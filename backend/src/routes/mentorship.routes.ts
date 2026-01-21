import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { 
  getMentorships, 
  getMentorship, 
  createMentorship, 
  updateMentorship, 
  deleteMentorship 
} from '../controllers/mentorship.controller';

const router = Router();

router.get('/', protect, getMentorships);
router.get('/:id', protect, getMentorship);
router.post('/', protect, authorize('admin'), createMentorship);
router.put('/:id', protect, authorize('admin'), updateMentorship);
router.delete('/:id', protect, authorize('admin'), deleteMentorship);

export default router;
