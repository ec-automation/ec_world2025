const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const stripePackage = require("stripe");
const bodyParser = require("body-parser");
const cors = require("cors");
const dispatcher = require("./dispatcher.js");
const { getConnection } = require("../lib/database.js");
const { getGeoInfoFromIP } = require("./utils/getGeoInfoFromIP.js");

dotenv.config({ path: "../.env.local" });
console.log("🔧 Variables de entorno cargadas.");

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());

io.on('connection', async (socket) => {
  const ipAddress = socket.handshake.address;
  const geoInfo = await getGeoInfoFromIP(ipAddress);

  if (geoInfo.isLocal) {
    console.log("🧠 Cliente Local conectado");
  } else if (geoInfo.reserved) {
    console.log(`🧠 Cliente conectado desde IP reservada: ${ipAddress}`);
  } else {
    console.log(`🧠 Cliente conectado desde IP: ${ipAddress}`);
    console.log(`    País: ${geoInfo.country}`);
    console.log(`    Ciudad: ${geoInfo.city}`);
    console.log(`    Región: ${geoInfo.region}`);
  }

  // 🔥 Correcto: login dentro de conexión
  socket.on('login', async (user) => {
    console.log(`✅ login received with: ${user.email}, ID: ${socket.user_id}`);
    try {
      const conn = await getConnection();
      const [rows] = await conn.execute(
        `SELECT id, theme, language FROM users WHERE username = ?`,
        [user.email]
      );
      conn.end();
  
      if (rows.length > 0) {
        socket.user_id = rows[0].id;
        console.log(`✅ Usuario autenticado: ${user.email}, ID: ${socket.user_id}`);
  
        // 🚀 Enviamos al frontend las preferencias
        socket.emit('user-preferences', {
          theme: rows[0].theme || 'light',
          language: rows[0].language || 'en',
        });
      } else {
        console.warn(`⚠️ Usuario no encontrado en base de datos: ${user.email}`);
      }
    } catch (err) {
      console.error("❌ Error buscando usuario:", err);
    }
  });

  socket.on('logout', (msg) => {
    console.log(`👤 Usuario cerró sesión:`, msg);
  });

  socket.onAny((event, data) => {
    if (dispatcher[event]) {
      dispatcher[event](socket, data);
    } else {
      console.warn(`⚠️ Evento WebSocket no reconocido: "${event}"`);
    }
  });

  socket.on('disconnect', () => {
    console.log(geoInfo.isLocal ? "👋 Cliente Local desconectado" : `👋 Cliente desconectado IP: ${ipAddress}`);
  });
});

// Stripe Webhook route
app.use("/webhook", bodyParser.raw({ type: "application/json" }));

app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Verificación fallida:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    io.emit("payment-confirmed", {
      customer: session.customer_email,
      amount: session.amount_total / 100,
      message: "✅ Pago confirmado vía Stripe",
    });

    console.log("📢 Emitido: payment-confirmed", session.customer_email);
  }

  res.status(200).send("OK");
});

// 🔥 Ahora escucha en todas las interfaces
httpServer.listen(4000, '0.0.0.0', () => {
  console.log("🚀 WebSocket + Stripe webhook activo en http://localhost:4000");
});
