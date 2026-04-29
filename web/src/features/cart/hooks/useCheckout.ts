import { useState } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, orderData, clearCart } = useCartStore();

  const submitOrder = async () => {
    if (items.length === 0) {
      setError('No podés hacer un pedido con el carrito vacío.');
      return { success: false };
    }
    if (!orderData.name.trim() || !orderData.phone.trim()) {
      setError('Por favor, completá tu nombre y teléfono para el pedido.');
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      customer: {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address.trim() !== '' ? orderData.address : undefined,
      },
      items: items.map((item) => {
        const addonsArray = item.adicionales
          ? Object.entries(item.adicionales)
              .filter(([, qty]) => qty > 0)
              .map(([id, qty]) => ({ addonId: id, quantity: qty }))
          : [];

        return {
          productId: item.productId,
          quantity: item.quantity,
          addons: addonsArray,
        };
      }),
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      couponCode: orderData.couponCode || undefined,
    };

    try {
      const response = await api.post('/api/orders', payload);
      if (response.success) {
        clearCart();
        return { success: true, data: response.data };
      }
      if (response.status === 400) {
        setError(response.error || 'El pedido tiene datos inválidos.');
      } else if (response.status === 404) {
        setError('No se encontró un producto o adicional del pedido.');
      } else if (response.status === 500) {
        setError('El servidor no pudo procesar el pedido.');
      } else {
        setError(response.error || 'Ocurrió un error inesperado al enviar el pedido.');
      }
      return { success: false };
    } catch {
      setError('Error de red al enviar el pedido.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { submitOrder, isLoading, error };
}
