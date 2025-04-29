'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSocket } from '../components/WebSocketProvider';
import { uploadLogoToS3 } from '../ws-server/utils/uploadLogoToS3';
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphId, setGraphId] = useState(null);
  const [idCounter, setIdCounter] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!sendMessage || !onMessage) return;

    console.log('📥 Solicitando carga del grafo...');
    sendMessage('load-graph', {});

    const unsubGraphLoaded = onMessage('graph-loaded', (data) => {
      console.log('📥 Grafo cargado:', data);
      if (data.graphId === null) {
        console.log('🆕 Creando primer grafo para el usuario...');
        sendMessage('create-graph', {});
      } else {
        setGraphId(data.graphId);
        const formattedNodes = data.nodes.map((node) => ({
          id: node.id.toString(),
          type: 'customNode',
          position: node.position || { x: Math.random() * 300, y: Math.random() * 300 },
          data: {
            label: node.label,
            ruc: node.ruc,
            website: node.website,
            backgroundColor: node.background_color,
            icon: node.icon,
          },
        }));
        setNodes(formattedNodes);
        setEdges(data.edges || []);
      }
    });

    const unsubGraphCreated = onMessage('graph-created', (data) => {
      console.log('🆕 Grafo creado:', data);
      setGraphId(data.graphId);
    });

    return () => {
      if (typeof unsubGraphLoaded === 'function') unsubGraphLoaded();
      if (typeof unsubGraphCreated === 'function') unsubGraphCreated();
    };
  }, [sendMessage, onMessage]);

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    console.log('📦 Detectado evento drop');

    const raw = event.dataTransfer.getData('application/ec-node');
    if (!raw) {
      console.warn('⚠️ No se encontró data de drag');
      return;
    }

    if (!graphId) {
      console.warn('⚠️ No hay graphId aún disponible');
      return;
    }

    const item = JSON.parse(raw);
    console.log('🧩 Item arrastrado:', item);

    const position = { x: event.clientX - 250, y: event.clientY - 100 };
    const newNode = {
      id: `${Date.now()}`,
      type: 'customNode',
      position,
      data: {
        label: item.label,
        backgroundColor: '',
        icon: item.icon,
      },
    };

    setNodes((nds) => nds.concat(newNode));

    if (item.type === 'company') {
      const payload = {
        graph_id: graphId,
        name: `Empresa ${idCounter}`,
        ruc: Math.floor(Math.random() * 1e11).toString().padStart(11, '1'),
        website: 'https://ecautomation.com',
      };
      sendMessage('create-company', payload);
      setIdCounter((prev) => prev + 1);
    }
  }, [graphId, idCounter, sendMessage]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDoubleClick = useCallback((event, node) => {
    console.log('🖱️ Doble clic en nodo:', node);
    setSelectedNode(node);
    setShowModal(true);
  }, []);

  const handleNodeEdit = (newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
    setShowModal(false);
  };

  return (
    <div className="flex h-full w-full">
      <GraphSidebarPalette />
      <div className="flex-1 h-full relative">
        {showModal && (
          <NodeEditModal
            node={selectedNode}
            onClose={() => setShowModal(false)}
            onSave={handleNodeEdit}
          />
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(connection) => setEdges((eds) => addEdge(connection, eds))}
          onMoveEnd={(viewport) => localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport))}
          onEdgeClick={(event, edge) => {
            event.stopPropagation();
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onNodeDoubleClick={onNodeDoubleClick}
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
