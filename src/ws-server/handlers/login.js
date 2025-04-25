const { getConnection } = require('../../lib/database');

async function login(socket, data) {
  try {
    const { email } = data;

    if (!email) {
      console.warn('⚠️ Email no proporcionado en login.');
      return;
    }

    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id FROM users WHERE username = ?', [email]);
    conn.end();

    if (rows.length > 0) {
      socket.user_id = rows[0].id;
      console.log(`✅ Usuario autenticado: ${email}, ID: ${socket.user_id}`);
    } else {
      console.warn(`⚠️ Usuario no encontrado para email: ${email}`);
    }
  } catch (err) {
    console.error('❌ Error en login WebSocket:', err);
  }
}

module.exports = { login };
