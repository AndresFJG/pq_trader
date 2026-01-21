import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService, User } from '../services/user.service';

export interface AuthRequest extends Request {
  user?: User;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No autorizado para acceder a esta ruta',
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

      // Get user from token
      const user = await UserService.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Usuario no encontrado',
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }
  } catch (error) {
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
