// handlers/clients/update.js
const { getConnection } = require('../../../lib/database');

async function update(socket, data) {
  try {
    const { node_id, graph_id, label, lastname, backgroundColor, email, phone } = data;
    const conn = await getConnection();

    await conn.execute(
      `UPDATE nodes SET label = ?, background_color = ? WHERE id = ? AND graph_id = ?`,
      [label, backgroundColor, node_id, graph_id]
    );

    await conn.execute(
      `UPDATE clients SET name = ?, lastname = ?, email = ?, phone = ?
       WHERE node_id = ? AND graph_id = ?`,
      [label, lastname, email, phone, node_id, graph_id]
    );

    conn.end();
    console.log('✅ Cliente actualizado:', { node_id });
    socket.emit('client-updated', { node_id });

  } catch (err) {
    console.error('❌ Error actualizando cliente:', err);
    socket.emit('error', { message: 'Error actualizando cliente' });
  }
}

module.exports = update;