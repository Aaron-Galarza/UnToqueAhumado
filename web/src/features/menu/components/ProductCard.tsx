"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "../types/product";
import { useCartStore } from '@/stores/cartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // Aaron: este payload es el "contrato" con el carrito. Si el backend manda otra estructura, conviene adaptarla antes de llegar acá.
    // Armamos el "paquete" con el formato exacto que pide el Carrito
    addItem({
      id: product.id,
      name: product.title, 
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1, 
      adicionales: {}, 
    });  

  };

  return (
    <Card className="flex flex-row justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group gap-4">
      
      {/* Lado Izquierdo: Info del Producto */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-bold text-foreground text-[15px] md:text-base leading-tight mb-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 pr-2 font-medium">
          {product.description}
        </p>
        <span className="font-extrabold text-primary text-base md:text-lg tracking-tight">
          ${product.price.toLocaleString('es-AR')}
        </span>
      </div>

      {/* Lado Derecho: Imagen y Botón */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover rounded-xl shadow-sm border border-border group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Botón "+" (¡Ahora SÍ funciona y está conectado al cerebro!) */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // 1. Evita que el clic se propague al resto de la tarjeta
            handleAddToCart();   // 2. Manda la hamburguesa a Zustand
          }}
          className="absolute -bottom-2 -right-2 bg-card text-primary border-2 border-primary rounded-full p-1.5 shadow-md hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
          title="Agregar al pedido"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

    </Card>
  );
}
