import { Clock, MessageCircle, Banknote, CreditCard } from 'lucide-react';
import { Order } from '../hooks/useAdminOrders';

const STATUS_COLORS = {
  'pending': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'in-preparation': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'ready': 'text-green-600 bg-green-500/10 border-green-500/20',
  'delivered': 'text-gray-500 bg-gray-500/10 border-gray-500/20'
};

const STATUS_LABELS = {
  'pending': 'Pendiente', 'in-preparation': 'En proceso', 'ready': 'Listo', 'delivered': 'Entregado'
};

interface OrderCardProps {
  order: Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export function OrderCard({ order, updateOrderStatus }: OrderCardProps) {
  const orderId = order._id || order.id || '';

  const handleWhatsAppClick = () => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const listaProductos = order.items.map(i => `${i.quantity}x ${i.title}${i.addons?.length ? ' (+ Extras)' : ''}`).join(', ');
    const mensaje = `¡Hola ${order.customer.name}! Te escribimos de Un Toque Ahumado 🔥. Te aviso que tu pedido (${listaProductos}) ya está ${STATUS_LABELS[order.status].toLowerCase()}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 relative group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-primary font-bold text-sm md:text-base">#{orderId.slice(-4).toUpperCase()}</span>
            <span className="text-gray-900 font-medium text-sm md:text-base">{order.customer.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{order.customer.phone}</span>
            <button onClick={handleWhatsAppClick} className="flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-500 hover:text-white p-1 rounded transition-colors cursor-pointer" title="Enviar WhatsApp">
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      <div className="text-xs md:text-sm text-gray-600 mb-4 font-medium">
        <ul className="list-none space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx}>
              <div className="font-bold text-gray-800">• {item.quantity}x {item.title}</div>
              {item.addons && item.addons.length > 0 && (
                <div className="pl-4 mt-1 space-y-0.5 text-gray-500 text-[11px] md:text-xs">
                  {item.addons.map((addon, aIdx) => (
                    <div key={aIdx}>+ {addon.quantity}x {addon.title || 'Adicional'}</div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-gray-200 pt-3 gap-3 sm:gap-0">
        <div className="flex flex-col">
          <span className="text-base md:text-lg font-bold text-gray-900">${order.total.toLocaleString('es-AR')}</span>
          <span className="text-xs md:text-sm text-gray-700 flex items-center gap-1.5 mt-1 font-medium">
            {order.paymentMethod === 'Efectivo' ? <Banknote className="w-4 h-4 text-green-600"/> : <CreditCard className="w-4 h-4 text-blue-600"/>}
            {order.paymentMethod}
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select 
            value={order.status}
            onChange={(e) => updateOrderStatus(orderId, e.target.value as Order['status'])}
            className={`text-[10px] md:text-xs font-bold px-2 py-1.5 md:px-3 rounded-lg border appearance-none outline-none cursor-pointer transition-colors ${STATUS_COLORS[order.status]}`}
          >
            <option value="pending" className="bg-white text-gray-900">Pendiente</option>
            <option value="in-preparation" className="bg-white text-gray-900">En proceso</option>
            <option value="ready" className="bg-white text-gray-900">Listo</option>
            <option value="delivered" className="bg-white text-gray-900">Entregado</option>
          </select>
        </div>
      </div>
    </div>
  );
}