"use client";

import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react'; 

// Importamos nuestro cerebro
import { useCartLogic } from '@/features/cart/hooks/useCartLogic';

// Componentes Visuales
import { CartItemCard } from '@/features/cart/components/CartItemCard';
import { DeliverySelector } from '@/features/cart/components/DeliverySelector';
import { CustomerForm } from '@/features/cart/components/CustomerForm';
import { CouponInput } from '@/features/cart/components/CouponInput';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { ConfirmButton } from '@/features/cart/components/ConfirmButton';
import { PaymentSelector } from '@/features/cart/components/PaymentSelector';

export default function CartPage() {
  const {
    cartItems, paymentMethod, setPaymentMethod, deliveryType, setDeliveryType,
    promoCode, setPromoCode, discountApplied, customerData, formErrors,
    subtotal, discount, deliveryFee, total, handleRemoveItem, updateMainQuantity, 
    setAdicional, handleApplyPromo, handleCustomerDataChange, handleClearCart, 
    handleConfirmOrder, router
  } = useCartLogic();

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="bg-card border-b border-border p-3 md:p-4 sticky top-0 z-50 flex items-center gap-4 shadow-sm">
        <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-secondary-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-['Bebas_Neue'] text-3xl tracking-widest text-foreground m-0 mt-1">CARRITO</h1>
        {cartItems.length > 0 && (
          <span className="ml-auto bg-primary text-primary-foreground rounded-full text-xs font-extrabold px-3 py-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex flex-col gap-4 mb-8">
          {cartItems.length > 0 && (
            <div className="flex justify-end -mb-2">
              <button onClick={handleClearCart} className="text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Trash2 className="w-4 h-4" /> Vaciar carrito
              </button>
            </div>
          )}

          {cartItems.map(item => (
            <CartItemCard 
              key={item.id} item={item} 
              onUpdateQuantity={updateMainQuantity} onRemoveItem={handleRemoveItem} onUpdateAdicional={setAdicional}
            />
          ))}
          
          {cartItems.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-2xl shadow-sm">
              <p className="font-semibold text-lg text-muted-foreground">Tu carrito está vacío</p>
              <button onClick={() => router.push('/')} className="mt-4 text-primary font-bold underline cursor-pointer">
                Volver al menú
              </button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-foreground mb-3">Método de entrega</h2>
            <DeliverySelector deliveryType={deliveryType} onSelect={setDeliveryType} />

            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-foreground mb-3">Tus datos</h2>
            <CustomerForm deliveryType={deliveryType} data={customerData} onChange={handleCustomerDataChange} errors={formErrors} />
            
            <PaymentSelector paymentMethod={paymentMethod} onChange={setPaymentMethod} />
            
            <CouponInput promoCode={promoCode} setPromoCode={setPromoCode} onApply={handleApplyPromo} discountApplied={discountApplied} />

            <CartSummary subtotal={subtotal} discount={discount} deliveryFee={deliveryFee} total={total} discountApplied={discountApplied} deliveryType={deliveryType} />

            <ConfirmButton mode="inline" isDisabled={cartItems.length === 0} onClick={handleConfirmOrder} />
          </>
        )}
      </main>
    </div>
  );
}