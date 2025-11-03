// components/editors/CompanyEditor.jsx
import React, { useState, useEffect } from 'react';

export default function CompanyEditor({ node, onClose, onDelete, onUpdate }) {
  const [label, setLabel] = useState(node.data.label || '');
  const [backgroundColor, setBackgroundColor] = useState(node.data.backgroundColor || '#334155');
  const [ruc, setRuc] = useState(node.data.ruc || '');
  const [website, setWebsite] = useState(node.data.website || '');
  const [logoUrl, setLogoUrl] = useState(node.data.logo_url || '');

  useEffect(() => {
    setLabel(node.data.label || '');
    setBackgroundColor(node.data.backgroundColor || '#334155');
    setRuc(node.data.ruc || '');
    setWebsite(node.data.website || '');
    setLogoUrl(node.data.logo_url || '');
  }, [node]);

  const handleSubmit = () => {
    onUpdate({ label, backgroundColor, ruc, website, logo_url: logoUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 dark:text-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Empresa</h2>

        <label className="block mb-1 text-sm font-semibold">Nombre</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Color de fondo</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">RUC</label>
        <input
          type="text"
          value={ruc}
          onChange={(e) => setRuc(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Sitio Web</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Logo URL</label>
        <input
          type="text"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex justify-between mt-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => onDelete(node)}
          >
            Eliminar Empresa
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
