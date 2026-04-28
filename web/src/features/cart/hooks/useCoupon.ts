import { useState } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';

export function useCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Traemos el cerebro de Zustand
  const orderData = useCartStore((state) => state.orderData);
  const setOrderData = useCartStore((state) => state.setOrderData);

  // Armamos el objeto para la vista si es que ya hay un cupón guardado
  const appliedCoupon = orderData.couponCode ? {
    code: orderData.couponCode,
    Percent: orderData.couponPercent || 0
  } : null;

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsLoading(true);
    setError(null);
    const code = couponCode.trim().toUpperCase();

    try {
      // Le pegamos al endpoint de Aaron con el parámetro en la URL
      const response = await api.post<any>(`/api/coupons/validate/${code}`, {});

      if (response.success && response.data) {
        // Guardamos en Zustand el código Y el porcentaje
        setOrderData({
          ...orderData,
          couponCode: response.data.code,
          couponPercent: response.data.Percent // Aaron lo manda con P mayúscula
        });
        setCouponCode(''); // Limpiamos el input
      } else {
        setError('Cupón inválido o expirado.');
      }
    } catch (err) {
      setError('Error al validar el cupón.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    // Para borrarlo, simplemente pisamos las variables con undefined
    setOrderData({
      ...orderData,
      couponCode: undefined,
      couponPercent: undefined
    });
    setError(null);
  };

  return {
    couponCode, setCouponCode,
    isLoading, error,
    appliedCoupon,
    validateCoupon, removeCoupon
  };
}