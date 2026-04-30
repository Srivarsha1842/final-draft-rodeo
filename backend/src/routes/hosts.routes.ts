import { Router } from 'express';
import * as ctrl from '../controllers/hosts.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, requireRole('host'));

// Dashboard
router.get('/dashboard', ctrl.getDashboard);
router.get('/analytics', ctrl.getAnalytics);

// Profile & Settings
router.get('/profile', ctrl.getProfile);
router.patch('/profile', ctrl.updateProfile);
router.patch('/profile/password', ctrl.updatePassword);
router.patch('/profile/bank', ctrl.updateBankDetails);

// Properties
router.get('/properties', ctrl.listProperties);
router.post('/properties', ctrl.createProperty);
router.patch('/properties/:propertyId', ctrl.updateProperty);
router.delete('/properties/:propertyId', ctrl.deleteProperty);

// Bookings
router.get('/bookings', ctrl.listBookings);
router.patch('/bookings/:bookingId/status', ctrl.updateBookingStatus);

// Reviews
router.get('/reviews', ctrl.listReviews);
router.post('/reviews/:reviewId/reply', ctrl.replyToReview);

// Notifications
router.get('/notifications', ctrl.listNotifications);
router.patch('/notifications/:notificationId/read', ctrl.markNotificationRead);

// Messages
router.get('/messages', ctrl.listMessages);
router.post('/messages', ctrl.sendMessage);

// Payouts
router.get('/payouts', ctrl.listPayouts);

// Promotions
router.get('/promotions', ctrl.listPromotions);
router.post('/promotions', ctrl.createPromotion);

export default router;
