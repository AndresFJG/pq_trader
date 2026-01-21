import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { getTransactions, getTransaction } from '../controllers/transaction.controller';

const router = Router();

router.get('/', protect, authorize('admin'), getTransactions);
router.get('/:id', protect, authorize('admin'), getTransaction);

export default router;
