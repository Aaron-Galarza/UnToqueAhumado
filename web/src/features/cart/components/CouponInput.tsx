"use client";

import { useCoupon } from '@/features/cart/hooks/useCoupon'; 

export function CouponInput() {
  const { 
    couponCode, setCouponCode, isLoading, error, 
    appliedCoupon, validateCoupon, removeCoupon 
  } = useCoupon();

  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm mt-4">
      <h3 className="text-sm font-bold mb-3">¿Tenés un cupón de descuento?</h3>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
          <div>
            <p className="text-green-700 font-bold text-sm">¡Cupón {appliedCoupon.code} aplicado!</p>
            <p className="text-green-600 text-xs">Descuento del {appliedCoupon.Percent}%</p>
          </div>
          <button onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline">
            Quitar
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ej: PROMO20" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-primary"
            />
            <button 
              onClick={validateCoupon}
              disabled={isLoading || !couponCode}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-opacity"
            >
              {isLoading ? '...' : 'Aplicar'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
        </div>
      )}
    </div>
  );
}