"use client";

/**  ⬅️  nada antes de esto **/

import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import Ec_nav_bar from "@/components/ec_nav_bar2";
import GraphEditor from '@/components/GraphEditor';

function InnerPage() {
  const { t } = useTranslation();

  return (
 <main className="flex flex-col min-h-screen">
   <Ec_nav_bar />
   <div className="flex-grow flex flex-col items-center justify-center p-6">

{/*       <div className="p-4 text-xl font-bold text-center bg-white text-black dark:bg-purple-900 dark:text-yellow-300">
      Test visual 🌗 Modo Claro / Oscuro
      </div> */}



     <GraphEditor />

{/*      <div className="bg-white dark:bg-black text-black dark:text-white p-4 rounded">
        Prueba de modo oscuro 🌙
      </div> */}

   </div>
   <footer className="p-4 bg-black text-white text-center">
   <p className="font-bold mb-4 text-white">{t("welcome_message")}</p>
   </footer> 

 </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerPage />
    </Suspense>
  );
}
