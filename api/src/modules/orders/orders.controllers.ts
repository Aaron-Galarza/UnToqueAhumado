// api\src\modules\orders\orders.controllers.ts

import { Request, Response } from 'express';
import * as OrderService from './orders.service';
import * as CouponService from '../coupons/coupons.services'
import { validateCoupon } from '../coupons/coupons.controllers';
import { sendError, sendSucces } from '../../utils/response';
import { validOrderStatus, OrderStatus} from '../orders/orders.model'

// Controlador para crear pedido
export const createOrder = (req: Request, res: Response) => {
  try {
    const { customer, items, deliveryType, couponCode } = req.body;

    // Validaciones clasicas:

    if (!customer?.name || !customer?.phone) {
      return sendError(res, 'Nombre y teléfono del cliente son requeridos')
    }

    if (!items || items.length === 0) {
      return sendError(res, 'El carrito no puede estar vacío')
    }

    if (!deliveryType) {
      return sendError(res, 'Debes seleccionar el tipo de entrega (pickup o delivery)')
    }

    const order = OrderService.createOrder(req.body);
    return sendSucces(res, order, 201) // <<--- Si todo sale bien manda el pedido ggwp ez jg
  } catch (error) {
    return sendError(res, 'Error al procesar el pedido', 500)
  }
};

//Controlador para obtener todos los pedidos
export const getOrders = (req: Request, res: Response) => {
  try {
    const orders = OrderService.getAllOrders()
    return sendSucces(res, orders, 200)
  } catch (error) {
    sendError(res, 'Error al obtener pedidos', 500)
  }
};

export const updateStatusOrder = (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!validOrderStatus.includes(status as OrderStatus)) return sendError(res, 'Estado no valido para la orden')

    const order = OrderService.update(id as string, status)
    return sendSucces(res, order, 200)
    
  } catch (error) {
    sendError(res, 'Error al actualizar el estado de la orden')
  }
}