import { iOrder, iCartItem, iCartAddon, OrderModel, OrderStatus } from './orders.model'
import * as CouponService from '../coupons/coupons.services'
import * as ProductService from '../productos/products.service'
import * as AdicionalService from '../adicionales/adicionales.service'
import { updateAnalyticsOnDelivery, revertAnalyticsOnDelivery } from '../analytics/analytics.service'
import { startOfWeek, startOfMonth, format, subDays } from 'date-fns';

export const createOrder = async (orderData: any): Promise<iOrder> => {

  const items: iCartItem[] = await Promise.all(
    orderData.items.map(async (item: any) => {

      // Snapshot del producto: precio real del catálogo
      const product = await ProductService.viewById(item.productId)
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`)

      // Snapshot de adicionales si vienen en el item
      let addons: iCartAddon[] = []
      if (item.addons && item.addons.length > 0) {
        addons = await Promise.all(
          item.addons.map(async (a: any) => {
            const adicional = await AdicionalService.viewById(a.addonId)
            if (!adicional) throw new Error(`Adicional ${a.addonId} no encontrado`)

            return {
              addonId:  a.addonId,
              title:    adicional.title,
              price:    adicional.price,  // precio real del catálogo
              quantity: a.quantity
            }
          })
        )
      }

      return {
        productId: item.productId,
        title:     product.title,
        price:     product.price,
        quantity:  item.quantity,
        addons
      }
    })
  )

  // Total: suma productos + adicionales de cada item
  const subTotal = items.reduce((acc, item) => {
    const itemTotal   = item.price * item.quantity
    const addonsTotal = (item.addons || []).reduce((a, addon) => a + addon.price * addon.quantity, 0)
    return acc + itemTotal + addonsTotal
  }, 0)

  let total = subTotal
  if (orderData.couponCode) {
    const coupon = await CouponService.search(orderData.couponCode)
    if (!coupon) throw new Error('El cupon ingresado no es valido')

    const discount = (subTotal * coupon.Percent) / 100
    total = subTotal - discount
  }

  const newOrder = new OrderModel({
    customer:      orderData.customer,
    items,
    deliveryType:  orderData.deliveryType,
    paymentMethod: orderData.paymentMethod,
    couponCode:    orderData.couponCode,
    total:         Math.max(0, total)
  })

  const saved = await newOrder.save()
  console.log(`[PEDIDO] Nuevo pedido ${saved._id} - ${saved.customer.name} - $${saved.total}`)
  return saved
}

export const getAllOrders = async (): Promise<iOrder[]> => {
  return await OrderModel.find().sort({ createdAt: -1 })
}

export const getOrdersRange = async (range: 'hoy' | 'ayer' | 'semana' | 'mes'): Promise<iOrder[] | null> => {

  const now = new Date();

  let startDate: Date;
  let endDate: Date | null = null;

  if (range === 'hoy') {
    startDate = new Date(format(now, 'yyyy-MM-dd') + 'T00:00:00.000Z');
  } else if (range === 'ayer') {
    const yesterday = subDays(now, 1);
    startDate = new Date(format(yesterday, 'yyyy-MM-dd') + 'T00:00:00.000Z');
    endDate   = new Date(format(now, 'yyyy-MM-dd') + 'T00:00:00.000Z');
  } else if (range === 'semana') {
    startDate = startOfWeek(now, { weekStartsOn: 1 });
  } else {
    startDate = startOfMonth(now);
  }

  const dateFilter: any = { $gte: startDate };
  if (endDate) dateFilter.$lt = endDate;

  const orders = await OrderModel.find({
    createdAt: dateFilter,
  }).lean().sort({ createdAt: -1 });

  return orders;
}

export const update = async (
  id: string,
  newStatus: OrderStatus
): Promise<iOrder | null> => {
  const oldOrder = await OrderModel.findById(id);
  if (!oldOrder) return null;
 
  const oldStatus = oldOrder.status;
 
  const updatedOrder = await OrderModel.findByIdAndUpdate(
    id,
    { status: newStatus },
    { returnDocument: 'after' }
  );
 
  if (!updatedOrder) return null;
 
  console.log(`[PEDIDO] Pedido ${updatedOrder._id} actualizado a "${newStatus}"`);
 
  // Pedido se entrega ahora → sumar a analytics
  if (oldStatus !== 'delivered' && newStatus === 'delivered') {
    await updateAnalyticsOnDelivery(updatedOrder);
  }
 
  // Pedido estaba entregado y se revierte → restar de analytics (con protección)
  if (oldStatus === 'delivered' && newStatus !== 'delivered') {
    await revertAnalyticsOnDelivery(updatedOrder);
  }
 
  return updatedOrder;
};