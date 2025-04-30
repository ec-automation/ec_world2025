const { getConnection } = require('../../lib/database');

async function login(socket, data) {
  try {
    const { email } = data;

    if (!email) {
      console.warn('⚠️ Email no proporcionado en login.');
      socket.emit('login-failed', { reason: 'Email no proporcionado.' });
      return;
    }

    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id FROM users WHERE username = ?', [email]);
    conn.end();

    if (rows.length > 0) {
      socket.user_id = rows[0].id;
      console.log(`✅ Usuario autenticado: ${email}, ID: ${socket.user_id}`);
      
      // 🚀 Confirmar al frontend que el login fue exitoso
      console.log('📤 Emisión login-success (backend):', socket.user_id);
      socket.emit('login-success', { userId: socket.user_id });
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
