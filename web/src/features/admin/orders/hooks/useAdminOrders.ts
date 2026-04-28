'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { getSocket, disconnectSocket } from '@/lib/socket.'

export interface OrderItem {
  productId?: string
  title: string
  price: number
  quantity: number
  addons?: any[]
}

export interface Order {
  _id?: string
  id?: string
  customer: {
    name: string
    phone: string
    address?: string
  }
  items: OrderItem[]
  deliveryType: 'pickup' | 'delivery'
  paymentMethod: string
  couponCode?: string; // Mantenemos lo que habíamos agregado antes
  total: number
  status: 'pending' | 'in-preparation' | 'ready' | 'delivered'
  createdAt: string
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    const response = await api.get<Order[]>('/api/orders/admin')

    if (response.success && response.data) {
      // Ordenamos para que los más nuevos queden arriba
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sorted)
      setError(null)
    } else {
      setError(response.error || 'Error al cargar los pedidos.')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // 1. Carga inicial "a la antigua" (REST) para tener la lista inicial
    fetchOrders()

    // 2. Prendemos el teléfono rojo (WebSocket) para escuchar lo nuevo
    const socket = getSocket()

    // Evento A: Entra un pedido nuevo
    socket.on('new-order', (order: Order) => {
      console.log('🚨 ¡NUEVO PEDIDO RECIBIDO POR SOCKET!', order);
      setOrders(prev => [order, ...prev]) // Lo metemos primero en la lista
    })

    // Evento B: Otro admin (o el cajero) actualizó un pedido
    socket.on('order-updated', ({ id, status }: { id: string; status: Order['status'] }) => {
      console.log(`🔄 Pedido ${id} actualizado a ${status} por otro lado`);
      setOrders(prev =>
        prev.map(o => (o._id === id || o.id === id) ? { ...o, status } : o)
      )
    })

    // 3. Cuando cerramos la pantalla de admin, cortamos el teléfono
    return () => {
      socket.off('new-order')
      socket.off('order-updated')
      disconnectSocket()
    }
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Cambiamos la UI al instante para que se sienta súper rápido (Optimistic UI)
    setOrders(prev =>
      prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o)
    )

    // Le avisamos al backend del cambio (esto también disparará 'order-updated' para los demás admins)
    const response = await api.put(`/api/orders/admin/${orderId}`, { status: newStatus })

    if (!response.success) {
      alert(`Error al actualizar estado: ${response.error}`)
      fetchOrders() // Si falló, recargamos la lista real para deshacer el cambio visual
    }
  }

  return {
    orders,
    isLoading,
    error,
    refreshOrders: fetchOrders,
    updateOrderStatus,
  }
}