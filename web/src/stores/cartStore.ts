import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/features/cart/types/cart';

// Aaron: este store persiste el carrito en el cliente. Si más adelante el backend maneja carrito por usuario, acá lo usamos como cache y sincronizamos.

// Definimos el formato de los datos del pedido
export interface OrderData {
  name: string;
  phone: string;
  address: string;
  deliveryType: 'takeaway' | 'delivery';
  discountApplied: boolean;
  paymentMethod: 'Efectivo' | 'Transferencia';
}

interface CartState {
  items: CartItem[];
  orderData: OrderData; // Siempre arranca con valores por defecto para evitar null-checks en la UI.
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  updateAdicional: (itemId: number, adId: string, delta: number) => void;
  setOrderData: (data: OrderData) => void;
  clearCart: () => void;
}

// Valores por defecto para que arranque limpio
const initialOrderData: OrderData = {
  name: '',
  phone: '',
  address: '',
  deliveryType: 'takeaway',
  discountApplied: false,
  paymentMethod: 'Efectivo',
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      orderData: initialOrderData,

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

      clearCart: () => set({ items: [], orderData: initialOrderData }), 
    }),
    {
      name: 'cart-storage',
    }
  )
);
