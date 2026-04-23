"use client";

import { Store, Bike } from "lucide-react";

interface DeliverySelectorProps {
  deliveryType: 'pickup' | 'delivery';
  onSelect: (type: 'pickup' | 'delivery') => void;
}
// Nota: Si adentro del componente tenías un botón que decía onSelect('takeaway'), cambialo a onSelect('pickup').

export function DeliverySelector({ deliveryType, onSelect }: DeliverySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      
      {/* Botón Retiro por Local */}
      <button 
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
          deliveryType === 'pickup' 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
        }`} 
        onClick={() => onSelect('pickup')}
      >
        <Store className="w-6 h-6" /> 
        Retiro por local
      </button>

      {/* Botón Delivery */}
      <button 
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
          deliveryType === 'delivery' 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
        }`} 
        onClick={() => onSelect('delivery')}
      >
        <Bike className="w-6 h-6" /> 
        Delivery
      </button>

    </div>
  );
}
