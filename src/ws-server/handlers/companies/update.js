// handlers/companies/update.js
const { getConnection } = require('../../../lib/database');

async function update(socket, data) {
  try {
    const { node_id, graph_id, label, backgroundColor, ruc, website, logo_url } = data;
    const conn = await getConnection();

    // Actualizar nodo base
    await conn.execute(
      `UPDATE nodes SET label = ?, background_color = ? WHERE id = ? AND graph_id = ?`,
      [label, backgroundColor, node_id, graph_id]
    );

    // Actualizar empresa
    await conn.execute(
      `UPDATE companies SET name = ?, ruc = ?, website = ?, logo_url = ?
       WHERE node_id = ? AND graph_id = ?`,
      [label, ruc, website, logo_url, node_id, graph_id]
    );

    conn.end();
    console.log('✅ Empresa actualizada:', { node_id });
    socket.emit('company-updated', { node_id });

  } catch (err) {
    console.error('❌ Error actualizando empresa:', err);
    socket.emit('error', { message: 'Error actualizando empresa' });
  }
}

module.exports = update;