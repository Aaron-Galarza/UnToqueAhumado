// api\src\modules\coupons\coupons.controllers.ts

import { sendError, sendSucces } from '../../utils/response'
import { Request, Response } from 'express'
import * as CouponsService from './coupons.services'

export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = CouponsService.viewAll()

        return sendSucces(res, coupons, 200)
    } catch (error) {
        return sendError(res, 'Error al cargar los cupones')
    }
}

export const createNewCoupon = async (req: Request, res: Response) => {
    try {
        const { Code, Percent } = req.body

        if (!Code || !Percent) return sendError(res, 'Faltan campos obligatorios (Code, Percent)')
        if (typeof Percent !== 'number' || Percent <= 0) return sendError(res, 'El procentaje tiene que se un numero entero positivo')

        const newCupon = CouponsService.create(req.body)

        return sendSucces(res, newCupon, 200)
    } catch (error) {
        return sendError(res, 'Error al crear el cupon')
    }
}

export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code } = req.params
        if (!code) return sendError(res, 'Se necesita un code para validar el cupon')
        
        const result = CouponsService.search(code as string)

        if (!result) return sendError(res, 'Cupon no valido, inexistente o expirado',200)
        
        return sendSucces(res, result)

    } catch (error) {
        return sendError(res, 'Error al validar cupon')
    }
}

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) return sendError(res, 'Se necesita un id para borrar un cupon')
        
        const result = CouponsService.deleteById(id as string)

        if (!result) return sendError(res, 'Cupon no borrado o encontrado',200)

        return sendSucces(res, result, 200)
    } catch (error) {
        return sendError(res, 'Error al borrar cupon')
    }
}