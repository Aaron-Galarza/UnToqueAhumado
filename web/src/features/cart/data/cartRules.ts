// src/features/cart/utils/cartRules.ts

export const canHaveExtras = (categoryName: string | undefined): boolean => {
  if (!categoryName) return false;

  const normalizedCategory = categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const keywords = ['hamburguesa', 'burger', 'smash', 'sanguche', 'sandwich'];

  return keywords.some(keyword => normalizedCategory.includes(keyword));
};