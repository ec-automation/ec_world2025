'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import Ec_nav_bar from './navbar';
import { useSocket } from '../components/WebSocketProvider';
import useDarkMode from '../hooks/useDarkMode';
import GeoStatus from './GeoStatus';
import GraphSidebarPalette from './GraphSidebarPalette';
import GraphCanvas from './GraphCanvas';
import NodeEditModalRouter from './NodeEditModalRouter';

import {
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';
import NodeEditModal from './NodeEditModal';

const nodeTypes = { customNode: CustomNodeComponent };

export default function DashboardClient() {
  const { socket, sendMessage } = useSocket();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation();
  const { setTheme } = useDarkMode();
  const [geoInfo, setGeoInfo] = useState(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphId, setGraphId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!socket || status !== 'authenticated' || !session?.user?.email) return;
    const { name, email } = session.user;
    const sendLogin = () => {
      console.log('📤 Emitiendo login:', { name, email });
      socket.emit('login', { name, email });
    };
    if (socket.connected) sendLogin();
    socket.on('connect', sendLogin);
    return () => socket.off('connect', sendLogin);
  }, [socket, status, session]);

  useEffect(() => {
    if (!socket) return;

    const handleLoginSuccess = () => {
      console.log('✅ Login confirmado en frontend1');
      if (socket) {
        setTimeout(() => {
          console.log('📡 Emitiendo carga de grafo tras pequeño delay...');
          socket.emit('load-graph', {});
        }, 250);
      }
    };

    const handleGraphLoaded = (data) => {
      console.log('📥 Grafo cargado:y', data);
      if (data.graphId !== null) {
        setGraphId(data.graphId);
    
        setNodes(data.nodes.map((node) => ({
          id: String(node.id),
          position: node.position || {
            x: node.position_x ?? 100,
            y: node.position_y ?? 100,
          },
          type: 'customNode',
          data: {
            label: node.data.label,
            backgroundColor: node.background_color || '#334155',
            icon: node.data.icon,
            type: node.data.type,
            ruc: node.data.ruc,
            website: node.data.website,
            logo_url: node.data.logo_url,
            email: node.data.email,
            phone: node.phone,
            sku: node.data.sku,
            price: node.data.price,
            lastname: node.data.lastname,
          },
        })));
    
        setEdges(data.data.edges);
      }
    };
    
    

    const handleUserPreferences = (prefs) => {
      if (prefs.theme) setTheme(prefs.theme);
      if (prefs.language) i18n.changeLanguage(prefs.language);
    };

    const handleUserInfo = (info) => setGeoInfo(info);

    const handleNodeCreated = (node) => {
      console.log('🆕 Nodo creado recibido:', node);
      const safeNode = {
        id: String(node.id),
        type: node.type || 'customNode',
        position: node.position ?? { x: 0, y: 0 },
        data: {
          label: node.data?.label || node.label || 'Sin nombre',
          icon: node.data?.icon || node.icon || '🔲',
          backgroundColor: node.data?.backgroundColor || node.backgroundColor || '#334155',
        },
      };
      setNodes((prev) => [...prev, safeNode]);
    };

    socket.on('login-success', handleLoginSuccess);
    socket.on('graph-loaded', handleGraphLoaded);
    socket.on('user-preferences', handleUserPreferences);
    socket.on('user-info', handleUserInfo);
    socket.on('node-created', handleNodeCreated);

    return () => {
      socket.off('login-success', handleLoginSuccess);
      socket.off('graph-loaded', handleGraphLoaded);
      socket.off('user-preferences', handleUserPreferences);
      socket.off('user-info', handleUserInfo);
      socket.off('node-created', handleNodeCreated);
    };
  }, [socket, setTheme, i18n]);

  const handleNodeDoubleClick = useCallback((event, node) => {
    console.log('🎯 Doble clic en nodo:', node);
    setSelectedNode(node);
    setModalOpen(true);
  }, []);

  const handleDeleteNode = (node) => {
    sendMessage('delete-node', { node_id: node.id, graph_id: graphId });
    setModalOpen(false);
    setNodes((prev) => prev.filter((n) => n.id !== node.id));
  };

  const handleUpdateNode = (updatedData) => {
    if (!selectedNode) return;
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        ...updatedData,
      },
    };
    sendMessage('update-node', {
      node_id: selectedNode.id,
      graph_id: graphId,
      label: updatedData.label,
      backgroundColor: updatedData.backgroundColor,
      ruc: updatedData.ruc,
      website: updatedData.website,
      logo_url: updatedData.logo_url,
    });
    setNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
    setModalOpen(false);
  };

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    changes.forEach(change => {
      if (change.type === 'position' && change.dragging === false) {
        const movedNode = nodes.find((n) => n.id === change.id);
        if (movedNode) {
          sendMessage('update-node-position', {
            nodeId: movedNode.id,
            graphId: graphId,
            x: movedNode.position.x,
            y: movedNode.position.y,
          });
        }
      }
      if (change.type === 'remove') {
        sendMessage('delete-node', { node_id: change.id, graph_id: graphId });
      }
    });
  }, [nodes, graphId, sendMessage]);

  return (
    <main className="flex flex-col min-h-screen">
      <Ec_nav_bar />
      {typeof window !== 'undefined' && geoInfo && <GeoStatus info={geoInfo} />}
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
                  onEdgesChange={onEdgesChange}
                  onNodeDoubleClick={handleNodeDoubleClick}
                  setEdges={setEdges}
                  graphId={graphId}
                  sendMessage={sendMessage}
                />
              </div>
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      <footer className="p-4 bg-black text-white text-center">
        <p className="mb-4 text-gray-600">
          {typeof window !== 'undefined'
            ? t('Copyright')
            : '© EC-HOME AUTOMATION PERU SAC 2025'}
        </p>
      </footer>

      {modalOpen && selectedNode && (
  <NodeEditModalRouter
    node={selectedNode}
    onClose={() => setModalOpen(false)}
    onDelete={handleDeleteNode}
    onUpdate={handleUpdateNode}
  />
)}
    </main>
  );
}
