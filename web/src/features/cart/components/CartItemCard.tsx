"use client";

import { Plus, Minus, Trash2 } from 'lucide-react';
import { CART_EXTRAS } from '@/features/cart/data/extras';
// Importamos el tipo extendido desde tu store
import { CartItemWithExtras } from '@/stores/cartStore'; 

interface CartItemCardProps {
  item: CartItemWithExtras;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateAdicional: (productId: string, adId: string, delta: number) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemoveItem, onUpdateAdicional }: CartItemCardProps) {
  // Cálculo de extras
  const extrasTotal = CART_EXTRAS.reduce((acc, extra) => {
    return acc + (item.adicionales?.[extra.id] || 0) * extra.price;
  }, 0);

  const itemTotal = (item.price + extrasTotal) * item.quantity;

  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 shadow-sm relative">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <h3 className="font-bold text-foreground leading-tight">{item.title}</h3>
          <p className="text-primary font-extrabold text-sm mt-1">${item.price}</p>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-xl p-3 flex flex-col gap-3">
        {CART_EXTRAS.map(extra => {
          const qty = item.adicionales?.[extra.id] || 0;
          return (
            <div key={extra.id} className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                + {extra.label} <span className="text-primary text-[10px]">(${extra.price})</span>
              </span>
              <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-0.5">
                <button 
                  onClick={() => onUpdateAdicional(item.productId, extra.id, -1)}
                  disabled={qty === 0}
                  className="w-6 h-6 flex items-center justify-center text-foreground hover:bg-secondary rounded-md disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold w-3 text-center">{qty}</span>
                <button 
                  onClick={() => onUpdateAdicional(item.productId, extra.id, 1)}
                  disabled={qty >= 10}
                  className="w-6 h-6 flex items-center justify-center text-foreground hover:bg-secondary rounded-md transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-4 bg-secondary border border-border rounded-xl p-1">
          <button 
            onClick={() => onUpdateQuantity(item.productId, -1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-background rounded-lg shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm w-4 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.productId, 1)}
            disabled={item.quantity >= 10}
            className="w-8 h-8 flex items-center justify-center bg-background rounded-lg shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-black text-lg">${itemTotal}</span>
          <button 
            onClick={() => onRemoveItem(item.productId)}
            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-105 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}