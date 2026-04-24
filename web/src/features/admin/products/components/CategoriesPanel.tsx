"use client";

import { useState } from 'react';
import { Edit2, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';
import { useAdminCategories, Category } from '../hooks/useAdminCategories';

export function CategoriesPanel() {
  const { categories, isLoading, createCategory, updateCategory, toggleActive, deleteCategory } = useAdminCategories();
  
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const handleSave = async () => {
    if (!newCatName.trim()) return;

    if (editingCat) {
      await updateCategory(editingCat._id, newCatName);
      setEditingCat(null);
    } else {
      await createCategory(newCatName);
    }
    setNewCatName('');
  };

  const handleEditClick = (cat: Category) => {
    setEditingCat(cat);
    setNewCatName(cat.name);
  };

  const cancelEdit = () => {
    setEditingCat(null);
    setNewCatName('');
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm mt-6">
      <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue'] mb-4">
        Categorías del Menú
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="lg:pr-8 lg:border-r border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-gray-500 block">
              {editingCat ? 'Editando Categoría' : 'Nueva Categoría'}
            </label>
            {editingCat && (
              <button onClick={cancelEdit} className="text-xs text-red-500 font-bold flex items-center gap-1 cursor-pointer">
                <X className="w-3 h-3" /> Cancelar
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newCatName} 
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej: Acompañamientos" 
              className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary" 
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button 
              onClick={handleSave}
              disabled={!newCatName.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50 transition-all hover:bg-primary/90 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {editingCat ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: LISTA */}
        <div>
          {isLoading ? (
            <p className="text-sm text-gray-500 animate-pulse">Cargando categorías...</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <div key={cat._id} className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50 transition-colors ${!cat.active ? 'opacity-60 grayscale' : ''} ${editingCat?._id === cat._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <span className={`text-sm font-bold ${!cat.active ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {cat.name}
                  </span>
                  
                  <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-1">
                    <button onClick={() => toggleActive(cat._id)} className="p-1 text-gray-400 hover:text-green-600 transition-colors" title={cat.active ? "Desactivar" : "Activar"}>
                      {cat.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button onClick={() => handleEditClick(cat)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteCategory(cat._id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-gray-400">No hay categorías. Creá la primera.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}