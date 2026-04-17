"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';

import { CartSummary } from '@/features/cart/components/CartSummary';

export function CheckoutView() {
  const router = useRouter();

  const subtotalMock = 18800; 
  
  const cuponAplicadoMock = true; 
  
  // Si está aplicado, calcula el 10%, sino, es 0.
  const discountMock = cuponAplicadoMock ? subtotalMock * 0.10 : 0; 
  
  const deliveryTypeMock = 'delivery';
  
  // Le decimos explícitamente a TypeScript que esto puede ser número o string
  const deliveryFeeMock: number | string = "A convenir";
  
  const numericDeliveryFee = typeof deliveryFeeMock === 'number' ? deliveryFeeMock : 0;
  const totalMock = subtotalMock - discountMock + numericDeliveryFee;

  const handleWhatsApp = () => {
    const numeroDylan = "5493624522876"; // Número limpio, sin guiones ni símbolos de más
    const mensaje = `¡Hola Un Toque Ahumado! 🍔🔥\n\nQuería confirmar mi pedido.\n\n*Total a pagar: $${totalMock.toLocaleString('es-AR')}*`;
    
    // Usamos la variable numeroDylan para evitar cuentas matemáticas accidentales
    const url = `https://wa.me/${numeroDylan}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
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
          Tu pedido fue realizado. Revisá el resumen y hacé clic en el botón verde para coordinar el envio por WhatsApp.
        </p>

        <div className="w-full mb-8">
          <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider pl-1">
            Resumen final
          </h3>
          <CartSummary 
            subtotal={subtotalMock}
            discount={discountMock}
            deliveryFee={deliveryFeeMock}
            total={totalMock}
            discountApplied={cuponAplicadoMock} // <-- ACÁ LE PASAMOS EL INTERRUPTOR
            deliveryType={deliveryTypeMock}
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