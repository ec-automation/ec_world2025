// components/editors/ClientEditor.jsx
import React, { useState, useEffect } from 'react';

export default function ClientEditor({ node, onClose, onDelete, onUpdate }) {
  const [label, setLabel] = useState(node.data.label || '');
  const [lastname, setLastname] = useState(node.data.lastname || '');
  const [email, setEmail] = useState(node.data.email || '');
  const [phone, setPhone] = useState(node.data.phone || '');
  const [backgroundColor, setBackgroundColor] = useState(node.data.backgroundColor || '#334155');

  const handleSubmit = () => {
    onUpdate({ label, lastname, email, phone, backgroundColor });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>

        <label className="block mb-1 text-sm font-semibold">Nombre</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Apellido</label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-1 text-sm font-semibold">Teléfono</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
            Eliminar Cliente
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

// 💡 Para usar este componente, impórtalo en tu renderizador de modales
// y cuando node.data.type === 'client', retorna <ClientEditor ... />
