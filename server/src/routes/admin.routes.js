import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { idParamValidator } from '../validators/link.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', adminController.stats);
router.get('/users', adminController.listUsers);
router.patch('/users/:id/ban', idParamValidator, validate, adminController.toggleBan);
router.get('/links', adminController.listAllLinks);
router.delete('/links/:id', idParamValidator, validate, adminController.deleteAnyLink);

export default router;
