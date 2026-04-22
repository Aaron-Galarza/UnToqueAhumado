import { Coupons } from './coupons.model';
import db from '../../data/data.json';

const coupons: Coupons[] = db.coupons as Coupons[];

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