import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { getTransactions, getTransaction, getUserTransactions } from '../controllers/transaction.controller';

const router = Router();

router.get('/', protect, authorize('admin'), getTransactions);
router.get('/my-transactions', protect, getUserTransactions);
router.get('/:id', protect, authorize('admin'), getTransaction);

export default router;
