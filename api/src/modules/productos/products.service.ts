import { Product } from './products.model';

// Datos mock (basados en tu descripción de Figma)
const products: Product[] = [
  {
    id: '1',
    title: 'Doble Smash Clásica',
    price: 10900,
    description: 'Doble carne, cheddar, cebolla caramelizada, salsa especial.',
    image: 'https://img.freepik.com/foto-gratis/hamburguesa-vista-frontal-soporte_23-2148784534.jpg',
    category: 'Smash Burgers'
  },
  {
    id: '2',
    title: 'Smash BBQ Ahumada',
    price: 14000,
    description: 'Carne ahumada, bacon, queso gouda, BBQ casera.',
    image: 'https://img.freepik.com/foto-gratis/sabrosa-hamburguesa-carne-queso-cebolla_23-2148835370.jpg',
    category: 'Smash Burgers'
  }
];

export const getAllProducts = (): Product[] => {
  return products;
};