"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export function CheckoutView() {
  const router = useRouter();

  // Traemos los datos básicos del pedido (el carrito ya está vacío a esta altura)
  const orderData = useCartStore((state) => state.orderData);

  // Si no hay datos (entró por error), lo pateamos al inicio
  useEffect(() => {
    if (!orderData || !orderData.name) {
      router.push('/');
    }
  }, [orderData, router]);

  if (!orderData || !orderData.name) return null; 

  const handleWhatsApp = () => {
    const storeWhatsAppNumber = "5493624522876"; 
    
    // Un mensaje cortito y al pie. El backend ya tiene todo el detalle.
    const mensaje = `¡Hola Un Toque Ahumado! 🍔🔥\n\nSoy *${orderData.name}*.\nAcabo de realizar un pedido a través de la web.\n\nElegí: ${orderData.deliveryType === 'delivery' ? `Delivery a ${orderData.address}` : 'Retiro por el local'}\nForma de pago: ${orderData.paymentMethod}\n\n¡Quedo a la espera de la confirmación!`;
    
    const url = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Lo mandamos al inicio después de abrir WhatsApp
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-10">
      <header className="p-4 flex items-center absolute top-0 left-0 w-full z-10">
        <button 
          onClick={() => router.push('/')} 
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
          ¡PEDIDO ENVIADO!
        </h1>
        
        <p className="text-muted-foreground text-center mb-8 font-medium">
          Hola, <strong>{orderData.name}</strong>. Ya recibimos tu pedido y la cocina está trabajando en él.
        </p>

        <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-sm mb-8 w-full text-center">
          <h3 className="font-bold text-sm text-foreground mb-2 uppercase tracking-wider">
            Siguiente paso
          </h3>
          <p className="text-sm text-muted-foreground">
            Para coordinar el pago ({orderData.paymentMethod}) y los tiempos de entrega, envianos un mensaje por WhatsApp.
          </p>
        </div>

        <button 
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-[#20bd5a] hover:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6" />
          Avisar por WhatsApp
        </button>
        
        <button 
          onClick={() => router.push('/')}
          className="mt-6 text-primary font-bold hover:underline cursor-pointer"
        >
          Volver al Menú
        </button>
      </main>
    </div>
  );
}