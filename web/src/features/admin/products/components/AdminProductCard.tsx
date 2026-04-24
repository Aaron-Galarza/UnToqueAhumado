import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Product } from '@/types';

interface AdminProductCardProps {
  product: Product;
  editingId: string | null;
  toggleProductActive: (id: string) => void;
  handleEditClick: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

export function AdminProductCard({ product, editingId, toggleProductActive, handleEditClick, deleteProduct }: AdminProductCardProps) {
  return (
    <div className={`bg-gray-50 border rounded-xl p-3 flex items-center gap-3 md:gap-4 group transition-colors ${editingId === product._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
      <img 
        src={product.image} 
        alt={product.title} 
        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover bg-gray-100 shrink-0 transition-all ${!product.active ? 'grayscale opacity-50' : ''}`} 
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h5 className={`font-bold text-xs md:text-sm truncate ${!product.active ? 'text-gray-400' : 'text-gray-900'}`}>{product.title}</h5>
          {!product.active && <span className="bg-red-100 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Inactivo</span>}
        </div>
        <p className="text-[10px] md:text-xs text-gray-500 truncate mb-1">
          <span className="text-primary">{product.category}</span> • {product.description}
        </p>
        <p className={`text-xs md:text-sm font-bold ${!product.active ? 'text-gray-400' : 'text-gray-900'}`}>
          ${product.price.toLocaleString('es-AR')}
        </p>
      </div>
      
      <div className="flex flex-col gap-1 md:gap-2 shrink-0">
        <button onClick={() => toggleProductActive(product._id)} className={`p-1.5 md:p-2 rounded-lg transition-colors cursor-pointer border border-transparent shadow-sm ${product.active ? 'text-green-600 hover:text-orange-500 bg-white hover:bg-orange-50' : 'text-gray-400 hover:text-green-600 bg-white hover:bg-green-50'}`} title={product.active ? "Desactivar producto" : "Activar producto"}>
          {product.active ? <Eye className="w-3 h-3 md:w-4 md:h-4" /> : <EyeOff className="w-3 h-3 md:w-4 md:h-4" />}
        </button>
        <button onClick={() => handleEditClick(product)} className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-100 rounded-lg transition-colors cursor-pointer shadow-sm" title="Editar producto">
          <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        <button onClick={() => deleteProduct(product._id)} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg transition-colors cursor-pointer shadow-sm" title="Eliminar producto">
          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}