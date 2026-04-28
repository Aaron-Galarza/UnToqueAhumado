"use client";

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { useCatalog } from '@/features/menu/hooks/useCatalog';
import { useStoreStatus } from '@/stores/useStoreStatus';
import { useCategories } from '@/features/menu/hooks/useCategories';

import { FloatingCart } from '@/features/cart/components/FloatingCart';
import { ProductList } from '@/features/menu/components/ProductList';
import { CategorySelector } from '@/features/menu/components/CategorySelector';
import { MenuSearch } from '@/features/menu/components/MenuSearch';
import { StoreInfo } from '@/components/ui/StoreInfo';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { products, isLoading: isProductsLoading, error } = useCatalog();
  const { status, isLoading: isStatusLoading, isStoreOpen } = useStoreStatus();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  // 1. MAGIA PURA: Filtramos las categorías para que solo queden las que tienen productos
  const categoriesWithProducts = categories.filter(category => 
    products.some(product => product.category === category.name)
  );

  // 2. EFECTO AUTO-SELECCIÓN (Ahora usa la lista limpia)
  useEffect(() => {
    // Solo marcamos una por defecto si ya cargaron ambas cosas y no hay ninguna seleccionada
    if (!isProductsLoading && !isCategoriesLoading && categoriesWithProducts.length > 0 && activeCategory === "") {
      setActiveCategory(categoriesWithProducts[0].name);
    }
  }, [categoriesWithProducts, activeCategory, isProductsLoading, isCategoriesLoading]);

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredProducts = products.filter(p => {
    const productName = p.title || "";
    const normalizedName = removeAccents(productName.toLowerCase());
    const normalizedSearch = removeAccents(searchTerm.toLowerCase());
    return p.category === activeCategory && normalizedName.includes(normalizedSearch);
  });

  // Consolidamos el estado de carga general
  const isPageLoading = isProductsLoading || isCategoriesLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-9">
      
      {/* HERO SECTION  */}
      <section
        className="w-full relative rounded-b-[2.5rem] shadow-md z-10 flex flex-col items-center justify-center pt-12 pb-16 bg-cover bg-center bg-[url('https://res.cloudinary.com/dwqxdensk/image/upload/v1777344079/Web_Photo_Editor_igrfxj.jpg')]"
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
        <p className="mt-3 font-bold tracking-[0.2em] uppercase text-xs text-orange-700">
          Burguers artesanales premium
        </p>
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 relative z-20 -mt-6">
        
        {/* BUSCADOR MODULAR */}
        <MenuSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          status={status}            
          isLoading={isStatusLoading}
          isStoreOpen={isStoreOpen}
        />

        {/* SELECTOR DE CATEGORÍAS */}
        <CategorySelector 
          categories={categoriesWithProducts} // Le pasamos la lista ya limpia
          isLoading={isPageLoading} // Pasamos el loading unificado
          activeCategory={activeCategory} 
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setSearchTerm("");
          }} 
        />

        {/* EL MENÚ DINÁMICO */}
        <div className="mt-8 mb-4 px-1">
          
          {/* BANNER DE CATEGORÍA */}
          {!isPageLoading && !error && activeCategory !== "" && (
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
          
          <ProductList 
            products={filteredProducts} 
            isLoading={isProductsLoading}
            error={error}
          />

          {!isPageLoading && !error && filteredProducts.length === 0 && products.length > 0 && activeCategory !== "" && (
            <div className="bg-card rounded-2xl border border-border text-center py-16 px-4 shadow-sm mt-4">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No encontramos productos con esa búsqueda.</p>
            </div>
          )}
        </div>

        <FloatingCart />
      </main>

      <StoreInfo />

    </div>
  );
}