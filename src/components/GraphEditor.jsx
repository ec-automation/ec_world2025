'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSocket } from '../components/WebSocketProvider';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';
import GraphSidebarPalette from './GraphSidebarPalette';
import NodeEditModal from './NodeEditModal';

const nodeTypes = { customNode: CustomNodeComponent };
const STORAGE_KEY = 'ec-flow-data';
const VIEWPORT_KEY = 'ec-viewport';

function GraphContent({ theme }) {
  const { sendMessage, onMessage } = useSocket();
  const [savedData, setSavedData] = useState(null);
  const [graphId, setGraphId] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [idCounter, setIdCounter] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onMoveEnd = useCallback((viewport) => {
    localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport));
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/ec-node');
    if (!raw) return;

    const item = JSON.parse(raw);
    const position = { x: event.clientX - 250, y: event.clientY - 100 };

    if (item.type === 'company' && graphId) {
      const payload = {
        graph_id: graphId,
        name: `Empresa ${idCounter}`,
        ruc: Math.floor(Math.random() * 1e11).toString().padStart(11, '1'),
        website: 'https://ecautomation.com',
        user_id: 1, // De momento lo tienes fijo, luego lo mejoramos
      };

      sendMessage('create-company', payload);
      sendMessage('create-node', {
        graph_id: graphId,
        type: item.type,
        position: position,
        label: payload.name, // o como quieras etiquetar
      });
    }
  }, [idCounter, sendMessage, graphId]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleNodeEdit = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
    setSelectedNode(null);
  };

  useEffect(() => {
    if (sendMessage && onMessage) {
      // 🚀 Apenas el GraphEditor carga, inicializar usuario
      sendMessage('initialize-user', {});

      onMessage('user-initialized', (data) => {
        if (data.graphId) {
          console.log(`✅ Usuario inicializado con graphId: ${data.graphId}`);
          setGraphId(data.graphId);
          // Aquí podríamos cargar sus nodos y edges también si quieres
        } else {
          console.warn('⚠️ No se pudo inicializar el usuario:', data.error);
        }
      });

      onMessage('graph-data', (res) => {
        if (res.nodes) {
          const loadedNodes = res.nodes.map((node) => ({
            id: node.id.toString(),
            position: { x: node.x, y: node.y },
            type: 'customNode',
            data: {
              label: node.label,
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              description: '',
            },
          }));
          setNodes(loadedNodes);
        }
      });
    }
  }, [sendMessage, onMessage]);

  return (
    <div className="flex h-full w-full">
      <GraphSidebarPalette />
      <div className="flex-1 h-full relative">

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-4 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Ingresa tu prompt</h2>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-2 rounded border dark:bg-slate-700 dark:text-white"
                rows={4}
                placeholder="Ej. Crea un sistema de reservas con login y pagos"
              />
              <div className="flex justify-end mt-2">
                <button className="bg-gray-500 text-white px-3 py-1 rounded mr-2" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => {}}>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedNode && (
          <NodeEditModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSave={handleNodeEdit}
          />
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onMoveEnd={onMoveEnd}
          onEdgeClick={onEdgeClick}
          onNodeDoubleClick={(event, node) => setSelectedNode(node)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView
        >
          <Controls />
          <Background />
          <Panel position="top-right">
            <button onClick={() => {}} className="m-1 px-2 py-1 bg-blue-500 text-white rounded">+ Nodo</button>
            <button onClick={() => setEdges([]) || setNodes([])} className="m-1 px-2 py-1 bg-red-500 text-white rounded">🗑 Borrar</button>
            <button onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(VIEWPORT_KEY);
              window.location.reload();
            }} className="m-1 px-2 py-1 bg-gray-700 text-white rounded">🔄 Reset</button>
          </Panel>
          <Panel position="bottom-right">
            <button onClick={() => setShowModal(true)} className="m-1 px-2 py-1 bg-emerald-600 text-white rounded">💡 Generar con IA</button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function GraphEditor() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.theme || 'light';
  });

  return (
    <div className="w-full h-[600px] bg-white dark:bg-black rounded shadow overflow-hidden">
      <ReactFlowProvider>
        <GraphContent theme={theme} />
      </ReactFlowProvider>
    </div>
  );
}
