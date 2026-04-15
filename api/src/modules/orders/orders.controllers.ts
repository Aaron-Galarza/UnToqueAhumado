import { Request, Response } from 'express';
import * as OrderService from './orders.service';

export const createOrder = (req: Request, res: Response) => {
  try {
    const { customer, items, deliveryType } = req.body;

    // Validación manual simple
    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ message: 'Nombre y teléfono del cliente son requeridos' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito no puede estar vacío' });
    }

    if (!deliveryType) {
      return res.status(400).json({ message: 'Debes seleccionar el tipo de entrega (pickup o delivery)' });
    }

    const order = OrderService.createOrder(req.body);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el pedido' });
  }
};

export const getOrders = (req: Request, res: Response) => {
  const orders = OrderService.getAllOrders();
  res.json(orders);
};