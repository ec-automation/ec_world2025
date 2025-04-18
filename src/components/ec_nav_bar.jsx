"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import CartIcon from "./CartIcon";
/* import Router from "next/router"; */
export const Ec_nav_bar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session]);

  return (
    <div className="w-screen h-20 grid grid-cols-4 border-1 bg-black bg-opacity-60">

{/*     <div className="col-span-1">
      <img src="./system_images/logo_png.png" className="h-20 w-full object-contain" href="/"/>
    </div> */}
    <a href="/" className="col-span-1">
{/*       <img src="./system_images/logo_png.png" className="h-20 w-full object-contain" alt="Logo" /> */}
      <img src="./system_images/Ec_automation_logo.png" className="h-20 w-full object-contain" alt="Logo" />
      
    </a>

    <div className="col-span-2 grid grid-cols-3 md:grid-cols-4">
    <div className=" text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./")}>Home</div>
    <div className=" text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./portfolio")}>Projects</div>
    <div className=" text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./store")}>Store</div>
    <div className=" hidden md:inline text-white cursor-pointer self-center place-self-center" onClick={() => router.push("./about_us")}>About Us</div>

    </div>
    
    <div className="text-white col-start-4  w-20 justify-self-end self-center ">
    <CartIcon /> {/* ✅ Icono del carrito con cantidad dinámica */}
        <div className="text-white cursor-pointer" onClick={() => signIn()}>Login</div>
    </div>
</div> 
  );
};


export default Ec_nav_bar;

// Elaborado por EC-Home Automation Peru
