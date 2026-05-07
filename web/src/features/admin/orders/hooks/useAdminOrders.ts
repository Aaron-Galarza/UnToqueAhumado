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

// 👇 LA FUNCIÓN DEL TIMBRE: La definimos fuera del hook para mejor rendimiento
const playNotificationSound = () => {
  const audio = new Audio('/ding.mp3'); 
  audio.play().catch(error => console.log("Audio bloqueado por el navegador hasta que el usuario interactúe."));
};

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
      if (response.status !== 403) {
        toast.error(response.error || 'Error al cargar los pedidos.');
      }
    }
    setIsLoading(false);
  }, [dateRange]); // <-- Se vuelve a ejecutar si cambia el rango

  useEffect(() => {
    fetchOrders();
    const socket = getSocket();
    
    socket.on('new-order', (order: Order) => {
      // 👇 1. HACEMOS SONAR LA CAMPANA ACÁ
      playNotificationSound();
      
      // 👇 2. MOSTRAMOS EL TOAST VISUAL ACÁ
      toast.success(`¡Nuevo pedido de ${order.customer.name}!`, {
        duration: 6000, // Queda 6 segundos en pantalla
        icon: '🍔',
        style: {
          fontWeight: 'bold',
          background: '#FFF0E5',
          color: '#EA580C',
        }
      });
      
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
      if (response.status !== 403) {
        toast.error(`Error al actualizar estado: ${response.error}`);
      }
      fetchOrders();
    }
  };

  return { 
    orders, isLoading, error, refreshOrders: fetchOrders, updateOrderStatus,
    dateRange, setDateRange 
  };
}