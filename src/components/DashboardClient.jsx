'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Ec_nav_bar from "./navbar";
import GraphEditor from "./GraphEditor";
import { useSocket } from "../components/WebSocketProvider";
import useDarkMode from "../hooks/useDarkMode";
import GeoStatus from "./GeoStatus";

export default function DashboardClient() {
  const { socket } = useSocket();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation();
  const { setTheme } = useDarkMode();
  const [geoInfo, setGeoInfo] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && socket && session?.user?.email) {
      const { name, email } = session.user;
      console.log("📤 Emitiendo login vía socket:", { name, email });
      socket.emit("login", { name, email });
    }
  }, [status, socket, session]);

  useEffect(() => {
    if (socket) {
      const handleUserPreferences = (prefs) => {
        console.log("🌟 Preferencias recibidas:", prefs);
        if (prefs.theme) setTheme(prefs.theme);
        if (prefs.language) i18n.changeLanguage(prefs.language);
      };

      const handleUserInfo = (info) => {
        console.log("🌐 Info de conexión recibida:", info);
        setGeoInfo(info);
      };

      socket.on("user-preferences", handleUserPreferences);
      socket.on("user-info", handleUserInfo);

      return () => {
        socket.off("user-preferences", handleUserPreferences);
        socket.off("user-info", handleUserInfo);
      };
    }
  }, [socket, setTheme, i18n]);

  return (
    <main className="flex flex-col min-h-screen">
      <Ec_nav_bar />

      {typeof window !== 'undefined' && geoInfo && (
        <div className="p-2 flex justify-center">
          <GeoStatus info={geoInfo} />
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <GraphEditor />
      </div>

      <footer className="p-4 bg-black text-white text-center">
        <p className="mb-4 text-gray-600">{t("Copyright")}</p>
      </footer>
    </main>
  );
}
