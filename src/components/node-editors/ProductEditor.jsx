// components/editors/ProductEditor.jsx
import React, { useState, useEffect } from 'react';

export default function ProductEditor({ node, onClose, onDelete, onUpdate }) {
  const [label, setLabel] = useState(node.data.label || '');
  const [sku, setSku] = useState(node.data.sku || '');
  const [price, setPrice] = useState(node.data.price || '');
  const [backgroundColor, setBackgroundColor] = useState(node.data.backgroundColor || '#334155');

  useEffect(() => {
    setLabel(node.data.label || '');
    setSku(node.data.sku || '');
    setPrice(node.data.price || '');
    setBackgroundColor(node.data.backgroundColor || '#334155');
  }, [node]);

  const handleSubmit = () => {
    onUpdate({ label, sku, price, backgroundColor });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>

        <label className="block mb-1 text-sm font-semibold">Nombre</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">SKU</label>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Precio</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Color de fondo</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex justify-between mt-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => onDelete(node)}
          >
            Eliminar Producto
          </button>
          <div className="space-x-2">
            <button
              className="px-4 py-2 border rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
