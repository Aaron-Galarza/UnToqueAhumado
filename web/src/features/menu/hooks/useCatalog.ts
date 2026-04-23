import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Arranca cargando
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      // Llamamos a la API pública de Aaron
      const response = await api.get<Product[]>('/api/productos');
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Ocurrió un error al cargar el menú.');
      }
      
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}