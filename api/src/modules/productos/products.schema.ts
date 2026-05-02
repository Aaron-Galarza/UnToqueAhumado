import { z } from 'zod'

export const createProductSchema = z.object({
  title:       z.string().min(1, 'El nombre del producto es obligatorio'),
  price:       z.number({ message: 'El precio debe ser un número' })
                .min(0, 'El precio no puede ser negativo'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  category:    z.string().regex(/^[a-f\d]{24}$/i, 'ID de categoría inválido'),
  image:       z.string().optional()
})

export const updateProductSchema = createProductSchema.partial()
