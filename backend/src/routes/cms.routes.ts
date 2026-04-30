import { Router, Request, Response, NextFunction } from 'express';
import * as ctrl from '../controllers/cms.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { cmsLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────────
// Regex routes accept multi-segment slugs like `blog/best-villas-goa-2026`.
// The `/head` variant must be declared first so it wins over the plain slug route.
router.get(/^\/pages\/slug\/(.+)\/head$/, (req: Request, res: Response, next: NextFunction) => {
  (req.params as Record<string, string>).slug = (req.params as unknown as string[])[0];
  return ctrl.getPageHead(req, res, next);
});
router.get(/^\/pages\/slug\/(.+)$/, (req: Request, res: Response, next: NextFunction) => {
  (req.params as Record<string, string>).slug = (req.params as unknown as string[])[0];
  return ctrl.getPageBySlug(req, res, next);
});
router.get('/experiences', ctrl.listExperiences);
router.get('/destinations', ctrl.listDestinations);
router.get('/public-content', ctrl.getPublicContent);

// ── Admin-only routes ──────────────────────────────────────────────────────────
router.use(authenticate, requireRole('admin'), cmsLimiter);

// Pages (CMS)
router.get('/pages', ctrl.listPages);
router.get('/pages/:id', ctrl.getPage);
router.post('/pages', ctrl.createPage);
router.patch('/pages/:id', ctrl.updatePage);
router.post('/pages/:id/publish', ctrl.publishPage);
router.post('/pages/:id/unpublish', ctrl.unpublishPage);
router.delete('/pages/:id', ctrl.deletePage);

// Settings
router.get('/settings', ctrl.getSettings);
router.post('/settings', ctrl.updateSetting);

// Hosts management
router.get('/hosts', ctrl.listHosts);
router.patch('/hosts/:hostId/status', ctrl.updateHostStatus);

// All bookings & revenue
router.get('/bookings', ctrl.listAllBookings);
router.get('/revenue', ctrl.getRevenue);

// Experiences
router.post('/experiences', ctrl.createExperience);
router.patch('/experiences/:id', ctrl.updateExperience);
router.delete('/experiences/:id', ctrl.deleteExperience);

// Destinations
router.post('/destinations', ctrl.createDestination);
router.patch('/destinations/:id', ctrl.updateDestination);
router.delete('/destinations/:id', ctrl.deleteDestination);

export default router;
