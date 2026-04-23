import { Request, Response } from 'express'
import * as AdicionalService from './adicionales.service'
import { sendError, sendSucces } from '../../utils/response'

export const getAdicionales = async (req: Request, res: Response) => {
  try {
    const adicionales = await AdicionalService.viewAll()
    return sendSucces(res, adicionales)
  } catch (error) {
    return sendError(res, 'Error al obtener los adicionales', 500)
  }
}

export const getActiveAdicionales = async (req: Request, res: Response) => {
  try {
    const adicionales = await AdicionalService.viewActive()
    return sendSucces(res, adicionales)
  } catch (error) {
    return sendError(res, 'Error al obtener los adicionales', 500)
  }
}

export const createAdicional = async (req: Request, res: Response) => {
  try {
    const { title, price, category } = req.body

    if (!title)    return sendError(res, 'El título del adicional es obligatorio')
    if (!category) return sendError(res, 'La categoría del adicional es obligatoria')
    if (!price && price !== 0) return sendError(res, 'El precio del adicional es obligatorio')

    const adicional = await AdicionalService.create(req.body)
    return sendSucces(res, adicional, 201)
  } catch (error) {
    return sendError(res, 'Error al crear el adicional', 500)
  }
}

export const updateAdicional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const adicional = await AdicionalService.modify(id as string, req.body)

    if (!adicional) return sendError(res, 'Adicional no encontrado', 404)

    return sendSucces(res, adicional)
  } catch (error) {
    return sendError(res, 'Error al actualizar el adicional', 500)
  }
}

export const toggleActiveAdicional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const adicional = await AdicionalService.toggleActive(id as string)

    if (!adicional) return sendError(res, 'Adicional no encontrado', 404)

    return sendSucces(res, adicional)
  } catch (error) {
    return sendError(res, 'Error al activar / desactivar adicional', 500)
  }
}

export const deleteAdicional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await AdicionalService.deleteById(id as string)

    if (!result) return sendError(res, 'Adicional no encontrado', 404)

    return sendSucces(res, result)
  } catch (error) {
    return sendError(res, 'Error al eliminar el adicional', 500)
  }
}
