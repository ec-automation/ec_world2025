const { getConnection } = require('../../lib/database');

// Crear nueva empresa
async function create(socket, data) {
  try {
    const { graph_id, name, ruc, website, user_id, logo_url } = data;

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO companies (graph_id, name, ruc, website, user_id, logo_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [graph_id, name, ruc, website, user_id, logo_url]
    );
    conn.end();

    console.log(`✅ Empresa creada con ID: ${result.insertId}`);
    socket.emit('company-created', { company_id: result.insertId });
  } catch (error) {
    console.error('❌ Error creando empresa:', error);
    socket.emit('error', { message: 'Error creando empresa' });
  }
}

// Actualizar logo de una empresa
async function updateLogo(socket, data) {
  try {
    const { graph_id, name, logo_url } = data;

    const conn = await getConnection();
    const [result] = await conn.execute(
      `UPDATE companies SET logo_url = ? WHERE graph_id = ? AND name = ?`,
      [logo_url, graph_id, name]
    );
    conn.end();

    if (result.affectedRows > 0) {
      console.log(`✅ Logo actualizado para la empresa: ${name}`);
      socket.emit('company-logo-updated', { success: true });
    } else {
      console.warn(`⚠️ No se encontró empresa para actualizar logo: ${name}`);
      socket.emit('company-logo-updated', { success: false });
    }
  } catch (error) {
    console.error('❌ Error actualizando logo de empresa:', error);
    socket.emit('error', { message: 'Error actualizando logo' });
  }
}

module.exports = { create, updateLogo };
