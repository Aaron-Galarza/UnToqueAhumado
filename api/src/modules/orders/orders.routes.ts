// api\src\modules\orders\orders.routes.ts 

import { Router } from 'express';
import * as OrderController from './orders.controllers';

const router = Router();

router.post('/', OrderController.createOrder);
router.put('/admin/:id', OrderController.updateStatusOrder)
router.get('/admin', OrderController.getOrders);

export default router;