'use client';

import { useState } from 'react';

export default function NodeEditModal({ node, onClose, onDelete }) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [backgroundColor, setBackgroundColor] = useState(node?.data?.backgroundColor || '#334155');

  if (!node) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-center">Editar nodo #{node.id}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Color de fondo</label>
          <input
            type="color"
            className="w-full h-10 rounded"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onDelete(node)}
          >
            Eliminar {node.data?.type || 'nodo'}
          </button>
        </div>
      </div>
    </div>
  );
}
