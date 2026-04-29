import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface Coupon {
  id?: string;
  _id?: string;
  code: string;
  Percent: number;
}

export function useAdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Coupon[]>('/api/coupons/admin');
    if (response.success && response.data) setCoupons(response.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const createCoupon = async (code: string, Percent: number) => {
    const response = await api.post<Coupon>('/api/coupons/admin', { Code: code, Percent });
    if (response.success) {
      fetchCoupons();
      toast.success('Cupón creado.');
      return true;
    }
    toast.error(`Error al crear cupón: ${response.error}`);
    return false;
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id && c._id !== id));
    const response = await api.delete(`/api/coupons/admin/${id}`);
    if (!response.success) {
      toast.error(`Error al eliminar: ${response.error}`);
      fetchCoupons();
      return false;
    }
    toast.success('Cupón eliminado.');
    return true;
  };

  return { coupons, isLoading, createCoupon, deleteCoupon, refreshCoupons: fetchCoupons };
}
