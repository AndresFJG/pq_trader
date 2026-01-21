import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { 
  getMentorships, 
  getMentorship,
  getFeaturedMentorships,
  createMentorship, 
  updateMentorship, 
  deleteMentorship 
} from '../controllers/mentorship.controller';

const router = Router();

router.get('/', getMentorships);
router.get('/featured', getFeaturedMentorships);
router.get('/:id', getMentorship);
router.post('/', protect, authorize('admin', 'mentor'), createMentorship);
router.put('/:id', protect, authorize('admin', 'mentor'), updateMentorship);
router.delete('/:id', protect, authorize('admin'), deleteMentorship);

export default router;
