import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como porcentaje con signo
 * @param value - Número a formatear
 * @returns String formateado (ej: "+23.5%" o "-5.2%")
 */
export function formatPercentage(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Obtiene la clase de color según si el porcentaje es positivo o negativo
 * @param value - Número a evaluar
 * @returns Clase de Tailwind para el color
 */
export function getPercentageColor(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'text-muted-foreground';
  }
  return value >= 0 ? 'text-profit' : 'text-loss';
}

/**
 * Formatea un número como moneda USD
 * @param value - Número a formatear
 * @returns String formateado (ej: "$1,234.56")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * Formatea un número con separadores de miles
 * @param value - Número a formatear
 * @returns String formateado (ej: "1,234")
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
