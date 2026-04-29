"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MessageCircle, ArrowLeft, Receipt } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAddons } from '@/features/menu/hooks/useAddons';

export function CheckoutView() {
  const router = useRouter();
  const { orderData, items: cartItems, clearCart } = useCartStore();
  const { addons } = useAddons();

  useEffect(() => {
    if (!orderData || !orderData.name || cartItems.length === 0) {
      router.push('/');
    }
  }, [orderData, cartItems, router]);

  if (!orderData || !orderData.name || cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const extrasTotal = Object.entries(item.adicionales || {}).reduce((sum, [eId, q]) => {
      const extraData = addons.find((e) => e._id === eId);
      return sum + (extraData ? extraData.price * (q as number) : 0);
    }, 0);
    return acc + (item.price + extrasTotal) * item.quantity;
  }, 0);

  const discount = orderData.couponPercent ? subtotal * (orderData.couponPercent / 100) : 0;
  const total = subtotal - discount;

  const finalizarPedido = () => {
    clearCart();
    router.push('/');
  };

  const handleWhatsApp = () => {
    const storeWhatsAppNumber = '5493624522876';

    const listaProductosText = cartItems
      .map((item) => {
        let textoItem = `- ${item.quantity}x ${item.title} ($${item.price * item.quantity})`;

        const extras = Object.entries(item.adicionales || {}).filter(([, q]) => (q as number) > 0);
        if (extras.length > 0) {
          extras.forEach(([eId, q]) => {
            const extraData = addons.find((e) => e._id === eId);
            if (extraData) textoItem += `\n  + ${q}x ${extraData.title} ($${extraData.price * (q as number)})`;
          });
        }
        return textoItem;
      })
      .join('\n');

    const mensaje = `¡Hola Un Toque Ahumado!\nSoy *${orderData.name}* y acabo de realizar un pedido web.\n\n*MI PEDIDO:*\n${listaProductosText}\n\n*ENTREGA:* ${orderData.deliveryType === 'delivery' ? `Delivery a ${orderData.address}` : 'Retiro por el local'}\n*PAGO:* ${orderData.paymentMethod}${orderData.couponCode ? `\n*CUPÓN:* ${orderData.couponCode} (-$${discount})` : ''}\n\n*TOTAL A PAGAR:* $${total.toLocaleString('es-AR')}\n\n¡Quedo a la espera de la confirmación!`;

    const url = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    finalizarPedido();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-10">
      <header className="p-4 flex items-center absolute top-0 left-0 w-full z-10">
        <button
          onClick={finalizarPedido}
          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pt-20 max-w-lg mx-auto w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl text-foreground mb-1 text-center tracking-wide">¡PEDIDO ENVIADO!</h1>

        <p className="text-muted-foreground text-center mb-6 font-medium text-sm md:text-base">
          Hola, <strong>{orderData.name}</strong>. Ya recibimos tu pedido.
        </p>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-6 w-full relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
            <Receipt className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground uppercase tracking-wider">Resumen de tu compra</h3>
          </div>

          <ul className="space-y-3 mb-4">
            {cartItems.map((item, idx) => (
              <li key={idx} className="text-sm">
                <div className="flex justify-between font-bold text-foreground">
                  <span>
                    {item.quantity}x {item.title}
                  </span>
                  <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                </div>

                {Object.entries(item.adicionales || {}).map(([eId, q]) => {
                  if ((q as number) <= 0) return null;
                  const extraData = addons.find((e) => e._id === eId);
                  return extraData ? (
                    <div key={eId} className="flex justify-between text-muted-foreground text-xs pl-4 mt-0.5">
                      <span>
                        + {q}x {extraData.title}
                      </span>
                      <span>${(extraData.price * (q as number)).toLocaleString('es-AR')}</span>
                    </div>
                  ) : null;
                })}
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Descuento (Cupón)</span>
                <span>-${discount.toLocaleString('es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-lg text-foreground pt-2">
              <span>Total</span>
              <span className="text-primary">${total.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 mb-6 w-full text-center border border-border">
          <p className="text-sm text-foreground font-medium">
            Avisanos por WhatsApp para coordinar el pago en <strong>{orderData.paymentMethod}</strong> y el{' '}
            {orderData.deliveryType === 'delivery' ? 'envío' : 'retiro'}.
          </p>
        </div>

        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-[#20bd5a] hover:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6" />
          Enviar a WhatsApp
        </button>

        <button onClick={finalizarPedido} className="mt-5 text-muted-foreground font-bold hover:text-primary transition-colors cursor-pointer">
          Volver al Menú
        </button>
      </main>
    </div>
  );
}
