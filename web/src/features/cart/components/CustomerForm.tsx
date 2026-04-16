"use client";

import React from "react";
import { User, Phone, MapPin } from "lucide-react";

interface CustomerFormProps {
  deliveryType: 'takeaway' | 'delivery';
  // A futuro, cuando conectemos Zustand, le pasaremos los datos reales acá
}

export function CustomerForm({ deliveryType }: CustomerFormProps) {
  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-col gap-3">
      
      {/* Input: Nombre */}
      <div className="relative">
        <User className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Nombre y Apellido" 
          className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
        />
      </div>

      {/* Input: Teléfono */}
      <div className="relative">
        <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground" />
        <input 
          type="tel" 
          placeholder="Teléfono (Ej: 3624...)" 
          className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
        />
      </div>

      {/* Input: Dirección (¡Aparece solo si es delivery!) */}
      {deliveryType === 'delivery' && (
        <div className="relative animate-in fade-in duration-300">
          <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Dirección de envío (Calle y número)" 
            className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
          />
        </div>
      )}

    </div>
  );
}