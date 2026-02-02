import express from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blog.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getBlogPosts);
router.get('/slug/:slug', getBlogPostBySlug);

// Admin routes
router.get('/:id', protect, authorize('admin'), getBlogPostById);
router.post('/', protect, authorize('admin'), createBlogPost);
router.put('/:id', protect, authorize('admin'), updateBlogPost);
router.delete('/:id', protect, authorize('admin'), deleteBlogPost);

export default router;
