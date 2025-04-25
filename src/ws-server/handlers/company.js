const { getConnection } = require('../../lib/database');

async function create(socket, data) {
  try {
    const { graph_id, name, ruc, website, user_id, logo_url } = data;

    if (!name || !ruc || !user_id) {
      socket.emit('company-created', { success: false, error: 'Datos incompletos' });
      return;
    }

    const logo = logo_url || `https://ecworldbucket.s3.amazonaws.com/default_company_logo.png`;

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO companies (name, ruc, website, user_id, logo_url) VALUES (?, ?, ?, ?, ?)`,
      [name, ruc, website, user_id, logo]
    );
    conn.end();

    socket.emit('company-created', { success: true, company_id: result.insertId });
  } catch (err) {
    console.error('❌ Error al crear empresa:', err);
    socket.emit('company-created', { success: false, error: err.message });
  }
}

module.exports = { create };
