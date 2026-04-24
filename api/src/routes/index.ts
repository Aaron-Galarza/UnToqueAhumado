import { Router } from 'express';
import productRoutes from '../modules/productos/products.routers';
import orderRoutes from '../modules/orders/orders.routes';
import couponsRoutes from '../modules/coupons/coupons.routes'
import userRouters from '../modules/users/user.routers'
import adicionalRoutes from '../modules/adicionales/adicionales.routes'
import categoriaRoutes from '../modules/categorias/categorias.routes'
import configRoutes from '../modules/Schedules/Schedule.routes'

const router = Router();

router.use('/productos', productRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponsRoutes)
router.use('/user', userRouters)
router.use('/adicionales', adicionalRoutes)
router.use('/categorias', categoriaRoutes)
router.use('/configuracion', configRoutes)

router.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

export default router;