// handlers/companies/get.js
const { getConnection } = require('../../../lib/database');

async function get(socket, data) {
  try {
    const { graph_id } = data;
    const conn = await getConnection();

    const [rows] = await conn.execute(
      `SELECT node_id, name, ruc, website, logo_url FROM companies WHERE graph_id = ?`,
      [graph_id]
    );

    conn.end();
    socket.emit('company-list', rows);
    console.log('📦 Empresas cargadas:', rows.length);
  } catch (err) {
    console.error('❌ Error consultando empresas:', err);
    socket.emit('error', { message: 'Error consultando empresas' });
  }
}

module.exports = get;