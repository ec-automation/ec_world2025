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
  const [promptText, setPromptText] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!sendMessage || !onMessage) return;

    let graphRequested = false;

    const unsubUserPreferences = onMessage('user-preferences', () => {
      if (!graphRequested) {
        console.log('📥 Usuario autenticado, solicitando carga de grafo...');
        sendMessage('load-graph', {});
        graphRequested = true;
      }
    });

    const unsubGraphLoaded = onMessage('graph-loaded', (data) => {
      console.log('📥 Grafo cargado:', data);
      if (data.graphId === null) {
        console.log('🆕 Creando primer grafo para el usuario...');
        sendMessage('create-graph', {});
      } else {
        setGraphId(data.graphId);
        setNodes(data.nodes.map(node => ({
          ...node,
          position: node.position || { x: Math.random() * 400, y: Math.random() * 400 }
        })));
        setEdges(data.edges);
      }
    });

    const unsubGraphCreated = onMessage('graph-created', (data) => {
      console.log('🆕 Grafo creado:', data);
      setGraphId(data.graphId);
    });

    return () => {
      if (typeof unsubUserPreferences === 'function') unsubUserPreferences();
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

    if (item.type === 'company') {
      console.log('🏢 Creando nueva empresa...');

      const name = `Empresa ${idCounter}`;
      const ruc = Math.floor(Math.random() * 1e11).toString().padStart(11, '1');
      const website = 'https://ecautomation.com';

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];

        let logoUrl = null;
        if (file) {
          console.log('📸 Imagen seleccionada para subir');
          logoUrl = await uploadLogoToS3(file, idCounter);
        } else {
          console.log('📸 No se seleccionó imagen');
        }

        const payload = {
          graph_id: graphId,
          name,
          ruc,
          website,
          logo_url: logoUrl,
        };

        console.log('🚀 Enviando create-company:', payload);
        sendMessage('create-company', payload);

        console.log('🚀 Enviando create-node:', {
          graph_id: graphId,
          type: item.type,
          position,
          label: name,
        });
        sendMessage('create-node', {
          graph_id: graphId,
          type: item.type,
          position,
          label: name,
        });

        setIdCounter((prev) => prev + 1);
      };
    }
  }, [graphId, idCounter, sendMessage]);

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
          onConnect={(connection) => setEdges((eds) => addEdge(connection, eds))}
          onMoveEnd={(viewport) => localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport))}
          onEdgeClick={(event, edge) => {
            event.stopPropagation();
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
          }}
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
