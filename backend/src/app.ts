import './config/env'; // load env first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import { env } from './config/env';
import prisma from './config/database';
import routes from './routes';
import { globalLimiter } from './middleware/rateLimiter.middleware';
import { notFound, errorHandler } from './middleware/error.middleware';

const app = express();

// Trust Vercel / proxy headers so req.ip + rate limiting work correctly.
app.set('trust proxy', 1);

// ── Security Headers ───────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", env.FRONTEND_URL],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ── CORS ───────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── General Middleware ─────────────────────────────────────────────────────────
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(globalLimiter);

// ── Static: CMS Admin UI (only when running as a long-lived server) ────────────
if (!process.env.VERCEL) {
  app.use('/cms-admin', express.static(path.join(__dirname, '../public/cms-admin')));
}

// ── SEO: Sitemap & Robots at root level ───────────────────────────────────────
app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const { generateSitemap } = await import('./services/cms.service');
    const xml = await generateSitemap();
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) { next(err); }
});

app.get('/robots.txt', async (_req, res, next) => {
  try {
    const { generateRobots } = await import('./services/cms.service');
    res.set('Content-Type', 'text/plain');
    res.send(generateRobots());
  } catch (err) { next(err); }
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── 404 & Error Handlers ───────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
