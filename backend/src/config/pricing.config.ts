/**
 * Configuración centralizada de precios
 * Todos los precios están en EUR (se convierten en el checkout)
 */

export interface PricingPlan {
  id: string;
  name: string;
  type: 'course' | 'mentorship' | 'subscription' | 'strategy' | 'club';
  price: number;
  currency: 'EUR';
  recurring?: boolean;
  billingPeriod?: 'monthly' | 'quarterly' | 'semiannual' | 'annual';
  stripePrice?: string;
  paypalPlanId?: string;
  description?: string;
}

/**
 * Catálogo completo de productos y servicios
 */
export const PRICING_CATALOG: Record<string, PricingPlan> = {
  // ============ CURSOS ============
  'course-python-trading': {
    id: 'course-python-trading',
    name: 'Python para Trading',
    type: 'course',
    price: 299,
    currency: 'EUR',
    description: 'Curso completo de Python aplicado al trading algorítmico',
  },
  'course-strategyquant': {
    id: 'course-strategyquant',
    name: 'StrategyQuant Avanzado',
    type: 'course',
    price: 249,
    currency: 'EUR',
    description: 'Domina StrategyQuant X para crear robots de trading',
  },
  'course-risk-management': {
    id: 'course-risk-management',
    name: 'Gestión de Riesgo',
    type: 'course',
    price: 199,
    currency: 'EUR',
    description: 'Técnicas profesionales de gestión de riesgo',
  },
  'course-technical-analysis': {
    id: 'course-technical-analysis',
    name: 'Análisis Técnico Avanzado',
    type: 'course',
    price: 399,
    currency: 'EUR',
    description: 'Indicadores, patrones y estrategias de trading profesional',
  },
  'course-bundle-3': {
    id: 'course-bundle-3',
    name: 'Pack 3 Cursos',
    type: 'course',
    price: 599,
    currency: 'EUR',
    description: 'Python + StrategyQuant + Riesgo (ahorra €148)',
  },

  // ============ MENTORÍAS ============
  'mentorship-individual': {
    id: 'mentorship-individual',
    name: 'Sesión Individual',
    type: 'mentorship',
    price: 70,
    currency: 'EUR',
    description: '1 hora de mentoría personalizada 1-a-1',
  },
  'mentorship-pack-5': {
    id: 'mentorship-pack-5',
    name: 'Pack 5 Sesiones',
    type: 'mentorship',
    price: 320,
    currency: 'EUR',
    description: '5 sesiones (ahorra €30)',
  },
  'mentorship-premium-club': {
    id: 'mentorship-premium-club',
    name: 'Club Mentoría Premium',
    type: 'mentorship',
    price: 400,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'monthly',
    description: '2 sesiones mensuales + grupo privado + grabaciones',
  },

  // ============ CLUBES Y SUSCRIPCIONES ============
  'club-strategyquant-monthly': {
    id: 'club-strategyquant-monthly',
    name: 'Club StrategyQuant',
    type: 'club',
    price: 150,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'monthly',
    stripePrice: process.env.STRIPE_PRICE_ID_MONTHLY,
    description: 'Comunidad + webinars + plantillas + soporte',
  },
  'subscription-total-access': {
    id: 'subscription-total-access',
    name: 'Acceso Total',
    type: 'subscription',
    price: 997,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'annual',
    stripePrice: process.env.STRIPE_PRICE_ID_ANNUAL,
    description: 'Todos los cursos + contenido exclusivo',
  },

  // ============ ALQUILER DE ESTRATEGIAS ============
  'strategy-individual-monthly': {
    id: 'strategy-individual-monthly',
    name: 'Estrategia Individual',
    type: 'strategy',
    price: 50,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'monthly',
    description: '1 estrategia a elección',
  },
  'strategy-individual-quarterly': {
    id: 'strategy-individual-quarterly',
    name: 'Estrategia Individual (Trimestral)',
    type: 'strategy',
    price: 130,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'quarterly',
    description: '1 estrategia - 3 meses',
  },
  'strategy-individual-semiannual': {
    id: 'strategy-individual-semiannual',
    name: 'Estrategia Individual (Semestral)',
    type: 'strategy',
    price: 250,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'semiannual',
    description: '1 estrategia - 6 meses',
  },
  'strategy-portfolio-monthly': {
    id: 'strategy-portfolio-monthly',
    name: 'Portfolio de Fondeo',
    type: 'strategy',
    price: 120,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'monthly',
    description: 'Pack de 3 sistemas optimizados',
  },
  'strategy-portfolio-quarterly': {
    id: 'strategy-portfolio-quarterly',
    name: 'Portfolio de Fondeo (Trimestral)',
    type: 'strategy',
    price: 320,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'quarterly',
    description: 'Pack de 3 sistemas - 3 meses',
  },
  'strategy-portfolio-semiannual': {
    id: 'strategy-portfolio-semiannual',
    name: 'Portfolio de Fondeo (Semestral)',
    type: 'strategy',
    price: 600,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'semiannual',
    description: 'Pack de 3 sistemas - 6 meses',
  },
  'strategy-darwinex-monthly': {
    id: 'strategy-darwinex-monthly',
    name: 'Portfolio Darwinex',
    type: 'strategy',
    price: 200,
    currency: 'EUR',
    recurring: true,
    billingPeriod: 'monthly',
    description: 'Portfolio completo verificado en Darwinex',
  },
};

/**
 * Obtener precio de un producto por ID
 */
export const getProductPrice = (productId: string): PricingPlan | null => {
  return PRICING_CATALOG[productId] || null;
};

/**
 * Validar si un precio es correcto para un producto
 */
export const validateProductPrice = (productId: string, amount: number): boolean => {
  const product = getProductPrice(productId);
  if (!product) return false;
  
  // Permitir variación del 1% por conversiones de moneda
  const tolerance = product.price * 0.01;
  return Math.abs(amount - product.price) <= tolerance;
};

/**
 * Obtener productos por tipo
 */
export const getProductsByType = (type: PricingPlan['type']): PricingPlan[] => {
  return Object.values(PRICING_CATALOG).filter(p => p.type === type);
};

/**
 * Conversión de monedas (tasas aproximadas)
 */
export const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1.00,
  USD: 1.09,
  GBP: 0.86,
  MXN: 18.50,
  BRL: 5.40,
  ARS: 900.00,
  COP: 4300.00,
};

/**
 * Convertir precio a otra moneda
 */
export const convertPrice = (priceEUR: number, targetCurrency: string): number => {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return Math.round(priceEUR * rate * 100) / 100;
};

export default PRICING_CATALOG;
