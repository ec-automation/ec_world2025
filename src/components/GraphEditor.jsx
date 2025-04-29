'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../components/WebSocketProvider';
import useDarkMode from '../hooks/useDarkMode';
import GeoStatus from './GeoStatus';
import Ec_nav_bar from './navbar';
import GraphSidebarPalette from './GraphSidebarPalette';
import { applyNodeChanges } from 'reactflow'; 
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';
import NodeEditModal from './NodeEditModal';

const nodeTypes = { customNode: CustomNodeComponent };
const STORAGE_KEY = 'ec-flow-data';
const VIEWPORT_KEY = 'ec-viewport';

export default function GraphEditor() {
  const { socket, sendMessage, onMessage } = useSocket();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation();
  const { setTheme } = useDarkMode();
  const [geoInfo, setGeoInfo] = useState(null);

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphId, setGraphId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && socket && session?.user?.email) {
      const { name, email } = session.user;
      console.log('📤 Emitiendo login vía socket1:', { name, email });
      socket.emit('login', { name, email });
    }
  }, [status, socket, session]);

  useEffect(() => {
    if (socket) {
      const handleUserPreferences = (prefs) => {
        console.log('🌟 Preferencias recibidas:', prefs);
        if (prefs.theme) setTheme(prefs.theme);
        if (prefs.language) i18n.changeLanguage(prefs.language);
      };

      const handleUserInfo = (info) => {
        console.log('🌐 Info de conexión recibida:', info);
        setGeoInfo(info);
      };

      const handleLoginSuccess = () => {
        console.log('✅ Login confirmado en frontend y');
        if (socket) {
          console.log('📥 Usuario autenticado, solicitando carga de grafo...');
          socket.emit('load-graph', {});
        }
      };

      const handleGraphLoaded = (data) => {
        console.log('📥 Grafo cargado:', data);
        if (data.graphId !== null) {
          setGraphId(data.graphId);
          setNodes(data.nodes.map((node) => ({
            id: String(node.id),
            position: node.x !== null && node.y !== null
              ? { x: node.x, y: node.y }
              : { x: 100, y: 100 },
            type: 'customNode',
            data: {
              label: node.label || 'Sin nombre',
              icon: node.icon || '🔲',
              backgroundColor: node.backgroundColor || '#334155',
            },
          })));
          
          setEdges(data.edges.map(edge => ({
            id: String(edge.id),
            source: String(edge.source),
            target: String(edge.target),
          })));
        }
      };

      socket.on('user-preferences', handleUserPreferences);
      socket.on('user-info', handleUserInfo);
      socket.on('login-success', handleLoginSuccess);
      socket.on('graph-loaded', handleGraphLoaded);

      return () => {
        socket.off('user-preferences', handleUserPreferences);
        socket.off('user-info', handleUserInfo);
        socket.off('login-success', handleLoginSuccess);
        socket.off('graph-loaded', handleGraphLoaded);
      };
    }
  }, [socket, setTheme, i18n]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    console.log('📦 Detectado evento drop');

    const raw = event.dataTransfer.getData('application/ec-node');
    if (!raw) return;

    if (!graphId) {
      console.warn('⚠️ No hay graphId disponible aún.');
      return;
    }

    const item = JSON.parse(raw);
    console.log('🧩 Item arrastrado:', item);

    const position = {
      x: event.clientX - 250,
      y: event.clientY - 100,
    };

    if (item.type === 'company') {
      const payload = {
        graph_id: graphId,
        name: `Empresa-${Date.now()}`,
        ruc: Math.floor(Math.random() * 1e11).toString().padStart(11, '1'),
        website: 'https://ecautomation.com',
      };

      sendMessage('create-company', payload);
    }

    sendMessage('create-node', {
      graph_id: graphId,
      type: item.type,
      position,
      label: item.label,
      backgroundColor: '#334155',
      icon: item.icon,
    });
  }, [graphId, sendMessage]);

  const onNodesChange = useCallback((changes) => {
    console.log('🌀 Cambios detectados en nodos:', changes);
    setNodes((nds) => applyNodeChanges(changes, nds));

    changes.forEach(change => {
      if (change.type === 'position' && change.dragging === false) {
        console.log('📍 Nodo movido:', change);
        if (change.id && graphId && sendMessage) {
          const movedNode = nodes.find((n) => n.id === change.id);
          if (movedNode) {
            console.log('📤 Enviando nueva posición del nodo:', movedNode.position);
            sendMessage('update-node-position', {
              node_id: movedNode.id,
              x: movedNode.position.x,
              y: movedNode.position.y,
            });
          }
        }
      }
    });
  }, [nodes, graphId, sendMessage]);

  return (
    <main className="flex flex-col min-h-screen">
      <Ec_nav_bar />

      {typeof window !== 'undefined' && geoInfo && (
        <div className="p-2 flex justify-center">
          <GeoStatus info={geoInfo} />
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full h-[600px] bg-white dark:bg-black rounded shadow overflow-hidden">
          <ReactFlowProvider>
            <div className="flex h-full w-full">
              <GraphSidebarPalette />
              <div className="flex-1 h-full relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={(connection) => setEdges((eds) => addEdge(connection, eds))}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  fitView
                >
                  <Controls />
                  <Background />
                  <MiniMap />
                </ReactFlow>
              </div>
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      <footer className="p-4 bg-black text-white text-center">
        <p className="mb-4 text-gray-600">{t('Copyright')}</p>
      </footer>
    </main>
  );
}
