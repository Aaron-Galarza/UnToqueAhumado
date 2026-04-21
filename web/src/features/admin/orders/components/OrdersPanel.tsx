"use client";

import { Clock, MessageCircle, Banknote, CreditCard, Trash2 } from 'lucide-react';
// Aaron: este panel hoy consume pedidos desde Zustand (y los persiste). Cuando conectes el backend, la idea es que el store sea solo un wrapper del API.
import { useAdminStore, Order } from '@/stores/adminStore';

const STATUS_COLORS = {
  'Pendiente': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'En proceso': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'Entregado': 'text-green-500 bg-green-500/10 border-green-500/20'
};

export function OrdersPanel() {
  // Aaron: las 3 acciones del store (update/delete) hoy son instantáneas. Con backend real deberían manejar loading/error y refrescar el listado.
  const orders = useAdminStore((state) => state.orders);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);
  const deleteOrder = useAdminStore((state) => state.deleteOrder);

  // Aaron: estos contadores son derivados del estado. Si más adelante vienen del backend, podés mandarlos ya agregados y evitamos recalcular.
  const countPendientes = orders.filter(o => o.status === 'Pendiente').length;
  const countProceso = orders.filter(o => o.status === 'En proceso').length;
  const countEntregados = orders.filter(o => o.status === 'Entregado').length;

  // Aaron: esto arma un deep-link a WhatsApp para confirmar estado con el cliente (sin backend de notificaciones todavía).
  const handleWhatsAppClick = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const mensaje = `¡Hola ${order.customerName}! Te escribimos de Un Toque Ahumado 🔥. Te aviso que tu pedido ${order.id} (${order.items}) ya está ${order.status.toLowerCase()}.`;
    const url = `https://wa.me/549${cleanPhone}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm flex flex-col h-[32rem]">
      
      {/* HEADER DEL PANEL */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 gap-3">
        <h3 className="text-xl md:text-2xl text-gray-900 tracking-wide font-['Bebas_Neue']">
          Panel de Pedidos
        </h3>
        
        {/* CONTADORES (Se actualizan solos gracias a Zustand) */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold">
          <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded border border-yellow-200">
            {countPendientes} Pendientes
          </span>
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200">
            {countProceso} En proceso
          </span>
          <span className="bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200">
            {countEntregados} Entregados
          </span>
        </div>
      </div>
      
      {/* LISTA DE PEDIDOS SCROLLEABLE */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {orders.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            No hay pedidos activos.
          </div>
        )}
        
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 relative group">
            <div className="flex justify-between items-start mb-3">
              
              {/* INFO DEL CLIENTE */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-primary font-bold text-sm md:text-base">{order.id}</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{order.phone}</span>
                  <button 
                    onClick={() => handleWhatsAppClick(order)}
                    className="flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-500 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* HORA */}
              <div className="flex items-center gap-1 md:gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">{order.time}</span>
              </div>
            </div>
            
            {/* ITEMS PEDIDOS */}
          <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium whitespace-pre-line">
              {order.items}
            </p>            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-gray-200 pt-3 gap-3 sm:gap-0">
              
              {/* TOTAL Y MÉTODO DE PAGO */}
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-bold text-gray-900">
                  ${order.total.toLocaleString('es-AR')}
                </span>
                <span className="text-xs md:text-sm text-gray-700 flex items-center gap-1.5 mt-1 font-medium">
                  {order.paymentMethod === 'Efectivo' ? (
                    <Banknote className="w-4 h-4 text-green-600"/>
                  ) : (
                    <CreditCard className="w-4 h-4 text-blue-600"/>
                  )}
                  Abonado en {order.paymentMethod}
                </span>
              </div>
              
              {/* ACCIONES (Cambiar estado y Eliminar) */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className={`text-[10px] md:text-xs font-bold px-2 py-1.5 md:px-3 rounded-lg border appearance-none outline-none cursor-pointer transition-colors ${STATUS_COLORS[order.status]}`}
                >
                  <option value="Pendiente" className="bg-white text-gray-900">Pendiente</option>
                  <option value="En proceso" className="bg-white text-gray-900">En proceso</option>
                  <option value="Entregado" className="bg-white text-gray-900">Entregado</option>
                </select>

                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar pedido"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
