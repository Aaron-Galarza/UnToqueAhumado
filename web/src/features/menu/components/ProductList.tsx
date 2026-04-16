"use client";
import React from "react";
import { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  // Si por algún motivo nos pasan un array vacío (ej: se filtró mal), mostramos un mensaje amigable
  if (!products || products.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border text-center py-16 px-4 shadow-sm mt-4">
        <p className="text-sm font-semibold text-muted-foreground">
          No encontramos productos para mostrar.
        </p>
      </div>
    );
  }

  return (
    // Un contenedor flexible tipo columna con una separación (gap) perfecta entre cada tarjeta
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}