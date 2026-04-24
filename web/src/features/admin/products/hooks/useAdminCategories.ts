import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  active: boolean;
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. LEER CATEGORÍAS
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Category[]>('/api/categorias/admin');
    if (response.success && response.data) {
      setCategories(response.data);
      setError(null);
    } else {
      setError(response.error || 'Error al cargar categorías');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 2. CREAR CATEGORÍA
  const createCategory = async (name: string) => {
    const response = await api.post<Category>('/api/categorias/admin', { name });
    if (response.success) {
      fetchCategories();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  // 3. EDITAR CATEGORÍA
  const updateCategory = async (id: string, name: string) => {
    const response = await api.put<Category>(`/api/categorias/admin/${id}`, { name });
    if (response.success) {
      fetchCategories();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  // 4. ACTIVAR/DESACTIVAR
  const toggleActive = async (id: string) => {
    const response = await api.put<Category>(`/api/categorias/admin/toggleActive/${id}`, {});
    if (response.success) {
      fetchCategories();
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  // 5. BORRAR CATEGORÍA
  const deleteCategory = async (id: string) => {
    if (window.confirm('¿Seguro que querés borrar esta categoría? Los productos no se borrarán, pero no podrás elegir esta categoría para nuevos productos.')) {
      const response = await api.delete<boolean>(`/api/categorias/admin/${id}`);
      if (response.success) {
        fetchCategories();
        return { success: true };
      }
      return { success: false, error: response.error };
    }
    return { success: false };
  };

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    toggleActive,
    deleteCategory
  };
}