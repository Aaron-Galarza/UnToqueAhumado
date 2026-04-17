"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';

export function FloatingCart() {
  const router = useRouter();
  
  // Nos conectamos al cerebro para saber qué hay adentro
  const items = useCartStore((state) => state.items);

  // Calculamos la cantidad total de artículos (sumando las cantidades de cada uno)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Si el carrito está vacío, no mostramos el botón flotante
  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => router.push('/cart')}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-primary text-primary-foreground p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center cursor-pointer"
    >
      <ShoppingCart className="w-6 h-6 md:w-5 md:h-5" />
      
      {/* El circulito blanco con el número (Badge) */}
      <span className="absolute -top-2 -right-2 bg-background text-primary border-2 border-primary font-bold text-xs md:text-sm w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full animate-in zoom-in">
        {totalItems}
      </span>
    </button>
  );
}