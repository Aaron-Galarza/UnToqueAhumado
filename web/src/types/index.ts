// --- USUARIOS Y AUTH ---
export interface AuthResponse {
  message: string;
  token: string;
}

// --- PRODUCTOS ---
export interface Product {
  _id: string;          // Cambió de number a string
  title: string;       // Aaron usa 'title', nosotros usábamos 'name'
  price: number;
  description: string;
  image: string;
  category: string;
  active: boolean;     // Nuevo campo para saber si se muestra o no
}

// --- CARRITO ---
export interface CartItem {
  productId: string;   // Aaron espera 'productId' al crear el pedido
  title: string;
  price: number;
  quantity: number;
  image?: string;  
  category?: string;    // Lo guardamos para la vista del carrito, pero no va a la API
}

// --- PEDIDOS ---
export interface OrderCustomer {
  name: string;
  phone: string;
  address?: string;
}

export interface Order {
  _id: string;
  customer: OrderCustomer;
  items: CartItem[];
  deliveryType: 'pickup' | 'delivery';
  couponCode?: string;
  total: number;
  status: 'pending' | 'in-preparation' | 'ready' | 'delivered';
  createdAt: string;
}

// Lo que espera la API cuando hacemos POST /api/orders
export interface OrderRequest {
  customer: OrderCustomer;
  items: { productId: string; quantity: number }[];
  deliveryType: 'pickup' | 'delivery';
  couponCode?: string;
}

// --- CUPONES ---
export interface Coupon {
  _id: string;
  code: string;
  Percent: number; }