import { Router } from 'express';
import {
  register,
  login,
  getMe,
  refreshToken,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate, registerSchema, loginSchema } from '../middleware/validation.middleware';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

export default router;
