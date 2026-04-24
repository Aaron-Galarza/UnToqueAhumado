import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Addon {
  _id: string;
  title: string;
  price: number;
}

export function useAddons() {
  const [addons, setAddons] = useState<Addon[]>([]);

  useEffect(() => {
    const fetchAddons = async () => {
      // Le pegamos al endpoint en español de Aaron, pero guardamos todo en inglés
      const response = await api.get<Addon[]>('/api/adicionales');
      if (response.success && response.data) {
        setAddons(response.data);
      }
    };
    fetchAddons();
  }, []);

  return addons;
}