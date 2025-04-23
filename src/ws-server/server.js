const dotenv = require("dotenv");
dotenv.config({ path: '../.env.local' });
console.log("Environment Variables Loaded:", process.env.STRIPE_SECRET_KEY, process.env.STRIPE_WEBHOOK_SECRET);
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const stripePackage = require("stripe");
const bodyParser = require("body-parser");
const cors = require("cors");

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // ajusta esto si tienes dominio de producción
  },
});

app.use(cors());

// WebSocket connection
io.on("connection", (socket) => {
  console.log("🧠 Cliente conectado vía WebSocket");

  socket.on("disconnect", () => {
    console.log("👋 Cliente desconectado");
  });

  socket.on("generate-graph", ({ prompt }) => {
    console.log("📩 Prompt recibido:", prompt);
  
    // TODO: Aquí irá la llamada real a OpenAI
  
    // Por ahora respondemos con nodos ficticios para testear:
    const response = {
      nodes: [
        { id: 'n1', data: { label: 'Inicio' }, position: { x: 0, y: 50 }, type: 'customNode' },
        { id: 'n2', data: { label: 'Proceso' }, position: { x: 200, y: 50 }, type: 'customNode' },
        { id: 'n3', data: { label: 'Fin' }, position: { x: 400, y: 50 }, type: 'customNode' },
      ],
      edges: [
        { id: 'e1-2', source: 'n1', target: 'n2' },
        { id: 'e2-3', source: 'n2', target: 'n3' },
      ],
    };
  
    socket.emit("graph-response", response);
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

// Start server
httpServer.listen(4000, () => {
  console.log("🚀 WebSocket + Stripe webhook en http://localhost:4000");
});
