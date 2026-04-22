import { Router } from 'express';
import productRoutes from '../modules/productos/products.routers';
import orderRoutes from '../modules/orders/orders.routes'; 
import couponsRoutes from '../modules/coupons/coupons.routes'
import userRouters from '../modules/users/user.routers'


const router = Router();

router.use('/productos', productRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponsRoutes)
router.use('/user', userRouters)

router.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

export default router;