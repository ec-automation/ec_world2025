// ✅ GraphCanvas.jsx
import React from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useReactFlow,
} from 'reactflow';

export default function GraphCanvas({
  nodes,
  edges,
  nodeTypes,
  onNodesChange,
  onEdgesChange,
  onNodeDoubleClick,
  setEdges,
  graphId,
  sendMessage,
}) {
  const { project } = useReactFlow();

  const handleDrop = (event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData('application/ec-node');
    if (!raw || !graphId) return;

    const item = JSON.parse(raw);
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    console.log('📥 Evento drop en GraphCanvas:', item);
    sendMessage('create-node', {
      graph_id: graphId,
      type: item.type,
      position: point,
      label: item.label,
      backgroundColor: '#334155',
      icon: item.icon,
    });
    console.log('📥 mesage sent:');
    if (item.type === 'company') {
      const payload = {
        graph_id: graphId,
        name: `Empresa-${Date.now()}`,
        ruc: Math.floor(Math.random() * 1e11).toString().padStart(11, '1'),
        website: 'https://ecautomation.com',
      };

      sendMessage('create-company', payload);
    }


  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(connection) => setEdges((eds) => addEdge(connection, eds))}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onNodeDoubleClick={onNodeDoubleClick}
      fitView
    >
      <Controls />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
}
