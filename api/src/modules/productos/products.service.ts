import { Product } from './products.model';

// Datos mock (basados en tu descripción de Figma)
const products: Product[] = [
  {
    id: '1',
    title: 'Doble Smash Clásica',
    price: 10900,
    description: 'Doble carne, cheddar, cebolla caramelizada, salsa especial.',
    image: 'https://img.freepik.com/foto-gratis/hamburguesa-vista-frontal-soporte_23-2148784534.jpg',
    category: 'Smash Burgers',
    active: true
  },
  {
    id: '2',
    title: 'Smash BBQ Ahumada',
    price: 14000,
    description: 'Carne ahumada, bacon, queso gouda, BBQ casera.',
    image: 'https://img.freepik.com/foto-gratis/sabrosa-hamburguesa-carne-queso-cebolla_23-2148835370.jpg',
    category: 'Smash Burgers',
    active: true
  },
    {
    id: '3',
    title: 'Papas Fritas',
    price: 9000,
    description: 'Papas Fritas de primera con salsa',
    image: 'https://img.freepik.com/foto-gratis/sabrosa-hamburguesa-carne-queso-cebolla_23-2148835370.jpg',
    category: 'Papas',
    active: false
  }
];

// Servicio para obtener todos los productos (admin)
export const getAllProducts = (): Product[] => {
  return products;
};

// Servicio para obtener todos los productos ACTIVOS (publico)
export const getActiveProducts = (): Product[] => {
 return products.filter(p => p.active)
}

// Servicio para obtener un producto por ID
export const getProductsByID = (id: string): Product | undefined => {
  return products.find(p => p.id === id)
}

// Servicio para crear un nuevo producto (ADMIN)
export const createProducto = (data: Omit<Product, 'id' | 'active'>): Product => {

  const newProduct: Product = {
    ...data,
    id: String(products.length + 1),
    active: true
  };

  products.push(newProduct)
  return newProduct
}

// Servicio para Actualizar un producto (ADMIN)
export const updateProducto = (id: string, data: Partial<Product>): Product | null => {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null

  const product = products[index]

  product.title = data.title || product.title
  product.description = data.description || product.description
  product.image = data.image || product.image
  product.category = data.category || product.category

  if (typeof data.price === 'number' && data.price >= 0 ) {
    product.price = data.price || product.price
  }
  
  products[index] = product
  return products[index]

}

// Servicio para Activar/Desactivar un Producto
export const activeStatusProduct = (id: string) => {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return null

  products[index].active = !products[index].active
  return products[index]

}