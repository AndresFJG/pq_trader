import { Router } from 'express';
import {
  getDashboardStats,
  getRecentUsers,
  getRecentTransactions,
} from '../controllers/dashboard.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public route - no authentication required
router.get('/stats', getDashboardStats);
router.get('/recent-users', protect, authorize('admin'), getRecentUsers);
router.get('/recent-transactions', protect, authorize('admin'), getRecentTransactions);

export default router;
