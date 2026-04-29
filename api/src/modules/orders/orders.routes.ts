// api\src\modules\orders\orders.routes.ts 

import { Router } from 'express';
import * as OrderController from './orders.controllers';
import { isAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', OrderController.createOrder);
router.put('/admin/:id', isAdmin, OrderController.updateStatusOrder)
router.get('/admin', isAdmin, OrderController.getAllOrders);
router.get('/admin/range', isAdmin, OrderController.getOrdersRange);

export default router;