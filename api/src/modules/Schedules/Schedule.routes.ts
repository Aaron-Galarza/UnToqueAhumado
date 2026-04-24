import { Router } from 'express';
import { getStatus, closeStore } from './Schedule.controller';
import { isAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Endpoint público para que el Front sepa si mostrar el botón de "Comprar"
router.get('/status', getStatus);
router.put('/status', closeStore, isAdmin)

export default router;