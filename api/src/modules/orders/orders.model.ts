// api\src\modules\orders\orders.model.ts

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'in-preparation' | 'ready' | 'delivered';
export const validOrderStatus: OrderStatus[] = ['pending', 'in-preparation', 'ready', 'delivered']

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address?: string; // Opcional si es retiro
  };
  items: CartItem[];
  couponCode?: string;
  deliveryType: 'pickup' | 'delivery';
  total: number;
  status: OrderStatus;
  createdAt: Date;
}