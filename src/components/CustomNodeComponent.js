import React from 'react';
import { Handle, Position } from 'reactflow';

function CustomNodeComponent({ data }) {
  const commonHandleStyle = { width: 10, height: 10, background: '#555' };

  return (
    <div
      style={{
        backgroundColor: data.backgroundColor || '#f6aa11',
        borderRadius: data.borderRadius || '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        minWidth: '80px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
        {data.label}
      </div>

      {/* Handles: Conexiones desde cualquier lado */}
      <Handle type="source" position={Position.Top} id="source-top" style={commonHandleStyle} />
      <Handle type="target" position={Position.Top} id="target-top" style={commonHandleStyle} />

      <Handle type="source" position={Position.Right} id="source-right" style={commonHandleStyle} />
      <Handle type="target" position={Position.Right} id="target-right" style={commonHandleStyle} />

      <Handle type="source" position={Position.Bottom} id="source-bottom" style={commonHandleStyle} />
      <Handle type="target" position={Position.Bottom} id="target-bottom" style={commonHandleStyle} />

      <Handle type="source" position={Position.Left} id="source-left" style={commonHandleStyle} />
      <Handle type="target" position={Position.Left} id="target-left" style={commonHandleStyle} />
    </div>
  );
}

export default CustomNodeComponent;
