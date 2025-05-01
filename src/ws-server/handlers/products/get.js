// handlers/products/get.js
const { getConnection } = require('../../../lib/database');

async function get(socket, data) {
  try {
    const { graph_id } = data;
    const conn = await getConnection();

    const [rows] = await conn.execute(
      `SELECT node_id, name, sku, price, description FROM products WHERE graph_id = ?`,
      [graph_id]
    );

    conn.end();
    socket.emit('product-list', rows);
    console.log('📦 Productos cargados:', rows.length);
  } catch (err) {
    console.error('❌ Error consultando productos:', err);
    socket.emit('error', { message: 'Error consultando productos' });
  }
}

module.exports = get;