import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types'; 

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'pickup' | 'delivery'; 
  couponCode?: string; 
  couponPercent?: number;
  paymentMethod: 'Efectivo' | 'Transferencia'; 
}

export interface CartItemWithExtras extends CartItem {
  cartItemId?: string; 
  adicionales?: Record<string, number>;
}

interface CartState {
  items: CartItemWithExtras[];
  orderData: OrderData; 
  addItem: (item: CartItemWithExtras) => void;
  setItems: (items: CartItemWithExtras[]) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  updateAdicional: (cartItemId: string, adId: string, delta: number) => void;
  setOrderData: (data: OrderData) => void;
  clearCart: () => void;
}

const initialOrderData: OrderData = {
  name: '',
  phone: '',
  address: '',
  deliveryType: 'pickup', 
  paymentMethod: 'Efectivo',
};

// --- HELPERS MÁGICOS ---
const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

// Esto limpia los "huevo: 0" y ordena los adicionales para poder compararlos perfectamente
const cleanExtras = (extras?: Record<string, number>) => {
  if (!extras) return {};
  const cleaned: Record<string, number> = {};
  Object.keys(extras).sort().forEach(k => {
    if (extras[k] > 0) cleaned[k] = extras[k];
  });
  return cleaned;
};

// Compara si dos hamburguesas tienen exactamente los mismos adicionales
const isSameItem = (item1: CartItemWithExtras, item2: CartItemWithExtras) => {
  return item1.productId === item2.productId && 
         JSON.stringify(cleanExtras(item1.adicionales)) === JSON.stringify(cleanExtras(item2.adicionales));
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      orderData: initialOrderData,

      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(item => isSameItem(item, newItem));

        if (existingItemIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return { items: newItems };
        }
        
        return { items: [...state.items, { ...newItem, cartItemId: generateUniqueId() }] };
      }),

      setItems: (items) => set({ items }),

      removeItem: (cartItemId) => set((state) => ({
        items: state.items.filter(item => (item.cartItemId || item.productId) !== cartItemId)
      })),

      updateQuantity: (cartItemId, delta) => set((state) => ({
        items: state.items.map(item => {
          if ((item.cartItemId || item.productId) !== cartItemId) return item;
          const nextQty = Math.min(10, Math.max(1, item.quantity + delta));
          return { ...item, quantity: nextQty };
        })
      })),

      updateAdicional: (cartItemId, adId, delta) => set((state) => {
        const itemIndex = state.items.findIndex(item => (item.cartItemId || item.productId) === cartItemId);
        if (itemIndex < 0) return state;

        const item = state.items[itemIndex];
        const currentQty = item.adicionales?.[adId] || 0;
        const nextQty = Math.min(10, Math.max(0, currentQty + delta));

        if (currentQty === nextQty) return state;

        // Calculamos cómo quedarían los adicionales nuevos
        const newAdicionales = { ...(item.adicionales || {}), [adId]: nextQty };
        const tempItemForComparison = { ...item, adicionales: newAdicionales };

        const newItems = [...state.items];

        // ESCENARIO A: Es una sola hamburguesa
        if (item.quantity === 1) {
          // Buscamos si al modificarla, quedó idéntica a otra que ya está en el carrito
          const matchingIndex = newItems.findIndex((otherItem, idx) => idx !== itemIndex && isSameItem(otherItem, tempItemForComparison));
          
          if (matchingIndex >= 0) {
            // ¡FUSIÓN! La sumamos a la otra y borramos esta
            newItems[matchingIndex].quantity += 1;
            newItems.splice(itemIndex, 1);
          } else {
            // No hay otra igual, solo le actualizamos sus datos
            newItems[itemIndex] = { ...item, adicionales: newAdicionales };
          }
          return { items: newItems };
        }

        // ESCENARIO B: Hay varias hamburguesas agrupadas
        
        // 1. Al grupo original le restamos 1
        newItems[itemIndex] = { ...item, quantity: item.quantity - 1 };

        // 2. Buscamos si YA EXISTE un grupo que sea exactamente igual a la nueva que estamos separando
        const matchingIndex = newItems.findIndex(otherItem => isSameItem(otherItem, tempItemForComparison));

        if (matchingIndex >= 0) {
          // Si ya existe, le sumamos 1 a ese grupo
          newItems[matchingIndex].quantity += 1;
        } else {
          // Si no existe, creamos la nueva tarjetita y la ponemos abajo del original
          const separatedItem = {
            ...item,
            cartItemId: generateUniqueId(),
            quantity: 1,
            adicionales: newAdicionales
          };
          newItems.splice(itemIndex + 1, 0, separatedItem);
        }

        return { items: newItems };
      }),

      setOrderData: (data) => set({ orderData: data }),
      clearCart: () => set({ items: [], orderData: initialOrderData }), 
    }),
    {
      name: 'cart-storage',
    }
  )
);