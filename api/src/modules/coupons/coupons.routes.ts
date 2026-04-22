import { Router } from 'express';
import { getAllCoupons, createNewCoupon, validateCoupon, deleteCoupon } from './coupons.controllers';

const router = Router()

router.get('/admin', getAllCoupons)
router.post('/admin', createNewCoupon)
router.post('/validate/:code', validateCoupon)
router.delete('/admin/:id',deleteCoupon)

export default router