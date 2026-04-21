import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Aaron: este store es un "mock" para el panel admin (persistido en localStorage). Cuando el backend esté listo, la idea es mantener estas interfaces y reemplazar las acciones por llamadas al API.

// 1. TUS INTERFACES
export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: string;
  total: number;
  time: string;
  status: 'Pendiente' | 'En proceso' | 'Entregado';
  paymentMethod: 'Efectivo' | 'Transferencia';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount: string;
}

// 2. DATOS INICIALES (Para que no arranque vacío)
const initialOrders: Order[] = [
  { id: '#ORD-1045', customerName: 'María González', phone: '362 412-3456', items: '2x Smash Clásica', total: 25800, time: 'hace 5 min', status: 'Pendiente', paymentMethod: 'Efectivo' },
  { id: '#ORD-1046', customerName: 'Carlos Ruiz', phone: '362 465-4321', items: '1x BBQ Ahumada, 1x Papas', total: 20800, time: 'hace 8 min', status: 'En proceso', paymentMethod: 'Transferencia' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Doble Smash Clásica', description: 'Doble carne, cheddar, cebolla', price: 12900, image: 'https://images.unsplash.com/photo-1769214571709-8136855ff6a5?auto=format&fit=crop&q=80&w=100', category: 'Smash Burgers' },
  { id: 2, name: 'Papas Crujientes', description: 'Corte artesanal, sal marina', price: 5900, image: 'https://images.unsplash.com/photo-1734774797087-b6435057a15e?auto=format&fit=crop&q=80&w=100', category: 'Acompañamientos' },
];

const initialCoupons: Coupon[] = [
  { id: 1, code: 'SMASHTIKTOK', discount: '10' },
];

// 3. LA ESTRUCTURA DEL CEREBRO
interface AdminState {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  
  // Acciones para Pedidos
  updateOrderStatus: (id: string, newStatus: Order['status']) => void;
  deleteOrder: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'time'>) => void;
  
  // Acciones para Productos
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  
  // Acciones para Cupones
  addCoupon: (code: string, discount: string) => void;
  deleteCoupon: (id: number) => void;
}

// 4. CREAMOS EL STORE CON PERSISTENCIA (LocalStorage)
export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      orders: initialOrders,
      products: initialProducts,
      coupons: initialCoupons,

      addOrder: (newOrder) => set((state) => ({
        orders: [
          {
            ...newOrder,
            id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: 'ahora',
          },
          ...state.orders
        ]
      })),

      updateOrderStatus: (id, newStatus) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status: newStatus } : o)
      })),
      
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      })),

      addProduct: (newProduct) => set((state) => ({
        products: [...state.products, { ...newProduct, id: Date.now() }] 
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      updateProduct: (id, updatedProduct) => set((state) => ({
     products: state.products.map(p => p.id === id ? { ...updatedProduct, id } : p)
   })),
      addCoupon: (code, discount) => set((state) => ({
        coupons: [...state.coupons, { id: Date.now(), code, discount }]
      })),
      
      deleteCoupon: (id) => set((state) => ({
        coupons: state.coupons.filter(c => c.id !== id)
      })),
    }),
    {
      name: 'admin-storage', 
    }
  )
);
