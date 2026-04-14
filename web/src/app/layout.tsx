import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
      <body className="antialiased bg-background text-foreground flex flex-col min-h-screen">
        
        <Header />

        <main className="flex-grow pt-16">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}