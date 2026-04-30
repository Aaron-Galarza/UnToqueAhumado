import { z } from 'zod'

export const createAdicionalSchema = z.object({
  title:    z.string().min(1, 'El título del adicional es obligatorio'),
  price:    z.number({ message: 'El precio debe ser un número' })
              .min(0, 'El precio no puede ser negativo'),
  category: z.string().min(1, 'La categoría del adicional es obligatoria')
})

export const updateAdicionalSchema = createAdicionalSchema.partial()
