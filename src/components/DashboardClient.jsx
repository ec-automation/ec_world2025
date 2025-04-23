'use client';

import Ec_nav_bar from "./ec_nav_bar2";
import GraphEditor from "./GraphEditor";
import { useTranslation } from "react-i18next";

export default function DashboardClient({ session }) {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col min-h-screen">
      <Ec_nav_bar />
      <h1 className="text-white">Hola! {session.user?.name}</h1>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <GraphEditor />
      </div>

      <footer className="p-4 bg-black text-white text-center">
        <p className="mb-4 text-gray-600">{t("Copyright")}</p>
      </footer>
    </main>
  );
}
