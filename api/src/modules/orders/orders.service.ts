import { Order, OrderStatus } from './orders.model';
import * as CouponService from '../coupons/coupons.services';
import db from '../../data/data.json';

const orders: Order[] = db.orders.map(o => ({
  ...o,
  deliveryType: o.deliveryType as Order['deliveryType'],
  status: o.status as OrderStatus,
  createdAt: new Date(o.createdAt)
}));

export const createOrder = (orderData: any): Order => {
  
  let subTotal = 0

  orderData.items.forEach((item: any) => {
    subTotal += item.price * item.quantity
  });
  
  // cupones
  let Total = subTotal
  if (orderData.couponCode) {
    const coupon = CouponService.search(orderData.couponCode)
    if (!coupon) {

      throw new Error ('El cupon ingresado no es valido')
    } else {
      const discount = (subTotal * coupon.Percent) / 100
      Total = subTotal - discount
    }
  }


  const newOrder: Order = {
    id: `ORD-${Math.floor(Math.random() * 10000)}`,
    customer: orderData.customer,
    items: orderData.items,
    deliveryType: orderData.deliveryType,
    status: 'pending',
    createdAt: new Date(),
    couponCode: orderData.couponCode,
    total: Math.max(0, Total)
  };
  
  orders.push(newOrder);
  return newOrder;
};

export const getAllOrders = (): Order[] => {
  return orders;
};

// Servicio para Actualizar un producto (ADMIN)
export const update = (id: string, newStatus: OrderStatus): Order | null => {
  const index = orders.findIndex(p => p.id === id)
  if (index === -1) return null
  orders[index].status = newStatus

  return orders[index]
}

//export const