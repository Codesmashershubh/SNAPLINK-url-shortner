import { Router } from 'express';
import authRoutes from './auth.routes.js';
import linkRoutes from './link.routes.js';
import analyticsRoutes from './analytics.routes.js';
import adminRoutes from './admin.routes.js';
import redirectRoutes from './redirect.routes.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SnapLink API is healthy',
    data: { db: isDbConnected() ? 'connected' : 'disconnected', uptime: process.uptime() },
  });
});

router.use('/auth', authRoutes);
router.use('/links', linkRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/redirect', redirectRoutes);

export default router;
