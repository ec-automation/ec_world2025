'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // ✅ Función para enviar mensajes
  const sendMessage = (event, data) => {
    if (socket) {
      socket.emit(event, data);
      console.log(`📤 Mensaje enviado: ${event}`, data);
    } else {
      console.warn("❌ Socket no conectado, no se pudo enviar:", event);
    }
  };

  // ✅ Función para escuchar mensajes
  const onMessage = (eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
    } else {
      console.warn("❌ Socket no conectado, no se pudo registrar listener:", eventName);
    }
  };

  useEffect(() => {
    const socketIo = io("ws://ecautomation2.ddns.net:4000");

    socketIo.on('connect', () => {
      console.log("✅ Socket conectado");
    });

    socketIo.on('disconnect', () => {
      console.log("⛔ Socket desconectado");
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const value = useMemo(() => ({
    socket,
    sendMessage,
    onMessage
  }), [socket]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook para consumirlo fácilmente
export const useSocket = () => useContext(WebSocketContext);
