import express, { Request, Response, NextFunction } from 'express';

/**
 * Middleware para preservar el raw body en webhooks de Stripe
 * Stripe requiere el body sin parsear para verificar la firma
 */
export const rawBodyMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.originalUrl === '/api/payments/webhook') {
    let data = '';
    
    req.setEncoding('utf8');
    
    req.on('data', (chunk) => {
      data += chunk;
    });
    
    req.on('end', () => {
      req.body = data;
      next();
    });
  } else {
    next();
  }
};

/**
 * Configuración de Express para usar con Stripe Webhooks
 * 
 * Ejemplo de uso en index.ts:
 * 
 * import { rawBodyMiddleware } from './middleware/stripe.middleware';
 * 
 * // Aplicar ANTES de express.json()
 * app.use(rawBodyMiddleware);
 * 
 * // Para otras rutas usar JSON normal
 * app.use(express.json());
 * 
 * // Ruta de webhook
 * app.post('/api/payments/webhook', 
 *   express.raw({ type: 'application/json' }), 
 *   paymentController.handleWebhook
 * );
 */
export const stripeWebhookConfig = express.raw({ type: 'application/json' });
