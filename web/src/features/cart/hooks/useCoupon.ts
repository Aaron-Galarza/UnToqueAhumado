import { useState } from 'react';
import { api } from '@/lib/api';
import { Coupon } from '@/types';
import { useCartStore } from '@/stores/cartStore'; 

export function useCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Traemos el store del carrito para guardar el cupón si es válido
  const orderData = useCartStore(state => state.orderData);
  const setOrderData = useCartStore(state => state.setOrderData);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Escribí un código primero');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Le pegamos a la API de Aaron. Como el código va en la URL, el body va vacío {}
    const response = await api.post<Coupon>(`/api/coupons/validate/${couponCode.toUpperCase()}`, {});

    if (response.success && response.data) {
      setAppliedCoupon(response.data);
      // ¡Éxito! Lo guardamos en el estado global para el Checkout
      setOrderData({ ...orderData, couponCode: response.data.code });
      setError(null);
    } else {
      setAppliedCoupon(null);
      // Si falla, limpiamos el código del store por las dudas
      setOrderData({ ...orderData, couponCode: undefined });
      setError(response.error || 'Cupón inválido o expirado');
    }

    setIsLoading(false);
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setError(null);
    setOrderData({ ...orderData, couponCode: undefined });
  };

  return {
    couponCode,
    setCouponCode,
    isLoading,
    error,
    appliedCoupon,
    validateCoupon,
    removeCoupon
  };
}