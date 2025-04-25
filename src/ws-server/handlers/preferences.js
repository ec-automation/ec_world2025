const { getConnection } = require('../../lib/database');

async function updatePreferences(socket, data) {
  try {
    const { theme, language } = data;

    if (!socket.user_id) {
      console.warn('⚠️ No hay usuario autenticado para actualizar preferencias.');
      return;
    }

    const conn = await getConnection();
    await conn.execute(
      `UPDATE users SET theme = ?, language = ? WHERE id = ?`,
      [theme, language, socket.user_id]
    );
    conn.end();

    console.log(`🎨 Preferencias actualizadas para user_id ${socket.user_id}:`);
    console.log(`    Tema: ${theme}`);
    console.log(`    Idioma: ${language}`);
    
    socket.emit('preferences-updated', { success: true });
  } catch (err) {
    console.error('❌ Error actualizando preferencias:', err);
    socket.emit('preferences-updated', { success: false, error: err.message });
  }
}

module.exports = { updatePreferences };
