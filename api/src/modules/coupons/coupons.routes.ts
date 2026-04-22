// api\src\modules\coupons\coupons.routes.ts

import { Router } from 'express';
import { getAllCoupons, createNewCoupon, validateCoupon, deleteCoupon } from './coupons.controllers';
import { isAdmin } from '../../middlewares/auth.middleware';

const router = Router()

router.post('/validate/:code', validateCoupon)

router.get('/admin', isAdmin, getAllCoupons)
router.post('/admin', isAdmin, createNewCoupon)
router.delete('/admin/:id', isAdmin, deleteCoupon)

export default router