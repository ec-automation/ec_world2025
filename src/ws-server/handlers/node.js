const { getConnection } = require('../../lib/database');

async function createNode(socket, data) {
  try {
    const { graph_id, type, position, label } = data;

    if (!graph_id || !position) {
      console.warn('⚠️ Faltan datos para crear nodo.');
      return;
    }

    const conn = await getConnection();

    const [result] = await conn.execute(
      `INSERT INTO nodes (graph_id, type, position_x, position_y, label) VALUES (?, ?, ?, ?, ?)`,
      [graph_id, type, position.x, position.y, label]
    );

    conn.end();

    console.log(`✅ Nodo creado ID ${result.insertId} para graph_id ${graph_id}`);

    // Opcionalmente podrías emitir de regreso el nuevo nodo
    socket.emit('node-created', {
      id: result.insertId,
      graph_id,
      type,
      position,
      label,
    });

  } catch (err) {
    console.error('❌ Error creando nodo:', err);
    socket.emit('node-created', { success: false, error: err.message });
  }
}

module.exports = { createNode };
