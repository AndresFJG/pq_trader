import { Request, Response, NextFunction } from 'express';

/**
 * Async handler wrapper para eliminar try-catch en controllers
 * Captura errores automáticamente y los pasa al error middleware
 * 
 * @example
 * export const getUsers = asyncHandler(async (req, res) => {
 *   const users = await UserService.findAll();
 *   res.json({ success: true, data: users });
 * });
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
