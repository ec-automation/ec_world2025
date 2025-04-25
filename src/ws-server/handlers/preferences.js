const { getConnection } = require('../../lib/database');

async function updatePreferences(socket, data) {
  try {
    let { theme, language } = data;

    if (!socket.user_id) {
      console.warn('⚠️ No hay usuario autenticado para actualizar preferencias.');
      return;
    }

    const conn = await getConnection();

    // ✅ Si vienen ambos, actualizamos ambos
    if (theme !== undefined && language !== undefined) {
      await conn.execute(
        `UPDATE users SET theme = ?, language = ? WHERE id = ?`,
        [theme, language, socket.user_id]
      );
    }
    // ✅ Si solo viene theme
    else if (theme !== undefined) {
      await conn.execute(
        `UPDATE users SET theme = ? WHERE id = ?`,
        [theme, socket.user_id]
      );
    }
    // ✅ Si solo viene language
    else if (language !== undefined) {
      await conn.execute(
        `UPDATE users SET language = ? WHERE id = ?`,
        [language, socket.user_id]
      );
    }
    else {
      console.warn('⚠️ No se enviaron cambios válidos de preferencias.');
    }

    conn.end();

    console.log(`🎨 Preferencias actualizadas para user_id ${socket.user_id}:`);
    console.log(`    Tema: ${theme !== undefined ? theme : "(sin cambio)"}`);
    console.log(`    Idioma: ${language !== undefined ? language : "(sin cambio)"}`);
    
    socket.emit('preferences-updated', { success: true });
  } catch (err) {
    console.error('❌ Error actualizando preferencias:', err);
    socket.emit('preferences-updated', { success: false, error: err.message });
  }
}

module.exports = { updatePreferences };
