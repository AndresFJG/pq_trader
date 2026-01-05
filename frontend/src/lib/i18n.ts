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
      orderSummary: 'Resumen del Pedido',
      productDetails: 'Detalles del Producto',
      paymentMethod: 'Método de Pago',
      card: 'Tarjeta de Crédito/Débito',
      paypal: 'PayPal',
      sepa: 'Transferencia SEPA',
      personalInfo: 'Información Personal',
      billingInfo: 'Información de Facturación',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      country: 'País',
      city: 'Ciudad',
      address: 'Dirección',
      postalCode: 'Código Postal',
      cardNumber: 'Número de Tarjeta',
      cardExpiry: 'Vencimiento',
      cardCVV: 'CVV',
      paypalEmail: 'Email de PayPal',
      sepaIBAN: 'IBAN',
      subtotal: 'Subtotal',
      tax: 'IVA',
      total: 'Total',
      processingPayment: 'Procesando pago...',
      completePurchase: 'Completar Compra',
      securePayment: 'Pago Seguro',
      secureInfo: 'Tus datos están protegidos con encriptación SSL',
      stripeSecure: 'Procesado de forma segura por Stripe',
    },
    whatsapp: {
      message: 'Hola, me gustaría obtener más información sobre los cursos de PQ Trader.',
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
      orderSummary: 'Order Summary',
      productDetails: 'Product Details',
      paymentMethod: 'Payment Method',
      card: 'Credit/Debit Card',
      paypal: 'PayPal',
      sepa: 'SEPA Transfer',
      personalInfo: 'Personal Information',
      billingInfo: 'Billing Information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone',
      country: 'Country',
      city: 'City',
      address: 'Address',
      postalCode: 'Postal Code',
      cardNumber: 'Card Number',
      cardExpiry: 'Expiry Date',
      cardCVV: 'CVV',
      paypalEmail: 'PayPal Email',
      sepaIBAN: 'IBAN',
      subtotal: 'Subtotal',
      tax: 'VAT',
      total: 'Total',
      processingPayment: 'Processing payment...',
      completePurchase: 'Complete Purchase',
      securePayment: 'Secure Payment',
      secureInfo: 'Your data is protected with SSL encryption',
      stripeSecure: 'Securely processed by Stripe',
    },
    whatsapp: {
      message: 'Hello, I would like to get more information about PQ Trader courses.',
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
