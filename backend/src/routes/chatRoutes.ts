import express from 'express';
import { sendMessage, getSuggestions } from '../controllers/chatController';
// rateLimiter temporalmente deshabilitado
// import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Public routes (rate limiting disabled temporarily)
router.post('/message', sendMessage);
router.get('/suggestions', getSuggestions);

export default router;
