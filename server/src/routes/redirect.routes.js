import { Router } from 'express';
import * as redirectController from '../controllers/redirect.controller.js';
import { redirectLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.get('/:code/meta', redirectLimiter, redirectController.meta);
router.post('/:code/unlock', redirectLimiter, redirectController.unlock);

export default router;
