"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Lock } from 'lucide-react';
// Traemos tu estado global para que el número del carrito sea real
import { useCartStore } from '@/stores/cartStore'; 

export function Header() {
  // 1. Calculamos la cantidad real de productos en el carrito
  const items = useCartStore((state) => state.items);
  // Sumamos las cantidades (si tenés 2 hamburguesas iguales, cuenta como 2 items)
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // 2. Estado para saber a dónde tiene que llevar el candado
  const [adminRoute, setAdminRoute] = useState('/admin/login');

  // Este useEffect se ejecuta apenas carga el Header en el navegador
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si encontramos el token, cambiamos la ruta para que vaya directo al panel
      setAdminRoute('/admin');
    }
  }, []);

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
          
          {/* Botón Admin Inteligente */}
          <Link href={adminRoute} className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Lock className="w-5 h-5" />
          </Link>

          {/* Botón Carrito Real */}
          <Link href="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {/* El badge ahora desaparece solo si el carrito global está vacío */}
            <span className={`absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${cartItemCount === 0 ? 'hidden' : ''}`}>
              {cartItemCount}
            </span>
          </Link>
          
        </div>
      </div>
    </header>
  );
}