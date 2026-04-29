"use client";

import { Plus, Minus } from "lucide-react";
import { useAddons } from '@/features/menu/hooks/useAddons'; // <-- 1. Traemos los extras de la BD real

interface ExtrasSelectorProps {
  itemId: string; // <-- 2. Cambiamos de number a string (porque MongoDB usa _id)
  adicionales: Record<string, number>;
  onUpdateAdicional: (itemId: string, adId: string, delta: number) => void;
}

export function ExtrasSelector({ itemId, adicionales, onUpdateAdicional }: ExtrasSelectorProps) {
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');
  
  // 3. Obtenemos los adicionales reales
  const { addons, isLoading: addonsLoading } = useAddons();

  if (addonsLoading) {
    return <div className="mt-3 text-xs text-muted-foreground text-center animate-pulse">Buscando adicionales...</div>;
  }

  return (
    <div className="mt-3 bg-muted border border-border rounded-xl p-3 animate-in slide-in-from-top-2 duration-200">
      <p className="text-[10px] font-bold text-secondary-foreground uppercase tracking-widest mb-2">
        Adicionales (Máx 10 c/u)
      </p>
      
      <div className="flex flex-col gap-2">
        {/* 4. Iteramos sobre los addons reales de la BD */}
        {addons.map(ad => {
          const qty = adicionales[ad._id] || 0; // Usamos _id
          
          return (
            <div key={ad._id} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
              <div>
                {/* Usamos title en vez de label */}
                <span className="text-sm font-semibold text-foreground">{ad.title}</span>
                <span className="text-xs font-semibold text-secondary-foreground ml-2">
                  +{fmt(ad.price)}
                </span>
              </div>
              
              {/* Stepper (+/-) */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onUpdateAdicional(itemId, ad._id, -1)} // Usamos _id
                  disabled={qty <= 0} 
                  className="w-7 h-7 rounded-full border-2 border-border bg-card text-primary font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-primary cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                
                <span className="text-sm font-extrabold text-foreground w-4 text-center">
                  {qty}
                </span>
                
                <button 
                  onClick={() => onUpdateAdicional(itemId, ad._id, +1)} // Usamos _id
                  disabled={qty >= 10} 
                  className="w-7 h-7 rounded-full border-2 border-border bg-card text-primary font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-primary cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
