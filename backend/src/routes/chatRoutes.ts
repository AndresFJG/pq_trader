import express from 'express';
import { sendMessage, getSuggestions } from '../controllers/chatController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Public routes with rate limiting
router.post('/message', rateLimiter(20, 60), sendMessage);
router.get('/suggestions', getSuggestions);

export default router;
