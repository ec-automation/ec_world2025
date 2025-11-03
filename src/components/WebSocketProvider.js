'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('disconnected');

/*   useEffect(() => {
    console.log('WS_URL:', process.env.NEXT_PUBLIC_WS_URL);
    //const socketIo = io(process.env.NEXT_PUBLIC_WS_URL, {
    const socketIo = io("ws://localhost:8080", {
      transports: ['websocket'],
    }); */
     useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketIo);

    socketIo.on('connect', () => {
      console.log('✅ Socket conectado');
      setStatus('connected');
    });

    socketIo.on('disconnect', () => {
      console.log('⛔ Socket desconectado');
      setStatus('disconnected');
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = (event, payload) => {
    if (socket && socket.connected) {
      socket.emit(event, payload);
    }
  };

  const onMessage = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage, onMessage, status }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = () => useContext(WebSocketContext);
