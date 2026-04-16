"use client";

import React from "react";
import { Store, Bike } from "lucide-react";

interface DeliverySelectorProps {
  deliveryType: 'takeaway' | 'delivery'; 
  onSelect: (type: 'takeaway' | 'delivery') => void; 
}

export function DeliverySelector({ deliveryType, onSelect }: DeliverySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      
      {/* Botón Retiro por Local */}
      <button 
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
          deliveryType === 'takeaway' 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border bg-card text-muted-foreground hover:border-primary/50'
        }`} 
        onClick={() => onSelect('takeaway')}
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