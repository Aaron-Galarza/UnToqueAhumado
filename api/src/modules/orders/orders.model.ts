import mongoose, { Schema, Document } from 'mongoose'

export type OrderStatus = 'pending' | 'in-preparation' | 'ready' | 'delivered'
export const validOrderStatus: OrderStatus[] = ['pending', 'in-preparation', 'ready', 'delivered']

export interface iCartItem {
  productId: string
  title: string
  price: number
  quantity: number
}

export interface iOrder extends Document {
  customer: {
    name: string
    phone: string
    address?: string
  }
  items: iCartItem[]
  couponCode?: string
  deliveryType: 'pickup' | 'delivery'
  total: number
  status: OrderStatus
}

// Subdocumento para cada item del carrito (sin _id propio)
const CartItemSchema = new Schema<iCartItem>({
  productId: { type: String, required: true },
  title:     { type: String, required: true },
  price:     { type: Number, required: true, min: 0 },
  quantity:  { type: Number, required: true, min: 1 }
}, { _id: false })

const OrderSchema = new Schema<iOrder>({
  customer: {
    name:    { type: String, required: [true, 'El nombre del cliente es obligatorio'] },
    phone:   { type: String, required: [true, 'El teléfono del cliente es obligatorio'] },
    address: { type: String }
  },
  items:        { type: [CartItemSchema], required: true },
  couponCode:   { type: String },
  deliveryType: { type: String, enum: ['pickup', 'delivery'], required: true },
  total:        { type: Number, required: true, min: 0 },
  status:       { type: String, enum: validOrderStatus, default: 'pending' }
}, { timestamps: true })

export const OrderModel = mongoose.model<iOrder>('Order', OrderSchema)
