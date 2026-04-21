"use client";

import { Search } from "lucide-react";

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function MenuSearch({ searchTerm, onSearchChange }: MenuSearchProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-4 mb-4 border border-border">
      {/* Etiqueta de abierto */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">Abierto ahora</span>
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
          Cierra 23:00hs
        </span>
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
