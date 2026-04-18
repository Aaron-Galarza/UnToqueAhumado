import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/features/cart/types/cart';

// Definimos el formato de los datos del pedido
export interface OrderData {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'takeaway' | 'delivery';
  discountApplied: boolean;
}

interface CartState {
  items: CartItem[];
  orderData: OrderData | null; // <--- NUEVO: Para guardar los datos del cliente
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  updateAdicional: (itemId: number, adId: string, delta: number) => void;
  setOrderData: (data: OrderData) => void; // <--- NUEVO: Para guardar la info antes del checkout
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      orderData: null, // Arranca sin datos del cliente

      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === newItem.id && JSON.stringify(item.adicionales) === JSON.stringify(newItem.adicionales)
        );
        if (existingItemIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return { items: newItems };
        }
        return { items: [...state.items, newItem] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map(item => {
          if (item.id !== id) return item;
          const nextQty = Math.min(10, Math.max(1, item.quantity + delta));
          return { ...item, quantity: nextQty };
        })
      })),

      updateAdicional: (itemId, adId, delta) => set((state) => ({
        items: state.items.map(item => {
          if (item.id !== itemId) return item;
          const currentQty = item.adicionales[adId] || 0;
          const nextQty = Math.min(10, Math.max(0, currentQty + delta));
          return { ...item, adicionales: { ...item.adicionales, [adId]: nextQty } };
        })
      })),

      setOrderData: (data) => set({ orderData: data }),

      // Modificamos clearCart para que también borre los datos del cliente
      clearCart: () => set({ items: [], orderData: null }), 
    }),
    {
      name: 'cart-storage',
    }
  )
);