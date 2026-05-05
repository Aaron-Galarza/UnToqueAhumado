"use client";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/index";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      adicionales: {},
      category: product.category?.name,
    });
  };

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={toggleExpanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded();
        }
      }}
      className={`relative cursor-pointer overflow-hidden border-2 transition-all duration-150 active:scale-[0.98] touch-manipulation ${
        isExpanded ? "border-primary/35 shadow-md p-3 md:p-4" : "border-transparent hover:bg-muted/50 p-4"
      }`}
    >
      {isExpanded ? (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 ease-out">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-foreground text-[15px] md:text-base leading-tight pt-0.5">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex w-fit bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border border-border">
                {product.category?.name}
              </span>
              <span className="font-extrabold text-primary text-base md:text-lg tracking-tight">
                ${product.price.toLocaleString("es-AR")}
              </span>
              <ChevronDown className="w-4 h-4 text-primary shrink-0" />
            </div>
          </div>

          <span className="sm:hidden inline-flex w-fit bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border border-border mb-3">
            {product.category?.name}
          </span>

          <div className="relative w-full h-60 md:h-80 mb-8">
            <img
              src={product.image}
              alt={product.title}
              // FIX: Atributos correctos para carga rápida en etiqueta <img>
              loading="eager"
              decoding="sync"
              className="w-full h-full object-cover rounded-xl shadow-sm border border-border"
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              className="absolute bottom-3 right-3 z-20 bg-card text-primary border-2 border-primary rounded-full p-1.5 shadow-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              title="Agregar al pedido"
              aria-label={`Agregar ${product.title} al pedido`}
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed pr-2">
            {product.description}
          </p>
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-bottom-1 duration-150 ease-out">
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-foreground text-[15px] md:text-base leading-tight mb-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 pr-2 font-medium">
              {product.description}
            </p>
            <span className="font-extrabold text-primary text-base md:text-lg tracking-tight">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>

          <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
            <img
              src={product.image}
              alt={product.title}
              loading="eager"
              className="w-full h-full object-cover rounded-xl shadow-sm border border-border group-hover:scale-105 transition-transform duration-150"
            />
            <div className="absolute -top-2 -right-2 z-10 bg-card border border-primary/25 rounded-full p-1 shadow-sm">
              <ChevronDown className="w-3 h-3 text-primary rotate-180" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              className="absolute bottom-0 right-[1px] z-20 h-[2.125rem] w-[2.125rem] flex items-center justify-center bg-card text-primary border-2 border-primary rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              title="Agregar al pedido"
              aria-label={`Agregar ${product.title} al pedido`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}