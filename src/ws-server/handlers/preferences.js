// src/ws-server/handlers/preferences.js

async function updatePreferences(socket, data) {
  try {
    const { theme, language } = data;

    if (!socket.user) {
      console.warn('⚠️ No hay usuario en sesión en updatePreferences');
      return;
    }

    // Guardar en memoria del socket
    socket.user.theme = theme || socket.user.theme;
    socket.user.language = language || socket.user.language;

    console.log(`🎨 Preferencias actualizadas: ${socket.user.theme}, ${socket.user.language}`);

    // (opcional) Aquí puedes actualizar en base de datos si deseas persistir

    // Notificar al cliente
    socket.emit('user-preferences', {
      theme: socket.user.theme,
      language: socket.user.language,
    });
  } catch (err) {
    console.error('❌ Error actualizando preferencias:', err);
    socket.emit('error', { message: 'Error actualizando preferencias' });
  }
}

function sendCurrentPreferences(socket) {
  if (socket.user) {
    socket.emit('user-preferences', {
      theme: socket.user.theme || 'dark',
      language: socket.user.language || 'es',
    });
  }
}

module.exports = { updatePreferences, sendCurrentPreferences };
