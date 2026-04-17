import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/features/cart/types/cart';

// 1. EL CONTRATO: Le decimos a TypeScript exactamente qué va a recordar el cerebro
interface CartState {
  items: CartItem[]; // La lista de productos
  addItem: (item: CartItem) => void; // Función para meter algo al carrito
  removeItem: (id: number) => void;  // Función para sacar algo
  updateQuantity: (id: number, delta: number) => void; // Sumar/restar principal
  updateAdicional: (itemId: number, adId: string, delta: number) => void; // Sumar/restar extras
  clearCart: () => void; // Vaciar todo (para cuando pagan)
}

// 2. LA CREACIÓN: Acá nace el cerebro usando `create` de Zustand
export const useCartStore = create<CartState>()(
  // `persist` hace la magia de guardar todo en la memoria del navegador automáticamente
  persist(
    (set) => ({
      // A. ESTADO INICIAL: Arrancamos con la lista vacía (cero harcodeo)
      items: [], 

      // B. LAS ACCIONES (Las mismas funciones que antes tenías en la página, pero ahora viven acá)
      
      addItem: (newItem) => set((state) => {
        // Lógica para que si agregás la misma burger 2 veces, se sume la cantidad en vez de duplicar la tarjeta
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

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // El nombre del archivo oculto en el navegador
    }
  )
);