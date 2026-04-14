"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Lock } from 'lucide-react';

export function Header() {
  // A futuro, este 0 vendrá de tu estado global (Zustand)
  const cartItemCount = 0;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo clickeable que lleva al Home */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src="https://res.cloudinary.com/dwqxdensk/image/upload/v1774491741/image_so7u3x.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-full border border-border"
          />
          <div className="flex flex-col">
             <span className="text-[10px] font-black leading-none text-foreground tracking-widest">UN TOQUE</span>
             <span className="text-[14px] font-black leading-none text-primary tracking-widest">AHUMADO</span>
          </div>
        </Link>

        {/* Botones de acción */}
        <div className="flex items-center gap-4">
          
          {/* Botón Admin (Solo visible en ciertas condiciones a futuro, por ahora lo dejamos) */}
          <Link href="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Lock className="w-5 h-5" />
          </Link>

          {/* Botón Carrito */}
          <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {/* Si no hay items, ocultamos el badge */}
            <span className={`absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${cartItemCount === 0 ? 'hidden' : ''}`}>
              {cartItemCount}
            </span>
          </Link>
          
        </div>
      </div>
    </header>
  );
}