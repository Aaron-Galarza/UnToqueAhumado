import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  active: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Category[]>('/api/categorias');
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading };
}