import { iOrder, iCartItem, OrderModel, OrderStatus } from './orders.model'
import * as CouponService from '../coupons/coupons.services'
import * as ProductService from '../productos/products.service'

export const createOrder = async (orderData: any): Promise<iOrder> => {

  // Snapshot de precios: busca cada producto en la BD para que
  // el cliente no pueda mandar un precio manipulado
  const items: iCartItem[] = await Promise.all(
    orderData.items.map(async (item: any) => {
      const product = await ProductService.viewById(item.productId)
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`)

      return {
        productId: item.productId,
        title:     product.title,
        price:     product.price,  // precio real del catálogo
        quantity:  item.quantity
      }
    })
  )

  const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  let total = subTotal
  if (orderData.couponCode) {
    const coupon = await CouponService.search(orderData.couponCode)
    if (!coupon) throw new Error('El cupon ingresado no es valido')

    const discount = (subTotal * coupon.Percent) / 100
    total = subTotal - discount
  }

  const newOrder = new OrderModel({
    customer:     orderData.customer,
    items,
    deliveryType: orderData.deliveryType,
    couponCode:   orderData.couponCode,
    total:        Math.max(0, total)
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
