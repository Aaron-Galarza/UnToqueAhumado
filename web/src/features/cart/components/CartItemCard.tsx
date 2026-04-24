"use client";

import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItemWithExtras } from '@/stores/cartStore'; 
import { useAddons } from '@/features/menu/hooks/useAddons'; 
import { canHaveExtras } from '@/features/cart/data/cartRules';

interface CartItemCardProps {
  item: CartItemWithExtras;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateAdicional: (productId: string, adId: string, delta: number) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemoveItem, onUpdateAdicional }: CartItemCardProps) {
  const addons = useAddons(); 

  const extrasTotal = addons.reduce((acc, extra) => {
    return acc + (item.adicionales?.[extra._id] || 0) * extra.price;
  }, 0);

  const itemTotal = (item.price + extrasTotal) * item.quantity;

  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 shadow-sm relative">
      <div className="flex gap-4 items-start">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 border border-border bg-muted/50"
          />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-foreground leading-tight">{item.title}</h3>
          <p className="text-primary font-extrabold text-sm mt-1">${item.price}</p>
        </div>
      </div>

      {/* MAGIA: Solo renderiza este bloque si la categoría es correcta */}
      {canHaveExtras(item.category) && (
        <div className="bg-secondary/50 rounded-xl p-3 flex flex-col gap-3">
          {addons.map(extra => {
            const qty = item.adicionales?.[extra._id] || 0;
            return (
              <div key={extra._id} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  + {extra.title} <span className="text-primary text-[10px]">(${extra.price})</span>
                </span>
                <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-0.5">
                  <button 
                    onClick={() => onUpdateAdicional(item.productId, extra._id, -1)}
                    disabled={qty === 0}
                    className="w-6 h-6 flex items-center justify-center text-foreground hover:bg-secondary rounded-md disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-3 text-center">{qty}</span>
                  <button 
                    onClick={() => onUpdateAdicional(item.productId, extra._id, 1)}
                    disabled={qty >= 10}
                    className="w-6 h-6 flex items-center justify-center text-foreground hover:bg-secondary rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
          {addons.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Buscando adicionales...</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-4 bg-secondary border border-border rounded-xl p-1">
          <button 
            onClick={() => onUpdateQuantity(item.productId, -1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-background rounded-lg shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-sm w-4 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.productId, 1)}
            disabled={item.quantity >= 10}
            className="w-8 h-8 flex items-center justify-center bg-background rounded-lg shadow-sm text-foreground hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-black text-lg">${itemTotal}</span>
          <button 
            onClick={() => onRemoveItem(item.productId)}
            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-105 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}