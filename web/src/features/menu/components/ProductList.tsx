"use client";

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function ProductList({ products, isLoading, error, onRetry }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm animate-pulse">
            <div className="h-4 w-2/3 bg-secondary rounded mb-3" />
            <div className="h-3 w-full bg-secondary rounded mb-2" />
            <div className="h-3 w-1/2 bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 text-center py-10 px-4 shadow-sm mt-4">
        <p className="text-sm font-bold text-red-600 mb-1">No se pudo cargar el menú.</p>
        <p className="text-xs text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-bold px-3 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-100 transition-colors"
          >
            Intentar nuevamente
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border text-center py-16 px-4 shadow-sm mt-4">
        <p className="text-sm font-semibold text-muted-foreground">No encontramos productos para mostrar en este momento.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
