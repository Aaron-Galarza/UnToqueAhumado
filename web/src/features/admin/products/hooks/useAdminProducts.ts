import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. TRAER TODOS LOS PRODUCTOS (Incluso los ocultos)
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Product[]>('/api/productos/admin');
    
    if (response.success && response.data) {
      setProducts(response.data);
      setError(null);
    } else {
      setError(response.error || 'Error al cargar productos del panel.');
    }
    setIsLoading(false);
  }, []);

  // Cargar al montar el panel
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. CREAR PRODUCTO
  const createProduct = async (productData: Omit<Product, 'id' | 'active'>) => {
    const response = await api.post<Product>('/api/productos/admin', productData);
    if (response.success && response.data) {
      // Agregamos el producto nuevo a la lista actual sin recargar la página
      setProducts(prev => [...prev, response.data!]);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  // 3. EDITAR PRODUCTO
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const response = await api.put<Product>(`/api/productos/admin/${id}`, productData);
    if (response.success && response.data) {
      // Actualizamos solo el producto que cambió en nuestra lista visual
      setProducts(prev => prev.map(p => p.id === id ? response.data! : p));
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  // 4. ACTIVAR / DESACTIVAR (Pausar producto)
  const toggleActive = async (id: string) => {
    const response = await api.put<Product>(`/api/productos/admin/toggleActive/${id}`, {});
    if (response.success && response.data) {
      setProducts(prev => prev.map(p => p.id === id ? response.data! : p));
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  // 5. BORRAR PRODUCTO
  const deleteProduct = async (id: string) => {
    const response = await api.delete<boolean>(`/api/productos/admin/${id}`);
    if (response.success) {
      // Lo sacamos de la lista visual
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  return {
    products,
    isLoading,
    error,
    refreshProducts: fetchProducts,
    createProduct,
    updateProduct,
    toggleActive,
    deleteProduct
  };
}