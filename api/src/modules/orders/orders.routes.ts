import { Router } from 'express';
import * as OrderController from './orders.controllers';

const router = Router();

router.post('/newOrder', OrderController.createOrder);
router.put('/admin/:id', OrderController.updateStatusOrder)
router.get('/admin', OrderController.getOrders);

export default router;