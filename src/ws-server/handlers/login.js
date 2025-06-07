const { getConnection } = require('../../lib/database');
const { sendCurrentPreferences } = require('./preferences'); // 👈 importar

async function login(socket, data) {
  try {
    const { email } = data;

    if (!email) {
      console.warn('⚠️ Email no proporcionado en login.');
      socket.emit('login-failed', { reason: 'Email no proporcionado.' });
      return;
    }

    const conn = await getConnection();
    const [rows] = await conn.execute(
      'SELECT id, username, role_id, theme, language FROM users WHERE username = ?',
      [email]
    );
    conn.end();

    if (rows.length > 0) {
      const user = {
        id: rows[0].id,
        email,
        username: rows[0].username,
        role_id: rows[0].role_id,
        theme: rows[0].theme || 'dark',
        language: rows[0].language || 'es',
      };

      socket.user = user;
      console.log(`✅ Usuario autenticado: ${email}, ID: ${user.id}`);

      socket.emit('login-success', { userId: user.id });

      // 🎯 Emitir preferencias automáticamente al frontend
      sendCurrentPreferences(socket);
    } else {
      console.warn(`⚠️ Usuario no encontrado para email: ${email}`);
      socket.emit('login-failed', { reason: 'Usuario no encontrado.' });
    }
  } catch (err) {
    console.error('❌ Error en login WebSocket:', err);
    socket.emit('login-failed', { reason: 'Error interno.' });
  }
}

module.exports = { login };
