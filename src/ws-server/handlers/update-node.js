const { getConnection } = require('../../lib/database');

async function updateNode(socket, data) {
  try {
    const { node_id, graph_id, label, backgroundColor } = data;
    console.log(`📝 Actualizando nodo ${node_id} en grafo ${graph_id}`);

    const conn = await getConnection();
    await conn.execute(
      `UPDATE nodes SET label = ?, background_color = ? WHERE id = ? AND graph_id = ?`,
      [label, backgroundColor, node_id, graph_id]
    );
    conn.end();

    console.log(`✅ Nodo ${node_id} actualizado correctamente.`);
  } catch (err) {
    console.error('❌ Error al actualizar nodo:', err);
  }
}

module.exports = { updateNode };
