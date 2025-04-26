'use client';

import { signIn } from "next-auth/react";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4 py-10">
      
      <div className="relative bg-neutral-900 rounded-xl p-8 w-full max-w-sm text-center shadow-[0px_0px_40px_5px_rgba(255,255,255,0.1)] overflow-hidden">
         <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <img
          src="/system_images/Ec_automation_logo.png"
          alt="Logo"
          className="w-96 h-24 mx-auto mb-6"
        />

        <div className="flex flex-col gap-4">

          <button
            onClick={() => signIn('google')}
            className="flex items-center justify-center bg-white text-black rounded shadow-md hover:bg-gray-100 px-4 py-2 w-full"
          >
            <div className="mr-2">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="font-medium">Sign in with Google</span>
          </button>

          <button
            onClick={() => signIn('github')}
            className="flex items-center justify-center bg-black text-white rounded shadow-md hover:bg-gray-800 px-4 py-2 w-full"
          >
            <div className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M12 0a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 00-1.34-1.76c-1.09-.75.08-.74.08-.74a2.53 2.53 0 011.85 1.25 2.58 2.58 0 003.52 1 2.58 2.58 0 01.77-1.61c-2.67-.3-5.47-1.34-5.47-5.95a4.66 4.66 0 011.24-3.22 4.32 4.32 0 01.12-3.17s1-.32 3.3 1.23a11.44 11.44 0 016 0c2.3-1.55 3.29-1.23 3.29-1.23a4.32 4.32 0 01.12 3.17 4.65 4.65 0 011.24 3.22c0 4.62-2.81 5.64-5.49 5.94a2.89 2.89 0 01.82 2.24v3.32c0 .32.22.69.83.58A12 12 0 0012 0z" />
              </svg>
            </div>
            <span className="font-medium">Sign in with GitHub</span>
          </button>

        <button
          onClick={() => signIn('facebook')}
          className="flex items-center justify-center bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 px-4 py-2 w-full"
        >
          <div className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691V11.01h3.129V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
          </div>
          <span className="font-medium">Sign in with Facebook</span>
        </button>

        </div>
      </div>

      <p className="text-gray-400 text-sm mt-6">¿No tienes cuenta? Se creará automáticamente al ingresar.</p>
    </div>
  );
}
