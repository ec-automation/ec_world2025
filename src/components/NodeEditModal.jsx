// ✅ NodeEditModal.jsx
import React from 'react';
import CompanyEditor from './node-editors/CompanyEditor';
import ClientEditor from './node-editors/ClientEditor';

export default function NodeEditModal({ node, onClose, onDelete, onUpdate }) {
  const renderEditor = () => {
    console.log('🧠 Editor cargando tipo lógico:', node.data?.type);
    console.log('📦 Datos completos del nodo:', node);
    switch (node.data.type) {
      case 'company':
        return <CompanyEditor node={node} onUpdate={onUpdate} />;
      case 'client':
        return <ClientEditor node={node} onUpdate={onUpdate} />;
      default:
        return (
          <div className="space-y-4">
            <p className="text-red-500">
              No hay editor definido para el tipo lógico "{node.data?.type ?? 'undefined'}"
              (type visual: "{node.type}")
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 dark:text-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar {node.data.type}</h2>

        {renderEditor()}

        <div className="flex justify-between mt-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => onDelete(node)}
          >
            Eliminar {node.data.type}
          </button>

          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
