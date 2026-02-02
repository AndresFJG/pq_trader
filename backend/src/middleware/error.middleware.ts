import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/env';

/**
 * Interface para errores de la aplicación
 */
interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: any[];
  isOperational?: boolean;
}

/**
 * Error handler middleware
 * Captura y formatea todos los errores de la aplicación
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode;

  // Log del error
  logger.error('Error Handler', {
    message: error.message,
    statusCode: error.statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.id,
  });

  // Mongoose/MongoDB bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { 
      ...error,
      name: 'CastError', 
      message, 
      statusCode: 404,
      isOperational: true 
    };
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = 'Este valor ya existe en la base de datos';
    error = { 
      ...error,
      name: 'DuplicateKey', 
      message, 
      statusCode: 400,
      isOperational: true 
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors || {})
      .map((val: any) => val.message)
      .join(', ');
    error = { 
      ...error,
      name: 'ValidationError', 
      message, 
      statusCode: 400,
      isOperational: true 
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      ...error,
      message: 'Token inválido',
      statusCode: 401,
      isOperational: true
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      ...error,
      message: 'Token expirado',
      statusCode: 401,
      isOperational: true
    };
  }

  // Supabase/PostgreSQL errors
  if ((err as any).code?.startsWith('PGRST')) {
    error = {
      ...error,
      message: 'Error en la base de datos',
      statusCode: 500,
      isOperational: false
    };
  }

  const response: any = {
    success: false,
    error: error.message || 'Error del servidor',
  };

  // Incluir detalles adicionales en desarrollo
  if (config.server.isDevelopment) {
    response.stack = err.stack;
    response.statusCode = error.statusCode;
    response.name = err.name;
  }

  res.status(error.statusCode || 500).json(response);
};
