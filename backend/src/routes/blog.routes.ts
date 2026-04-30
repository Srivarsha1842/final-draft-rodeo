// backend/src/routes/blog.routes.ts
// Stub router — extend this file when blog functionality is ready.
import { Router } from 'express';

const router = Router();

// GET /api/blog  → returns empty list until blog is implemented
router.get('/', (_req, res) => {
  res.json({ success: true, data: [], message: 'Blog coming soon' });
});

export default router;
