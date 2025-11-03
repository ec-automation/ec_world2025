// handlers/clients/delete.js
const { getConnection } = require('../../../lib/database');

async function remove(socket, data) {
  try {
    const { node_id, graph_id } = data;
    const conn = await getConnection();

    await conn.execute(
      `DELETE FROM clients WHERE node_id = ? AND graph_id = ?`,
      [node_id, graph_id]
    );

    await conn.execute(
      `DELETE FROM nodes WHERE id = ? AND graph_id = ?`,
      [node_id, graph_id]
    );

    conn.end();
    console.log('🗑 Cliente eliminado:', node_id);
    socket.emit('client-deleted', { node_id });

  } catch (err) {
    console.error('❌ Error eliminando cliente:', err);
    socket.emit('error', { message: 'Error eliminando cliente' });
  }
}

module.exports = remove;