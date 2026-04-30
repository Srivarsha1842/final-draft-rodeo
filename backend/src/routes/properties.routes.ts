import { Router } from 'express';
import * as ctrl from '../controllers/properties.controller';

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.get('/:id/reviews', ctrl.getReviews);
router.get('/:id/availability', ctrl.checkAvailability);

export default router;
