import React, { useState, useEffect } from 'react';

export default function NodeEditModal({ node, onClose, onDelete, onUpdate }) {
  const [label, setLabel] = useState(node.data.label);
  const [backgroundColor, setBackgroundColor] = useState(node.data.backgroundColor);
  const [companyData, setCompanyData] = useState({ ruc: '', website: '' });

  useEffect(() => {
    if (node.data.type === 'company') {
      // Prellenar desde el nodo si ya hay data, si no es editable lo manejaremos desde base de datos luego
      setCompanyData({
        ruc: node.data.ruc || '',
        website: node.data.website || '',
      });
    }
  }, [node]);

  const handleSubmit = () => {
    const updatePayload = {
      label,
      backgroundColor,
      ...(node.data.type === 'company' && {
        ruc: companyData.ruc,
        website: companyData.website,
      })
    };
    onUpdate(updatePayload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Nodo</h2>

        <label className="block mb-2 text-sm font-semibold">Nombre</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 text-sm font-semibold">Color de fondo</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        {node.data.type === 'company' && (
          <>
            <label className="block mb-2 text-sm font-semibold">RUC</label>
            <input
              type="text"
              value={companyData.ruc}
              onChange={(e) => setCompanyData({ ...companyData, ruc: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 text-sm font-semibold">Sitio Web</label>
            <input
              type="text"
              value={companyData.website}
              onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
          </>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => onDelete(node)}
          >
            Eliminar {node.data.type}
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
