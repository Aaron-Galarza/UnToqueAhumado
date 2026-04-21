"use client";

import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "../types/cart";
import { canHaveExtras, CART_EXTRAS } from "../data/extras";
import { ExtrasSelector } from "./ExtrasSelector";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onUpdateAdicional: (itemId: number, adId: string, delta: number) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemoveItem, onUpdateAdicional }: CartItemCardProps) {
  // Estado local para abrir/cerrar el panel de extras
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);

  // Calcula el total del producto + sus extras
  const adExtraPrice = CART_EXTRAS.reduce((acc, a) => acc + (item.adicionales[a.id] || 0) * a.price, 0);
  const totalItemPrice = (item.price + adExtraPrice) * item.quantity;
  
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');
  const hasExtrasRule = canHaveExtras(item.category);
  const adCount = Object.values(item.adicionales).reduce((a, b) => a + b, 0);

  return (
    <div className={`bg-card border-2 rounded-2xl p-4 transition-all duration-200 ${isExtrasOpen ? 'border-primary shadow-md' : 'border-border shadow-sm'}`}>
      
      {/* 1. Fila Principal (Foto, Nombre, Precio, y Controles) */}
      <div className="flex items-center gap-3 md:gap-4">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-border shrink-0" 
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm md:text-base text-foreground leading-tight mb-1">
            {item.name}
          </p>
          <p className="font-extrabold text-base md:text-lg text-primary m-0">
            {fmt(totalItemPrice)}
          </p>
        </div>

        {/* Stepper del producto principal y Tacho de basura */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="flex items-center bg-secondary rounded-full border border-border p-1">
            <button onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1} className="w-6 h-6 rounded-full flex items-center justify-center text-secondary-foreground hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold w-6 text-center text-foreground">{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, +1)} disabled={item.quantity >= 10} className="w-6 h-6 rounded-full flex items-center justify-center text-secondary-foreground hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <button onClick={() => onRemoveItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1 cursor-pointer" title="Eliminar producto">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Botón para abrir Extras (Solo si la categoría lo permite) */}
      {hasExtrasRule && (
        <button 
          className="flex items-center gap-1.5 mt-3 text-xs font-bold text-primary uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer"
          onClick={() => setIsExtrasOpen(!isExtrasOpen)}
        >
          <Plus className={`w-3 h-3 transition-transform ${isExtrasOpen ? 'rotate-45' : ''}`} />
          {isExtrasOpen ? 'Cerrar adicionales' : adCount > 0 ? `Adicionales (${adCount})` : 'Agregar adicionales'}
        </button>
      )}

      {/* 3. Panel de Extras Componentizado */}
      {hasExtrasRule && isExtrasOpen && (
        <ExtrasSelector 
          itemId={item.id}
          adicionales={item.adicionales}
          onUpdateAdicional={onUpdateAdicional}
        />
      )}
    </div>
  );
}
