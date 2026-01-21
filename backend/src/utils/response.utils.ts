import { Response } from 'express';

/**
 * Respuesta estándar para operaciones exitosas
 */
export const sendSuccess = <T = any>(
  res: Response,
  data?: T,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Respuesta estándar para errores
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    error,
  });
};

/**
 * Respuesta estándar para errores de validación
 */
export const sendValidationError = (
  res: Response,
  error: string,
  details?: Array<{ field: string; message: string }>
): void => {
  res.status(400).json({
    success: false,
    error,
    details,
  });
};

/**
 * Respuesta estándar para recursos no encontrados
 */
export const sendNotFound = (
  res: Response,
  resource: string = 'Recurso'
): void => {
  res.status(404).json({
    success: false,
    error: `${resource} no encontrado`,
  });
};

/**
 * Respuesta estándar para falta de autorización
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'No autorizado'
): void => {
  res.status(401).json({
    success: false,
    error: message,
  });
};

/**
 * Respuesta estándar para recursos prohibidos
 */
export const sendForbidden = (
  res: Response,
  message: string = 'Acceso denegado'
): void => {
  res.status(403).json({
    success: false,
    error: message,
  });
};

/**
 * Respuesta con paginación
 */
export const sendPaginatedSuccess = <T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): void => {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};
