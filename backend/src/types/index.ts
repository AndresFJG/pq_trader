/**
 * Exportaciones centralizadas de tipos del backend
 * Importar desde aquí para mantener consistencia
 */

export * from './database.types';

// Re-exportar tipos comunes de Express para conveniencia
export type { Request, Response, NextFunction } from 'express';
