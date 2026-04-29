'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getSocket, disconnectSocket } from '@/lib/socket.';
import toast from 'react-hot-toast';

export interface OrderItem {
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  addons?: unknown[];
}

export interface Order {
  _id?: string;
  id?: string;
  customer: { name: string; phone: string; address?: string };
  items: OrderItem[];
  deliveryType: 'pickup' | 'delivery';
  paymentMethod: string;
  couponCode?: string;
  total: number;
  status: 'pending' | 'in-preparation' | 'ready' | 'delivered';
  createdAt: string;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const response = await api.get<Order[]>('/api/orders/admin');
    if (response.success && response.data) {
      const sorted = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);
      setError(null);
    } else setError(response.error || 'Error al cargar los pedidos.');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const socket = getSocket();
    socket.on('new-order', (order: Order) => setOrders((prev) => [order, ...prev]));
    socket.on('order-updated', ({ id, status }: { id: string; status: Order['status'] }) => setOrders((prev) => prev.map((o) => (o._id === id || o.id === id ? { ...o, status } : o))));
    return () => {
      socket.off('new-order');
      socket.off('order-updated');
      disconnectSocket();
    };
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o)));
    const response = await api.put(`/api/orders/admin/${orderId}`, { status: newStatus });
    if (!response.success) {
      toast.error(`Error al actualizar estado: ${response.error}`);
      fetchOrders();
    }
  };

  return { orders, isLoading, error, refreshOrders: fetchOrders, updateOrderStatus };
}
