'use client';

import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import { WebSocketProvider } from "../components/WebSocketProvider";
import Ec_nav_bar from "../components/navbar";

function InnerPage() {
  const { t } = useTranslation();

  return (
    <WebSocketProvider>
      <main className="flex flex-col min-h-screen">
        <Ec_nav_bar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          {/* tu contenido */}
          {/* <p>testing 12345</p> */}
          <p>{t("Main_greeting")}</p>

        </div>
         <footer className="p-4 bg-black text-white text-center">
          <p className="mb-4 text-gray-600">{t("Copyright")}</p>
        </footer> 
{/*         <footer className="p-4 bg-black text-white text-center">
  <p className="mb-4 text-gray-600">
    Creado por Edgar f Soarez A de EC-HOME AUTOMATION PERU SAC © Copyright 2025
  </p>
</footer> */}

      </main>
    </WebSocketProvider>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerPage />
    </Suspense>
  );
}
