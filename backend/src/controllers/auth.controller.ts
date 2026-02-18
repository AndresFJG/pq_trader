import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { config } from '../config/env';

// NOTA: generateToken y generateRefreshToken ahora se importan de ../utils/jwt


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await UserService.findByEmail(email);

    if (userExists) {
      res.status(400).json({
        success: false,
        error: 'El usuario ya existe',
      });
      return;
    }

    // Create user
    const user = await UserService.createUser({
      name,
      email,
      password,
    });

    // Crear notificación de nuevo usuario (para administradores)
    // NOTA: No pasar user_id ni related_id porque son UUID, pero user.id es INTEGER
    await NotificationService.create({
      type: 'new_user',
      title: 'Nuevo usuario registrado',
      message: `${name} (${email}) se ha registrado en la plataforma`,
      metadata: {
        email,
        name,
        user_id: user.id,
        registration_date: new Date().toISOString(),
      },
    });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set HttpOnly cookies (más seguro que localStorage)
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production', // HTTPS en producción
      sameSite: config.server.nodeEnv === 'production' ? 'none' : 'lax', // 'none' para cross-domain
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: config.server.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await UserService.findByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
      return;
    }

    // Check password
    const isMatch = await UserService.comparePassword(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
      return;
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set HttpOnly cookies
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: config.server.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: config.server.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await UserService.findById(req.user!.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Leer refresh token de cookie (prioridad) o body (fallback)
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: 'Refresh token no proporcionado',
      });
      return;
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded) {
        res.status(401).json({
          success: false,
          error: 'Token inválido',
        });
        return;
      }

      const user = await UserService.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Usuario no encontrado',
        });
        return;
      }

      const newToken = generateToken(user.id);

      // Actualizar cookie de accessToken
      res.cookie('accessToken', newToken, {
        httpOnly: true,
        secure: config.server.nodeEnv === 'production',
        sameSite: config.server.nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Refresh token inválido',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Logout user (clear cookies)
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

