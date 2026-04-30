import { z } from 'zod'

export const createCategoriaSchema = z.object({
  name: z.string().min(1, 'El nombre de la categoría es obligatorio')
})

export const updateCategoriaSchema = createCategoriaSchema.partial()
