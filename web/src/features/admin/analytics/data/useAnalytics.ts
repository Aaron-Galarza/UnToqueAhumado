import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface AnalyticsData {
  total: number;
  efectivo: number;
  trans: number;
  entregados: number;
  topProduct: {
    title: string;
    quantity: number;
  } | null;
}

export type AnalyticsRange = 'hoy' | 'ayer' |'semana' | 'mes';

export function useAnalytics() {
  const [range, setRange] = useState<AnalyticsRange>('hoy');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Función que va a buscar los datos
  const fetchAnalytics = async (selectedRange: AnalyticsRange) => {
    setIsLoading(true);
    try {
      const response = await api.get<AnalyticsData>(`/api/analiticas?range=${selectedRange}`);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error('No se pudieron cargar las estadísticas.');
      }
    } catch (error) {
      toast.error('Error de conexión al cargar estadísticas.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Efecto: Cada vez que cambia el "range", volvemos a buscar a la API
  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  return { range, setRange, data, isLoading };
}