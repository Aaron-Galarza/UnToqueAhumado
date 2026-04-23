import { Router } from 'express'
import * as AdicionalController from './adicionales.controller'
import { isAdmin } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', AdicionalController.getActiveAdicionales)

router.get('/admin', isAdmin, AdicionalController.getAdicionales)
router.post('/admin', isAdmin, AdicionalController.createAdicional)
router.put('/admin/:id', isAdmin, AdicionalController.updateAdicional)
router.put('/admin/toggleActive/:id', isAdmin, AdicionalController.toggleActiveAdicional)
router.delete('/admin/:id', isAdmin, AdicionalController.deleteAdicional)

export default router
