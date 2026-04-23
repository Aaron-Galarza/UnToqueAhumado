"use client";

// ¡OJO ACÁ! Fijate que ahora importamos Product de nuestro archivo central
import { Product } from "@/types"; 
import { ProductCard } from "./ProductCard";
import { useCatalog } from '@/features/menu/hooks/useCatalog';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean; // Le avisamos si tiene que mostrar el cartel de cargando
  error?: string | null; // Le avisamos si hubo un problema
}

export function ProductList({ products, isLoading, error }: ProductListProps) {
  
  // 1. ESTADO: CARGANDO (Mientras esperamos que Aaron responda)
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border text-center py-16 px-4 shadow-sm mt-4">
        <p className="text-sm font-bold text-[#FF5500] animate-pulse">
          Buscando el menú en la cocina...
        </p>
      </div>
    );
  }

  // 2. ESTADO: ERROR (Si el backend de Aaron está apagado o falla)
  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 text-center py-16 px-4 shadow-sm mt-4">
        <p className="text-sm font-bold text-red-600 mb-1">¡Ups! Tuvimos un problema</p>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  // 3. ESTADO: VACÍO (Si Aaron borró todas las hamburguesas de la base de datos)
  if (!products || products.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border text-center py-16 px-4 shadow-sm mt-4">
        <p className="text-sm font-semibold text-muted-foreground">
          No encontramos productos para mostrar en este momento.
        </p>
      </div>
    );
  }

  // 4. ESTADO: ÉXITO (Si todo salió bien, mapeamos las tarjetas)
  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}