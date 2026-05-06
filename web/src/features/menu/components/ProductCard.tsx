"use client";
import { useState, memo } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/index";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: Product;
}

// Mantenemos memo para blindar el rendimiento
export const ProductCard = memo(({ product }: ProductCardProps) => {
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

  // 👇 EL BISTURÍ MÁGICO: Interceptamos y achicamos la imagen a 600px
  const optimizedImage = product.image ? product.image.replace('/upload/', '/upload/w_900/') : '';

  return (
    <Card
      onClick={toggleExpanded}
      // transform-gpu sigue acá para salvar a Samsung Internet
      className={`relative cursor-pointer overflow-hidden border-2 transition-all duration-200 transform-gpu ${
        isExpanded ? "border-primary/35 shadow-lg scale-[1.01]" : "border-transparent hover:bg-muted/50"
      }`}
    >
      <div className="p-4 touch-manipulation">
        {isExpanded ? (
          /* VISTA EXPANDIDA - Imagen más alta */
          <div className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-[15px] leading-tight pt-0.5">{product.title}</h3>
              <span className="font-extrabold text-primary text-base">${product.price.toLocaleString("es-AR")}</span>
            </div>
            
            {/* 👇 ACÁ ESTÁ EL CAMBIO (h-80) 👇 */}
            <div className="relative w-full h-80 mb-4">
              <img
                src={optimizedImage} // <-- Usamos la imagen optimizada
                alt={product.title}
                loading="eager"
                decoding="sync"
                className="w-full h-full object-cover object-[70%_center] md:object-center rounded-xl border border-border/50"
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className="absolute bottom-3 right-3 bg-card text-primary border-2 border-primary rounded-full p-2 z-10 shadow-md active:scale-90 transition-transform"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium pr-1">{product.description}</p>
          </div>
        ) : (
          /* VISTA CONTRAÍDA - Imagen un poco más grande */
          <div className="flex flex-row justify-between items-center gap-4 animate-in fade-in duration-150">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[15px] truncate mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 pr-1">{product.description}</p>
              <span className="font-extrabold text-primary">${product.price.toLocaleString("es-AR")}</span>
            </div>

            {/* 👇 ACÁ ESTÁ EL CAMBIO (w-28 h-28) 👇 */}
            <div className="relative w-28 h-28 shrink-0">
              <img
                src={optimizedImage} // <-- Usamos la imagen optimizada
                alt={product.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover rounded-xl border border-border/50"
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className="absolute -bottom-1 -right-1 h-8 w-8 flex items-center justify-center bg-card text-primary border-2 border-primary rounded-full shadow-sm active:scale-90 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";