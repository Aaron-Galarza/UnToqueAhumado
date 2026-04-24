import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  addons?: any[];
}

export interface Order {
  _id?: string; // MongoDB suele devolver _id
  id?: string; 
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  deliveryType: 'pickup' | 'delivery';
  paymentMethod: string;
  total: number;
  status: 'pending' | 'in-preparation' | 'ready' | 'delivered';
  createdAt: string;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. TRAER LOS PEDIDOS
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Order[]>('/api/orders/admin');
    
    if (response.success && response.data) {
      // Ordenamos para que los más nuevos salgan arriba (por fecha)
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
      setError(null);
    } else {
      setError(response.error || 'Error al cargar los pedidos.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000); 
    
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // 2. ACTUALIZAR ESTADO DEL PEDIDO
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Optimistic UI: Actualizamos localmente para que se sienta súper rápido
    setOrders(prev => prev.map(o => 
      (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o
    ));

    const response = await api.put(`/api/orders/admin/${orderId}`, { status: newStatus });
    
    if (!response.success) {
      alert(`Error al actualizar estado: ${response.error}`);
      fetchOrders(); // Si falla, recargamos para volver al estado real de la BD
    }
  };

return {
    orders,
    isLoading,
    error,
    refreshOrders: fetchOrders,
    updateOrderStatus // Solo estas
  };
}