import { Request, Response } from 'express';
import * as OrderService from './orders.service';
import { sendError, sendSucces } from '../../utils/response';
import { validOrderStatus, OrderStatus} from '../orders/orders.model'

export const createOrder = (req: Request, res: Response) => {
  try {
    const { customer, items, deliveryType } = req.body;

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

    if (!deliveryType) {
      return sendError(res, 'Debes seleccionar el tipo de entrega (pickup o delivery)')
    }

    const order = OrderService.createOrder(req.body);
    return sendSucces(res, order, 201)
  } catch (error: any) {
    // Errores conocidos del service (ej: cupón inválido, producto inexistente)
    const esErrorDeNegocio = error?.message && !error.message.includes('Cannot')
    if (esErrorDeNegocio) return sendError(res, error.message, 400)

    console.error(`[ERROR] createOrder - ${error?.message}`)
    return sendError(res, 'Error al procesar el pedido', 500)
  }
};

export const getOrders = (req: Request, res: Response) => {
  try {
    const orders = OrderService.getAllOrders()
    return sendSucces(res, orders, 200)
  } catch (error: any) {
    console.error(`[ERROR] getOrders - ${error?.message}`)
    return sendError(res, 'Error al obtener pedidos', 500)
  }
};

export const updateStatusOrder = (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!validOrderStatus.includes(status as OrderStatus)) {
      return sendError(res, 'Estado no valido para la orden')
    }

    const order = OrderService.update(id as string, status)

    // El service devuelve null si no existe el id
    if (!order) return sendError(res, 'Pedido no encontrado', 404)

    return sendSucces(res, order, 200)
  } catch (error: any) {
    console.error(`[ERROR] updateStatusOrder - ${error?.message}`)
    return sendError(res, 'Error al actualizar el estado de la orden', 500)
  }
}