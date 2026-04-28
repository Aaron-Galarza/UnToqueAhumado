"use client";

import { Search } from "lucide-react";

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: any; 
  isLoading: boolean; 
  isStoreOpen: boolean; // Recibimos el estado limpio
}

export function MenuSearch({ searchTerm, onSearchChange, status, isLoading, isStoreOpen }: MenuSearchProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-4 mb-4 border border-border">
      {/* Etiqueta de abierto/cerrado dinámica */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isStoreOpen ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            )}
          </span>
          <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">
            {isLoading ? 'Cargando...' : isStoreOpen ? 'Abierto ahora' : 'Cerrado ahora'}
          </span>
        </div>
        
        {!isLoading && status && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${isStoreOpen ? 'text-primary bg-primary/10 border-primary/20' : 'text-red-700 bg-red-50 border-red-200'}`}>
            {isStoreOpen && status.schedule ? `Cierra ${status.schedule.closeTime}hs` : status.message}
          </span>
        )}
      </div>

      {/* Input de búsqueda */}
      <div className="flex items-center gap-2 w-full bg-background border border-border hover:border-primary/50 rounded-xl px-4 py-3 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input 
          type="text" 
          placeholder="Buscar hamburguesas, promos..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground font-medium outline-none min-w-0"
        />
      </div>
    </div>
  );
}