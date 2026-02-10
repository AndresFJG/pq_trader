import { Router } from 'express';
import { getMentors, getMentor } from '../controllers/mentor.controller';

const router = Router();

/**
 * @route   GET /api/mentors
 * @desc    Get all mentors
 * @access  Public
 */
router.get('/', getMentors);

/**
 * @route   GET /api/mentors/:id
 * @desc    Get single mentor
 * @access  Public
 */
router.get('/:id', getMentor);

export default router;
