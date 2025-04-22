'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io('ws://localhost:4000', {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket conectado');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('⛔ Socket desconectado');
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (event, payload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, payload);
    } else {
      console.warn('🔌 Socket no conectado');
    }
  };

  const onMessage = (event, callback) => {
    socketRef.current?.on(event, callback);
  };

  return (
    <SocketContext.Provider value={{ sendMessage, onMessage, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
