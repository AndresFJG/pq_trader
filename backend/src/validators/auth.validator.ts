import Joi from 'joi';
import { SUPPORTED_CURRENCIES, VALIDATION_MESSAGES, REGEX } from '../utils/constants.utils';

/**
 * Validaciones de autenticación
 */

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': VALIDATION_MESSAGES.NAME.MIN_LENGTH,
      'string.max': VALIDATION_MESSAGES.NAME.MAX_LENGTH,
      'any.required': VALIDATION_MESSAGES.NAME.REQUIRED,
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': VALIDATION_MESSAGES.EMAIL.INVALID,
      'any.required': VALIDATION_MESSAGES.EMAIL.REQUIRED,
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.min': VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH,
      'string.max': 'La contraseña no puede exceder 128 caracteres',
      'string.pattern.base': VALIDATION_MESSAGES.PASSWORD.PATTERN,
      'any.required': VALIDATION_MESSAGES.PASSWORD.REQUIRED,
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Por favor ingresa un email válido',
      'any.required': 'El email es requerido',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida',
    }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Por favor ingresa un email válido',
      'any.required': 'El email es requerido',
    }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder 128 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La contraseña es requerida',
    }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña actual es requerida',
    }),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder 128 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La nueva contraseña es requerida',
    }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .optional()
    .messages({
      'string.email': 'Por favor ingresa un email válido',
    }),
});

/**
 * Validaciones de pagos Stripe
 */

export const createSubscriptionSchema = Joi.object({
  priceId: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del precio es requerido',
    }),
});

export const createPaymentIntentSchema = Joi.object({
  amount: Joi.number()
    .min(0.5)
    .max(999999)
    .required()
    .messages({
      'number.min': VALIDATION_MESSAGES.AMOUNT.MIN,
      'number.max': VALIDATION_MESSAGES.AMOUNT.MAX,
      'any.required': VALIDATION_MESSAGES.AMOUNT.REQUIRED,
    }),
  currency: Joi.string()
    .valid(...SUPPORTED_CURRENCIES)
    .default('usd')
    .messages({
      'any.only': VALIDATION_MESSAGES.CURRENCY.INVALID,
    }),
  metadata: Joi.object().optional(),
});

export const cancelSubscriptionSchema = Joi.object({
  immediately: Joi.boolean()
    .default(false),
});

export const createCheckoutSessionSchema = Joi.object({
  priceId: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del precio es requerido',
    }),
  successUrl: Joi.string()
    .uri()
    .optional(),
  cancelUrl: Joi.string()
    .uri()
    .optional(),
});

export const createBillingPortalSchema = Joi.object({
  returnUrl: Joi.string()
    .uri()
    .optional(),
});

/**
 * Validaciones de PayPal
 */

export const createPayPalOrderSchema = Joi.object({
  amount: Joi.number()
    .min(0.5)
    .max(999999)
    .required()
    .messages({
      'number.min': VALIDATION_MESSAGES.AMOUNT.MIN,
      'number.max': VALIDATION_MESSAGES.AMOUNT.MAX,
      'any.required': VALIDATION_MESSAGES.AMOUNT.REQUIRED,
    }),
  currency: Joi.string()
    .valid(...SUPPORTED_CURRENCIES.map(c => c.toUpperCase()))
    .default('USD')
    .messages({
      'any.only': VALIDATION_MESSAGES.CURRENCY.INVALID,
    }),
  plan: Joi.string()
    .optional(),
});

export const refundPaymentSchema = Joi.object({
  amount: Joi.number()
    .min(0.01)
    .optional(),
  currency: Joi.string()
    .valid(...SUPPORTED_CURRENCIES.map(c => c.toUpperCase()))
    .optional(),
});
