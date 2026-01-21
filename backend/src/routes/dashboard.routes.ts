import { Router } from 'express';
import {
  getDashboardStats,
  getRecentUsers,
  getRecentTransactions,
} from '../controllers/dashboard.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require admin authentication
router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/recent-users', protect, authorize('admin'), getRecentUsers);
router.get('/recent-transactions', protect, authorize('admin'), getRecentTransactions);

export default router;
