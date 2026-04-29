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
  paymentMethod: 'Efectivo' | 'Transferencia'; }

export interface CartItemWithExtras extends CartItem {
  adicionales?: Record<string, number>;
}

interface CartState {
  items: CartItemWithExtras[];
  orderData: OrderData; 
  addItem: (item: CartItemWithExtras) => void;
  setItems: (items: CartItemWithExtras[]) => void;
  // 4. Pasamos los IDs a productId (string)
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  updateAdicional: (productId: string, adId: string, delta: number) => void;
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

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      orderData: initialOrderData,

      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          // Comparamos usando productId
          (item) => item.productId === newItem.productId && JSON.stringify(item.adicionales) === JSON.stringify(newItem.adicionales)
        );
        if (existingItemIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return { items: newItems };
        }
        return { items: [...state.items, newItem] };
      }),

      setItems: (items) => set({ items }),

      // Filtramos usando productId
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),

      // Buscamos y actualizamos usando productId
      updateQuantity: (productId, delta) => set((state) => ({
        items: state.items.map(item => {
          if (item.productId !== productId) return item;
          const nextQty = Math.min(10, Math.max(1, item.quantity + delta));
          return { ...item, quantity: nextQty };
        })
      })),

      // Buscamos y actualizamos usando productId
      updateAdicional: (productId, adId, delta) => set((state) => ({
        items: state.items.map(item => {
          if (item.productId !== productId) return item;
          const currentQty = item.adicionales?.[adId] || 0;
          const nextQty = Math.min(10, Math.max(0, currentQty + delta));
          return { ...item, adicionales: { ...(item.adicionales || {}), [adId]: nextQty } };
        })
      })),

      setOrderData: (data) => set({ orderData: data }),

      clearCart: () => set({ items: [], orderData: initialOrderData }), 
    }),
    {
      name: 'cart-storage',
    }
  )
);
