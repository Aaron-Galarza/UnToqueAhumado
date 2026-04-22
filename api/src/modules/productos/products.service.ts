import { iProducto, ProductModel } from './products.model'; // Importación limpia
// const products: Product[] = db.products as Product[];

// Servicio para obtener todos los productos (admin)
export const viewAll = async (): Promise<iProducto[]> => {
  return await ProductModel.find();
};

// Servicio para obtener todos los productos ACTIVOS (publico)
export const viewActive = async (): Promise<iProducto[]> => {
 return await ProductModel.find({ active: true })
}

// Servicio para obtener un producto por ID
export const viewById = async (id: string): Promise<iProducto | null> => {
  return await ProductModel.findById(id)
}

// Servicio para crear un nuevo producto (ADMIN)
export const create = async (data: Partial<iProducto>): Promise<iProducto> => {
  const newProduct = new ProductModel(data)
  return await newProduct.save()
}

// Servicio para Actualizar un producto (ADMIN)
export const modify = async (id: string, data: Partial<iProducto>): Promise<iProducto | null> => {
  return await ProductModel.findByIdAndUpdate(id,
    { $set: data },
    { new: true,
      runValidators: true
     }
  )
}

// Servicio para Activar/Desactivar un Producto
export const toggleActive = async (id: string): Promise<iProducto | null> => {
  const product = await ProductModel.findById(id)

  if (!product) return null

  product.active = !product.active 
  return await product.save()
}

// Servicio para eliminar un producto permanentemente
export const deleteById = async (id: string): Promise<iProducto | null> => {
  const results = ProductModel.findByIdAndDelete(id)
  return await results
}