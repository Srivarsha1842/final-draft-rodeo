import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/admin/login', authLimiter, ctrl.adminLogin);
router.post('/host/login', authLimiter, ctrl.hostLogin);
router.post('/host/signup', authLimiter, ctrl.hostSignup);
router.post('/user/login', authLimiter, ctrl.userLogin);
router.post('/user/signup', authLimiter, ctrl.userSignup);
router.post('/refresh', ctrl.refreshTokens);
router.get('/me', authenticate, ctrl.me);

export default router;
