'use client';

import { useState, useEffect } from 'react';

export default function NodeEditModal({ node, onClose, onSave }) {
  const [formData, setFormData] = useState({
    label: '',
    ruc: '',
    website: '',
    backgroundColor: '',
    icon: '',
  });

  useEffect(() => {
    if (node) {
      setFormData({
        label: node.data?.label || '',
        ruc: node.data?.ruc || '',
        website: node.data?.website || '',
        backgroundColor: node.data?.backgroundColor || '',
        icon: node.data?.icon || '',
      });
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!node) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-white">
          Editar Empresa
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="label"
            placeholder="Nombre"
            value={formData.label}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            name="ruc"
            placeholder="RUC"
            value={formData.ruc}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            name="website"
            placeholder="Sitio Web"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            name="backgroundColor"
            placeholder="Color de Fondo (#hex)"
            value={formData.backgroundColor}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            name="icon"
            placeholder="Icono Emoji (🏢, 🏥, etc)"
            value={formData.icon}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
