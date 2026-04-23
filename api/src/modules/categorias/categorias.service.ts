import { iCategoria, CategoriaModel } from './categorias.model'

export const viewAll = async (): Promise<iCategoria[]> => {
  return await CategoriaModel.find()
}

export const viewActive = async (): Promise<iCategoria[]> => {
  return await CategoriaModel.find({ active: true })
}

// Usada por products.controller para validar que la categoría existe y está activa
export const findByName = async (name: string): Promise<iCategoria | null> => {
  return await CategoriaModel.findOne({ name, active: true })
}

export const create = async (data: Partial<iCategoria>): Promise<iCategoria> => {
  const newCategoria = new CategoriaModel(data)
  return await newCategoria.save()
}

export const modify = async (id: string, data: Partial<iCategoria>): Promise<iCategoria | null> => {
  return await CategoriaModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
}

export const toggleActive = async (id: string): Promise<iCategoria | null> => {
  const categoria = await CategoriaModel.findById(id)
  if (!categoria) return null

  categoria.active = !categoria.active
  return await categoria.save()
}

export const deleteById = async (id: string): Promise<iCategoria | null> => {
  return await CategoriaModel.findByIdAndDelete(id)
}
