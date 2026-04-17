import React from "react";

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number | string;
  total: number;
  discountApplied: boolean;
  deliveryType: 'takeaway' | 'delivery';
  discountPercentage?: number;
}

export function CartSummary({ 
  subtotal, 
  discount, 
  deliveryFee, 
  total, 
  discountApplied, 
  deliveryType,
  discountPercentage = 10 
}: CartSummaryProps) {
  
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');
  
  const deliveryFeeLabel =
    typeof deliveryFee === "number"
      ? fmt(deliveryFee)
      : deliveryFee.trim().toLowerCase() === "a convenir"
        ? "A convenir"
        : deliveryFee;

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex flex-col gap-3">
        
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">
            {fmt(subtotal)}
          </span>
        </div>

        {/* Descuento bien claro */}
        {discountApplied && (
          <div className="flex justify-between items-center text-sm font-extrabold text-green-600 bg-green-500/10 px-2 py-1.5 rounded-lg -mx-2 animate-in fade-in">
            <span>Cupón aplicado ({discountPercentage}%)</span>
            <span>−{fmt(discount)}</span>
          </div>
        )}

        {/* Envío */}
        {deliveryType === 'delivery' && (
          <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground animate-in fade-in">
            <span>Envío</span>
            <span className="text-foreground">{deliveryFeeLabel}</span>
          </div>
        )}

        {/* Total Final Limpio */}
        <div className="border-t-2 border-border pt-3 mt-1 flex justify-between items-center">
          <span className="text-lg font-black text-foreground">Total</span>
          <span className="text-2xl font-black text-primary">
            {fmt(total)}
          </span>
        </div>

      </div>
    </div>
  );
}