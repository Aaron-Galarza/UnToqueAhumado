import { ExtraOption } from "../types/cart";

export const CART_EXTRAS: ExtraOption[] = [
  { id: 'carne',  label: 'Carne extra',  price: 2500 },
  { id: 'bacon',  label: 'Bacon extra',  price: 1800 },
  { id: 'huevo',  label: 'Huevo extra',  price: 1200 },
  { id: 'papas',  label: 'Con papas',    price: 2000 },
];


export const canHaveExtras = (category: string) => {
  return category === 'Hamburguesas Artesanales';
};
