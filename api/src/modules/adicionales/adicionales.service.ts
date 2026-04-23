import { iAdicional, AdicionalModel } from './adicionales.model'

export const viewAll = async (): Promise<iAdicional[]> => {
  return await AdicionalModel.find()
}

export const viewActive = async (): Promise<iAdicional[]> => {
  return await AdicionalModel.find({ active: true })
}

export const viewById = async (id: string): Promise<iAdicional | null> => {
  return await AdicionalModel.findById(id)
}

export const create = async (data: Partial<iAdicional>): Promise<iAdicional> => {
  const newAdicional = new AdicionalModel(data)
  return await newAdicional.save()
}

export const modify = async (id: string, data: Partial<iAdicional>): Promise<iAdicional | null> => {
  return await AdicionalModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
}

export const toggleActive = async (id: string): Promise<iAdicional | null> => {
  const adicional = await AdicionalModel.findById(id)
  if (!adicional) return null

  adicional.active = !adicional.active
  return await adicional.save()
}

export const deleteById = async (id: string): Promise<iAdicional | null> => {
  return await AdicionalModel.findByIdAndDelete(id)
}
