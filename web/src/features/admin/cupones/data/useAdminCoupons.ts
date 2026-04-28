import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface Coupon {
  id?: string; 
  _id?: string; 
  code: string;
  Percent: number;
}

export function useAdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. TRAER CUPONES
  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Coupon[]>('/api/coupons/admin');
    
    if (response.success && response.data) {
      setCoupons(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // 2. CREAR CUPÓN
  const createCoupon = async (code: string, Percent: number) => {
const response = await api.post<Coupon>('/api/coupons/admin', { 
      Code: code, 
      Percent: Percent 
    });
    if (response.success) {
      fetchCoupons(); // Recargamos la lista si se creó bien
      return true;
    } else {
      alert(`Error al crear cupón: ${response.error}`);
      return false;
    }
  };

  // 3. ELIMINAR CUPÓN
  const deleteCoupon = async (id: string) => {
    if (!window.confirm('¿Seguro que querés borrar este cupón?')) return;
    
    // Optimistic UI: lo borramos localmente primero para que sea rápido
    setCoupons(prev => prev.filter(c => c.id !== id && c._id !== id));
    
    const response = await api.delete(`/api/coupons/admin/${id}`);
    if (!response.success) {
      alert(`Error al eliminar: ${response.error}`);
      fetchCoupons(); // Revertimos si falló
    }
  };

  return {
    coupons,
    isLoading,
    createCoupon,
    deleteCoupon,
    refreshCoupons: fetchCoupons
  };
}