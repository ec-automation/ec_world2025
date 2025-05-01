// handlers/clients/get.js
const { getConnection } = require('../../../lib/database');

async function get(socket, data) {
  try {
    const { graph_id } = data;
    const conn = await getConnection();

    const [rows] = await conn.execute(
      `SELECT node_id, name, lastname, email, phone FROM clients WHERE graph_id = ?`,
      [graph_id]
    );

    conn.end();
    socket.emit('client-list', rows);
    console.log('👥 Clientes cargados:', rows.length);
  } catch (err) {
    console.error('❌ Error consultando clientes:', err);
    socket.emit('error', { message: 'Error consultando clientes' });
  }
}

module.exports = get;