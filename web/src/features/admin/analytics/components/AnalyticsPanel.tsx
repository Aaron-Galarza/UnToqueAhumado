"use client";

import React, { useState } from 'react';
import { DollarSign, Banknote, CreditCard, ShoppingBag, Award } from 'lucide-react';

type FilterType = 'hoy' | 'semana' | 'mes';

// Usamos tus datos de prueba (El día de mañana esto se puede calcular leyendo Zustand o el Backend real)
const mockStats = {
  hoy: { total: 350000, efectivo: 120000, trans: 230000, entregados: 45, top: 'Doble Smash Clásica' },
  semana: { total: 2150000, efectivo: 850000, trans: 1300000, entregados: 312, top: 'Bacon Ahumada' },
  mes: { total: 8400000, efectivo: 3100000, trans: 5300000, entregados: 1240, top: 'Combo Doble Smash' }
};

export function AnalyticsPanel() {
  const [dateFilter, setDateFilter] = useState<FilterType>('hoy');
  
  // Obtenemos las estadísticas según lo que el usuario seleccionó
  const currentStats = mockStats[dateFilter];

  return (
    <div className="space-y-4">
      {/* Header con Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF9F5] p-4 rounded-xl border border-[#FFE8D9] shadow-sm">
        <h2 className="text-xl md:text-2xl text-gray-900 tracking-wide flex items-center gap-2 font-['Bebas_Neue']">
          <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-[#FF5500]" />
          Métricas de Negocio
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Filtrar por:</span>
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as FilterType)}
            className="w-full sm:w-auto bg-white border border-[#FFE8D9] text-gray-900 text-sm rounded-lg px-4 py-2 outline-none focus:border-[#FF5500] cursor-pointer"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Total */}
        <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-[#FF5500]/50 transition-colors">
          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Ventas Totales</p>
          <p className="text-2xl md:text-3xl text-gray-900 font-bold">${currentStats.total.toLocaleString('es-AR')}</p>
        </div>

        {/* Efectivo */}
        <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-green-500/50 transition-colors relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">En Efectivo</p>
            <p className="text-xl md:text-2xl text-green-600 font-bold">${currentStats.efectivo.toLocaleString('es-AR')}</p>
          </div>
          <Banknote className="w-12 h-12 md:w-16 md:h-16 text-green-500/10 absolute -right-2 -bottom-2" />
        </div>

        {/* Transferencia */}
        <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-blue-500/50 transition-colors relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Transferencia</p>
            <p className="text-xl md:text-2xl text-blue-600 font-bold">${currentStats.trans.toLocaleString('es-AR')}</p>
          </div>
          <CreditCard className="w-12 h-12 md:w-16 md:h-16 text-blue-500/10 absolute -right-2 -bottom-2" />
        </div>

        {/* Entregados */}
        <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-purple-500/50 transition-colors relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Entregados</p>
            <p className="text-2xl md:text-3xl text-gray-900 font-bold">{currentStats.entregados}</p>
          </div>
          <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-purple-500/10 absolute -right-2 -bottom-2" />
        </div>

        {/* Producto Estrella */}
        <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-yellow-500/50 transition-colors relative overflow-hidden sm:col-span-3 lg:col-span-1">
          <div className="relative z-10">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Producto Estrella</p>
            <p className="text-base md:text-lg text-yellow-600 font-bold leading-tight">{currentStats.top}</p>
          </div>
          <Award className="w-12 h-12 md:w-16 md:h-16 text-yellow-500/10 absolute -right-2 -bottom-2" />
        </div>

      </div>
    </div>
  );
}