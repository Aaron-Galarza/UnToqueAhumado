import { z } from 'zod'

const CartAddonSchema = z.object({
  addonId:  z.string().min(1, 'El ID del adicional es requerido'),
  quantity: z.number({ message: 'La cantidad del adicional debe ser un número' })
             .int()
             .min(1, 'La cantidad del adicional debe ser al menos 1')
             .max(10, 'La cantidad del adicional no puede superar 10')
})

const CartItemSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  quantity:  z.number({ message: 'La cantidad debe ser un número' })
              .int()
              .min(1, 'La cantidad debe ser al menos 1'),
  addons:    z.array(CartAddonSchema).optional()
})

export const createOrderSchema = z.object({
  customer: z.object({
    name:    z.string().min(1, 'El nombre del cliente es obligatorio'),
    phone:   z.string().min(1, 'El teléfono del cliente es obligatorio'),
    address: z.string().optional()
  }),
  items:         z.array(CartItemSchema).min(1, 'El carrito no puede estar vacío'),
  deliveryType:  z.enum(['pickup', 'delivery'], {
    message: 'Tipo de entrega inválido. Opciones: pickup, delivery'
  }),
  paymentMethod: z.enum(['Efectivo', 'Transferencia'], {
    message: 'Método de pago inválido. Opciones: Efectivo, Transferencia'
  }),
  couponCode: z.string().optional()
})
