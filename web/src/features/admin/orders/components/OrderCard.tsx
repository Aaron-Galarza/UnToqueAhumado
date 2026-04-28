import { Clock, MessageCircle, Banknote, CreditCard, MapPin, Store, Ticket } from 'lucide-react';
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
    <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 relative group shadow-sm flex flex-col gap-3">
      
      {/* 1. CABECERA: QUIÉN PIDIÓ Y CÓMO SE ENTREGA */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          {/* Nombre */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold text-xs">#{orderId.slice(-4).toUpperCase()}</span>
            <h3 className="text-gray-950 font-black text-base md:text-lg leading-none">{order.customer.name}</h3>
          </div>
          
          {/* Teléfono y WhatsApp */}
          <div className="flex items-center gap-2">
            <button onClick={handleWhatsAppClick} className="flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-500 hover:text-white p-1 rounded-md transition-colors cursor-pointer" title="Enviar WhatsApp">
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-gray-500">{order.customer.phone}</span>
          </div>

          {/* Bloque de Tipo de Entrega */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-800 bg-gray-50 border border-gray-200 w-fit px-2 py-1.5 rounded-md">
            {order.deliveryType === 'delivery' ? (
              <>
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" /> 
                <span className="font-bold">Envío:</span> 
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{order.customer.address}</span>
              </>
            ) : (
              <>
                <Store className="w-3.5 h-3.5 text-blue-500 shrink-0" /> 
                <span className="font-bold">Retiro por el local</span>
              </>
            )}
          </div>
        </div>

        {/* Hora arrinconada arriba a la derecha */}
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-[10px] md:text-xs font-bold text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      {/* 2. EL CORAZÓN DE LA COMANDA: QUÉ COCINAR */}
      <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-2.5 md:p-3">
        <ul className="list-none space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex flex-col">
              {/* Producto principal */}
              <div className="font-black text-gray-900 text-sm md:text-base">
                <span className="text-primary mr-1.5">{item.quantity}x</span>
                {item.title}
              </div>
              
              {/* Adicionales */}
              {item.addons && item.addons.length > 0 && (
                <div className="pl-5 mt-0.5 space-y-0.5">
                  {item.addons.map((addon, aIdx) => (
                    <div key={aIdx} className="text-gray-600 font-bold text-[11px] md:text-xs flex items-center gap-1">
                      <span className="text-orange-400">+</span>
                      <span>{addon.quantity}x {addon.title || 'Adicional'}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. FOOTER: PLATA Y ESTADO */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-1 gap-3 sm:gap-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-black text-gray-900">${order.total.toLocaleString('es-AR')}</span>
            
            {order.couponCode && (
              <span className="flex items-center gap-1 text-[10px] md:text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">
                <Ticket className="w-3 h-3" />
                {order.couponCode}
              </span>
            )}
          </div>
          
          <span className="text-xs text-gray-500 flex items-center gap-1 font-bold uppercase tracking-wider">
            {order.paymentMethod === 'Efectivo' ? <Banknote className="w-3.5 h-3.5 text-green-600"/> : <CreditCard className="w-3.5 h-3.5 text-blue-600"/>}
            {order.paymentMethod}
          </span>
        </div>

        {/* Select de estado */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          <select 
            value={order.status}
            onChange={(e) => updateOrderStatus(orderId, e.target.value as Order['status'])}
            className={`w-full sm:w-auto text-[11px] md:text-xs font-bold px-2 py-1.5 md:px-3 rounded-lg border-2 appearance-none outline-none cursor-pointer transition-colors ${STATUS_COLORS[order.status]}`}
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