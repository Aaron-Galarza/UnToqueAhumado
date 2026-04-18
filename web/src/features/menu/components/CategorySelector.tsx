"use client";

import React from "react";

const BurgerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10.5C4 9.4 4.9 8.5 6 8.5H18C19.1 8.5 20 9.4 20 10.5V11.5H4V10.5Z" fill="currentColor"/>
    <path d="M3 13.5H21V14.5C21 15.05 20.55 15.5 20 15.5H4C3.45 15.5 3 15.05 3 14.5V13.5Z" fill="currentColor"/>
    <path d="M4 11.5H20V13.5H4V11.5Z" fill="currentColor" opacity="0.4"/>
    <ellipse cx="12" cy="8.5" rx="8" ry="2.5" fill="currentColor" opacity="0.6"/>
    <path d="M5 15.5H19L18.5 17.5C18.22 18.65 17.2 19.5 16 19.5H8C6.8 19.5 5.78 18.65 5.5 17.5L5 15.5Z" fill="currentColor"/>
    <path d="M5 8.5C5 6.84 8.13 5.5 12 5.5C15.87 5.5 19 6.84 19 8.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

const PromoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FriesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="2.5" height="10" rx="1.25" fill="currentColor"/>
    <rect x="10.75" y="8" width="2.5" height="12" rx="1.25" fill="currentColor"/>
    <rect x="15.5" y="10" width="2.5" height="10" rx="1.25" fill="currentColor"/>
    <path d="M5 10H19L18 20.5C17.9 21.3 17.2 22 16.4 22H7.6C6.8 22 6.1 21.3 6 20.5L5 10Z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <path d="M4 10H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 10L7 7M12 10L12 6.5M16 10L17 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M7 7C7 5.5 8.5 4.5 8.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M12 6.5C12 5 13.5 4 13.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M17 7C17 5.5 15.5 4.5 15.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const categories = [
  { name: "Promos", Icon: PromoIcon },
  { name: "Hamburguesas Artesanales", Icon: BurgerIcon }, 
  { name: "Acompañamientos", Icon: FriesIcon }
];

interface CategorySelectorProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({ activeCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    // ¡BOM! Un solo justify-center para que sea el rey de la simetría en cualquier celular.
    <div className="flex w-full overflow-x-auto scrollbar-hide gap-3 md:gap-6 snap-x pt-1 pb-4 px-4 justify-center">
      {categories.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelectCategory(c.name)}
          className={`snap-center flex flex-col items-center w-[84px] md:w-[100px] shrink-0 gap-2 transition-all duration-300 ${
            activeCategory === c.name ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-colors border shadow-sm ${
            activeCategory === c.name ? 'border-primary bg-background shadow-md' : 'border-border bg-card'
          }`}>
            <c.Icon className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          
          <span className="text-[10px] md:text-xs font-bold text-center leading-[1.1]">
            {c.name}
          </span>
        </button>
      ))}
    </div>
  );
}