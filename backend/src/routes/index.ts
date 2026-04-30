import blogRoutes from './blog.routes';
import { Router } from 'express';
import authRoutes from './auth.routes';
import propertiesRoutes from './properties.routes';
import bookingsRoutes from './bookings.routes';
import hostsRoutes from './hosts.routes';
import cmsRoutes from './cms.routes';
import { getSitemap, getRobots } from '../controllers/cms.controller';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/host', hostsRoutes);
router.use('/cms', cmsRoutes);

// SEO-critical public endpoints
router.get('/sitemap.xml', getSitemap);
router.get('/robots.txt', getRobots);

export default router;
