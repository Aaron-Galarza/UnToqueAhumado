import { Router } from 'express'
import * as CategoriaController from './categorias.controller'
import { isAdmin } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', CategoriaController.getActiveCategorias)

router.get('/admin', isAdmin, CategoriaController.getCategorias)
router.post('/admin', isAdmin, CategoriaController.createCategoria)
router.put('/admin/:id', isAdmin, CategoriaController.updateCategoria)
router.put('/admin/toggleActive/:id', isAdmin, CategoriaController.toggleActiveCategoria)
router.delete('/admin/:id', isAdmin, CategoriaController.deleteCategoria)

export default router
