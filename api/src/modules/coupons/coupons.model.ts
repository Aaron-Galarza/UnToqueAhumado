import mongoose, { Schema, Document } from 'mongoose'

export interface iCoupon extends Document {
  code: string
  Percent: number
}

const CouponSchema = new Schema<iCoupon>({
  code: {
    type: String,
    required: [true, 'El codigo del cupon es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true  // siempre se guarda en mayúsculas
  },
  Percent: {
    type: Number,
    required: [true, 'El porcentaje es obligatorio'],
    min: [1, 'El porcentaje debe ser mayor a 0']
  }
}, { timestamps: true })

export const CouponModel = mongoose.model<iCoupon>('Coupon', CouponSchema)
