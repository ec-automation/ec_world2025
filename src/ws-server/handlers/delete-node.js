const { getConnection } = require('../../lib/database');

async function deleteNode(socket, data) {
  try {
    const { node_id, graph_id } = data;
    console.log(`🧨 Solicitando eliminación de nodo ${node_id} del grafo ${graph_id}`);

    const conn = await getConnection();
    const [result] = await conn.execute(
      'DELETE FROM nodes WHERE id = ? AND graph_id = ?',
      [node_id, graph_id]
    );
    conn.end();

    if (result.affectedRows > 0) {
      console.log(`✅ Nodo ${node_id} eliminado correctamente de la base de datos.`);
      socket.emit('node-deleted', { node_id });
    } else {
      console.warn(`⚠️ Nodo ${node_id} no fue encontrado o ya estaba eliminado.`);
    }

  } catch (err) {
    console.error('❌ Error al eliminar nodo:', err);
  }
}

module.exports = { deleteNode };
