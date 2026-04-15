import { Router } from 'express';
import * as OrderController from './orders.controllers';

const router = Router();

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);

export default router;