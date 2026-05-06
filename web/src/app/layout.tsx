import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Un Toque Ahumado | Smash Burgers Premium",
  description: "Las mejores smash burgers premium. Pedí online y pasá a retirar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* 👇 PLAN B: Carga rápida sin bloquear el CSS 👇 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-foreground flex flex-col min-h-screen">
        
        <Header />

        <main className="flex-grow pt-16">
          {children}
        </main>
        
        <Toaster position="top-right" />
        <Footer />

      </body>
    </html>
  );
}