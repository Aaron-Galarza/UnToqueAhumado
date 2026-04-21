import { Router } from "express";
import * as ProductController from './products.controller'

const router = Router()

router.get('/', ProductController.getActiveProducts)
router.get('/allProducts', ProductController.getProducts)
router.post('/newProduct', ProductController.createNewProduct)
router.put('/updateProduct/:id', ProductController.updateProduct)
router.put('/activeChangeProduct/:id', ProductController.activeStatusProduct)


export default router