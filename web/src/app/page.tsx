"use client";

import { useState } from 'react';
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
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { products, isLoading: isProductsLoading, error: productsError, retry: retryProducts } = useCatalog();
  const { status, isLoading: isStatusLoading, isStoreOpen, error: statusError, retry: retryStatus } = useStoreStatus();
  const { categories, isLoading: isCategoriesLoading, error: categoriesError, retry: retryCategories } = useCategories();

  const categoriesWithProducts = categories.filter((category) => products.some((product) => product.category === category.name));

  const effectiveCategory = activeCategory || categoriesWithProducts[0]?.name || '';

  const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredProducts = products.filter((p) => {
    const normalizedName = removeAccents((p.title || '').toLowerCase());
    const normalizedSearch = removeAccents(searchTerm.toLowerCase());
    return p.category === effectiveCategory && normalizedName.includes(normalizedSearch);
  });

  const isPageLoading = isProductsLoading || isCategoriesLoading;
  const pageError = productsError || categoriesError || statusError;

  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-9">
      <section className="w-full relative rounded-b-[2.5rem] shadow-md z-10 flex flex-col items-center justify-center pt-12 pb-16 bg-cover bg-center bg-[url('https://res.cloudinary.com/dwqxdensk/image/upload/v1777344079/Web_Photo_Editor_igrfxj.jpg')]">
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
        <p className="mt-3 font-bold tracking-[0.2em] uppercase text-xs text-orange-700">Burguers artesanales premium</p>
      </section>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 relative z-20 -mt-6">
        <MenuSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} status={status} isLoading={isStatusLoading} isStoreOpen={isStoreOpen} />

        {!!pageError && !isPageLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-red-700">No se pudo cargar la información.</p>
            <p className="text-xs text-red-600 mt-1">{pageError}</p>
            <button
              onClick={() => {
                retryProducts();
                retryCategories();
                retryStatus();
              }}
              className="mt-3 text-xs font-bold px-3 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-100 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        <CategorySelector
          categories={categoriesWithProducts}
          isLoading={isPageLoading}
          activeCategory={effectiveCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setSearchTerm('');
          }}
        />

        <div className="mt-8 mb-4 px-1">
          {!isPageLoading && !productsError && effectiveCategory !== '' && (
            <div className="bg-secondary px-4 py-3 border border-border rounded-xl flex items-center justify-between mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">{effectiveCategory}</h2>
                {effectiveCategory === 'Hamburguesas Artesanales' && (
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wide">(Salen con papas)</span>
                )}
              </div>
              <span className="bg-white text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#FFDAB9] shadow-sm">{filteredProducts.length}</span>
            </div>
          )}

          <ProductList products={filteredProducts} isLoading={isProductsLoading} error={productsError} onRetry={retryProducts} />

          {!isPageLoading && !productsError && filteredProducts.length === 0 && products.length > 0 && effectiveCategory !== '' && (
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
