"use client";
import { signIn } from "next-auth/react";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Inicia sesión</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => signIn("google")}
          className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition"
        >
          Continuar con Google
        </button>

        <button
          onClick={() => signIn("github")}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
        >
          Continuar con GitHub
        </button>

        <button
          onClick={() => signIn("facebook")}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Continuar con Facebook
        </button>
      </div>
    </div>
  );
}
