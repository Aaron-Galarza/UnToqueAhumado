import { Request, Response } from 'express'
import * as ProductService from './products.service'
import { sendError, sendSucces } from '../../utils/response'

// Controlador para obtener todos los productos (adminin)
export const getProducts = async (req: Request, res: Response) => { 

    try {
        const products = await ProductService.viewAll()
        return sendSucces(res, products) // <<---Si funciona tira los todos los productos
    } catch (error) {
        return sendError(res, 'Error al obtener los productos', 500)
    }
}

//controlador para obtener todo los productos ACTIVOS (publico)
export const getActiveProducts = async (req: Request, res: Response) => {
    try {
        const productos = await ProductService.viewActive()
        return sendSucces(res, productos)
    } catch (error) {
        return sendError(res, 'Error al obtener los productos', 500)
    }

}

//controlador para crear producto nuevo
export const createNewProduct = async (req: Request, res: Response) => {
    try {
        const {  title, price, description, image, category } = req.body

        // Validacion clasicas:
        if (!title) return sendError(res, 'Nombre del Producto es obligatorio')
        
        if (!category) return sendError(res, 'Categoria del Producto es obligatorio')
        
        if (!price) return sendError(res, 'Precio del Producto es obligatorio')

        if (!description) return sendError(res, 'Descripcion del Producto es obligatoria')

        const newProduct = await ProductService.create(req.body)
        return sendSucces(res, newProduct, 201)
    } catch (error) {
        return sendError(res, 'Error al cargar el producto', 500)
    }

}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) return sendError(res, 'Se necesita un id para actualizar un producto')

        const update = await ProductService.modify(id as string, req.body)

        // El service devuelve null si no existe el id
        if (!update) return sendError(res, 'Producto no encontrado', 404)

        return sendSucces(res, update, 200)
    } catch (error) {
        return sendError(res, 'Error al actualizar el producto', 500)
    }
}

export const activeStatusProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await ProductService.toggleActive(id as string)

        if (!product) return sendError(res, 'Producto no encontrado', 404)

        return sendSucces(res, product, 200)
    } catch (error) {
        return sendError(res, 'Error al activar / desactivar producto', 500)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await ProductService.deleteById(id as string)

        if (!result) return sendError(res, 'Producto no encontrado', 404)

        return sendSucces(res, result)
    } catch (error) {
        return sendError(res, 'Error al borrar producto', 500)
    }
}