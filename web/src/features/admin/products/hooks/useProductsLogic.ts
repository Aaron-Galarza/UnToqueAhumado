import { useState } from 'react';
import { useAdminStore, type Product } from '@/stores/adminStore';

export function useProductsLogic() {
  // Aaron: este hook es el punto único de verdad para el CRUD de productos en el panel. Cuando haya backend, la idea es reemplazar las acciones del store por llamadas al API acá.
  const products = useAdminStore((state) => state.products);
  const addProduct = useAdminStore((state) => state.addProduct);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);
  const updateProduct = useAdminStore((state) => state.updateProduct);

  // 2. ESTADOS LOCALES
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todas');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category: 'Hamburguesas Artesanales', price: '', image: ''
  });

  // 3. LÓGICA Y HANDLERS
  const filteredProducts = productCategoryFilter === 'Todas' 
    ? products 
    : products.filter(p => p.category === productCategoryFilter);

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Por favor completá al menos el nombre, precio e imagen.");
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        name: newProduct.name,
        description: newProduct.description || 'Sin descripción',
        category: newProduct.category,
        price: Number(newProduct.price),
        image: newProduct.image
      });
      setEditingId(null);
    } else {
      addProduct({
        name: newProduct.name,
        description: newProduct.description || 'Sin descripción',
        category: newProduct.category,
        price: Number(newProduct.price),
        image: newProduct.image
      });
    }

    setNewProduct({ name: '', description: '', category: 'Hamburguesas Artesanales', price: '', image: '' });
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      image: product.image
    });
    // ¡CHAU SCROLL! Se queda exactamente donde el usuario hizo clic.
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProduct({ name: '', description: '', category: 'Hamburguesas Artesanales', price: '', image: '' });
  };

  return {
    newProduct, setNewProduct,
    productCategoryFilter, setProductCategoryFilter,
    filteredProducts, handleSaveProduct, deleteProduct,
    handleEditClick, editingId, cancelEdit
  };
}
