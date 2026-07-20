import { Router } from 'express';
import * as linkController from '../controllers/link.controller.js';
import { requireAuthOrApiKey, optionalAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { shortenLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  createLinkValidator,
  updateLinkValidator,
  idParamValidator,
} from '../validators/link.validator.js';

const router = Router();

// Anonymous visitors can shorten a link too (no dashboard persistence),
// but if they're signed in it's saved to their account automatically.
router.post('/', shortenLimiter, optionalAuth, createLinkValidator, validate, linkController.create);

router.get('/', requireAuthOrApiKey, linkController.list);
router.get('/export/csv', requireAuthOrApiKey, linkController.exportCsv);
router.get('/:id', requireAuthOrApiKey, idParamValidator, validate, linkController.getOne);
router.patch('/:id', requireAuthOrApiKey, updateLinkValidator, validate, linkController.update);
router.delete('/:id', requireAuthOrApiKey, idParamValidator, validate, linkController.remove);
router.post('/bulk/delete', requireAuthOrApiKey, linkController.removeBulk);
router.post('/:id/duplicate', requireAuthOrApiKey, idParamValidator, validate, linkController.duplicate);
router.get('/:id/qr.png', requireAuthOrApiKey, idParamValidator, validate, linkController.getQrPng);
router.get('/:id/qr.svg', requireAuthOrApiKey, idParamValidator, validate, linkController.getQrSvg);

export default router;
