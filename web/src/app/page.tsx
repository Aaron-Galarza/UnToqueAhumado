import { Search, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative pb-10 font-['Montserrat']">
      
      {/* HERO SECTION (Fondo oscuro para contrastar) */}
      <section className="w-full relative rounded-b-[2.5rem] shadow-md z-10 flex flex-col items-center justify-center bg-zinc-950 pt-12 pb-16">
        
        {/* Logo Circular (Test de bordes y sombras) */}
        <div className="w-24 h-24 rounded-full border-[3px] border-white/90 bg-white shadow-xl flex items-center justify-center overflow-hidden mb-4">
          <img 
            src="https://res.cloudinary.com/dwqxdensk/image/upload/v1774491741/image_so7u3x.png" 
            alt="Un Toque Ahumado" 
            className="w-[85%] h-[85%] object-contain"
          />
        </div>

        {/* Títulos (Test de color primario) */}
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
        
        {/* DASHBOARD CARD (Test de bg-card, border-border, y text-foreground) */}
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

          {/* INPUT (Test de inputs y anillos de focus) */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Buscar hamburguesas, promos..." 
              className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground font-medium transition-all outline-none"
            />
          </div>
        </div>

        {/* TARJETA DE PRUEBA (Para ver cómo queda una burger) */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex gap-4 mt-6">
           <div className="flex-1 flex flex-col justify-center">
             <h3 className="font-bold text-foreground text-base leading-tight mb-1">
               Doble Smash Clásica
             </h3>
             <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
               Doble carne smash, queso cheddar, cebolla caramelizada, salsa especial.
             </p>
             <span className="font-extrabold text-primary text-lg">
               $10.900
             </span>
           </div>
           <div className="w-24 h-24 shrink-0 bg-secondary rounded-xl border border-border flex items-center justify-center text-muted-foreground">
             <MapPin size={24} opacity={0.5} />
           </div>
        </div>

      </main>
    </div>
  );
}