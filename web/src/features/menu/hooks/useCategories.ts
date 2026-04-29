import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  active: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      const response = await api.get<Category[]>('/api/categorias');

      if (response.success && response.data) {
        setCategories(response.data);
      } else if (response.status === 404) {
        setError('No se encontraron categorías.');
      } else if (response.status === 500) {
        setError('El servidor no pudo cargar las categorías.');
      } else {
        setError(response.error || 'No se pudieron cargar las categorías.');
      }

      setIsLoading(false);
    };

    fetchCategories();
  }, [reloadKey]);

  const retry = () => setReloadKey((prev) => prev + 1);

  return { categories, isLoading, error, retry };
}
