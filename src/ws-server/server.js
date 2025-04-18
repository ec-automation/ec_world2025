const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🧠 Cliente conectado");

  // Ejemplo: enviar mensaje de pago confirmado después de 3 segundos
  setTimeout(() => {
    socket.emit("payment-confirmed", {
      orderId: "1234",
      message: "Gracias por tu compra 🎉",
    });
  }, 3000);

  socket.on("disconnect", () => {
    console.log("👋 Cliente desconectado");
  });
});

httpServer.listen(4001, () => {
  console.log("🚀 WebSocket server escuchando en puerto 4001");
});

