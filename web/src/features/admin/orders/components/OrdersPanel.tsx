"use client";

import { RefreshCcw } from 'lucide-react';
import { useAdminOrders } from '../hooks/useAdminOrders'; 
import { OrderCard } from './OrderCard'; // <-- Importamos la tarjeta

export function OrdersPanel() {
  const { orders, isLoading, updateOrderStatus, refreshOrders } = useAdminOrders();

  const countPendientes = orders.filter(o => o.status === 'pending').length;
  const countProceso = orders.filter(o => o.status === 'in-preparation').length;
  const countListos = orders.filter(o => o.status === 'ready' || o.status === 'delivered').length;

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
          <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded border border-yellow-200">{countPendientes} Pendientes</span>
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200">{countProceso} En proceso</span>
          <span className="bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200">{countListos} Terminados</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {orders.length === 0 && !isLoading && (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">No hay pedidos activos.</div>
        )}
        
        {/* MAGIA: Acá iteramos el componente nuevo */}
        {orders.map((order) => {
          const orderId = order._id || order.id || '';
          return <OrderCard key={orderId} order={order} updateOrderStatus={updateOrderStatus} />;
        })}
      </div>
    </div>
  );
}