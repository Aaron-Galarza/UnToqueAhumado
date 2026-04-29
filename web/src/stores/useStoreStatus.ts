import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface StoreStatusResponse {
  isOpen?: boolean;
  isClose?: boolean;
  message: string;
  schedule?: {
    closeTime: string;
  };
}

export function useStoreStatus() {
  const [status, setStatus] = useState<StoreStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      setError(null);

      const response = await api.get<StoreStatusResponse>('/api/configuracion/status');

      if (response.success && response.data) {
        setStatus(response.data);
        if (response.data.isClose === true) {
          setIsStoreOpen(false);
        } else if (response.data.isOpen === true) {
          setIsStoreOpen(true);
        } else {
          setIsStoreOpen(false);
        }
      } else if (response.status === 500) {
        setError('No se pudo verificar el estado del local.');
      } else {
        setError(response.error || 'No se pudo verificar el estado del local.');
      }

      setIsLoading(false);
    };

    fetchStatus();
  }, [reloadKey]);

  const retry = () => setReloadKey((prev) => prev + 1);

  return { status, isStoreOpen, isLoading, error, retry };
}
