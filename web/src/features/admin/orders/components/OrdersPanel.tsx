"use client";

import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useAdminOrders } from '../hooks/useAdminOrders'; 
import { OrderCard } from './OrderCard';

export function OrdersPanel() {
  const { orders, isLoading, updateOrderStatus, refreshOrders, dateRange, setDateRange } = useAdminOrders();
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in-preparation' | 'done'>('all');

  const countPendientes = orders.filter(o => o.status === 'pending').length;
  const countProceso = orders.filter(o => o.status === 'in-preparation').length;
  const countListos = orders.filter(o => o.status === 'ready' || o.status === 'delivered').length;

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return o.status === 'pending';
    if (activeFilter === 'in-preparation') return o.status === 'in-preparation';
    if (activeFilter === 'done') return o.status === 'ready' || o.status === 'delivered';
    return true;
  });

  const toggleFilter = (filter: 'pending' | 'in-preparation' | 'done') => {
    setActiveFilter(prev => prev === filter ? 'all' : filter);
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm flex flex-col h-[32rem]">
      
      {/* --- CABECERA REORDENADA --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
        
        {/* BLOQUE IZQUIERDO: Título y Filtros de Estado */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue'] whitespace-nowrap">
            Panel de Pedidos
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold">
            <button onClick={() => toggleFilter('pending')} className={`bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded border border-yellow-200 transition-all cursor-pointer hover:opacity-100 ${activeFilter !== 'all' && activeFilter !== 'pending' ? 'opacity-40' : 'opacity-100'}`}>
              {countPendientes} Pendientes
            </button>
            <button onClick={() => toggleFilter('in-preparation')} className={`bg-blue-50 text-blue-600 px-2.5 py-1 rounded border border-blue-200 transition-all cursor-pointer hover:opacity-100 ${activeFilter !== 'all' && activeFilter !== 'in-preparation' ? 'opacity-40' : 'opacity-100'}`}>
              {countProceso} En proceso
            </button>
            <button onClick={() => toggleFilter('done')} className={`bg-green-50 text-green-600 px-2.5 py-1 rounded border border-green-200 transition-all cursor-pointer hover:opacity-100 ${activeFilter !== 'all' && activeFilter !== 'done' ? 'opacity-40' : 'opacity-100'}`}>
              {countListos} Terminados
            </button>
          </div>
        </div>
        
        {/* BLOQUE DERECHO: Filtro de Fecha y Botón Refresh */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="text-xs font-bold border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-pointer outline-none focus:border-primary py-1.5 px-2 w-28 transition-colors"
          >
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>

          <button onClick={refreshOrders} className={`p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer bg-gray-50 border border-gray-200 rounded-md ${isLoading ? 'animate-spin text-primary' : ''}`}>
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
      {/* --- FIN CABECERA --- */}

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {filteredOrders.length === 0 && !isLoading && (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            {orders.length === 0 ? "No hay pedidos en este rango." : "No hay pedidos en este estado."}
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