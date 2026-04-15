import { Router } from "express";
import * as ProductController from './products.controller'

const router = Router()

router.get('/', ProductController.getProducts)

export default router