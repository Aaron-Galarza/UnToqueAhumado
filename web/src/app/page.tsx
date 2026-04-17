import { Search } from 'lucide-react';

// 1. Importamos la "Bandeja" (El componente visual) y la "Comida" (Los datos)
import { FloatingCart } from '@/features/cart/components/FloatingCart';
import { ProductList } from '@/features/menu/components/ProductList';
import { mockProducts } from '@/features/menu/data/mockProducts';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-10">
      
      {/* HERO SECTION (Intacto) */}
  {/* HERO SECTION (Con fondo de hamburguesa) */}
      <section 
        className="w-full relative rounded-b-[2.5rem] shadow-md z-10 flex flex-col items-center justify-center pt-12 pb-16 bg-cover bg-center"
        style={{
          backgroundImage: ` url('https://lavozdelosbarrios.com/wp-content/uploads/2025/04/Milei-925x535.jpg')`
        }}
      >
        <div className="w-24 h-24 rounded-full border-[3px] border-white/90 bg-white shadow-xl flex items-center justify-center overflow-hidden mb-4">
          <img 
            src="https://res.cloudinary.com/dwqxdensk/image/upload/v1774491741/image_so7u3x.png" 
            alt="Un Toque Ahumado" 
            className="w-[85%] h-[85%] object-contain"
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
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 relative z-20" style={{ marginTop: -24 }}>
        
        {/* DASHBOARD CARD (Intacto) */}
        <div className="bg-card rounded-2xl shadow-sm p-4 mb-4 border border-border">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                Abierto ahora
              </span>
            </div>
            <span className="text-[10px] font-bold text-secondary-foreground bg-secondary px-2 py-1 rounded border border-border">
              Cierra 23:00hs
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Buscar hamburguesas, promos..." 
              className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground font-medium transition-all outline-none"
            />
          </div>
        </div>

        {/* 2. ACÁ OCURRE LA MAGIA: EL MENÚ DINÁMICO */}
        <div className="mt-8 mb-4 px-1">
          <h2 className="text-xl font-black text-foreground uppercase tracking-wider mb-4">
            Nuestro Menú
          </h2>
          {/* Le pasamos el array de mockProducts al ProductList */}
          <ProductList products={mockProducts} />
        </div>
<FloatingCart />
      </main>
    </div>
  );
}