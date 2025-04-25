'use client';
import React from 'react';
import { GripVertical } from 'lucide-react';
import { useTranslation } from "react-i18next";

const sidebarSections = [
  {
    title: '🧱 Building Blocks',
    items: [
      { id: 'company', label: 'Empresa', icon: '🏢', type: 'company' },
      { id: 'client', label: 'Cliente', icon: '🧍', type: 'client' },
      { id: 'product', label: 'Producto', icon: '📦', type: 'product' },
      { id: 'invoice', label: 'Factura', icon: '🧾', type: 'invoice' },
    ],
  },
  {
    title: '📊 Data Structures',
    items: [
      { id: 'stack', label: 'Stack', icon: '🗂️', type: 'structure' },
      { id: 'queue', label: 'Queue', icon: '📦', type: 'structure' },
      { id: 'array', label: 'Array', icon: '🔢', type: 'structure' },
      { id: 'tree', label: 'Tree', icon: '🌳', type: 'structure' },
      { id: 'graph', label: 'Graph', icon: '🕸️', type: 'structure' },
    ],
  },
  {
    title: '⚙️ Algorithms',
    items: [
      { id: 'dfs', label: 'DFS', icon: '🔍', type: 'algorithm' },
      { id: 'bfs', label: 'BFS', icon: '🔎', type: 'algorithm' },
      { id: 'dijkstra', label: 'Dijkstra', icon: '🧠', type: 'algorithm' },
    ],
  }
];

export default function GraphSidebarPalette() {
  const { t } = useTranslation();

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData('application/ec-node', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-48 h-full p-3 bg-gray-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 overflow-y-auto">
      <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <GripVertical size={16} />{t("Catalog")}
      </h2>

      {sidebarSections.map((section) => (
        <div key={section.title} className="mb-4">
          <h3 className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="cursor-grab active:cursor-grabbing bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white p-2 rounded shadow flex items-center gap-2"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
