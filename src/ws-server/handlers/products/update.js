
// handlers/products/update.js
const { getConnection } = require('../../../lib/database');

async function update(socket, data) {
  try {
    const { node_id, graph_id, label, backgroundColor, sku, price, description } = data;
    const conn = await getConnection();

    await conn.execute(
      `UPDATE nodes SET label = ?, background_color = ? WHERE id = ? AND graph_id = ?`,
      [label, backgroundColor, node_id, graph_id]
    );

    await conn.execute(
      `UPDATE products SET name = ?, sku = ?, price = ?, description = ?
       WHERE node_id = ? AND graph_id = ?`,
      [label, sku, price, description, node_id, graph_id]
    );

    conn.end();
    console.log('✅ Producto actualizado:', { node_id });
    socket.emit('product-updated', { node_id });

  } catch (err) {
    console.error('❌ Error actualizando producto:', err);
    socket.emit('error', { message: 'Error actualizando producto' });
  }
}

module.exports = update;