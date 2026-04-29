import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface Addon {
  _id: string;
  title: string;
  price: number;
}

export function useAddons() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchAddons = async () => {
      setIsLoading(true);
      setError(null);

      const response = await api.get<Addon[]>('/api/adicionales');
      if (response.success && response.data) {
        setAddons(response.data);
      } else {
        setError(response.error || 'No se pudieron cargar los adicionales.');
      }

      setIsLoading(false);
    };

    fetchAddons();
  }, [reloadKey]);

  const retry = () => setReloadKey((prev) => prev + 1);

  return { addons, isLoading, error, retry };
}
