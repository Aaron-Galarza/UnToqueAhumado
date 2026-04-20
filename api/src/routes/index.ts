import { Router } from 'express';
import productRoutes from '../modules/productos/products.routers';
import orderRoutes from '../modules/orders/orders.routes'; // Importar

const router = Router();

router.use('/productos', productRoutes);
router.use('/orders', orderRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

export default router;