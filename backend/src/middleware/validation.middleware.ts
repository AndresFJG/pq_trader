import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
    'any.required': 'El nombre es requerido',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Por favor ingresa un email válido',
    'any.required': 'El email es requerido',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Course validation schemas
export const courseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().required(),
  duration: Joi.number().positive().required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  thumbnail: Joi.string().uri().optional(),
  topics: Joi.array().items(Joi.string()).optional(),
});

// Mentorship validation schemas
export const mentorshipSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().required(),
  duration: Joi.number().min(15).required(),
});

// Booking validation schema
export const bookingSchema = Joi.object({
  mentorshipId: Joi.string().required(),
  timeSlot: Joi.object({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
  }).required(),
  notes: Joi.string().optional(),
});

// Validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        error: 'Errores de validación',
        errors,
      });
      return;
    }

    next();
  };
};
