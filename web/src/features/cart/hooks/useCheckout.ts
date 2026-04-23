import { useState } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore'; // Ajustá la ruta a tu store

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
      items: items.map(item => {
        // TRANSFORMACIÓN: Pasamos tus adicionales al formato que ahora exige Aaron
        const addonsArray = item.adicionales 
          ? Object.entries(item.adicionales)
              .filter(([_, qty]) => qty > 0)
              .map(([id, qty]) => ({ addonId: id, quantity: qty }))
          : [];

        return {
          productId: item.productId,
          quantity: item.quantity,
          addons: addonsArray // ¡Agregado!
        };
      }),
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod, // ¡Agregado y ahora es requerido!
      couponCode: orderData.couponCode || undefined
    };

    const response = await api.post('/api/orders', payload);

    if (response.success) {
      clearCart();
      setIsLoading(false);
      return { success: true, data: response.data };
    } else {
      setError(response.error || 'Ocurrió un error inesperado al enviar el pedido.');
      setIsLoading(false);
      return { success: false };
    }
  };

  return { submitOrder, isLoading, error };
}