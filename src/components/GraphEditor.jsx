'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const nodeTypes = {
  customNode: CustomNodeComponent,
};

const STORAGE_KEY = 'ec-flow-data';
const VIEWPORT_KEY = 'ec-viewport';

function GraphContent({ theme }) {
  const savedData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log('[LOAD] LocalStorage raw:', raw);
      const parsed = JSON.parse(raw);
      console.log('[LOAD] Parsed graph:', parsed);
      return parsed;
    } catch (err) {
      console.warn('[LOAD ERROR]', err);
      return null;
    }
  }, []);

  const defaultNodes = [
    { id: '1', position: { x: 0, y: 50 }, data: { label: 'Landing Page' }, type: 'customNode' },
    { id: '2', position: { x: 200, y: 50 }, data: { label: 'Store' }, type: 'customNode' },
    { id: '3', position: { x: 400, y: 50 }, data: { label: 'Product' }, type: 'customNode' },
    { id: '4', position: { x: 600, y: 50 }, data: { label: 'Cart' }, type: 'customNode' },
    { id: '5', position: { x: 800, y: 50 }, data: { label: 'Checkout' }, type: 'customNode' },
    { id: '6', position: { x: 1000, y: 50 }, data: { label: 'Payment' }, type: 'customNode' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(savedData?.nodes || defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedData?.edges || []);
  const [idCounter, setIdCounter] = useState(7);

  const onConnect = useCallback(
    (connection) => {
      console.log('[CONNECT] New connection:', connection);
      setEdges((eds) => {
        const updated = addEdge(connection, eds);
        console.log('[CONNECT] Updated edges:', updated);
        return updated;
      });
    },
    [setEdges]
  );

  const onMoveEnd = useCallback((viewport) => {
    localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport));
    console.log('[VIEWPORT] Saved:', viewport);
  }, []);

  const handleAddNode = () => {
    const newId = `${idCounter}`;
    const newNode = {
      id: newId,
      data: { label: `Node ${newId}` },
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

  useEffect(() => {
    const data = JSON.stringify({ nodes, edges });
    localStorage.setItem(STORAGE_KEY, data);
    console.log('[SAVE] Graph saved:', data);
  }, [nodes, edges]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onMoveEnd={onMoveEnd}
      fitView 
    >
      <MiniMap />
      <Controls />
      <Background />
      <Panel position="top-left">
        <button onClick={handleAddNode} className="m-1 px-2 py-1 bg-blue-500 text-white rounded">+ Nodo</button>
        <button onClick={handleDelete} className="m-1 px-2 py-1 bg-red-500 text-white rounded">🗑 Borrar</button>
        <button onClick={handleReset} className="m-1 px-2 py-1 bg-gray-700 text-white rounded">🔄 Reset</button>
      </Panel>
    </ReactFlow>
  );
}

export default function GraphEditor() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.theme || 'light';
  });

  return (
    <div className="w-full h-[600px] bg-white dark:bg-slate-900 rounded shadow overflow-hidden">
      <ReactFlowProvider>
        <GraphContent theme={theme} />
      </ReactFlowProvider>
    </div>
  );
}
