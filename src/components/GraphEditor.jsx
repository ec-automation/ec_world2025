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

const nodeTypes = { customNode: CustomNodeComponent };
const STORAGE_KEY = 'ec-flow-data';
const VIEWPORT_KEY = 'ec-viewport';

function GraphContent({ theme }) {
  const { sendMessage, onMessage } = useSocket();
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSavedData(JSON.parse(raw));
    } catch (err) {
      console.error('Error loading localStorage data:', err);
    }
  }, []);

  const defaultNodes = [
    { id: '1', position: { x: 0, y: 50 }, data: { label: 'Landing Page', backgroundColor: '#f1f5f9', borderRadius: '8px' }, type: 'customNode' },
    { id: '2', position: { x: 200, y: 50 }, data: { label: 'Store', backgroundColor: '#f1f5f9', borderRadius: '8px' }, type: 'customNode' },
    { id: '3', position: { x: 400, y: 50 }, data: { label: 'Product', backgroundColor: '#f1f5f9', borderRadius: '8px' }, type: 'customNode' },
    { id: '4', position: { x: 600, y: 50 }, data: { label: 'Cart', backgroundColor: '#f1f5f9', borderRadius: '8px' }, type: 'customNode' },
    { id: '5', position: { x: 800, y: 50 }, data: { label: 'Checkout', backgroundColor: '#f1f5f9', borderRadius: '8px' }, type: 'customNode' },
    { id: '6', position: { x: 1000, y: 50 }, data: { label: 'Payment', backgroundColor: '#f1f5f9', borderRadius: '8px' }, type: 'customNode' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(savedData?.nodes || defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedData?.edges || []);
  const [idCounter, setIdCounter] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    }, [setEdges]
  );

  const onMoveEnd = useCallback((viewport) => {
    localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport));
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  const handleAddNode = () => {
    const newId = `${idCounter}`;
    const newNode = {
      id: newId,
      data: { label: `Node ${newId}`, backgroundColor: '#f1f5f9', borderRadius: '8px' },
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      type: 'customNode',
    };
    setNodes((nds) => [...nds, newNode]);
    setIdCounter((prev) => prev + 1);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VIEWPORT_KEY);
    window.location.reload();
  };

  const handleDelete = () => {
    setEdges([]);
    setNodes([]);
  };

  const handleModalSubmit = () => {
    if (!promptText.trim()) {
      console.warn('⚠️ El prompt está vacío, no se envía.');
      return;
    }

    const currentNodes = [...nodes];
    const currentEdges = [...edges];

    console.log('[PROMPT SUBMIT]', {
      prompt: promptText,
      nodes: currentNodes,
      edges: currentEdges,
    });


    sendMessage('generate-graph', {
      prompt: promptText,
      current: {
        nodes: currentNodes,
        edges: currentEdges,
      },
    });
    setShowModal(false);
    setPromptText('');
  };

  useEffect(() => {
    const handler = (data) => {
      console.log('📥 Respuesta de IA:', data);
      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        setNodes(data.nodes);
        setEdges(data.edges);
      } else {
        console.warn('❌ Formato de datos inválido:', data);
      }
    };

    onMessage('graph-response', handler);
    return () => {
      const socket = document.querySelector('[data-socket]');
      socket?.off?.('graph-response', handler);
    };
  }, [onMessage, setNodes, setEdges]);

  useEffect(() => {
    const data = JSON.stringify({ nodes, edges });
    localStorage.setItem(STORAGE_KEY, data);
  }, [nodes, edges]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

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
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleModalSubmit}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
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
        fitView
      >
        {/* <MiniMap /> */}
        <Controls />
        <Background />
        <Panel position="top-right">
          <button onClick={handleAddNode} className="m-1 px-2 py-1 bg-blue-500 text-white rounded">+ Nodo</button>
          <button onClick={handleDelete} className="m-1 px-2 py-1 bg-red-500 text-white rounded">🗑 Borrar</button>
          <button onClick={handleReset} className="m-1 px-2 py-1 bg-gray-700 text-white rounded">🔄 Reset</button>
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
