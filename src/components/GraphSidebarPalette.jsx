'use client';
import React from 'react';
import { GripVertical } from 'lucide-react';
import { useTranslation } from "react-i18next";



const sidebarItems = [
  { id: 'stack', label: 'Stack', icon: '🗂️' },
  { id: 'queue', label: 'Queue', icon: '📦' },
  { id: 'array', label: 'Array', icon: '🔢' },
  { id: 'graph', label: 'Graph', icon: '🕸️' },
  { id: 'tree', label: 'Tree', icon: '🌳' },
  { id: 'hashtable', label: 'Hash Table', icon: '🔐' },
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
      <ul className="space-y-2">
        {sidebarItems.map((item) => (
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
  );
}
