import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface Category {
  _id: string;
  name: string;
  active: boolean;
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Category[]>('/api/categorias/admin');
    if (response.success && response.data) {
      setCategories(response.data);
      setError(null);
    } else setError(response.error || 'Error al cargar categorías');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (name: string) => {
    const response = await api.post<Category>('/api/categorias/admin', { name });
    if (response.success) {
      fetchCategories();
      toast.success('Categoría creada.');
      return { success: true };
    }
    toast.error(response.error || 'No se pudo crear la categoría.');
    return { success: false, error: response.error };
  };

  const updateCategory = async (id: string, name: string) => {
    const response = await api.put<Category>(`/api/categorias/admin/${id}`, { name });
    if (response.success) {
      fetchCategories();
      toast.success('Categoría actualizada.');
      return { success: true };
    }
    toast.error(response.error || 'No se pudo actualizar la categoría.');
    return { success: false, error: response.error };
  };

  const toggleActive = async (id: string) => {
    const response = await api.put<Category>(`/api/categorias/admin/toggleActive/${id}`, {});
    if (response.success) {
      fetchCategories();
      return { success: true };
    }
    toast.error(response.error || 'No se pudo cambiar el estado de la categoría.');
    return { success: false, error: response.error };
  };

  const deleteCategory = async (id: string) => {
    const response = await api.delete<boolean>(`/api/categorias/admin/${id}`);
    if (response.success) {
      fetchCategories();
      toast.success('Categoría eliminada.');
      return { success: true };
    }
    toast.error(response.error || 'No se pudo eliminar la categoría.');
    return { success: false, error: response.error };
  };

  return { categories, isLoading, error, createCategory, updateCategory, toggleActive, deleteCategory };
}
