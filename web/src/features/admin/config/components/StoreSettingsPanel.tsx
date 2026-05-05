"use client";

import { useState } from 'react';
import { AlertTriangle, Power, Check, X, ShieldAlert, Activity } from 'lucide-react';
import { useAdminConfig } from '../hooks/useAdminConfig';

export function StoreSettingsPanel() {
  const { isEmergencyClosed, isLoading, toggleEmergencyStatus } = useAdminConfig();
  
  // Estado para manejar la doble confirmación (UX segura)
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await toggleEmergencyStatus();
    setIsProcessing(false);
    setIsConfirming(false); // Reseteamos el estado visual
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Activity className="w-8 h-8 animate-spin text-primary" />
        <p className="font-bold tracking-widest uppercase">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto pt-4">
      {/* Centramos el título también para que acompañe el diseño */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <ShieldAlert className="w-7 h-7 text-primary" />
        <h2 className="text-2xl md:text-3xl text-foreground tracking-wide font-['Bebas_Neue']">
          Configuración del Negocio
        </h2>
      </div>

      {/* TARJETA DE CIERRE DE EMERGENCIA */}
      <div className={`relative overflow-hidden bg-card p-4 md:p-6 rounded-2xl border-2 shadow-sm transition-all duration-500 ${
        isEmergencyClosed ? 'border-red-500 shadow-red-500/20' : 'border-border'
      }`}>
        
        {/* Fondo de alerta si está cerrado */}
        {isEmergencyClosed && (
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-5 pointer-events-none">
            <AlertTriangle className="w-48 h-48 text-red-500" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-start gap-3 md:gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${isEmergencyClosed ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
              <Power className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-foreground">
                Botón de Pánico (Cierre Forzado)
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                Esta acción ignora los horarios normales. Si cerrás el local desde acá, los clientes no podrán hacer pedidos hasta que vuelvas a reanudar el servicio.
              </p>
            </div>
          </div>

          {/* ACÁ ESTÁ LA MAGIA RESPONSIVE: flex-col en celu, md:flex-row en PC */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-secondary/50 p-4 rounded-xl border border-border">
            
            <div className="flex-1 w-full">
              <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Estado Actual
              </span>
              {isEmergencyClosed ? (
                <span className="flex items-center gap-1.5 text-red-600 font-black text-sm md:text-base">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  CERRADO POR FUERZA MAYOR
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-green-600 font-black text-sm md:text-base">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  OPERANDO NORMALMENTE
                </span>
              )}
            </div>

            {/* ZONA DEL BOTÓN CON DOBLE CONFIRMACIÓN */}
            <div className="shrink-0 w-full md:w-auto">
              {!isConfirming ? (
                <button
                  onClick={() => setIsConfirming(true)}
                  className={`w-full md:w-auto px-4 py-3 md:py-2.5 rounded-lg font-bold text-sm shadow-sm transition-transform active:scale-95 ${
                    isEmergencyClosed 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isEmergencyClosed ? 'Reanudar Servicio' : 'Cerrar Local'}
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Ocultamos el "¿Seguro?" en celular para ahorrar espacio valioso */}
                  <span className="hidden md:inline-block text-xs font-bold text-foreground mr-1">
                    ¿Seguro?
                  </span>
                  
                  {/* En celular, estos botones toman flex-1 para dividirse el 50% de la pantalla cada uno */}
                  <button
                    onClick={() => setIsConfirming(false)}
                    disabled={isProcessing}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-muted hover:bg-muted/80 text-foreground px-3 py-3 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4 shrink-0" /> Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-3 md:py-2 rounded-lg text-xs md:text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-50 ${
                      isEmergencyClosed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isProcessing ? (
                      <Activity className="w-4 h-4 animate-spin shrink-0" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 shrink-0" /> Confirmar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}