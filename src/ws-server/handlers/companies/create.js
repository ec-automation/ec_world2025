// handlers/companies/create.js
const { getConnection } = require('../../../lib/database');

async function create(socket, data) {
  try {
    const { graph_id, node_id, label, ruc, website, logo_url } = data;
    const conn = await getConnection();

    await conn.execute(
      `INSERT INTO companies (graph_id, node_id, name, ruc, website, logo_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [graph_id, node_id, label, ruc, website, logo_url]
    );

    conn.end();
    console.log('🏢 Empresa registrada para nodo:', node_id);
    socket.emit('company-created', { node_id });

  } catch (err) {
    console.error('❌ Error creando empresa:', err);
    socket.emit('error', { message: 'Error creando empresa' });
  }
}

module.exports = create;