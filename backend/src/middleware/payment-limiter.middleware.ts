import rateLimit from 'express-rate-limit';

/**
 * Rate limiter para endpoints de pago
 * Más restrictivo que el rate limiter general
 */
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests por ventana
  message: {
    success: false,
    error: 'Demasiadas solicitudes de pago. Por favor intenta más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identificar por IP + user (si está autenticado)
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `payment_${userId}` : `payment_ip_${req.ip}`;
  },
});

/**
 * Rate limiter para uploads de archivos
 * Previene abuso del sistema de almacenamiento
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 uploads por hora
  message: {
    success: false,
    error: 'Límite de uploads alcanzado. Intenta en una hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `upload_${userId}` : `upload_ip_${req.ip}`;
  },
});

/**
 * Rate limiter estricto para webhooks
 * Previene ataques de replay
 */
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requests por minuto (Stripe puede enviar múltiples)
  message: {
    success: false,
    error: 'Webhook rate limit exceeded',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
