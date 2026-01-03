// Tasas de conversión aproximadas (en producción usar API real)
const exchangeRates: { [key: string]: number } = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  MXN: 18.5,
  ARS: 350,
  COP: 4200,
  CLP: 950,
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
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.85, decimals: 2 },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', rate: 18.5, decimals: 0 },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', rate: 350, decimals: 0 },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', rate: 4200, decimals: 0 },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', rate: 950, decimals: 0 },
];

export const convertPrice = (priceInEUR: number, targetCurrency: string): number => {
  const rate = exchangeRates[targetCurrency] || 1;
  return Math.round(priceInEUR * rate * 100) / 100;
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `${price}€`;
  
  // Formatear sin decimales para monedas con valores altos
  if (['ARS', 'COP', 'CLP', 'MXN'].includes(currencyCode)) {
    const rounded = Math.round(price);
    const formatted = rounded.toLocaleString('es-ES');
    return `${currency.symbol}${formatted}`;
  }
  
  // Formatear con decimales para otras monedas
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
    
    // Mapear países a monedas
    const currencyMap: { [key: string]: string } = {
      'ES': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'PT': 'EUR',
      'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'IE': 'EUR', 'GR': 'EUR',
      'US': 'USD',
      'GB': 'GBP',
      'MX': 'MXN',
      'AR': 'ARS',
      'CO': 'COP',
      'CL': 'CLP',
    };
    
    return {
      country: data.country_code || 'ES',
      currency: currencyMap[data.country_code] || 'EUR',
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
