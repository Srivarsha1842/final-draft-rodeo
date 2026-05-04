import { Router } from 'express';
import * as ctrl from '../controllers/inventory.controller';

const router = Router();

router.get('/calendar', ctrl.calendar);

export default router;
