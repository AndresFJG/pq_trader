import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper para funciones async que elimina la necesidad de try-catch repetitivo
 * Captura automáticamente errores y los pasa al middleware de error
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
