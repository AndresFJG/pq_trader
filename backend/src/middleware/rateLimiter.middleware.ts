import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(config.rateLimit.windowMs || '900000'), // 15 minutes
  max: parseInt(config.rateLimit.maxRequests || '100'),
  message: {
    success: false,
    error: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Demasiados intentos de inicio de sesión, por favor intenta más tarde',
  },
});

// Registration limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: {
    success: false,
    error: 'Demasiados registros desde esta IP, por favor intenta más tarde',
  },
});

// Payment limiter
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Demasiadas transacciones, por favor intenta más tarde',
  },
});

// Webhook limiter
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many webhook requests',
  },
});

// Password reset limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Demasiados intentos de recuperación de contraseña',
  },
});
