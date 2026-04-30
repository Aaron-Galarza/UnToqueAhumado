import { z } from 'zod'

export const createProductSchema = z.object({
  title:       z.string().min(1, 'El nombre del producto es obligatorio'),
  price:       z.number({ message: 'El precio debe ser un número' })
                .min(0, 'El precio no puede ser negativo'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  category:    z.string().min(1, 'La categoría es obligatoria'),
  image:       z.string().optional()
})

export const updateProductSchema = createProductSchema.partial()
