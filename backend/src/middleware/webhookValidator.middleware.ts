import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

/**
 * Validate Stripe webhook signature
 */
export const validateStripeWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    logger.warn('Stripe webhook: Missing signature', { ip: req.ip });
    res.status(400).json({
      success: false,
      error: 'Missing stripe-signature header',
    });
    return;
  }

  // Content-Type debe ser application/json
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    logger.warn('Stripe webhook: Invalid Content-Type', {
      contentType,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      error: 'Invalid Content-Type. Expected application/json',
    });
    return;
  }

  next();
};

/**
 * Validate PayPal webhook signature
 */
export const validatePayPalWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const transmissionId = req.headers['paypal-transmission-id'];
  const transmissionTime = req.headers['paypal-transmission-time'];
  const certUrl = req.headers['paypal-cert-url'];
  const authAlgo = req.headers['paypal-auth-algo'];
  const transmissionSig = req.headers['paypal-transmission-sig'];

  // Verificar que todos los headers estén presentes
  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    logger.warn('PayPal webhook: Missing required headers', {
      ip: req.ip,
      headers: {
        transmissionId: !!transmissionId,
        transmissionTime: !!transmissionTime,
        certUrl: !!certUrl,
        authAlgo: !!authAlgo,
        transmissionSig: !!transmissionSig,
      },
    });
    res.status(400).json({
      success: false,
      error: 'Missing required PayPal webhook headers',
    });
    return;
  }

  // Content-Type debe ser application/json
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    logger.warn('PayPal webhook: Invalid Content-Type', {
      contentType,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      error: 'Invalid Content-Type. Expected application/json',
    });
    return;
  }

  next();
};

/**
 * Generic webhook validator - verifica Content-Type y IP allowlist
 */
export const validateWebhook = (allowedIPs?: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Verificar Content-Type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      logger.warn('Webhook: Invalid Content-Type', {
        contentType,
        ip: req.ip,
        path: req.path,
      });
      res.status(400).json({
        success: false,
        error: 'Invalid Content-Type. Expected application/json',
      });
      return;
    }

    // Verificar IP si se especificó allowlist
    if (allowedIPs && allowedIPs.length > 0) {
      const clientIP = req.ip || req.connection.remoteAddress || '';
      const isAllowed = allowedIPs.some((ip) => clientIP.includes(ip));

      if (!isAllowed) {
        logger.warn('Webhook: IP not allowed', {
          clientIP,
          path: req.path,
        });
        res.status(403).json({
          success: false,
          error: 'IP not allowed',
        });
        return;
      }
    }

    logger.info('Webhook validated', {
      path: req.path,
      ip: req.ip,
    });

    next();
  };
};
