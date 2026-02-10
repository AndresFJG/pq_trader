import { Router } from 'express';
import {
  getCourses,
  getCourse,
  getFeaturedCourses,
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} from '../controllers/course.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/stats', getCourseStats);
router.get('/:id', getCourse);
router.post('/', protect, authorize('admin', 'mentor'), createCourse);
router.put('/:id', protect, authorize('admin', 'mentor'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);

export default router;
