import { Request, Response } from 'express'
import { sendError, sendSucces } from '../../utils/response'
import * as CouponsService from './coupons.services'

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await CouponsService.viewAll()
    return sendSucces(res, coupons, 200)
  } catch (error) {
    return sendError(res, 'Error al cargar los cupones', 500)
  }
}

export const createNewCoupon = async (req: Request, res: Response) => {
  try {
    const { Code, Percent } = req.body
    const newCoupon = await CouponsService.create({ code: Code, Percent })
    return sendSucces(res, newCoupon, 201)
  } catch (error: any) {
    if (error?.code === 11000) return sendError(res, 'Ya existe un cupón con ese código', 409)
    return sendError(res, 'Error al crear el cupon', 500)
  }
}

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.params
    const result = await CouponsService.search(code as string)
    if (!result) return sendError(res, 'Cupon no valido, inexistente o expirado', 400)
    return sendSucces(res, result)
  } catch (error) {
    return sendError(res, 'Error al validar cupon', 500)
  }
}

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await CouponsService.deleteById(id as string)
    if (!result) return sendError(res, 'Cupon no encontrado', 404)
    return sendSucces(res, result, 200)
  } catch (error) {
    return sendError(res, 'Error al borrar cupon', 500)
  }
}
