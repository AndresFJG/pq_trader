// Geolocation utilities for regional compliance

export async function getUserCountry(): Promise<string> {
  try {
    // Usar API gratuita de geolocalización
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code || 'US';
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'US'; // Default a US
  }
}

export function getRegionalDisclaimer(countryCode: string): {
  title: string;
  content: string;
  regulator: string;
  critical: boolean;
} {
  const disclaimers: Record<string, any> = {
    // Estados Unidos - CFTC/NFA
    US: {
      title: 'CFTC Risk Disclosure',
      content: 'HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN. Trading futures and forex involves substantial risk of loss and is not suitable for all investors.',
      regulator: 'CFTC/NFA',
      critical: true
    },
    
    // España - CNMV
    ES: {
      title: 'Advertencia de Riesgo - CNMV',
      content: 'Los CFDs son instrumentos complejos y están asociados a un riesgo elevado de perder dinero rápidamente debido al apalancamiento. Entre el 74-89% de las cuentas de inversores minoristas pierden dinero al operar con CFDs. Debe considerar si comprende el funcionamiento de los CFDs.',
      regulator: 'CNMV',
      critical: true
    },
    
    // Reino Unido - FCA
    GB: {
      title: 'FCA Risk Warning',
      content: 'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.',
      regulator: 'FCA',
      critical: true
    },
    
    // Unión Europea - ESMA
    EU: {
      title: 'ESMA Risk Disclosure',
      content: 'Les CFD sont des instruments complexes et présentent un risque élevé de perte rapide en capital en raison de l\'effet de levier. Vous devez vous assurer que vous comprenez comment les CFD fonctionnent.',
      regulator: 'ESMA',
      critical: true
    },
    
    // Australia - ASIC
    AU: {
      title: 'ASIC Risk Disclosure',
      content: 'Trading derivatives carries a high level of risk to your capital and you should only trade with money you can afford to lose. This product may not be suitable for all investors.',
      regulator: 'ASIC',
      critical: true
    },
    
    // Default/Internacional
    DEFAULT: {
      title: 'Risk Disclosure',
      content: 'Trading involves substantial risk of loss. Past performance is not indicative of future results. You should carefully consider your investment objectives, level of experience, and risk appetite before trading.',
      regulator: 'General',
      critical: false
    }
  };

  return disclaimers[countryCode] || disclaimers.DEFAULT;
}

export function shouldShowCFDWarning(countryCode: string): boolean {
  // Países de la UE que requieren advertencia específica de CFDs
  const cfdCountries = ['ES', 'GB', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE', 'AT', 'IE'];
  return cfdCountries.includes(countryCode);
}
