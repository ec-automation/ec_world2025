"use client";
/**  ⬅️  nada antes de esto **/

import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";


export default function SuccessPage() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ {t("payment_success")}
      </h1>
      <p className="mb-6">{t("thank_you")}</p>

      <a
        href="/downloads/mi-producto.pdf"
        download
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        ⬇️ {t("download_product")}
      </a>

      {sessionId && (
        <p className="mt-4 text-xs text-gray-500">
          {t("session_id")}: {sessionId}
        </p>
      )}
    </main>
  );
}
