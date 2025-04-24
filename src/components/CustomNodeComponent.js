import React from 'react';
import { Handle, Position } from 'reactflow';

function CustomNodeComponent({ data }) {
  return (
    <div
      style={{
        backgroundColor: data.backgroundColor || '#f1f5f9',
        borderRadius: data.borderRadius || '8px',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        minWidth: 100,
        maxWidth: 220,
        overflowWrap: 'break-word',
      }}
    >
      <div style={{ fontSize: 24 }}>{data.icon || '⬤'}</div>
      <div>{data.label}</div>
      {data.description && (
        <div style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4 }}>
          {data.description}
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#10b981' }} isConnectable={true} />
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6' }} isConnectable={true} />
    </div>
  );
}

export default CustomNodeComponent;
