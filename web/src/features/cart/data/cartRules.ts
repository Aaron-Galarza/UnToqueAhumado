// src/features/cart/utils/cartRules.ts

export const canHaveExtras = (category?: string) => {
  return category === 'Hamburguesas Artesanales';
};