import { z } from 'zod'

export const createCouponSchema = z.object({
  Code:    z.string().min(1, 'El código del cupón es obligatorio'),
  Percent: z.number({ message: 'El porcentaje debe ser un número' })
             .int()
             .min(1, 'El porcentaje mínimo es 1')
             .max(100, 'El porcentaje máximo es 100')
})
