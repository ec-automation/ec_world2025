'use client';

import { signIn } from "next-auth/react";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4 py-10">
      
      <div className="bg-neutral-900 rounded-xl shadow-2xl p-8 w-full max-w-sm text-center ">
        <img
          src="/system_images/Ec_automation_logo.png"
          alt="Logo"
          className="w-96 h-24 mx-auto mb-6"
        />

        <div className="flex flex-col gap-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3  text-white font-semibold py-2 px-4 rounded transition"
          >
            <img src="/system_images/login_google.png" alt="Google" className="w-24 h-12" />
            Continuar con Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded transition"
          >
            <img src="/system_images/login_github.png" alt="GitHub" className="w-24 h-12" />
            Continuar con GitHub
          </button>

          <button
            onClick={() => signIn("facebook")}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            <img src="/system_images/login_facebook.png" alt="Facebook" className="w-24 h-18" />
            Continuar con Facebook
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-6">¿No tienes cuenta? Se creará automáticamente al ingresar.</p>
    </div>
  );
}
