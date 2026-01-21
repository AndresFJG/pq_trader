import { Router } from 'express';
import {
  register,
  login,
  // logout,
  // verifyEmail,
  // forgotPassword,
  // resetPassword,
  getMe,
  // updateProfile,
  // changePassword,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  registerSchema,
  loginSchema,
  // forgotPasswordSchema,
  // resetPasswordSchema,
  // changePasswordSchema,
  // updateProfileSchema,
} from '../validators/auth.validator';
import {
  registerLimiter,
  authLimiter,
  // passwordResetLimiter,
} from '../middleware/rateLimiter.middleware';
// import { refreshToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * Rutas públicas (sin autenticación)
 */
router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
// router.get('/verify-email/:token', verifyEmail);
// router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword);
// router.post('/reset-password/:token', passwordResetLimiter, validate(resetPasswordSchema), resetPassword);
// router.post('/refresh-token', refreshToken);

/**
 * Rutas protegidas (requieren autenticación)
 */
router.use(protect); // Todas las rutas siguientes requieren autenticación

// router.post('/logout', logout);
router.get('/me', getMe);
// router.put('/update-profile', validate(updateProfileSchema), updateProfile);
// router.put('/change-password', validate(changePasswordSchema), changePassword);

export default router;
