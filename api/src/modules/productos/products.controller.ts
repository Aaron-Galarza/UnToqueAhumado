import { Request, Response } from 'express'
import * as ProductService from './products.service'
import { sendError, sendSucces } from '../../utils/response'

// Controlador para obtener todos los productos (adminin)
export const getProducts = async (req: Request, res: Response) => { 

    try {
        const products = ProductService.viewAll()
        return sendSucces(res, products) // <<---Si funciona tira los todos los productos
    } catch (error) {
        return sendError(res, 'Error al obtener los productos', 500)
    }
}

//controlador para obtener todo los productos ACTIVOS (publico)
export const getActiveProducts = async (req: Request, res: Response) => {
    try {
        const productos = ProductService.viewActive()
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

        const newProduct = ProductService.create(req.body)
        return sendSucces(res, newProduct, 201)
    } catch (error) {
        return sendError(res, 'Error al cargar el producto', 500)
    }

}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) return sendError(res, 'Se necesita un id para actualizar un producto')
    
        const update = ProductService.modify(id as string, req.body)

        return sendSucces(res, update, 200)
    } catch (error) {
        sendError(res, 'Error al actualizar el producto')
    }
}

export const activeStatusProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = ProductService.toggleActive(id as string)
        return sendSucces(res, product, 200)
    } catch (error) {
        return sendError(res, 'Error al activar / desactivar producto')
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = ProductService.deleteById(id as string)
        return sendSucces(res, result)
    } catch (error) {
        return sendError(res, 'Error al borrar producto')
    }
}