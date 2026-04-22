// api\src\modules\coupons\coupons.services.ts

import { sendError } from '../../utils/response';
import { Product } from '../productos/products.model';
import { Coupons } from './coupons.model'

// Datos mock
const coupons: Coupons[] = [
  {
    id: '1',
    code: 'VERANO2026',
    Percent: 10 
  },
    {
    id: '2',
    code: 'SMASHTIKTOK',
    Percent: 30
  }
];

export const viewAll = (): Coupons[] => {
    return coupons
}

export const create = (Data: Omit<Coupons, 'id'>): Coupons => {
  const newCupon: Coupons = {
    ...Data,
    id: `ORD-${Math.floor(Math.random() * 10000)}`
  }
    
  coupons.push(newCupon)
  return newCupon
}

export const search = (Code: string): Coupons | undefined => {
  const coupon = coupons.find(c => c.code === Code)
  
  return coupon
}

export const deleteById = (id: string) => {
  const index = coupons.findIndex(c => c.id === id)
  coupons.splice(index, 1)
  return true
}