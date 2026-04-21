"use client";
import { Tag } from "lucide-react";

interface CouponInputProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  onApply: () => void;
  discountApplied: boolean;
}

export function CouponInput({ promoCode, setPromoCode, onApply, discountApplied }: CouponInputProps) {
  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-primary" />
        <p className="font-extrabold text-sm text-foreground uppercase tracking-wide">
          Código de descuento
        </p>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Ej: SMASHTIKTOK" 
          value={promoCode}
          onChange={e => setPromoCode(e.target.value)}
          className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-sm font-bold text-foreground uppercase focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-w-0" 
        />
        <button 
          onClick={onApply} 
          className="bg-secondary border border-border rounded-xl px-5 font-bold text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors whitespace-nowrap cursor-pointer"
        >
          Aplicar
        </button>
      </div>

      {discountApplied && (
        <p className="text-green-600 text-xs font-bold mt-2 animate-in fade-in">
          ✓ Cupón aplicado · 10% de descuento
        </p>
      )}
    </div>
  );
}
