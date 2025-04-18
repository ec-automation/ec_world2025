"use client";

import { SessionProvider } from "next-auth/react";
import { WebSocketProvider } from "./WebSocketProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/i18n";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <WebSocketProvider>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </WebSocketProvider>
    </SessionProvider>
  );
}
