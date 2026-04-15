import { Request, Response } from 'express'
import * as ProductService from './products.service'

export const getProducts = async (req: Request, res: Response) => {

    try {
        const products = ProductService.getAllProducts()
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos'
        })
    }
}