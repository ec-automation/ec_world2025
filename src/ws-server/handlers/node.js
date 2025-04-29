// src/ws-server/handlers/node.js
const { getConnection } = require('../../lib/database');

async function create(socket, data) {
  try {
    console.log('🛠️ Creando nuevo nodo en base de datos:', data);

    const { graph_id, type, position, label, backgroundColor, icon } = data;

    if (!graph_id || !type || !position) {
      console.warn('⚠️ Datos incompletos para crear nodo.');
      return;
    }

    const conn = await getConnection();

    const [result] = await conn.execute(
      `INSERT INTO nodes (graph_id, type, label, position_x, position_y, background_color, icon) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        graph_id,
        type,
        label || '',
        position.x,
        position.y,
        backgroundColor || '#334155',
        icon || '🔲'
      ]
    );

    conn.end();

    console.log('✅ Nodo creado con ID:', result.insertId);

    // Opcionalmente podrías emitir aquí una confirmación si deseas
    socket.emit('node-created', { nodeId: result.insertId });
  } catch (err) {
    console.error('❌ Error creando nodo:', err);
  }
}

async function updatePosition(socket, data) {
  try {
    console.log('📍 Actualizando posición de nodo:', data);

    const { node_id, x, y } = data;

    if (!node_id || x === undefined || y === undefined) {
      console.warn('⚠️ Datos incompletos para actualizar posición.');
      return;
    }

    const conn = await getConnection();

    await conn.execute(
      `UPDATE nodes SET position_x = ?, position_y = ? WHERE id = ?`,
      [x, y, node_id]
    );

    conn.end();

    console.log('✅ Posición actualizada exitosamente.');
  } catch (err) {
    console.error('❌ Error actualizando posición de nodo:', err);
  }
}

module.exports = {
  create,
  updatePosition,
};
