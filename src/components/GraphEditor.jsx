'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNodeComponent from './CustomNodeComponent';

const nodeTypes = {
  customNode: CustomNodeComponent,
};

const STORAGE_KEY = 'ec-flow-data';

export default function GraphEditor() {
  // ⬇ Cargar datos desde localStorage si existen
  const savedData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (err) {
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

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // 💾 Guardar cada vez que cambian nodos o conexiones
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges]);

  return (
    <div className="w-full h-[600px] bg-white dark:bg-slate-900 rounded shadow overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
