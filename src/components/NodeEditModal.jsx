'use client';

import { useState } from 'react';

export default function NodeEditModal({ node, onClose, onSave }) {
  const [newLabel, setNewLabel] = useState(node.data.label || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">
          Editar nodo: {node.id}
        </h2>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
          placeholder="Nuevo nombre del nodo"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(node.id, newLabel)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
