import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

// Protect all admin routes to authenticated admin users only
router.use(authenticate, authorize('ADMIN'));

router.get('/users', AdminController.listUsers);
router.get('/properties', AdminController.listProperties);
router.patch('/properties/:id/approve', AdminController.approveProperty);
router.get('/analytics', AdminController.getAnalytics);
router.delete('/users/:id', AdminController.deleteUser);

export default router;
