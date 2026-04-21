"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
  const router = useRouter();

  return (
    <header className="bg-[#FFF9F5] border-b border-[#FFE8D9] px-4 md:px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <img src="https://res.cloudinary.com/dwqxdensk/image/upload/v1774491741/image_so7u3x.png" alt="Un Toque Ahumado" className="w-10 h-10 md:w-12 md:h-12" />
          <div>
            <h1 className="text-xl md:text-2xl text-primary tracking-wider font-['Bebas_Neue']">
              UN TOQUE AHUMADO
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest hidden sm:block">Torre de Control</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-3 border-r border-[#FFE8D9] pr-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">AD</div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@untoque.com</p>
            </div>
          </div>
          {/* Aaron: cuando haya auth real, este botón debería cerrar sesión (token/cookie) antes de volver al home. */}
<button
  onClick={() => router.push('/')}
  className="flex items-center gap-2 bg-[#FFF0E5] text-primary border border-primary/30 hover:bg-primary hover:text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md"
>
  <ArrowLeft className="w-4 h-4" />
  <span className="text-sm font-bold hidden sm:inline">Cerrar Sesión</span>
</button>
        </div>
      </div>
    </header>
  );
}
