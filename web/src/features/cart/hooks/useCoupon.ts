import { useState } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';

export function useCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const orderData = useCartStore((state) => state.orderData);
  const setOrderData = useCartStore((state) => state.setOrderData);

  const appliedCoupon = orderData.couponCode
    ? {
        code: orderData.couponCode,
        Percent: orderData.couponPercent || 0,
      }
    : null;

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    const code = couponCode.trim().toUpperCase();

    try {
      const response = await api.post<CouponValidation>(`/api/coupons/validate/${code}`, {});

      if (response.success && response.data) {
        setOrderData({
          ...orderData,
          couponCode: response.data.code,
          couponPercent: response.data.Percent,
        });
        setCouponCode('');
        setSuccessMessage(`Cupón ${response.data.code} aplicado correctamente.`);
      } else if (response.status === 400) {
        setError('Cupón inválido o expirado.');
      } else if (response.status === 404) {
        setError('No se encontró el cupón.');
      } else if (response.status === 500) {
        setError('El servidor no pudo validar el cupón.');
      } else {
        setError(response.error || 'Error al validar el cupón.');
      }
    } catch {
      setError('Error de red al validar el cupón.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setOrderData({
      ...orderData,
      couponCode: undefined,
      couponPercent: undefined,
    });
    setError(null);
    setSuccessMessage(null);
  };

  return {
    couponCode,
    setCouponCode,
    isLoading,
    error,
    successMessage,
    appliedCoupon,
    validateCoupon,
    removeCoupon,
  };
}
  type CouponValidation = { code: string; Percent: number };
