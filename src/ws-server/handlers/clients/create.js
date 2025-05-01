// handlers/clients/create.js
const { getConnection } = require('../../../lib/database');

async function create(socket, data) {
  try {
    const { graph_id, node_id, label, lastname, email, phone } = data;
    const conn = await getConnection();

    await conn.execute(
      `INSERT INTO clients (graph_id, node_id, name, lastname, email, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [graph_id, node_id, label, lastname, email, phone]
    );

    conn.end();
    console.log('👤 Cliente registrado para nodo:', node_id);
    socket.emit('client-created', { node_id });

  } catch (err) {
    console.error('❌ Error creando cliente:', err);
    socket.emit('error', { message: 'Error creando cliente' });
  }
}

module.exports = create;