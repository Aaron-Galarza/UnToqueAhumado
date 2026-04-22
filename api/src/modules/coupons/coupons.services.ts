import { iCoupon, CouponModel } from './coupons.model'

export const viewAll = async (): Promise<iCoupon[]> => {
  return await CouponModel.find()
}

export const create = async (data: Partial<iCoupon>): Promise<iCoupon> => {
  const newCoupon = new CouponModel(data)
  return await newCoupon.save()
}

// Busca por código (case-insensitive: convierte a mayúsculas antes de buscar)
export const search = async (code: string): Promise<iCoupon | null> => {
  return await CouponModel.findOne({ code: code.toUpperCase() })
}

export const deleteById = async (id: string): Promise<iCoupon | null> => {
  return await CouponModel.findByIdAndDelete(id)
}
