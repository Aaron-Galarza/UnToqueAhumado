import { Router } from 'express';
import { getAllCoupons, createNewCoupon, validateCoupon } from './coupons.controllers';

const router = Router()

router.get('/admin', getAllCoupons)
router.post('/admin', createNewCoupon)
router.post('/validate/:code', validateCoupon)

export default router