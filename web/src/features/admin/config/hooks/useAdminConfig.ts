import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

type StoreStatus = { isClose?: boolean };

export function useAdminConfig() {
  const [isEmergencyClosed, setIsEmergencyClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    const response = await api.get<StoreStatus>('/api/configuracion/status');
    if (response.success && response.data) setIsEmergencyClosed(response.data.isClose === true);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const toggleEmergencyStatus = async () => {
    const response = await api.put('/api/configuracion/status', {});
    if (response.success) {
      await fetchStatus();
      toast.success('Estado del local actualizado.');
      return true;
    }
    toast.error(`No pudimos cambiar el estado del local: ${response.error}`);
    return false;
  };

  return { isEmergencyClosed, isLoading, toggleEmergencyStatus };
}
