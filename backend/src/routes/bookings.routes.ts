import { Router } from 'express';
import * as ctrl from '../controllers/bookings.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', ctrl.create);
router.get('/:id', authenticate, ctrl.getById);
router.patch('/:id/status', authenticate, ctrl.updateStatus);

export default router;
