// components/NodeEditModalRouter.jsx
import React from 'react';
import ClientEditor from './node-editors/ClientEditor';
import CompanyEditor from './node-editors/CompanyEditor';
import ProductEditor from './node-editors/ProductEditor';

export default function NodeEditModalRouter({ node, onClose, onDelete, onUpdate }) {
    console.log('🧠 Editor cargando tipo lógico:', node.data?.type);
    console.log('📦 Datos completos del nodo:', node);
  if (!node?.data?.type) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 shadow-lg">
          <h2 className="text-xl font-bold text-center">No hay editor definido para el tipo "{node?.data?.type}".</h2>
          <div className="mt-6 text-center">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  switch (node.data.type) {
    case 'client':
      return <ClientEditor node={node} onClose={onClose} onDelete={onDelete} onUpdate={onUpdate} />;
    case 'company':
      return <CompanyEditor node={node} onClose={onClose} onDelete={onDelete} onUpdate={onUpdate} />;
    case 'product':
      return <ProductEditor node={node} onClose={onClose} onDelete={onDelete} onUpdate={onUpdate} />;
    default:
      return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-bold text-center">No hay editor definido para el tipo "{node.data.type}".</h2>
            <div className="mt-6 text-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      );
  }
}
