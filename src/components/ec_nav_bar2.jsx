"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';

import CartIcon from "./CartIcon";
/* import Router from "next/router"; */
export const Ec_nav_bar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        console.log(`Changing language to: ${lng}`);
        i18n.changeLanguage(lng);
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
      <img src="./system_images/Ec_automation_logo.png" className="h-12 w-full object-contain " alt="Logo" />
    </a>

    <div className="col-span-2 grid grid-cols-3 md:grid-cols-5">
      <div className="text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./home")}>Home</div>
      <div className="text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./hospital")}>Hospital</div>
      <div className="hidden md:inline text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./about_us")}>About Us</div>
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
      
  
    </div>
    
    <div className="text-white col-start-4 w-20 justify-self-end self-center">


      <div className="text-white cursor-pointer" onClick={() => signIn()}>Login</div>
    </div>
{/*     <div className="text-white">
     { <p>{t('welcome')}</p>}
    </div> */}
</div>
  );
};


export default Ec_nav_bar;

// Elaborado por EC-Home Automation Peru
