import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "../components/Providers";
import "./globals.css";



const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "EC Virtual Store",
  description: "Tienda de intangibles con Stripe y Next.js",
};

// ⬇︎  PON estas dos líneas al principio del layout  (antes del HTML)
export const dynamic   = "force-dynamic";
export const revalidate = 0;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-no-repeat bg-cover bg-center min-h-screen`}

        style={{
          backgroundImage: `url("/system_images/bg2.jpg")`,
          backgroundRepeat: 'no-repeat', 
        }}
      >
    
        <Providers>
          {children}
        </Providers>
      


      </body>
    </html>
  );
}
