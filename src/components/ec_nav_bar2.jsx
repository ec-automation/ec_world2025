'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // CAMBIO CLAVE
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import useDarkMode from '@/hooks/useDarkMode';
import CartIcon from "./CartIcon";

export const Ec_nav_bar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const { theme, toggleTheme } = useDarkMode();

  const changeLanguage = (lng) => {
    console.log(`Changing language to: ${lng}`);
    i18n.changeLanguage(lng);
  };

  const handleBuy = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_1RFbSbIW5IjCzrzLcZLxH7jr" }),
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  useEffect(() => {
    console.log(`Current language: ${i18n.language}`);
  }, [i18n.language]);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session]);

  return (
    <div className="w-screen h-20 grid grid-cols-4 border-1 bg-black bg-opacity-60">
      <a href="/" className="col-span-1 flex items-center justify-center">
        <img src="./system_images/Ec_automation_logo.png" className="h-12 w-full object-contain" alt="Logo" />
      </a>

      <div className="col-span-2 grid grid-cols-3 md:grid-cols-7">
        <div className="text-white cursor-pointer self-center place-self-center" onClick={() => router.push("/")}>{t("AI_Agent")}</div>
        <div className="text-white cursor-pointer self-center place-self-center" onClick={() => router.push("/")}>Hospital</div>
        <div className="hidden md:inline text-white cursor-pointer self-center place-self-center" onClick={() => router.push("/about_us")}>{t("About_Us")}</div>

        <div className="self-center justify-self-end mr-4 cursor-pointe text-white" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </div>
        <div className="hidden md:inline text-white cursor-pointer self-center place-self-center"><CartIcon /></div>
        <div className="hidden md:inline text-white cursor-pointer self-center place-self-center">
          <select style={{ backgroundColor: 'black', color: 'white' }} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
          </select>
        </div>
        <button onClick={handleBuy} className="bg-blue-600 text-white rounded hover:bg-blue-700 transition">{t("buy_now")}</button>
      </div>

      <div className="text-white col-start-4 w-20 justify-self-end self-center">
        <div className="text-white cursor-pointer" onClick={() => signIn()}>Login</div>
      </div>
    </div>
  );
};

export default Ec_nav_bar;
