const { getConnection } = require('../../lib/database');

async function updateNode(socket, data) {
  try {
    const { node_id, graph_id, label, backgroundColor, ruc, website, logo_url } = data;

    const conn = await getConnection();

    // 1️⃣ Actualizar nodo base
    await conn.execute(
      `UPDATE nodes SET label = ?, background_color = ? WHERE id = ?`,
      [label, backgroundColor, node_id]
    );

    // 2️⃣ Verificar si es tipo company
    const [[node]] = await conn.execute(
      `SELECT type FROM nodes WHERE id = ?`,
      [node_id]
    );

    if (node?.type === 'company') {
      await conn.execute(
        `UPDATE companies SET name = ?, ruc = ?, website = ?, logo_url = ? WHERE node_id = ? AND graph_id = ?`,
        [label, ruc, website, logo_url, node_id, graph_id]
      );
      console.log(`🏢 Empresa actualizada desde nodo ${node_id}`);
    }

    conn.end();
    socket.emit('node-updated', { success: true, node_id });
    console.log(`✅ Nodo actualizado: ${node_id}`);
  } catch (err) {
    console.error('❌ Error actualizando nodo:', err);
    socket.emit('error', { message: 'Error actualizando nodo' });
  }
}

module.exports = { updateNode };
