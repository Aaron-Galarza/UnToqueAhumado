import { Order, OrderStatus, CartItem } from './orders.model';
import * as CouponService from '../coupons/coupons.services';
import * as ProductService from '../productos/products.service';
import db from '../../data/data.json';

const orders: Order[] = db.orders.map(o => ({
  ...o,
  deliveryType: o.deliveryType as Order['deliveryType'],
  status: o.status as OrderStatus,
  createdAt: new Date(o.createdAt)
}));

export const createOrder = (orderData: any): Order => {

  // Snapshot de precios: se busca cada producto en el catálogo
  // para que el cliente no pueda mandar un precio manipulado
  const items: CartItem[] = orderData.items.map((item: any) => {
    const product = ProductService.viewById(item.productId)
    if (!product) throw new Error(`Producto ${item.productId} no encontrado`)

    return {
      productId: item.productId,
      title: product.title,
      price: product.price,   // precio real del catálogo, no el del cliente
      quantity: item.quantity
    }
  })

  const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Descuento por cupón
  let total = subTotal
  if (orderData.couponCode) {
    const coupon = CouponService.search(orderData.couponCode)
    if (!coupon) throw new Error('El cupon ingresado no es valido')

    const discount = (subTotal * coupon.Percent) / 100
    total = subTotal - discount
  }

  const newOrder: Order = {
    id: `ORD-${Math.floor(Math.random() * 10000)}`,
    customer: orderData.customer,
    items,
    deliveryType: orderData.deliveryType,
    status: 'pending',
    createdAt: new Date(),
    couponCode: orderData.couponCode,
    total: Math.max(0, total)
  };

  orders.push(newOrder);
  console.log(`[PEDIDO] Nuevo pedido ${newOrder.id} - ${newOrder.customer.name} - $${newOrder.total}`)
  return newOrder;
};

export const getAllOrders = (): Order[] => {
  return orders;
};

export const update = (id: string, newStatus: OrderStatus): Order | null => {
  const index = orders.findIndex(p => p.id === id)
  if (index === -1) return null

  orders[index].status = newStatus
  console.log(`[PEDIDO] Pedido ${orders[index].id} actualizado a "${newStatus}"`)
  return orders[index]
}

//export const