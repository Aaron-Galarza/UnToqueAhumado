import { Router } from 'express';
import { getAllCoupons, createNewCoupon, validateCoupon, deleteCoupon } from './coupons.controllers';
import { isAdmin } from '../../middlewares/auth.middleware';
import { couponLimiter } from '../../middlewares/rateLimiter.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCouponSchema } from './coupons.schema';

const router = Router()

router.post('/validate/:code', couponLimiter, validateCoupon)

router.get('/admin', isAdmin, getAllCoupons)
router.post('/admin', isAdmin, validate(createCouponSchema), createNewCoupon)
router.delete('/admin/:id', isAdmin, deleteCoupon)

export default router
