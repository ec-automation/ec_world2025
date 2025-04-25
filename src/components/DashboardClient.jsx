'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Ec_nav_bar from "./navbar";
import GraphEditor from "./GraphEditor";
import { useTranslation } from "react-i18next";
import { useSocket } from "../components/WebSocketProvider";

export default function DashboardClient() {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const { data: session, status } = useSession();


  // Enviar login cuando se autentica el usuario
  useEffect(() => {
    if (status === "authenticated" && socket && session?.user?.email) {
      const { name, email } = session.user;
      console.log("📤 Enviando login vía socket:", { name, email });
      socket.emit("login", { name, email });
    }
  }, [status, socket, session]);



  return (
    <main className="flex flex-col min-h-screen">
      <Ec_nav_bar />
      
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <GraphEditor />
      </div>

      <footer className="p-4 bg-black text-white text-center">
        <p className="mb-4 text-gray-600">{t("Copyright")}</p>
      </footer>
    </main>
  );
}
