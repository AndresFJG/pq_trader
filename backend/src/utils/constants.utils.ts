/**
 * Constantes de validación reutilizables
 */

// Monedas soportadas en el sistema
export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp', 'mxn', 'ars', 'cop', 'clp'] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

// Límites de montos
export const PAYMENT_LIMITS = {
  MIN_AMOUNT: 0.5,
  MAX_AMOUNT: 999999,
} as const;

// Niveles de cursos
export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export type CourseLevel = typeof COURSE_LEVELS[number];

// Roles de usuario
export const USER_ROLES = ['user', 'admin', 'mentor'] as const;

export type UserRole = typeof USER_ROLES[number];

// Estados de suscripción
export const SUBSCRIPTION_STATUSES = [
  'active',
  'inactive',
  'canceled',
  'past_due',
  'trialing',
] as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUSES[number];

// Tiers de suscripción
export const SUBSCRIPTION_TIERS = ['free', 'basic', 'premium', 'enterprise'] as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[number];

// Tipos de transacción
export const TRANSACTION_TYPES = [
  'purchase',
  'subscription',
  'refund',
  'payment',
] as const;

export type TransactionType = typeof TRANSACTION_TYPES[number];

// Estados de transacción
export const TRANSACTION_STATUSES = [
  'pending',
  'completed',
  'failed',
  'refunded',
  'canceled',
] as const;

export type TransactionStatus = typeof TRANSACTION_STATUSES[number];

// Tipos de pago
export const PAYMENT_METHODS = ['card', 'paypal', 'mercadopago', 'sepa', 'pix'] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];

// Expresiones regulares comunes
export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Mensajes de validación en español
export const VALIDATION_MESSAGES = {
  EMAIL: {
    REQUIRED: 'El email es requerido',
    INVALID: 'Por favor ingresa un email válido',
  },
  PASSWORD: {
    REQUIRED: 'La contraseña es requerida',
    MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
    PATTERN: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  },
  NAME: {
    REQUIRED: 'El nombre es requerido',
    MIN_LENGTH: 'El nombre debe tener al menos 2 caracteres',
    MAX_LENGTH: 'El nombre no puede exceder 50 caracteres',
  },
  AMOUNT: {
    REQUIRED: 'El monto es requerido',
    MIN: `El monto mínimo es ${PAYMENT_LIMITS.MIN_AMOUNT}`,
    MAX: `El monto máximo es ${PAYMENT_LIMITS.MAX_AMOUNT}`,
  },
  CURRENCY: {
    INVALID: 'Moneda no válida',
  },
} as const;
