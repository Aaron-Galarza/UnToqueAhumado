import { Clock, MapPin, MessageCircle } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export function StoreInfo() {
  // Aumentamos el max-w, sumamos margen top y sacamos el margen bottom
  return (
    <section className="pt-8 pb-0 relative z-10 w-full max-w-[850px] mx-auto px-4 mt-10 mb-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

        {/* Horario */}
        <div className="flex items-center gap-2.5 bg-card p-2.5 md:p-3 rounded-2xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary transition-colors shrink-0">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Horario</span>
            <span className="text-[10px] md:text-xs text-foreground font-black leading-tight">Mar-Dom<br/>18 a 23h</span>
          </div>
        </div>

        {/* Retiro */}
        <div className="flex items-center gap-2.5 bg-card p-2.5 md:p-3 rounded-2xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary transition-colors shrink-0">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Retiro</span>
            <span className="text-[10px] md:text-xs text-foreground font-black leading-tight">Mac Lean<br/>3500</span>
          </div>
        </div>

        {/* WhatsApp */}
        <a href="https://wa.me/+5493624522876" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2.5 bg-card p-2.5 md:p-3 rounded-2xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all group cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary transition-colors shrink-0">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">WhatsApp</span>
            <span className="text-[10px] md:text-xs text-foreground font-black leading-tight">362 452-<br/>2876</span>
          </div>
        </a>

        {/* Instagram */}
        <a href="https://www.instagram.com/untoqueahumado_/" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2.5 bg-card p-2.5 md:p-3 rounded-2xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all group cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary transition-colors shrink-0">
            <InstagramIcon className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Instagram</span>
            <span className="text-[10px] md:text-xs text-foreground font-black leading-tight">@untoque<br/>ahumado_</span>
          </div>
        </a>

      </div>
    </section>
  );
}