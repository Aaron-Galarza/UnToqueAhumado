import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      const response = await api.get<Product[]>('/api/productos');

      if (response.success && response.data) {
        setProducts(response.data);
      } else if (response.status === 404) {
        setError('No se encontró el catálogo.');
      } else if (response.status === 500) {
        setError('El servidor no pudo cargar el menú.');
      } else {
        setError(response.error || 'Ocurrió un error al cargar el menú.');
      }

      setIsLoading(false);
    };

    fetchProducts();
  }, [reloadKey]);

  const retry = () => setReloadKey((prev) => prev + 1);

  return { products, isLoading, error, retry };
}
