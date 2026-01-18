import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { logger } from '../utils/logger';

/**
 * Middleware genérico para validar request body con Joi
 */
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retornar todos los errores, no solo el primero
      stripUnknown: true, // Remover campos no definidos en el schema
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation failed', {
        path: req.path,
        errors,
      });

      res.status(400).json({
        success: false,
        error: 'Validación fallida',
        details: errors,
      });
      return;
    }

    // Reemplazar req.body con los valores validados y sanitizados
    req.body = value;
    next();
  };
};

/**
 * Middleware para validar parámetros de ruta
 */
export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Params validation failed', {
        path: req.path,
        errors,
      });

      res.status(400).json({
        success: false,
        error: 'Parámetros inválidos',
        details: errors,
      });
      return;
    }

    req.params = value;
    next();
  };
};

/**
 * Middleware para validar query string
 */
export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Query validation failed', {
        path: req.path,
        errors,
      });

      res.status(400).json({
        success: false,
        error: 'Query inválido',
        details: errors,
      });
      return;
    }

    req.query = value;
    next();
  };
};
