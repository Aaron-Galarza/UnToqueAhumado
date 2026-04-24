"use client";

import { Image as ImageIcon, X } from 'lucide-react';
import { useProductsLogic } from '@/features/admin/products/hooks/useProductsLogic';
import { AdminProductCard } from './AdminProductCard'; // <-- Importamos la tarjeta

export function ProductsPanel() {
  const {
    newProduct, setNewProduct, productCategoryFilter, setProductCategoryFilter,
    filteredProducts, handleSaveProduct, deleteProduct, toggleProductActive, 
    handleEditClick, editingId, cancelEdit, isLoading, categories 
  } = useProductsLogic();

  const updateNewProduct = (patch: Partial<typeof newProduct>) => setNewProduct({ ...newProduct, ...patch });

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="space-y-4 lg:pr-8 lg:border-r border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue']">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            {editingId && (
              <button onClick={cancelEdit} className="text-md text-gray-500 hover:text-red-500 font-bold flex items-center gap-1 cursor-pointer">
                <X className="w-3 h-3" /> Cancelar
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Nombre del producto</label>
              <input type="text" value={newProduct.title} onChange={(e) => updateNewProduct({ title: e.target.value })} placeholder="Ej: Triple Bacon" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Descripción</label>
              <textarea rows={2} value={newProduct.description} onChange={(e) => updateNewProduct({ description: e.target.value })} placeholder="Ingredientes..." className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Categoría</label>
              <select value={newProduct.category} onChange={(e) => updateNewProduct({ category: e.target.value })} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary">
                {categories.length === 0 && <option value="">Cargando categorías...</option>}
                {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Precio ($)</label>
              <input type="number" value={newProduct.price} onChange={(e) => updateNewProduct({ price: e.target.value })} placeholder="0.00" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] md:text-xs text-gray-500 mb-1 block">URL de Imagen</label>
              <div className="flex items-center gap-2 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-primary">
                <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" value={newProduct.image} onChange={(e) => updateNewProduct({ image: e.target.value })} placeholder="https://..." className="flex-1 bg-transparent text-sm text-gray-900 focus:outline-none min-w-0" />
              </div>
            </div>
          </div>
          <button onClick={handleSaveProduct} disabled={categories.length === 0} className={`w-full mt-2 text-white text-sm md:text-base font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#FF5500] hover:bg-[#E04D00]'}`}>
            {editingId ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
        </div>

        {/* COLUMNA DERECHA: LISTA DE PRODUCTOS */}
        <div className="flex flex-col h-96 md:h-[26rem] mt-2 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue']">Tus Productos</h3>
            <select value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary cursor-pointer max-w-[200px]">
              <option value="Todas">Todas las categorías</option>
              {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {isLoading ? (
               <div className="text-center py-8 text-gray-500 font-medium animate-pulse">Cargando menú desde el servidor...</div>
            ) : filteredProducts.map(product => (
              /* MAGIA: Acá iteramos el componente nuevo y le pasamos todo por Props */
              <AdminProductCard 
                key={product._id} product={product} editingId={editingId}
                toggleProductActive={toggleProductActive} handleEditClick={handleEditClick} deleteProduct={deleteProduct}
              />
            ))}
            {!isLoading && filteredProducts.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No hay productos cargados.</div>}
          </div>
        </div>

      </div>
    </div>
  );
}