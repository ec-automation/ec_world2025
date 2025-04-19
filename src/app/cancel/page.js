"use client";

import { useTranslation } from "react-i18next";

export default function CancelPage() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ {t("payment_canceled")}
      </h1>
      <p className="mb-6">{t("payment_canceled_message")}</p>
      <a
        href="/"
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        {t("return_home")}
      </a>
    </main>
  );
}