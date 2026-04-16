import React from "react";

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  discountApplied: boolean;
  deliveryType: 'takeaway' | 'delivery';
}

export function CartSummary({ subtotal, discount, deliveryFee, total, discountApplied, deliveryType }: CartSummaryProps) {
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex flex-col gap-3">
        
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">{fmt(subtotal)}</span>
        </div>

        {/* Descuento (Condicional) */}
        {discountApplied && (
          <div className="flex justify-between items-center text-sm font-semibold text-green-600">
            <span>Descuento (10%)</span>
            <span>−{fmt(discount)}</span>
          </div>
        )}

        {/* Envío (Condicional) */}
        {deliveryType === 'delivery' && (
          <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground animate-in fade-in">
            <span>Envío</span>
            <span className="text-foreground">{fmt(deliveryFee)}</span>
          </div>
        )}

        {/* Total Final */}
        <div className="border-t-2 border-border pt-3 mt-1 flex justify-between items-center">
          <span className="text-lg font-black text-foreground">Total</span>
          <span className="text-2xl font-black text-primary">{fmt(total)}</span>
        </div>

      </div>
    </div>
  );
}