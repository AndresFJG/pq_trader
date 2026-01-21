import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

router.delete('/:id', protect, authorize('admin'), (_req, res) => {
  res.json({ success: true, message: 'Delete user route' });
});

export default router;
