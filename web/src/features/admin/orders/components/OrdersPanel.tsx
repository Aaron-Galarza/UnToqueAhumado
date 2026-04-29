"use client";

import { useState } from 'react'; // <-- 1. Importamos useState
import { RefreshCcw } from 'lucide-react';
import { useAdminOrders } from '../hooks/useAdminOrders'; 
import { OrderCard } from './OrderCard';

export function OrdersPanel() {
  const { orders, isLoading, updateOrderStatus, refreshOrders } = useAdminOrders();
  
  // 2. Estado para saber qué filtro está activo (arranca en 'all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in-preparation' | 'done'>('all');

  const countPendientes = orders.filter(o => o.status === 'pending').length;
  const countProceso = orders.filter(o => o.status === 'in-preparation').length;
  const countListos = orders.filter(o => o.status === 'ready' || o.status === 'delivered').length;

  // 3. Filtramos la lista de pedidos en base al botón clickeado
  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return o.status === 'pending';
    if (activeFilter === 'in-preparation') return o.status === 'in-preparation';
    if (activeFilter === 'done') return o.status === 'ready' || o.status === 'delivered';
    return true;
  });

  // 4. Función para alternar el filtro (si toco el mismo, lo apago)
  const toggleFilter = (filter: 'pending' | 'in-preparation' | 'done') => {
    setActiveFilter(prev => prev === filter ? 'all' : filter);
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm flex flex-col h-[32rem]">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue']">Panel de Pedidos</h3>
          <button onClick={refreshOrders} className={`p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer ${isLoading ? 'animate-spin' : ''}`}>
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold">
          {/* Reemplazamos los <span> por <button> y agregamos la lógica de opacidad */}
          <button 
            onClick={() => toggleFilter('pending')}
            className={`bg-yellow-50 text-yellow-600 px-2 py-1 rounded border border-yellow-200 transition-all cursor-pointer hover:opacity-100 ${activeFilter !== 'all' && activeFilter !== 'pending' ? 'opacity-40' : 'opacity-100'}`}
          >
            {countPendientes} Pendientes
          </button>
          
          <button 
            onClick={() => toggleFilter('in-preparation')}
            className={`bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 transition-all cursor-pointer hover:opacity-100 ${activeFilter !== 'all' && activeFilter !== 'in-preparation' ? 'opacity-40' : 'opacity-100'}`}
          >
            {countProceso} En proceso
          </button>
          
          <button 
            onClick={() => toggleFilter('done')}
            className={`bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 transition-all cursor-pointer hover:opacity-100 ${activeFilter !== 'all' && activeFilter !== 'done' ? 'opacity-40' : 'opacity-100'}`}
          >
            {countListos} Terminados
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {/* Cambiamos el texto dinámicamente si no hay resultados por el filtro */}
        {filteredOrders.length === 0 && !isLoading && (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            {orders.length === 0 ? "No hay pedidos activos." : "No hay pedidos en este estado."}
          </div>
        )}
        
        {filteredOrders.map((order) => {
          const orderId = order._id || order.id || '';
          return <OrderCard key={orderId} order={order} updateOrderStatus={updateOrderStatus} />;
        })}
      </div>
    </div>
  );
}