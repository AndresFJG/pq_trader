import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Schema para crear usuario
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  role: Joi.string().valid('user', 'admin', 'mentor').optional(),
});

// Schema para actualizar usuario
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('user', 'admin', 'mentor').optional(),
  subscription_tier: Joi.string().valid('free', 'basic', 'premium', 'enterprise').optional(),
  subscription_status: Joi.string().valid('active', 'canceled', 'past_due', 'trialing', 'none').optional(),
});

// Middleware de validación para crear usuario
export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = createUserSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
    return;
  }
  
  next();
};

// Middleware de validación para actualizar usuario
export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = updateUserSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
    return;
  }
  
  next();
};
