"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const useSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("ws://localhost:4000"); // Cambia si lo alojas en producción
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🔌 Conectado a WebSocket Server");
    });

    newSocket.on("payment-confirmed", (data) => {
      console.log("✅ Pago confirmado recibido:", data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
