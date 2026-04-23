"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

// 1. Importamos el hook que se conecta al backend
import { useCatalog } from '@/features/menu/hooks/useCatalog';

// 2. Importamos tus componentes visuales
import { FloatingCart } from '@/features/cart/components/FloatingCart';
import { ProductList } from '@/features/menu/components/ProductList';
import { CategorySelector } from '@/features/menu/components/CategorySelector';
import { MenuSearch } from '@/features/menu/components/MenuSearch';

export default function Home() {
  // --- ESTADOS PARA FILTRAR ---
  const [activeCategory, setActiveCategory] = useState("Hamburguesas Artesanales");
  const [searchTerm, setSearchTerm] = useState("");


  const { products, isLoading, error } = useCatalog();

  // --- FUNCIÓN MÁGICA PARA LIMPIAR ACENTOS ---
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Ahora filtramos el array 'products' que nos devuelve la API, no el mock
  const filteredProducts = products.filter(p => {
    const productName = p.title || "";
    
    // Limpiamos el nombre del producto (minúsculas y sin acentos)
    const normalizedName = removeAccents(productName.toLowerCase());
    // Limpiamos lo que escribió el usuario (minúsculas y sin acentos)
    const normalizedSearch = removeAccents(searchTerm.toLowerCase());
    
    return p.category === activeCategory && normalizedName.includes(normalizedSearch);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-10">
      
      {/* HERO SECTION  */}
      <section
        className="w-full relative rounded-b-[2.5rem] shadow-md z-10 flex flex-col items-center justify-center pt-12 pb-16 bg-cover bg-center bg-[url('https://lavozdelosbarrios.com/wp-content/uploads/2025/04/Milei-925x535.jpg')]"
      >
        <div className="w-24 h-24 rounded-full border-[3px] border-white/90 bg-white shadow-xl flex items-center justify-center overflow-hidden mb-4">
          <img 
            src="https://res.cloudinary.com/dwqxdensk/image/upload/v1774491741/image_so7u3x.png" 
            alt="Un Toque Ahumado" 
            className="w-5/6 h-5/6 object-contain"
          />
        </div>
        <h1 className="text-center relative z-10 leading-none font-bold text-white tracking-widest text-4xl md:text-5xl">
          UN TOQUE <br />
          <span className="text-primary mt-1 block">AHUMADO</span>
        </h1>
        <p className="mt-3 font-bold tracking-[0.2em] uppercase text-xs text-orange-100">
          Burguers smash premium
        </p>
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 relative z-20 -mt-6">
        
        {/* BUSCADOR MODULAR */}
        <MenuSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {/* SELECTOR DE CATEGORÍAS */}
        <CategorySelector 
          activeCategory={activeCategory} 
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setSearchTerm(""); // Si cambia de categoría, le limpiamos lo que escribió
          }} 
        />

        {/* EL MENÚ DINÁMICO */}
        <div className="mt-8 mb-4 px-1">
          
          {/* BANNER DE CATEGORÍA ESTILO FIGMA */}
          {/* Ocultamos el banner si está cargando o si hay error, queda más limpio */}
          {!isLoading && !error && (
            <div className="bg-secondary px-4 py-3 border border-border rounded-xl flex items-center justify-between mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">
                  {activeCategory}
                </h2>
                {activeCategory === "Hamburguesas Artesanales" && (
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wide">
                    (Salen con papas)
                  </span>
                )}
              </div>
              <span className="bg-white text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#FFDAB9] shadow-sm">
                {filteredProducts.length}
              </span>
            </div>
          )}
          
          {/* Le pasamos los productos filtrados y los estados al ProductList */}
          <ProductList 
            products={filteredProducts} 
            isLoading={isLoading}
            error={error}
          />

          {/* Mensaje de error si la búsqueda no encuentra nada, SOLO si ya terminó de cargar */}
          {!isLoading && !error && filteredProducts.length === 0 && products.length > 0 && (
            <div className="bg-card rounded-2xl border border-border text-center py-16 px-4 shadow-sm mt-4">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No encontramos productos con esa búsqueda.</p>
            </div>
          )}
        </div>

        <FloatingCart />
      </main>
    </div>
  );
}