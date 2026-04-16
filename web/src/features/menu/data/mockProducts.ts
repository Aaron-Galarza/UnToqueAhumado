import { Product } from "../types/product";

export const mockProducts: Product[] = [
  // --- HAMBURGUESAS SIMPLES ---
  {
    id: 1,
    title: "Bacon Burger",
    description: "Medallón de asado y roast beef ahumada. Salsa artesanal, pan de papa, panceta ahumada, cheddar, cebolla, relish.",
    price: 8400,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
    category: "Hamburguesas Artesanales",
    badge: "Viene con papas crinkles"
  },
  {
    id: 2,
    title: "Clásica Burger",
    description: "Medallón artesanal, salsa artesanal, pan artesanal, cheddar, tomate, lechuga, cebolla, relish de pepinillo.",
    price: 7900,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    category: "Hamburguesas Artesanales",
    badge: "Viene con papas crinkles"
  },
  {
    id: 3,
    title: "CheeseBurger",
    description: "Medallón artesanal, salsa artesanal, pan artesanal, cheddar, cebolla, relish de pepinillo.",
    price: 7500,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    category: "Hamburguesas Artesanales",
    badge: "Viene con papas crinkles"
  },

  // --- HAMBURGUESAS 2.0 (DOBLES) ---
  {
    id: 4,
    title: "Bacon Burger 2.0",
    description: "Doble medallón de asado y roast beef ahumada. Salsa artesanal, pan de papa, panceta ahumada, doble cheddar, cebolla, relish.",
    price: 10500,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    category: "Hamburguesas Artesanales",
    badge: "Viene con papas crinkles"
  },
  {
    id: 5,
    title: "Clásica Burger 2.0",
    description: "Doble medallón artesanal, salsa artesanal, pan artesanal, cheddar doble, tomate, lechuga, cebolla, relish.",
    price: 9500,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    category: "Hamburguesas Artesanales",
    badge: "Viene con papas crinkles"
  },
  {
    id: 6,
    title: "CheeseBurger 2.0",
    description: "Doble medallón artesanal, salsa artesanal, pan artesanal, cheddar doble, cebolla, relish. (La más pedida).",
    price: 9000,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    category: "Hamburguesas Artesanales",
    badge: "Viene con papas crinkles"
  },

  // --- PAPAS FRITAS ---
  {
    id: 7,
    title: "Papas Fritas Crinkles",
    description: "Bandeja de papas fritas crinkles 400gr, sazonado especial.",
    price: 6200,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    category: "Papas Fritas"
  },
  {
    id: 8,
    title: "Papas Fritas con Cheddar",
    description: "Bandeja de papas fritas crinkles 400gr bañadas en abundante cheddar.",
    price: 7200,
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    category: "Papas Fritas"
  },
  {
    id: 9,
    title: "Papas Fritas Cheddar & Bacon",
    description: "Bandeja de papas fritas crinkles 400gr con lluvia de cheddar y bacon crujiente.",
    price: 8200,
    image: "https://images.unsplash.com/photo-1629814545199-73dfdb5c7428?auto=format&fit=crop&w=800&q=80",
    category: "Papas Fritas"
  },

  // --- COMBOS BOX ---
  {
    id: 10,
    title: "Box Cheeseburger (Combo Dúo)",
    description: "Caja con 2 Cheeseburger Simples, Papas con Cheddar y 1 Dip a elección.",
    price: 14500,
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80",
    category: "Combos Box"
  },
  {
    id: 11,
    title: "Box Doble Brutal",
    description: "Caja con 2 Cheeseburger Dobles y Papas con Cheddar.",
    price: 16900,
    image: "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=800&q=80",
    category: "Combos Box"
  },
  {
    id: 12,
    title: "Box Doble Bacon",
    description: "Caja con 2 Bacon Burgers Dobles y Papas con Cheddar. (El más premium).",
    price: 20000,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    category: "Combos Box"
  }
];