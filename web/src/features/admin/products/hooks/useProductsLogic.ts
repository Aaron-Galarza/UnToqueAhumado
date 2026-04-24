import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  active: boolean;
}

// NUEVA INTERFAZ PARA LAS CATEGORÍAS
export interface Category {
  _id: string;
  name: string;
}

export function useProductsLogic() {
  const [products, setProducts] = useState<Product[]>([]);
  // NUEVO ESTADO PARA CATEGORÍAS
  const [categories, setCategories] = useState<Category[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category: '' // Arranca vacío hasta que carguen las de verdad
  });

  const [productCategoryFilter, setProductCategoryFilter] = useState('Todas');

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await api.get<Product[]>('/api/productos/admin');
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      setError('Error al cargar los productos');
    }
    setIsLoading(false);
  };

  // NUEVA FUNCIÓN PARA TRAER CATEGORÍAS REALES
const fetchCategories = async () => {
    const response = await api.get<Category[]>('/api/categorias');
    
    if (response.success && response.data && response.data.length > 0) {
      // Guardamos la data en una constante segura para que TypeScript no pierda el tipado
      const fetchedCategories = response.data; 
      
      setCategories(fetchedCategories);
      setNewProduct(prev => ({ ...prev, category: fetchedCategories[0].name }));
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Lo llamamos al cargar
  }, []);

  const handleSaveProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.description || !newProduct.image || !newProduct.category) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const payload = {
      ...newProduct,
      price: Number(newProduct.price)
    };

    let response;
    if (editingId) {
      response = await api.put(`/api/productos/admin/${editingId}`, payload);
    } else {
      response = await api.post('/api/productos/admin', payload);
    }

    if (response.success) {
      fetchProducts();
      cancelEdit();
    } else {
      alert(`Error al guardar: ${response.error || 'Verificá que la categoría sea válida'}`);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de forma permanente?')) {
      const response = await api.delete(`/api/productos/admin/${id}`);
      if (response.success) {
        fetchProducts();
      }
    }
  };

  const toggleProductActive = async (id: string) => {
    const response = await api.put(`/api/productos/admin/toggleActive/${id}`, {});
    if (response.success) {
      fetchProducts();
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setNewProduct({
      title: product.title || '',
      price: String(product.price || ''),
      description: product.description || '',
      image: product.image || '',
      category: product.category || (categories[0]?.name || '')
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProduct({
      title: '',
      price: '',
      description: '',
      image: '',
      category: categories[0]?.name || '' // Reseteamos a la primera real
    });
  };

  const filteredProducts = products.filter(p => 
    productCategoryFilter === 'Todas' ? true : p.category === productCategoryFilter
  );

  return {
    products,
    categories, // EXPORTAMOS LAS CATEGORÍAS
    isLoading,
    error,
    newProduct, setNewProduct,
    productCategoryFilter, setProductCategoryFilter,
    filteredProducts, 
    handleSaveProduct, 
    deleteProduct,
    toggleProductActive,
    handleEditClick, 
    editingId, 
    cancelEdit
  };
}