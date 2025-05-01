// ✅ GraphEditor.jsx
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
import ReactFlowProvider from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';
import NodeEditModal from './NodeEditModal';
import GraphCanvas from './GraphCanvas';

const nodeTypes = { customNode: CustomNodeComponent };

export default function GraphEditor() {
  const { socket, sendMessage, onMessage } = useSocket();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation();
  const { setTheme } = useDarkMode();
  const [geoInfo, setGeoInfo] = useState(null);
  const [nodes, setNodes, onNodesChangeInternal] = useState([]);
  const [edges, setEdges] = useState([]);
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
        console.log('📥 Grafo cargado: 2', data);
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
              backgroundColor: node.data.backgroundColor || '#334155',
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
                <GraphCanvas
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={setEdges}
                  setEdges={setEdges}
                  graphId={graphId}
                  sendMessage={sendMessage}
                  onNodeDoubleClick={(event, node) => {
                    setSelectedNode(node);
                    setShowModal(true);
                  }}
                />
              </div>
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      <NodeEditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        node={selectedNode}
        updateNode={(updated) => {
          setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        }}
      />

      <footer className="p-4 bg-black text-white text-center">
        <p className="mb-4 text-gray-600">{t('Copyright')}</p>
      </footer>
    </main>
  );
}
