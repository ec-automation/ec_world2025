"use client";

/**  ⬅️  nada antes de esto **/

import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import Ec_nav_bar from "@/components/ec_nav_bar2";
import GraphEditor from '@/components/GraphEditor';

function InnerPage() {
  const { t } = useTranslation();

  const handleBuy = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_1RFbSbIW5IjCzrzLcZLxH7jr" }),
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  return (
 <main className="flex flex-col min-h-screen">
   <Ec_nav_bar />
   <div className="flex-grow flex flex-col items-center justify-center p-6">
      <div className="bg-white dark:bg-black text-black dark:text-white p-4 rounded">
        Prueba de modo oscuro 🌙
      </div>
      <div className="p-4 text-xl font-bold text-center bg-white text-black dark:bg-purple-900 dark:text-yellow-300">
      Test visual 🌗 Modo Claro / Oscuro
      </div>

     <h1 className="text-3xl font-bold mb-4 text-white">{t("welcome_message")}</h1>
     <GraphEditor />
     <button
       onClick={handleBuy}
       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
     >
       {t("buy_now")}
     </button>
   </div>
   <footer className="p-4 bg-gray-800 text-white text-center">
     Footer Content
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
