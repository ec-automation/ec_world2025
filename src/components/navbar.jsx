'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "../components/WebSocketProvider";
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import CartIcon from "./CartIcon";
import useDarkMode from "../hooks/useDarkMode";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { socket } = useSocket();
  const { theme, toggleTheme } = useDarkMode();
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { sendMessage } = useSocket();


  const [previewUser, setPreviewUser] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [empresas, setEmpresas] = useState([]); // ← simulado por ahora
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  // Detectar conexión socket
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => setIsSocketConnected(true));
      socket.on("disconnect", () => setIsSocketConnected(false));
    }
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("user-info", (info) => {
        console.log("🌐 Info de conexión:", info);
  
        if (info.reserved) {
          setGeoText("🌐 Red Privada (IP CGNAT)");
        } else {
          setGeoText(`${info.city}, ${info.country}`);
        }
      });
    }
  }, [socket]);

  // Detectar sesión
  useEffect(() => {
    if (session?.user) {
      const { name, image, email } = session.user;
      localStorage.setItem("ec_last_user", JSON.stringify({ name, image, email }));
      setPreviewUser({ name, image, email });

      if (socket) {
        socket.emit("login", { name, email, image });
        console.log("📡 Emitido login por WebSocket:", { name, email });
      }

      // Simulación: Cargar empresas desde DB
      setEmpresas([]); // ← aquí deberíamos cargar empresas reales del user
    } else {
      const saved = localStorage.getItem("ec_last_user");
      if (saved) {
        setPreviewUser(JSON.parse(saved));
      }
    }
  }, [session, socket]);

  const handleSignOut = async () => {
    if (socket) {
      socket.emit("logout", { message: "Usuario cerró sesión" });
      console.log("📡 Emitido logout por WebSocket");
    }
    signOut();
  };

  const handleBuy = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_1RFbSbIW5IjCzrzLcZLxH7jr" }), // tu Price ID de Stripe
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  const changeLanguage = (lng) => {
    console.log(`Changing language to: ${lng}`);
    const currentLanguage = i18n.language;
  
    i18n.changeLanguage(lng);
  
    if (lng !== currentLanguage && typeof window !== "undefined") {
      sendMessage('update-preferences', { language: lng });
    }
  };
  

  const handleCreateCompany = () => {
    // Redireccionar o abrir modal
    console.log("Crear nueva empresa");
    router.push("/crear-empresa"); // ← más adelante podemos hacer que abra modal
  };

  return (
    <nav className="w-full h-16 bg-black bg-opacity-70 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src="/system_images/Ec_automation_logo.png" alt="Logo" className="h-10" />
      </div>

      {/* Opciones Centrales */}
      <div className="flex items-center gap-6">
        {/* Botón Empresas */}
        {empresas.length > 0 ? (
          <div className="relative group">
            <button className="text-white text-sm">
              Empresas ▼
            </button>
            <div className="absolute hidden group-hover:flex flex-col bg-white text-black rounded shadow mt-2 w-40 z-50">
              {empresas.map((empresa, idx) => (
                <button
                  key={idx}
                  onClick={() => setEmpresaSeleccionada(empresa)}
                  className="hover:bg-gray-200 p-2 text-left text-sm"
                >
                  {empresa.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm"
            onClick={handleCreateCompany}
          >
            Crear Empresa
          </button>
        )}

        {/* Cambio idioma */}
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
          className="bg-black text-white border border-gray-700 rounded p-1 text-xs"
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="de">DE</option>
          <option value="fr">FR</option>
          <option value="zh">中文</option>
        </select>

        {/* Botón Dark/Light */}
        <button onClick={toggleTheme} className="text-white">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Cart Icon */}
        <CartIcon />
        
        {/* Buy Now Button */}
        {typeof window !== "undefined" && t
  ? <button
      onClick={handleBuy}
      className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-md text-sm"
    >
      {t("buy_now")}
    </button>
  : null
}

      </div>

      {/* Estado + Usuario */}
      <div className="flex items-center gap-4">
        {/* Estado conexión */}
        <span className={`text-xs ${isSocketConnected ? "text-green-400" : "text-red-400"}`}>
          {isSocketConnected ? "🟢 Conectado" : "🔴 Desconectado"}
        </span>

        {status === "authenticated" && session?.user ? (
          <>
            <p className="text-gray-300 text-sm hidden md:inline">Hola, {session.user.name} 👋</p>
            <img
              src={session.user.image}
              alt="Perfil"
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={handleSignOut}
              className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : previewUser ? (
          <>
            <p className="text-gray-300 text-sm hidden md:inline">Hola de nuevo, {previewUser.name} 👋</p>
            <img
              src={previewUser.image}
              alt="Preview"
              className="w-10 h-10 rounded-full opacity-50"
            />
            <button
              onClick={() => signIn()}
              className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
            >
              Continuar
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
