import { getConnection } from '../../lib/database.js';

export async function create(socket, data) {
  try {
    const { name, ruc, website } = data;

    if (!name || !ruc) {
      socket.emit('company-created', { success: false, error: 'Datos incompletos' });
      return;
    }

    if (!socket.user_id) {
      socket.emit('company-created', { success: false, error: 'Usuario no autenticado. No se puede crear empresa.' });
      return;
    }

    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO companies (name, ruc, website, user_id) VALUES (?, ?, ?, ?)`,
      [name, ruc, website, socket.user_id]
    );
    conn.end();

    socket.emit('company-created', { success: true, company_id: result.insertId });
    console.log(`🏢 Empresa creada correctamente: ${name}, ID: ${result.insertId}`);
  } catch (err) {
    console.error('❌ Error al crear empresa:', err);
    socket.emit('company-created', { success: false, error: err.message });
  }
}