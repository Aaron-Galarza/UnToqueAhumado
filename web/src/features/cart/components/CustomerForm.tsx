"use client";

import { User, Phone, MapPin } from "lucide-react";

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
}

interface CustomerFormProps {
  deliveryType: 'pickup' | 'delivery';
  data: { name: string; phone: string; address: string };
  onChange: (field: any, value: string) => void;
  errors: { name: string; phone: string; address: string };
}

export function CustomerForm({ deliveryType, data, onChange, errors }: CustomerFormProps) {
  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-col gap-4">
      
      {/* Input: Nombre */}
      <div>
        <div className="relative">
          <User className={`absolute left-3.5 top-3.5 w-5 h-5 ${errors.name ? 'text-red-500' : 'text-muted-foreground'}`} />
          <input 
            type="text" 
            placeholder="Nombre y Apellido" 
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className={`w-full bg-background border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-foreground outline-none transition-all ${
              errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
            }`} 
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 animate-in fade-in">{errors.name}</p>}
      </div>

      {/* Input: Teléfono */}
      <div>
        <div className="relative">
          <Phone className={`absolute left-3.5 top-3.5 w-5 h-5 ${errors.phone ? 'text-red-500' : 'text-muted-foreground'}`} />
          <input 
            type="tel" 
            placeholder="Teléfono (Ej: 3624...)" 
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={`w-full bg-background border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-foreground outline-none transition-all ${
              errors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
            }`} 
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 animate-in fade-in">{errors.phone}</p>}
      </div>

      {/* Input: Dirección (Solo delivery) */}
      {deliveryType === 'delivery' && (
        <div className="animate-in fade-in duration-300">
          <div className="relative">
            <MapPin className={`absolute left-3.5 top-3.5 w-5 h-5 ${errors.address ? 'text-red-500' : 'text-muted-foreground'}`} />
            <input 
              type="text" 
              placeholder="Dirección de envío (Calle y número)" 
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              className={`w-full bg-background border rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-foreground outline-none transition-all ${
                errors.address ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
              }`} 
            />
          </div>
          {errors.address && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 animate-in fade-in">{errors.address}</p>}
        </div>
      )}

    </div>
  );
}
