import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { 
  getPortfolios, 
  getPortfolio, 
  createPortfolio, 
  updatePortfolio, 
  deletePortfolio 
} from '../controllers/portfolio.controller';

const router = Router();

router.get('/', protect, getPortfolios);
router.get('/:id', protect, getPortfolio);
router.post('/', protect, createPortfolio);
router.put('/:id', protect, authorize('admin'), updatePortfolio);
router.delete('/:id', protect, authorize('admin'), deletePortfolio);

export default router;
