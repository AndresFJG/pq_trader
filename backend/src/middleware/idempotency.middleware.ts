/**
 * Middleware de Idempotencia
 * Previene procesamiento duplicado de requests usando Idempotency-Key header
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface IdempotentResponse {
  statusCode: number;
  body: any;
  timestamp: number;
}

// Cache en memoria (en producción usar Redis)
const idempotencyCache = new Map<string, IdempotentResponse>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Limpiar cache expirado cada hora
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of idempotencyCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      idempotencyCache.delete(key);
    }
  }
}, 60 * 60 * 1000);

/**
 * Middleware de idempotencia
 */
export const idempotency = (req: Request, res: Response, next: NextFunction) => {
  // Solo aplicar a POST/PUT/PATCH
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      error: 'Idempotency-Key header is required for this operation',
    });
  }

  // Validar formato UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(idempotencyKey)) {
    return res.status(400).json({
      success: false,
      error: 'Idempotency-Key must be a valid UUID',
    });
  }

  // Verificar si ya existe en cache
  const cached = idempotencyCache.get(idempotencyKey);
  
  if (cached) {
    logger.info('Idempotent request - returning cached response', {
      idempotencyKey,
      age: Date.now() - cached.timestamp,
    });

    return res.status(cached.statusCode).json(cached.body);
  }

  // Interceptar la respuesta para cachearla
  const originalJson = res.json.bind(res);
  let responseSent = false;

  res.json = function (body: any) {
    if (!responseSent) {
      responseSent = true;

      // Guardar en cache solo si fue exitoso (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        idempotencyCache.set(idempotencyKey, {
          statusCode: res.statusCode,
          body,
          timestamp: Date.now(),
        });

        logger.info('Cached idempotent response', {
          idempotencyKey,
          statusCode: res.statusCode,
        });
      }
    }

    return originalJson(body);
  };

  next();
};

/**
 * Generar idempotency key en el servidor (fallback)
 */
export const generateIdempotencyKey = (): string => {
  return crypto.randomUUID();
};
