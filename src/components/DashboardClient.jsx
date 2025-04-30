'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import Ec_nav_bar from './navbar';
import { useSocket } from '../components/WebSocketProvider';
import useDarkMode from '../hooks/useDarkMode';
import GeoStatus from './GeoStatus';
import GraphSidebarPalette from './GraphSidebarPalette';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
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
  const { socket, sendMessage, onMessage } = useSocket();
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
      console.log('📤 (Re)emitiendo login tras conexión o carga inicial:', { name, email });
      socket.emit('login', { name, email });
    };
    if (socket.connected) {
      sendLogin();
    }
    socket.on('connect', sendLogin);
    return () => socket.off('connect', sendLogin);
  }, [socket, status, session]);

  useEffect(() => {
    if (!socket) return;

    const handleLoginSuccess = () => {
      console.log('✅ Login confirmado en frontend');
      if (socket) {
        setTimeout(() => {
          console.log('📡 Emitiendo carga de grafo tras pequeño delay...');
          socket.emit('load-graph', {});
        }, 250);
      }
    };
    const handleGraphLoaded = (data) => {
      console.log('📥 Grafo cargado:', data);
      if (data.graphId !== null) {
        setGraphId(data.graphId);
        setNodes(data.nodes.map(node => ({
  id: String(node.id),
  position: {
    x: node.position?.x ?? 0,
    y: node.position?.y ?? 0,
  },
  type: 'customNode',
  data: {
    label: node.data?.label || 'Sin nombre',
    icon: node.data?.icon || '🔲',
    backgroundColor: node.data?.backgroundColor || '#334155',
  },
})));
        setEdges(data.edges);
      }
    };
    socket.on('login-success', handleLoginSuccess);
    socket.on('graph-loaded', handleGraphLoaded);
    return () => {
      socket.off('login-success', handleLoginSuccess);
      socket.off('graph-loaded', handleGraphLoaded);
    };
  }, [socket]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/ec-node');
    if (!raw || !graphId) return;
    const item = JSON.parse(raw);
    const position = { x: event.clientX - 250, y: event.clientY - 100 };
    sendMessage('create-node', {
      graph_id: graphId,
      type: item.type,
      position,
      label: item.label,
      backgroundColor: '#334155',
      icon: item.icon,
    });
  }, [graphId, sendMessage]);

  const handleNodeDoubleClick = useCallback((event, node) => {
    console.log('🖱 Doble clic en nodo:', node);
    setSelectedNode(node);
    setModalOpen(true);
  }, []);

  const handleDeleteNode = (node) => {
    console.log('❌ Eliminando nodo desde modal:', node);
    sendMessage('delete-node', { node_id: node.id, graph_id: graphId });
    setModalOpen(false);
    setNodes((prev) => prev.filter((n) => n.id !== node.id));
  };

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));

    changes.forEach(change => {
      if (change.type === 'position' && change.dragging === false) {
        const movedNode = nodes.find((n) => n.id === change.id);
        if (movedNode) {
          console.log('📍 Nodo detenido, enviando nueva posición:', movedNode);
          sendMessage('update-node-position', {
            nodeId: movedNode.id,
            graphId: graphId,
            x: movedNode.position.x,
            y: movedNode.position.y,
          });
        }
      }
      if (change.type === 'remove') {
        console.log('🗑 Nodo eliminado:', change);
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
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={(connection) => setEdges((eds) => addEdge(connection, eds))}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onNodeDoubleClick={handleNodeDoubleClick}
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
        {typeof window !== 'undefined' ? (
          <p className="mb-4 text-gray-600">{t('Copyright')}</p>
        ) : (
          <p className="mb-4 text-gray-600">© EC-HOME AUTOMATION PERU SAC 2025</p>
        )}
      </footer>
      {modalOpen && (
        <NodeEditModal
          node={selectedNode}
          onClose={() => setModalOpen(false)}
          onDelete={handleDeleteNode}
        />
      )}
    </main>
  );
}
