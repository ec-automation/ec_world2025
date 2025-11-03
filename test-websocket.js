const { io } = require('socket.io-client');

console.log('🔄 Attempting to connect to Socket.IO server...');
const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server');
  console.log('Socket ID:', socket.id);
  
  // Test sending a message
  socket.emit('test', { message: 'Hello from test client' });
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

// Handle custom events
socket.on('message', (data) => {
  console.log('📨 Message received:', data);
});

// Close after 5 seconds
setTimeout(() => {
  console.log('🕒 5 seconds passed, disconnecting...');
  socket.disconnect();
  process.exit(0);
}, 5000);