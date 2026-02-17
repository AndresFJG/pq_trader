// Tasas de conversión aproximadas (en producción usar API real)
const exchangeRates: { [key: string]: number } = {
  EUR: 1,
  USD: 1.08,
};

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  decimals?: number;
}

export const currencies: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1, decimals: 2 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.08, decimals: 2 },
];

export const convertPrice = (priceInEUR: number, targetCurrency: string): number => {
  const rate = exchangeRates[targetCurrency] || 1;
  return Math.round(priceInEUR * rate * 100) / 100;
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `${price}€`;
  
  // Formatear con decimales para EUR y USD
  const formatted = price.toLocaleString('es-ES', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  return `${currency.symbol}${formatted}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency?.symbol || '€';
};

// Detectar país por IP usando ipapi.co (gratis hasta 1000 requests/día)
export const detectUserLocation = async (): Promise<{
  country: string;
  currency: string;
  countryName: string;
} | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Mapear países a monedas (solo EUR y USD)
    const currencyMap: { [key: string]: string } = {
      // Países de la Unión Europea
      'ES': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'PT': 'EUR',
      'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'IE': 'EUR', 'GR': 'EUR',
      'FI': 'EUR', 'LU': 'EUR', 'SI': 'EUR', 'EE': 'EUR', 'LV': 'EUR',
      // Estados Unidos
      'US': 'USD',
      // Resto del mundo: USD por defecto
    };
    
    return {
      country: data.country_code || 'ES',
      currency: currencyMap[data.country_code] || 'USD', // USD por defecto
      countryName: data.country_name || 'España',
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    return null;
  }
};

// Obtener tasas de cambio actualizadas (opcional, requiere API key)
export const fetchExchangeRates = async (baseCurrency: string = 'EUR'): Promise<{ [key: string]: number } | null> => {
  try {
    // Usar API gratuita de exchangerate-api.com
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};
