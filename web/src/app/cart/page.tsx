"use client";

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Tipos y Datos
import { CartItem } from '@/features/cart/types/cart';
import { CART_EXTRAS } from '@/features/cart/data/extras';

// Componentes
import { CartItemCard } from '@/features/cart/components/CartItemCard';
import { DeliverySelector } from '@/features/cart/components/DeliverySelector';
import { CustomerForm } from '@/features/cart/components/CustomerForm';
import { CouponInput } from '@/features/cart/components/CouponInput';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { ConfirmButton } from '@/features/cart/components/ConfirmButton';

export default function CartPage() {
  const router = useRouter();

  // --- ESTADOS LOCALES ---
  const [deliveryType, setDeliveryType] = useState<'takeaway' | 'delivery'>('takeaway');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Por ahora hardcodeado, en el próximo paso lo conectaremos a Zustand
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { 
      id: 1, 
      name: "Doble Smash Clásica",  
      price: 12900, 
      quantity: 2, 
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80", 
      category: "Hamburguesas Artesanales",
      adicionales: {} 
    },
    { 
      id: 5, 
      name: "Papas Crujientes",     
      price: 5900,  
      quantity: 1, 
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=200&q=80", 
      category: "Papas Fritas",
      adicionales: {} 
    }
  ]);

  // --- LÓGICA DE CÁLCULOS ---
  const itemTotal = (item: CartItem) => {
    const adExtra = CART_EXTRAS.reduce((acc, a) => acc + (item.adicionales[a.id] || 0) * a.price, 0);
    return (item.price + adExtra) * item.quantity;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + itemTotal(item), 0);
  const discount = discountApplied ? subtotal * 0.10 : 0;
  const deliveryFee = deliveryType === 'delivery' ? 2500 : 0;
  const total = subtotal - discount + deliveryFee;

  // --- FUNCIONES MANEJADORAS (HANDLERS) ---
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SMASHTIKTOK') setDiscountApplied(true);
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateMainQuantity = (itemId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const nextQty = Math.min(10, Math.max(1, item.quantity + delta)); 
      return { ...item, quantity: nextQty };
    }));
  };

  const setAdicional = (itemId: number, adId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const current = item.adicionales[adId] || 0;
      const next = Math.min(10, Math.max(0, current + delta));
      return { ...item, adicionales: { ...item.adicionales, [adId]: next } };
    }));
  };

  const handleConfirmOrder = () => {
    console.log("Procesando pedido...", { cartItems, total, deliveryType });
    alert("¡Pedido confirmado! (Simulación)");
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-background pb-10">

      {/* HEADER */}
      <header className="bg-card border-b border-border p-3 md:p-4 sticky top-0 z-50 flex items-center gap-4 shadow-sm">
        <button 
          onClick={() => router.push('/')} 
          className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-secondary-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-['Bebas_Neue'] text-3xl tracking-widest text-foreground m-0 mt-1">
          CARRITO
        </h1>
        {cartItems.length > 0 && (
          <span className="ml-auto bg-primary text-primary-foreground rounded-full text-xs font-extrabold px-3 py-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">

        {/* LISTA DE PRODUCTOS */}
        <div className="flex flex-col gap-4 mb-8">
          {cartItems.map(item => (
            <CartItemCard 
              key={item.id} 
              item={item} 
              onUpdateQuantity={updateMainQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateAdicional={setAdicional}
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

        {/* FORMULARIOS Y CÁLCULOS */}
        {cartItems.length > 0 && (
          <>
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-foreground mb-3">Método de entrega</h2>
            <DeliverySelector 
              deliveryType={deliveryType} 
              onSelect={setDeliveryType} 
            />

            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-foreground mb-3">Tus datos</h2>
            <CustomerForm 
              deliveryType={deliveryType} 
            />

            <CouponInput 
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              onApply={handleApplyPromo}
              discountApplied={discountApplied}
            />

            <CartSummary 
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
              discountApplied={discountApplied}
              deliveryType={deliveryType}
            />

            <ConfirmButton
              mode="inline"
              isDisabled={cartItems.length === 0}
              onClick={handleConfirmOrder}
            />
          </>
        )}

      </main>

    </div>
  );
}
