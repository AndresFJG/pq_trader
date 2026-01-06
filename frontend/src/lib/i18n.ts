// Multi-language support configuration
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export const locales = ['es', 'en'] as const;
export type Locale = typeof locales[number];

export const translations = {
  es: {
    common: {
      courses: 'Cursos',
      mentorships: 'Mentorías',
      portfolios: 'Portafolios',
      rentals: 'Alquileres',
      blog: 'Blog',
      login: 'Iniciar Sesión',
      register: 'Comenzar Ahora',
      learnMore: 'Saber Más',
      buyNow: 'Comprar Ahora',
      getStarted: 'Empezar',
      viewAll: 'Ver Todos',
      readMore: 'Leer Más',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Volver',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      backToTop: 'Volver arriba',
      contactWhatsApp: 'Contactar por WhatsApp',
      viewCourse: 'Ver Curso',
      bookMentorship: 'Reservar Mentoría',
      startFreeTrial: 'Comenzar Gratis',
      talkToSales: 'Hablar con Ventas',
      noCreditCard: 'Sin tarjeta de crédito requerida',
      cancelAnytime: 'Cancela cuando quieras',
    },
    nav: {
      home: 'Inicio',
      courses: 'Cursos',
      mentorships: 'Mentorías',
      strategyquant: 'StrategyQuant',
      portfolios: 'Portafolios',
      rentals: 'Alquileres',
      blog: 'Blog',
      features: 'Funcionalidades',
      about: 'Nosotros',
      contact: 'Contacto',
    },
    hero: {
      badge: '🚀 Resultados reales verificados por Darwinex',
      title: 'Aprende Trading',
      titleHighlight: 'Algorítmico',
      titleSuffix: 'con Expertos',
      subtitle: 'Domina el trading algorítmico desde cero. Cursos prácticos, mentorías personalizadas y estrategias probadas con resultados reales.',
      cta: 'Ver Cursos',
      ctaSecondary: 'Reservar Mentoría',
      stats: {
        students: 'Estudiantes',
        rating: 'Rating Promedio',
        courses: 'Cursos',
      },
      portfolio: 'Portafolio Live',
      winRate: 'Win Rate',
      sharpeRatio: 'Sharpe Ratio',
    },
    courses: {
      title: 'Cursos Destacados',
      subtitle: 'Aprende con contenido estructurado y práctico',
      level: {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
      },
      list: {
        python: {
          title: 'Trading Algorítmico con Python',
          description: 'Aprende a crear estrategias automatizadas desde cero usando Python y bibliotecas especializadas.',
        },
        strategyquant: {
          title: 'StrategyQuant Masterclass',
          description: 'Domina StrategyQuant para diseñar, testear y optimizar robots de trading sin programar.',
        },
        risk: {
          title: 'Gestión de Riesgo Avanzada',
          description: 'Aprende técnicas profesionales de gestión de riesgo y money management.',
        },
      },
    },
    mentorships: {
      title: 'Mentorías Personalizadas',
      subtitle: 'Aprende directamente de traders profesionales',
      individual: 'Sesión Individual',
      pack: 'Pack 4 Sesiones',
      club: 'Club Premium',
      from: 'Desde',
      perSession: 'por sesión',
      perMonth: 'por mes',
    },
    footer: {
      description: 'Aprende trading algorítmico con expertos y resultados reales.',
      products: 'Productos',
      company: 'Compañía',
      legal: 'Legal',
      aboutUs: 'Sobre Nosotros',
      contact: 'Contacto',
      faqs: 'FAQs',
      terms: 'Términos y Condiciones',
      riskDisclosure: 'Divulgación de Riesgos',
      privacy: 'Política de Privacidad',
      cookies: 'Cookies',
      regulatoryNotice: 'Aviso Regulatorio Importante',
      regulatoryText: 'PQ Trader NO está registrado como CTA ante la CFTC/NFA. Los servicios ofrecidos son exclusivamente educativos y no constituyen asesoramiento de inversión. El trading conlleva riesgos elevados de pérdida.',
      regulatoryDisclaimer: 'CFDs prohibidos para residentes de EE.UU. • Solo para fines educativos • Opere con responsabilidad',
      rights: '© 2026 PQ Trader. Todos los derechos reservados.',
    },
    chat: {
      title: 'Asistente Virtual',
      subtitle: 'Respuesta instantánea',
      placeholder: 'Escribe tu pregunta...',
      online: 'Online',
      available: 'Disponible 24/7',
      instant: 'Respuestas instantáneas',
    },
    testimonials: {
      title: 'Lo Que Dicen Nuestros Alumnos',
      subtitle: 'Más de 1,000 traders satisfechos',
    },
    cta: {
      title: '¿Listo para transformar tu trading?',
      subtitle: 'Únete a cientos de traders que ya están automatizando sus estrategias y obteniendo resultados consistentes. Comienza tu prueba gratuita hoy.',
      start: 'Comenzar Gratis',
      sales: 'Hablar con Ventas',
      noCreditCard: '✓ Sin tarjeta de crédito requerida',
      cancelAnytime: '✓ Cancela cuando quieras',
    },
    features: {
      title: '¿Por qué elegir',
      titleHighlight: 'PQ Trader',
      subtitle: 'Todo lo que necesitas para dominar el trading algorítmico en un solo lugar',
      list: {
        courses: {
          title: 'Cursos Completos',
          description: 'Desde principiante hasta avanzado, aprende a tu propio ritmo con material estructurado.',
        },
        mentorships: {
          title: 'Mentorías 1-a-1',
          description: 'Sesiones personalizadas con traders experimentados para resolver tus dudas específicas.',
        },
        results: {
          title: 'Resultados Reales',
          description: 'Visualiza nuestros portafolios en tiempo real integrados con Darwinex.',
        },
        payment: {
          title: 'Pago Seguro',
          description: 'Pagos protegidos con Stripe. Cancela tu suscripción cuando quieras.',
        },
        access: {
          title: 'Acceso Inmediato',
          description: 'Comienza a aprender inmediatamente después de tu suscripción.',
        },
        certificates: {
          title: 'Certificados',
          description: 'Obtén certificados al completar cursos y demuestra tus habilidades.',
        },
      },
    },
    darwinex: {
      title: 'Resultados',
      titleHighlight: 'Verificados',
      subtitle: 'Nuestros portafolios en vivo integrados con Darwinex. Transparencia total.',
      annualReturn: 'Retorno Anual',
      drawdown: 'Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      trades: 'Trades',
      live: 'EN VIVO',
      tradingNow: 'Operando ahora',
    },
    trackRecords: {
      title: 'Track Records',
      subtitle: 'Historial de rendimiento real',
      period: 'Período',
      totalReturn: 'Retorno Total',
      maxDrawdown: 'Drawdown Máximo',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      monthly: 'Retornos Mensuales',
      yearly: 'Retornos Anuales',
    },
    checkout: {
      title: 'Checkout',
      paymentInfo: 'Información de Pago',
      completeData: 'Completa tus datos para finalizar la compra',
      orderSummary: 'Resumen del Pedido',
      productDetails: 'Detalles del Producto',
      paymentMethod: 'Método de Pago',
      paymentCurrency: 'Moneda de Pago',
      detected: 'Detectado',
      detectingLocation: 'Detectando tu ubicación...',
      card: 'Tarjeta',
      paypal: 'PayPal',
      googlePay: 'Google Pay',
      applePay: 'Apple Pay',
      sepa: 'SEPA',
      personalInfo: 'Información Personal',
      fullName: 'Nombre Completo',
      email: 'Email',
      phone: 'Teléfono',
      country: 'País',
      cardInfo: 'Información de Tarjeta',
      cardNumber: 'Número de Tarjeta',
      expiry: 'Vencimiento',
      cvv: 'CVV',
      paypalInfo: 'Información de PayPal',
      paypalEmail: 'Email de PayPal',
      bankingInfo: 'Información Bancaria',
      iban: 'IBAN',
      billingAddress: 'Dirección de Facturación',
      address: 'Dirección',
      city: 'Ciudad',
      postalCode: 'Código Postal',
      processing: 'Procesando...',
      pay: 'Pagar',
      sslSecure: 'SSL Seguro',
      encrypted: 'Encriptado',
      required: '*',
    },
    whatsapp: {
      message: 'Hola, me gustaría obtener más información sobre los cursos de PQ Trader.',
    },
    cookies: {
      title: 'Usamos Cookies',
      description: 'Utilizamos cookies para mejorar tu experiencia. Puedes personalizar tus preferencias o aceptar todas.',
      acceptAll: 'Aceptar Todas',
      acceptNecessary: 'Solo Necesarias',
      customize: 'Personalizar',
      savePreferences: 'Guardar Preferencias',
      necessary: 'Cookies Necesarias',
      necessaryDesc: 'Esenciales para el funcionamiento del sitio',
      analytics: 'Cookies de Análisis',
      analyticsDesc: 'Nos ayudan a mejorar el sitio con estadísticas anónimas',
      marketing: 'Cookies de Marketing',
      marketingDesc: 'Personalizan anuncios según tus intereses',
      learnMore: 'Aprende más sobre nuestra',
      privacyPolicy: 'Política de Privacidad',
    },
    regional: {
      title: 'Aviso Regulatorio',
      cfdWarning: 'Advertencia CFD',
      cfdContent: 'Los CFDs son instrumentos complejos con alto riesgo de pérdida rápida debido al apalancamiento. Entre el 74-89% de inversores minoristas pierden dinero operando CFDs. Considere si comprende cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero.',
    },
    payments: {
      title: 'Métodos de Pago Disponibles',
      selectMethod: 'Selecciona tu método de pago preferido',
      card: 'Tarjeta de Crédito/Débito',
      cardDesc: 'Visa, Mastercard, American Express',
      paypal: 'PayPal',
      paypalDesc: 'Pago seguro con tu cuenta PayPal',
      mercadopago: 'Mercado Pago',
      mercadopagoDesc: 'Disponible en América Latina',
      pix: 'PIX',
      pixDesc: 'Transferencia instantánea (Brasil)',
      sepa: 'Transferencia SEPA',
      sepaDesc: 'Transferencia bancaria (Europa)',
      instant: 'Instantáneo',
      businessDays: 'días hábiles',
      select: 'Seleccionar',
    },
    coursesPage: {
      badge: 'Catálogo Completo',
      title: 'Cursos de Trading',
      titleHighlight: 'Algorítmico',
      subtitle: 'Aprende de traders profesionales. Desde lo básico hasta estrategias avanzadas de trading cuantitativo.',
      filters: {
        level: 'Nivel',
        topic: 'Tema',
        all: 'Todos',
      },
      stats: {
        activeCourses: 'Cursos Activos',
        totalStudents: 'Estudiantes',
        avgRating: 'Calificación Promedio',
      },
      card: {
        students: 'estudiantes',
        hours: 'horas',
        details: 'Ver Detalles',
        buyNow: 'Comprar Ahora',
      },
      filters: {
        level: 'Nivel',
        topic: 'Tema',
        all: 'Todos',
      },
    },
  },
  en: {
    common: {
      courses: 'Courses',
      mentorships: 'Mentorships',
      portfolios: 'Portfolios',
      rentals: 'Rentals',
      blog: 'Blog',
      login: 'Login',
      register: 'Get Started',
      learnMore: 'Learn More',
      buyNow: 'Buy Now',
      getStarted: 'Get Started',
      viewAll: 'View All',
      readMore: 'Read More',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      backToTop: 'Back to top',
      contactWhatsApp: 'Contact via WhatsApp',
      viewCourse: 'View Course',
      bookMentorship: 'Book Mentorship',
      startFreeTrial: 'Start Free Trial',
      talkToSales: 'Talk to Sales',
      noCreditCard: 'No credit card required',
      cancelAnytime: 'Cancel anytime',
    },
    nav: {
      home: 'Home',
      courses: 'Courses',
      mentorships: 'Mentorships',
      strategyquant: 'StrategyQuant',
      portfolios: 'Portfolios',
      rentals: 'Rentals',
      blog: 'Blog',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      badge: '🚀 Real results verified by Darwinex',
      title: 'Learn',
      titleHighlight: 'Algorithmic',
      titleSuffix: 'Trading with Experts',
      subtitle: 'Master algorithmic trading from scratch. Practical courses, personalized mentorships, and proven strategies with real results.',
      cta: 'View Courses',
      ctaSecondary: 'Book Mentorship',
      stats: {
        students: 'Students',
        rating: 'Average Rating',
        courses: 'Courses',
      },
      portfolio: 'Live Portfolio',
      winRate: 'Win Rate',
      sharpeRatio: 'Sharpe Ratio',
    },
    courses: {
      title: 'Featured Courses',
      subtitle: 'Learn with structured and practical content',
      level: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      list: {
        python: {
          title: 'Algorithmic Trading with Python',
          description: 'Learn to create automated strategies from scratch using Python and specialized libraries.',
        },
        strategyquant: {
          title: 'StrategyQuant Masterclass',
          description: 'Master StrategyQuant to design, test, and optimize trading bots without coding.',
        },
        risk: {
          title: 'Advanced Risk Management',
          description: 'Learn professional risk management and money management techniques.',
        },
      },
    },
    mentorships: {
      title: 'Personalized Mentorships',
      subtitle: 'Learn directly from professional traders',
      individual: 'Individual Session',
      pack: '4-Session Pack',
      club: 'Premium Club',
      from: 'From',
      perSession: 'per session',
      perMonth: 'per month',
    },
    footer: {
      description: 'Learn algorithmic trading with experts and real results.',
      products: 'Products',
      company: 'Company',
      legal: 'Legal',
      aboutUs: 'About Us',
      contact: 'Contact',
      faqs: 'FAQs',
      terms: 'Terms and Conditions',
      riskDisclosure: 'Risk Disclosure',
      privacy: 'Privacy Policy',
      cookies: 'Cookies',
      regulatoryNotice: 'Important Regulatory Notice',
      regulatoryText: 'PQ Trader is NOT registered as a CTA with the CFTC/NFA. The services offered are exclusively educational and do not constitute investment advice. Trading involves high risk of loss.',
      regulatoryDisclaimer: 'CFDs prohibited for U.S. residents • For educational purposes only • Trade responsibly',
      rights: '© 2026 PQ Trader. All rights reserved.',
    },
    chat: {
      title: 'Virtual Assistant',
      subtitle: 'Instant response',
      placeholder: 'Type your question...',
      online: 'Online',
      available: 'Available 24/7',
      instant: 'Instant answers',
    },
    testimonials: {
      title: 'What Our Students Say',
      subtitle: 'More than 1,000 satisfied traders',
    },
    cta: {
      title: 'Ready to transform your trading?',
      subtitle: 'Join hundreds of traders already automating their strategies and achieving consistent results. Start your free trial today.',
      start: 'Start Free Trial',
      sales: 'Talk to Sales',
      noCreditCard: '✓ No credit card required',
      cancelAnytime: '✓ Cancel anytime',
    },
    features: {
      title: 'Why choose',
      titleHighlight: 'PQ Trader',
      subtitle: 'Everything you need to master algorithmic trading in one place',
      list: {
        courses: {
          title: 'Complete Courses',
          description: 'From beginner to advanced, learn at your own pace with structured material.',
        },
        mentorships: {
          title: '1-on-1 Mentorships',
          description: 'Personalized sessions with experienced traders to solve your specific questions.',
        },
        results: {
          title: 'Real Results',
          description: 'View our real-time portfolios integrated with Darwinex.',
        },
        payment: {
          title: 'Secure Payment',
          description: 'Payments protected with Stripe. Cancel your subscription anytime.',
        },
        access: {
          title: 'Immediate Access',
          description: 'Start learning immediately after your subscription.',
        },
        certificates: {
          title: 'Certificates',
          description: 'Get certificates upon course completion and prove your skills.',
        },
      },
    },
    darwinex: {
      title: 'Verified',
      titleHighlight: 'Results',
      subtitle: 'Our live portfolios integrated with Darwinex. Total transparency.',
      annualReturn: 'Annual Return',
      drawdown: 'Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      trades: 'Trades',
      live: 'LIVE',
      tradingNow: 'Trading now',
    },
    trackRecords: {
      title: 'Track Records',
      subtitle: 'Real performance history',
      period: 'Period',
      totalReturn: 'Total Return',
      maxDrawdown: 'Max Drawdown',
      sharpeRatio: 'Sharpe Ratio',
      winRate: 'Win Rate',
      monthly: 'Monthly Returns',
      yearly: 'Yearly Returns',
    },
    checkout: {
      title: 'Checkout',
      paymentInfo: 'Payment Information',
      completeData: 'Complete your details to finalize the purchase',
      orderSummary: 'Order Summary',
      productDetails: 'Product Details',
      paymentMethod: 'Payment Method',
      paymentCurrency: 'Payment Currency',
      detected: 'Detected',
      detectingLocation: 'Detecting your location...',
      card: 'Card',
      paypal: 'PayPal',
      googlePay: 'Google Pay',
      applePay: 'Apple Pay',
      sepa: 'SEPA',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      country: 'Country',
      cardInfo: 'Card Information',
      cardNumber: 'Card Number',
      expiry: 'Expiry Date',
      cvv: 'CVV',
      paypalInfo: 'PayPal Information',
      paypalEmail: 'PayPal Email',
      bankingInfo: 'Banking Information',
      iban: 'IBAN',
      billingAddress: 'Billing Address',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      processing: 'Processing...',
      pay: 'Pay',
      sslSecure: 'SSL Secure',
      encrypted: 'Encrypted',
      required: '*',
    },
    whatsapp: {
      message: 'Hello, I would like to get more information about PQ Trader courses.',
    },
    cookies: {
      title: 'We Use Cookies',
      description: 'We use cookies to improve your experience. You can customize your preferences or accept all.',
      acceptAll: 'Accept All',
      acceptNecessary: 'Only Necessary',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Essential for site functionality',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us improve the site with anonymous statistics',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Personalize ads based on your interests',
      learnMore: 'Learn more about our',
      privacyPolicy: 'Privacy Policy',
    },
    regional: {
      title: 'Regulatory Notice',
      cfdWarning: 'CFD Warning',
      cfdContent: 'CFDs are complex instruments with a high risk of rapid loss due to leverage. Between 74-89% of retail investors lose money trading CFDs. Consider whether you understand how CFDs work and whether you can afford the high risk of losing your money.',
    },
    payments: {
      title: 'Available Payment Methods',
      selectMethod: 'Select your preferred payment method',
      card: 'Credit/Debit Card',
      cardDesc: 'Visa, Mastercard, American Express',
      paypal: 'PayPal',
      paypalDesc: 'Secure payment with your PayPal account',
      mercadopago: 'Mercado Pago',
      mercadopagoDesc: 'Available in Latin America',
      pix: 'PIX',
      pixDesc: 'Instant transfer (Brazil)',
      sepa: 'SEPA Transfer',
      sepaDesc: 'Bank transfer (Europe)',
      instant: 'Instant',
      businessDays: 'business days',
      select: 'Select',
    },
    coursesPage: {
      badge: 'Full Catalog',
      title: 'Trading Courses',
      titleHighlight: 'Algorithmic',
      subtitle: 'Learn from professional traders. From basics to advanced quantitative trading strategies.',
      stats: {
        activeCourses: 'Active Courses',
        totalStudents: 'Students',
        avgRating: 'Average Rating',
      },
      card: {
        students: 'students',
        hours: 'hours',
        details: 'View Details',
        buyNow: 'Buy Now',
      },
      filters: {
        level: 'Level',
        topic: 'Topic',
        all: 'All',
      },
    },
  },
};

interface LanguageStore {
  language: Locale;
  setLanguage: (lang: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'es',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'pq-trader-language',
      skipHydration: true,
    }
  )
);

export function useLanguage() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  // Return default language on server/initial render to avoid hydration errors
  if (!mounted) {
    return { language: 'es' as Locale, setLanguage, toggleLanguage, t };
  }

  return { language, setLanguage, toggleLanguage, t };
}

export function detectUserLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
}
