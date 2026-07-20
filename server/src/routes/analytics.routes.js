import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { requireAuthOrApiKey } from '../middlewares/auth.middleware.js';
import { idParamValidator } from '../validators/link.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/overview', requireAuthOrApiKey, analyticsController.overview);
router.get('/account', requireAuthOrApiKey, analyticsController.account);
router.get('/link/:id', requireAuthOrApiKey, idParamValidator, validate, analyticsController.forLink);

export default router;
