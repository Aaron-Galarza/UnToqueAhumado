import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface StoreStatusResponse {
  isOpen?: boolean;
  isClose?: boolean; // Agregamos la variable fantasma de Aaron
  message: string;
  schedule?: {
    closeTime: string;
  };
}

export function useStoreStatus() {
  const [status, setStatus] = useState<StoreStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(false); // Estado limpio para usar en la UI

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<StoreStatusResponse>('/api/configuracion/status');
        
        if (response.success && response.data) {
          setStatus(response.data);
          
          // Lógica a prueba de balas: 
          // Si Aaron manda isClose en true, está cerrado. Si manda isOpen en true, está abierto.
          if (response.data.isClose === true) {
            setIsStoreOpen(false);
          } else if (response.data.isOpen === true) {
            setIsStoreOpen(true);
          } else {
            setIsStoreOpen(false);
          }
        }
      } catch (error) {
        console.error("Error obteniendo estado del local:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return { status, isStoreOpen, isLoading };
}