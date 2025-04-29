'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNodeComponent({ data }) {
  return (
    <div
      className="rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-2 text-center text-xs"
      style={{
        backgroundColor: data.backgroundColor || '#f9fafb',
        color: '#111',
        width: 120,
        minHeight: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {data.icon && <div className="text-2xl">{data.icon}</div>}
      <div className="font-bold mt-1">{data.label}</div>

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
}

export default memo(CustomNodeComponent);
