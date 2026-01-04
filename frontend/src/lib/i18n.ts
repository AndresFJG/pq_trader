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
      title: 'Aprende Trading Algorítmico con Expertos',
      subtitle: 'Domina el trading algorítmico desde cero. Cursos prácticos, mentorías personalizadas y estrategias probadas con resultados reales.',
      cta: 'Ver Cursos',
      ctaSecondary: 'Reservar Mentoría',
      verified: 'Resultados Verificados',
      students: '+1,000 Alumnos',
      rating: 'Valoración 4.9/5',
    },
    courses: {
      title: 'Nuestros Cursos',
      subtitle: 'Aprende a tu ritmo con contenido de calidad profesional',
      python: {
        name: 'Trading con Python',
        description: 'Aprende a crear robots de trading desde cero',
        price: '$299',
        duration: '40 horas',
        level: 'Principiante',
      },
      strategyquant: {
        name: 'StrategyQuant Masterclass',
        description: 'Crea estrategias sin programar',
        price: '$249',
        duration: '30 horas',
        level: 'Todos los niveles',
      },
      risk: {
        name: 'Gestión de Riesgo',
        description: 'Protege tu capital como un profesional',
        price: '$199',
        duration: '20 horas',
        level: 'Intermedio',
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
      description: 'Plataforma educativa de trading algorítmico con resultados verificados.',
      quickLinks: 'Enlaces Rápidos',
      legal: 'Legal',
      followUs: 'Síguenos',
      rights: 'Todos los derechos reservados',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
      cookies: 'Política de Cookies',
      disclaimer: 'Aviso Legal',
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
      ready: '¿Listo para Empezar?',
      join: 'Únete a más de 1,000 traders que ya están ganando con algoritmos',
      start: 'Comenzar Ahora',
      demo: 'Ver Demo Gratis',
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
      title: 'Learn Algorithmic Trading with Experts',
      subtitle: 'Master algorithmic trading from scratch. Practical courses, personalized mentorships, and proven strategies with real results.',
      cta: 'View Courses',
      ctaSecondary: 'Book Mentorship',
      verified: 'Verified Results',
      students: '+1,000 Students',
      rating: '4.9/5 Rating',
    },
    courses: {
      title: 'Our Courses',
      subtitle: 'Learn at your own pace with professional quality content',
      python: {
        name: 'Python Trading',
        description: 'Learn to create trading bots from scratch',
        price: '$299',
        duration: '40 hours',
        level: 'Beginner',
      },
      strategyquant: {
        name: 'StrategyQuant Masterclass',
        description: 'Create strategies without coding',
        price: '$249',
        duration: '30 hours',
        level: 'All levels',
      },
      risk: {
        name: 'Risk Management',
        description: 'Protect your capital like a professional',
        price: '$199',
        duration: '20 hours',
        level: 'Intermediate',
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
      description: 'Algorithmic trading educational platform with verified results.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      followUs: 'Follow Us',
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms and Conditions',
      cookies: 'Cookie Policy',
      disclaimer: 'Legal Notice',
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
      ready: 'Ready to Start?',
      join: 'Join over 1,000 traders already earning with algorithms',
      start: 'Start Now',
      demo: 'Watch Free Demo',
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
