"use client";

import { DollarSign, Banknote, CreditCard, ShoppingBag, Award, Loader2 } from 'lucide-react';
import { useAnalytics } from '../data/useAnalytics'; // <-- Asegurate de que la ruta coincida con tu carpeta

export function AnalyticsPanel() {
  // 1. Reemplazamos los mocks y el useState por nuestro Cerebro conectado al backend
  const { range, setRange, data, isLoading } = useAnalytics();

  return (
    <div className="space-y-4">
      {/* Header con Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF9F5] p-4 rounded-xl border border-[#FFE8D9] shadow-sm">
        <h2 className="text-xl md:text-2xl text-gray-900 tracking-wide flex items-center gap-2 font-['Bebas_Neue']">
          <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          Métricas de Negocio
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Filtrar por:</span>
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            disabled={isLoading} // Deshabilitamos si está cargando
            className="w-full sm:w-auto bg-white border border-[#FFE8D9] text-gray-900 text-sm rounded-lg px-4 py-2 outline-none focus:border-primary cursor-pointer disabled:opacity-50"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
          </select>
        </div>
      </div>

      {/* 2. Control de Carga: Skeletons o Spinner mientras esperamos al servidor */}
      {isLoading || !data ? (
        <div className="flex flex-col items-center justify-center h-40 bg-[#FFF9F5] rounded-xl border border-[#FFE8D9] text-gray-400 gap-3 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest">Calculando métricas...</p>
        </div>
      ) : (
        /* Tarjetas de KPIs (Tus tarjetas originales conectadas a 'data') */
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Total */}
          <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-primary/50 transition-colors">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Ventas Totales</p>
            <p className="text-2xl md:text-3xl text-gray-900 font-bold">${data.total.toLocaleString('es-AR')}</p>
          </div>

          {/* Efectivo */}
          <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-green-500/50 transition-colors relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">En Efectivo</p>
              <p className="text-xl md:text-2xl text-green-600 font-bold">${data.efectivo.toLocaleString('es-AR')}</p>
            </div>
            <Banknote className="w-12 h-12 md:w-16 md:h-16 text-green-500/10 absolute -right-2 -bottom-2" />
          </div>

          {/* Transferencia */}
          <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-blue-500/50 transition-colors relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Transferencia</p>
              <p className="text-xl md:text-2xl text-blue-600 font-bold">${data.trans.toLocaleString('es-AR')}</p>
            </div>
            <CreditCard className="w-12 h-12 md:w-16 md:h-16 text-blue-500/10 absolute -right-2 -bottom-2" />
          </div>

          {/* Entregados */}
          <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-purple-500/50 transition-colors relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Entregados</p>
              <p className="text-2xl md:text-3xl text-gray-900 font-bold">{data.entregados}</p>
            </div>
            <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-purple-500/10 absolute -right-2 -bottom-2" />
          </div>

          {/* Producto Estrella (Adaptado al objeto del Backend) */}
          <div className="bg-[#FFF9F5] rounded-xl p-5 border border-[#FFE8D9] shadow-sm hover:border-yellow-500/50 transition-colors relative overflow-hidden sm:col-span-3 lg:col-span-1">
            <div className="relative z-10">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Producto Estrella</p>
              {data.topProduct ? (
                <div className="flex flex-col">
                  <p className="text-base md:text-lg text-yellow-600 font-bold leading-tight truncate" title={data.topProduct.title}>
                    {data.topProduct.title}
                  </p>
                  <span className="text-[10px] text-yellow-700 mt-1 font-bold bg-yellow-100 w-fit px-1.5 py-0.5 rounded">
                    {data.topProduct.quantity} vendidos
                  </span>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-500">Sin ventas aún</p>
              )}
            </div>
            <Award className="w-12 h-12 md:w-16 md:h-16 text-yellow-500/10 absolute -right-2 -bottom-2" />
          </div>

        </div>
      )}
    </div>
  );
}