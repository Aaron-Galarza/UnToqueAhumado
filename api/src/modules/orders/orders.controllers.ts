import { Request, Response } from 'express'
import * as OrderService from './orders.service'
import { sendError, sendSucces } from '../../utils/response'
import { validOrderStatus, OrderStatus, validPaymentMethods, PaymentMethod } from './orders.model'

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer, items, deliveryType, paymentMethod } = req.body

    if (!customer?.name || !customer?.phone) {
      return sendError(res, 'Nombre y teléfono del cliente son requeridos')
    }

    if (!items || items.length === 0) {
      return sendError(res, 'El carrito no puede estar vacío')
    }

    // Cada item necesita productId y una cantidad válida
    const itemInvalido = items.some((item: any) => !item.productId || !item.quantity || item.quantity <= 0)
    if (itemInvalido) {
      return sendError(res, 'Cada item debe tener productId y quantity mayor a 0')
    }

    // Validar adicionales si vienen: addonId requerido, quantity entre 1 y 10
    for (const item of items) {
      if (item.addons && item.addons.length > 0) {
        const addonInvalido = item.addons.some(
          (a: any) => !a.addonId || !a.quantity || a.quantity <= 0 || a.quantity > 10
        )
        if (addonInvalido) {
          return sendError(res, 'Cada adicional debe tener addonId y quantity entre 1 y 10')
        }
      }
    }

    if (!deliveryType) {
      return sendError(res, 'Debes seleccionar el tipo de entrega (pickup o delivery)')
    }

    if (!validPaymentMethods.includes(paymentMethod as PaymentMethod)) {
      return sendError(res, 'Método de pago inválido. Opciones: Efectivo, Transferencia')
    }

    const order = await OrderService.createOrder(req.body)
    return sendSucces(res, order, 201)
  } catch (error: any) {
    // Errores de negocio lanzados desde el service (cupón inválido, producto inexistente, etc.)
    const esErrorDeNegocio = error?.message && !error.message.includes('Cannot')
    if (esErrorDeNegocio) return sendError(res, error.message, 400)

    console.error(`[ERROR] createOrder - ${error?.message}`)
    return sendError(res, 'Error al procesar el pedido', 500)
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders()
    return sendSucces(res, orders, 200)
  } catch (error: any) {
    console.error(`[ERROR] getOrders - ${error?.message}`)
    return sendError(res, 'Error al obtener pedidos', 500)
  }
}

export const updateStatusOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!validOrderStatus.includes(status as OrderStatus)) {
      return sendError(res, 'Estado no valido para la orden')
    }

    const order = await OrderService.update(id as string, status)

    if (!order) return sendError(res, 'Pedido no encontrado', 404)

    return sendSucces(res, order, 200)
  } catch (error: any) {
    console.error(`[ERROR] updateStatusOrder - ${error?.message}`)
    return sendError(res, 'Error al actualizar el estado de la orden', 500)
  }
}
