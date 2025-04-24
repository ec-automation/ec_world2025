'use client';

import { useState } from 'react';

export default function NodeEditModal({ node, onClose, onSave }) {
  const [label, setLabel] = useState(node.data.label || '');
  const [backgroundColor, setBackgroundColor] = useState(node.data.backgroundColor || '#f1f5f9');
  const [description, setDescription] = useState(node.data.description || '');

  const handleSave = () => {
    onSave(node.id, { label, backgroundColor, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">
          Editar nodo: {node.id}
        </h2>

        <label className="block mb-2 text-sm font-medium text-black dark:text-white">Nombre</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-slate-700 dark:text-white"
        />

        <label className="block mb-2 text-sm font-medium text-black dark:text-white">Color de fondo</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full p-2 mb-4 border rounded h-10"
        />

        <label className="block mb-2 text-sm font-medium text-black dark:text-white">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
