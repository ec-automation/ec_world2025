// handlers/products/create.js
const { getConnection } = require('../../../lib/database');

async function create(socket, data) {
  try {
    const { graph_id, node_id, label, sku, price, description } = data;
    const conn = await getConnection();

    await conn.execute(
      `INSERT INTO products (graph_id, node_id, name, sku, price, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [graph_id, node_id, label, sku, price, description]
    );

    conn.end();
    console.log('📦 Producto registrado para nodo:', node_id);
    socket.emit('product-created', { node_id });

  } catch (err) {
    console.error('❌ Error creando producto:', err);
    socket.emit('error', { message: 'Error creando producto' });
  }
}

module.exports = create;
