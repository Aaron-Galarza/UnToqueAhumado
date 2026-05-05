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
      className={`relative cursor-pointer overflow-hidden border-2 transition-colors duration-250 ${
        isExpanded ? "border-primary/35 shadow-md pt-0.5 pb-2 px-2.5" : "border-transparent hover:bg-muted/50 px-3.5 py-2.5"
      }`}
    >
      <div className={`grid [contain:layout_paint_style] ${isExpanded ? "gap-3" : "gap-0.5"}`}>
        <div
          className={`grid gap-3 transition-[grid-template-columns] duration-250 ease-out ${
            isExpanded ? "items-start grid-cols-[1fr_0fr]" : "items-center grid-cols-[1fr_6rem] md:grid-cols-[1fr_7rem]"
          }`}
        >
          <div className="min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-foreground text-[15px] md:text-base leading-tight mb-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <div
              className={`grid transition-[grid-template-rows,opacity,transform] duration-250 ease-out ${
                isExpanded ? "grid-rows-[0fr] opacity-0 -translate-y-1 mb-0" : "grid-rows-[1fr] opacity-100 translate-y-0 mb-2"
              }`}
            >
              <p className="overflow-hidden text-xs md:text-sm text-muted-foreground pr-2 font-medium line-clamp-2">
                {product.description}
              </p>
            </div>
            <span className="font-extrabold text-primary text-base md:text-lg tracking-tight">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>

          <div
            className={`relative overflow-visible transition-[opacity,transform] duration-250 ease-out ${
              isExpanded ? "opacity-0 scale-95 pointer-events-none h-0 w-0" : "opacity-100 scale-100 h-24 w-24 md:h-28 md:w-28"
            }`}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl shadow-sm border border-border group-hover:scale-105 transition-transform duration-250"
            />
            <div className="absolute -top-2 -right-2 z-10 bg-card border border-primary/25 rounded-full p-1 shadow-sm">
              <ChevronDown className="w-3 h-3 text-primary rotate-180" />
            </div>
            
            {/* BOTÓN CHICO: Salvado del recorte por 1 píxel */}
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              className="absolute bottom-0 right-[1px] z-20 h-[2.125rem] w-[2.125rem] flex items-center justify-center bg-card text-primary border-2 border-primary rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              title="Agregar al pedido"
              aria-label={`Agregar ${product.title} al pedido`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className={`absolute right-4 top-4 flex items-center gap-2 transition-[opacity,transform] duration-250 ${
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
          >
            <span className="hidden sm:inline-flex w-fit bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border border-border">
              {product.category?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-primary shrink-0 rotate-0" />
          </div>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,transform] duration-250 ease-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100 translate-y-0" : "grid-rows-[0fr] opacity-0 -translate-y-1"
          }`}
        >
          <div className="overflow-hidden">
            <span className="sm:hidden inline-flex w-fit bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border border-border mb-3">
              {product.category?.name}
            </span>

            <div className="relative w-[96%] mx-auto h-56 md:h-72 mb-8 [will-change:transform,opacity]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover rounded-xl shadow-sm border border-border"
              />
              
              {/* BOTÓN GRANDE: Salvado del recorte */}
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className="absolute bottom-2 right-[2px] z-20 bg-card text-primary border-2 border-primary rounded-full p-1.5 shadow-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
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
        </div>
      </div>
    </Card>
  );
}