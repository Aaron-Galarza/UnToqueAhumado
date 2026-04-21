import { Router } from "express";
import * as ProductController from './products.controller'

const router = Router()

router.get('/', ProductController.getActiveProducts)
router.get('/admin', ProductController.getProducts)
router.post('/admin', ProductController.createNewProduct)
router.put('/admin/:id', ProductController.updateProduct)
router.put('/admin/toggleActive/:id', ProductController.activeStatusProduct)
router.delete('/admin/:id', ProductController.deleteProduct)


export default router