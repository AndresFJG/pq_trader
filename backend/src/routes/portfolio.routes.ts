import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { 
  getPortfolios, 
  getPortfolio,
  getFeaturedPortfolios,
  createPortfolio, 
  updatePortfolio, 
  deletePortfolio 
} from '../controllers/portfolio.controller';

const router = Router();

router.get('/', getPortfolios);
router.get('/featured', getFeaturedPortfolios);
router.get('/:id', getPortfolio);
router.post('/', protect, createPortfolio);
router.put('/:id', protect, authorize('admin'), updatePortfolio);
router.delete('/:id', protect, authorize('admin'), deletePortfolio);

export default router;
