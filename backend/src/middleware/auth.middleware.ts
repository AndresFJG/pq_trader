import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService, User } from '../services/user.service';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: User;
}

/**
 * Middleware de autenticación
 * Verifica el token JWT y adjunta el usuario al request
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Prioridad: 1) Cookie (más seguro), 2) Authorization header (para APIs externas)
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No autorizado - Token no proporcionado',
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as { id: number };

      // Get user from token
      const user = await UserService.findById(decoded.id);

      if (!user) {
        logger.warn('Token válido pero usuario no encontrado', { userId: decoded.id });
        res.status(401).json({
          success: false,
          error: 'Usuario no encontrado',
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      const errorName = (error as Error).name;
      
      if (errorName === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        });
        return;
      }
      
      if (errorName === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          error: 'Token inválido',
          code: 'TOKEN_INVALID'
        });
        return;
      }

      throw error; // Otros errores pasan al error handler
    }
  } catch (error) {
    logger.error('Error en middleware de autenticación', { error });
    res.status(500).json({
      success: false,
      error: 'Error del servidor',
    });
  }
};

// Authorize specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `El rol ${req.user?.role} no está autorizado para acceder a esta ruta`,
      });
      return;
    }
    next();
  };
};
