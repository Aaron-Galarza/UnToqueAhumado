import { Router } from 'express';
import * as OrderController from './orders.controllers';

const router = Router();

router.post('/newOrder', OrderController.createOrder);
router.get('/', OrderController.getOrders);

export default router;