import { iOrder, iCartItem, iCartAddon, OrderModel, OrderStatus } from './orders.model'
import * as CouponService from '../coupons/coupons.services'
import * as ProductService from '../productos/products.service'
import * as AdicionalService from '../adicionales/adicionales.service'

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

export const update = async (id: string, newStatus: OrderStatus): Promise<iOrder | null> => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  )

  if (order) {
    console.log(`[PEDIDO] Pedido ${order._id} actualizado a "${newStatus}"`)
  }

  return order
}
