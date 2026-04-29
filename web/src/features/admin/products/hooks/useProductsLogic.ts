import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  active: boolean;
}

export interface Category {
  _id: string;
  name: string;
}

export function useProductsLogic() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', image: '', category: '' });
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todas');

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await api.get<Product[]>('/api/productos/admin');
    if (response.success && response.data) setProducts(response.data);
    else setError('Error al cargar los productos');
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const response = await api.get<Category[]>('/api/categorias');
    if (response.success && response.data && response.data.length > 0) {
      const fetchedCategories = response.data;
      setCategories(fetchedCategories);
      setNewProduct((prev) => ({ ...prev, category: fetchedCategories[0].name }));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSaveProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.description || !newProduct.image || !newProduct.category) {
      toast.error('Por favor completá todos los campos.');
      return;
    }
    const payload = { ...newProduct, price: Number(newProduct.price) };
    const response = editingId ? await api.put(`/api/productos/admin/${editingId}`, payload) : await api.post('/api/productos/admin', payload);
    if (response.success) {
      fetchProducts();
      cancelEdit();
      toast.success(editingId ? 'Producto actualizado.' : 'Producto creado.');
    } else toast.error(`Error al guardar: ${response.error || 'Verificá que la categoría sea válida'}`);
  };

  const deleteProduct = async (id: string) => {
    const response = await api.delete(`/api/productos/admin/${id}`);
    if (response.success) {
      fetchProducts();
      toast.success('Producto eliminado.');
    } else toast.error(`Error al eliminar: ${response.error || 'No se pudo eliminar el producto.'}`);
  };

  const toggleProductActive = async (id: string) => {
    const response = await api.put(`/api/productos/admin/toggleActive/${id}`, {});
    if (response.success) fetchProducts();
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setNewProduct({ title: product.title || '', price: String(product.price || ''), description: product.description || '', image: product.image || '', category: product.category || (categories[0]?.name || '') });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProduct({ title: '', price: '', description: '', image: '', category: categories[0]?.name || '' });
  };

  const filteredProducts = products.filter((p) => (productCategoryFilter === 'Todas' ? true : p.category === productCategoryFilter));

  return { products, categories, isLoading, error, newProduct, setNewProduct, productCategoryFilter, setProductCategoryFilter, filteredProducts, handleSaveProduct, deleteProduct, toggleProductActive, handleEditClick, editingId, cancelEdit };
}
