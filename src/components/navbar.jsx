'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useSocket } from "./WebSocketProvider"; // Asegúrate de que la ruta es correcta
import { Moon, Sun } from "lucide-react";
import CartIcon from "./CartIcon";
import useDarkMode from "../hooks/useDarkMode";
import { useEffect, useState } from "react";

function Ec_nav_bar() {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const { socket, status: socketStatus } = useSocket();
  const { theme, toggleTheme } = useDarkMode();

  const [logoUrl, setLogoUrl] = useState("/system_images/Ec_automation_logo.png");

  const handleBuy = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_1RFbSbIW5IjCzrzLcZLxH7jr" }),
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    if (socket) {
      socket.emit('update-preferences', { language: lng });
    }
  };

  useEffect(() => {
    if (session?.user?.companyLogo) {
      setLogoUrl(session.user.companyLogo);
    }
  }, [session]);

  return (
    <nav className="w-full h-20 bg-black bg-opacity-70 flex items-center justify-between px-4">
      <div className="flex items-center">
        <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
      </div>

      <div className="flex items-center gap-4">
        <select
          className="bg-black text-white border rounded p-1 text-sm"
          onChange={(e) => changeLanguage(e.target.value)}
          defaultValue={i18n.language}
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="de">DE</option>
          <option value="fr">FR</option>
          <option value="zh">中文</option>
        </select>

        <button onClick={toggleTheme} className="text-white">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className={`text-sm ${socketStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
          {socketStatus === 'connected' ? '🟢' : '🔴'}
        </div>

        {session ? (
          <>
            <button onClick={handleBuy} className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded-md text-sm">
              {t("buy_now")}
            </button>
            <CartIcon />
            <button onClick={() => signOut()} className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded-md text-sm">
              {t("Sign Out")}
            </button>
          </>
        ) : (
          <button onClick={() => signIn()} className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm">
            {t("Sign In")}
          </button>
        )}
      </div>
    </nav>
  );
}

export default Ec_nav_bar;
