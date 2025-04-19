"use client";

/**  ⬅️  nada antes de esto **/

import { useTranslation } from "react-i18next";
import { Suspense } from "react";

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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 ">
      <div className="p-12 m-60 text-red-400">
        <h1>Hellox</h1>
      </div>
      <h1 className="text-3xl font-bold mb-4">{t("welcome_message")}</h1>
      <button
        onClick={handleBuy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {t("buy_now")}
      </button>
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
