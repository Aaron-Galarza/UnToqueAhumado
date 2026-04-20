"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Banknote, CreditCard, CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';

import { useCartStore } from '@/stores/cartStore';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { CART_EXTRAS } from '@/features/cart/data/extras';
import { CartItem } from '@/features/cart/types/cart';

export function CheckoutView() {
  const router = useRouter();

  // 1. TRAEMOS TODO DESDE ZUSTAND
  const items = useCartStore((state) => state.items);
  const orderData = useCartStore((state) => state.orderData);
  const setOrderData = useCartStore((state) => state.setOrderData);
  const clearCart = useCartStore((state) => state.clearCart);
  // Si no hay datos (ej: el usuario recargó la página o entró directo), lo mandamos al inicio
  useEffect(() => {
    if (items.length === 0 || !orderData) {
      router.push('/');
    }
  }, [items, orderData, router]);

  if (!orderData) return null; 

  // 2. MATEMÁTICA REAL
  const itemTotal = (item: CartItem) => {
    const adExtra = CART_EXTRAS.reduce((acc, a) => acc + (item.adicionales[a.id] || 0) * a.price, 0);
    return (item.price + adExtra) * item.quantity;
  };

  const subtotal = items.reduce((acc, item) => acc + itemTotal(item), 0);
  const discount = orderData.discountApplied ? subtotal * 0.10 : 0;
  const deliveryFee: number | string = orderData.deliveryType === 'delivery' ? 'A convenir' : 0;
  
  const numericDeliveryFee = typeof deliveryFee === 'number' ? deliveryFee : 0;
  const total = subtotal - discount + numericDeliveryFee;
  
//ENVIAR EL PEDIDO A WSP
 const handleWhatsApp = () => {
    const numeroDylan = "5493624522876"; 
    
    const listaProductos = items.map(item => {
      let texto = `- ${item.quantity}x ${item.name}`;
      const extras = Object.entries(item.adicionales)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const extraDef = CART_EXTRAS.find(e => e.id === id);
          return extraDef ? `\n   + ${qty}x ${extraDef.label}` : '';
        }).join('');
      return texto + extras;
    }).join('\n');
    // ----------------------------------------------------

    const datosCliente = `Mis datos:\n- Nombre: ${orderData.name}\n- Teléfono: ${orderData.phone}\n- Envío: ${orderData.deliveryType === 'delivery' ? `Delivery a ${orderData.address}` : 'Retiro por el local'}`;

    const mensaje = `¡Hola Un Toque Ahumado! 🍔🔥\n\nQuería confirmar mi pedido:\n\n${listaProductos}\n\n*Total a pagar: $${total.toLocaleString('es-AR')}*\n*Método de pago: ${orderData.paymentMethod}*\n\n${datosCliente}`;
    
    const url = `https://wa.me/${numeroDylan}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    clearCart();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-10">
      <header className="p-4 flex items-center absolute top-0 left-0 w-full z-10">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 max-w-lg mx-auto w-full">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-foreground mb-2 text-center tracking-wide">
          ¡PEDIDO ARMADO!
        </h1>
        
        <p className="text-muted-foreground text-center mb-8 font-medium">
          Hola, <strong>{orderData.name}</strong>. Revisá tu pedido y hacé clic en el botón verde para coordinar la entrega por WhatsApp.
        </p>

        <div className="w-full mb-8">
          
          {/* --- NUEVA SECCIÓN: LISTA DE PRODUCTOS --- */}
          <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm mb-4">
            <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
              Detalle del pedido
            </h3>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm font-medium text-foreground border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span><span className="text-primary font-bold">{item.quantity}x</span> {item.name}</span>
                  <span className="font-bold">${itemTotal(item).toLocaleString('es-AR')}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* ----------------------------------------- */}

          <CartSummary 
            subtotal={subtotal}
            discount={discount}
            deliveryFee={deliveryFee}
            total={total}
            discountApplied={orderData.discountApplied}
            deliveryType={orderData.deliveryType}
          />
        </div>

        <button 
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-[#20bd5a] hover:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6" />
          Confirmar por WhatsApp
        </button>
      </main>
    </div>
  );
}