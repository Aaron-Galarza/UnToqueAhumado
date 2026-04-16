"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import { CART_EXTRAS } from "../data/extras";

interface ExtrasSelectorProps {
  itemId: number;
  adicionales: Record<string, number>;
  // Funciones que le pasaremos desde arriba para actualizar el estado
  onUpdateAdicional: (itemId: number, adId: string, delta: number) => void;
}

export function ExtrasSelector({ itemId, adicionales, onUpdateAdicional }: ExtrasSelectorProps) {
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');

  return (
    <div className="mt-3 bg-muted border border-border rounded-xl p-3 animate-in slide-in-from-top-2 duration-200">
      <p className="text-[10px] font-bold text-secondary-foreground uppercase tracking-widest mb-2">
        Adicionales (Máx 10 c/u)
      </p>
      
      <div className="flex flex-col gap-2">
        {CART_EXTRAS.map(ad => {
          const qty = adicionales[ad.id] || 0;
          
          return (
            <div key={ad.id} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
              <div>
                <span className="text-sm font-semibold text-foreground">{ad.label}</span>
                <span className="text-xs font-semibold text-secondary-foreground ml-2">
                  +{fmt(ad.price)}
                </span>
              </div>
              
              {/* Stepper (+/-) */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onUpdateAdicional(itemId, ad.id, -1)} 
                  disabled={qty <= 0} 
                  className="w-7 h-7 rounded-full border-2 border-border bg-card text-primary font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-primary cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                
                <span className="text-sm font-extrabold text-foreground w-4 text-center">
                  {qty}
                </span>
                
                <button 
                  onClick={() => onUpdateAdicional(itemId, ad.id, +1)} 
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