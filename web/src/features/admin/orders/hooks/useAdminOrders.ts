'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getSocket, disconnectSocket } from '@/lib/socket.'; 
import toast from 'react-hot-toast';

// 1. Definimos los rangos permitidos
export type DateRange = 'hoy' | 'ayer' |'semana' | 'mes';

export interface OrderItem {
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  // 2. Arreglamos el error de TypeScript (adiós unknown)
  addons?: { addonId: string; title: string; quantity: number; price?: number; }[];
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

export interface Addon {
  title: string;
  quantity: number;
  price: number;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 3. Agregamos el estado del filtro de fecha
  const [dateRange, setDateRange] = useState<DateRange>('hoy');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    // 4. Usamos el nuevo endpoint de Aaron con el filtro
    const response = await api.get<Order[]>(`/api/orders/admin/range?range=${dateRange}`);
    
    if (response.success && response.data) {
      const sorted = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);
      setError(null);
    } else {
      setError(response.error || 'Error al cargar los pedidos.');
      toast.error(response.error || 'Error al cargar los pedidos.');
    }
    setIsLoading(false);
  }, [dateRange]); // <-- Se vuelve a ejecutar si cambia el rango

  useEffect(() => {
    fetchOrders();
    const socket = getSocket();
    
    socket.on('new-order', (order: Order) => {
      // Opcional: Solo agregar al estado si estamos en "hoy"
      if (dateRange === 'hoy') {
        setOrders((prev) => [order, ...prev]);
      }
    });
    
    socket.on('order-updated', ({ id, status }: { id: string; status: Order['status'] }) => 
      setOrders((prev) => prev.map((o) => (o._id === id || o.id === id ? { ...o, status } : o)))
    );
    
    return () => {
      socket.off('new-order');
      socket.off('order-updated');
      disconnectSocket();
    };
  }, [fetchOrders, dateRange]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o)));
    const response = await api.put(`/api/orders/admin/${orderId}`, { status: newStatus });
    if (!response.success) {
      toast.error(`Error al actualizar estado: ${response.error}`);
      fetchOrders();
    }
  };

  // 5. Exponemos dateRange y setDateRange para que la UI pueda usarlos
  return { 
    orders, isLoading, error, refreshOrders: fetchOrders, updateOrderStatus,
    dateRange, setDateRange 
  };
}