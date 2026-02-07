// --- Mentores destacados ---
export const mentors = [
  {
    name: 'Marco Andres',
    phrase: '“El trading es la forma mas difícil de hacer dinero facil”',
    title: 'Trader & tutor',
    subtitle: 'Trader Algorítmico de enfoque practico',
    description: `Más de 5 años de trayectoria en MQL5 y 100% de éxito en Upwork. Profesor de Trading Algorítmico y experto en el desarrollo de Expert Advisors (EAs) para la plataforma MT4. Ha validado sistemas con esperanza matemática positiva en tiempo real y cuenta con certificaciones oficiales en pruebas de fondeo. Tutor de traders Top 1 en Darwinex Zero.`,
    highlights: [
      'Tutor de traders top 1 en Darwinex Zero.',
      'Calificación: 4.9',
      'Más de 2000 estrategias creadas desde 2021.',
      '5 años de clientes satisfechos en MQL5',
      '4 años como profesor de trading algorítmico.',
      '100% de clientes satisfechos en Upwork',
      'Estrategias con esperanza matemática positiva en tiempo real.',
      'Pruebas de fondeo pasadas con certificación oficial.'
    ],
    link: 'https://www.mql5.com/es/users/marcotisma/news',
    rating: 4.9,
    specialties: [
      'Localizador de ventajas estadísticas y fundamentales en los mercados.',
      'Métodos personalizados basados en la experiencia para actualizar y mejorar estrategias.',
      'Conocimiento de amplio espectro en estrategias de volatilidad extrema.',
      'MQL5',
      'fxDreema',
      'EAbuilder.'
    ],
    yearsMql5: 5,
    upworkSuccess: '100%',
    tagline: 'Trader Algorítmico de enfoque práctico',
    location: 'Miami, FL',
    image: '/martin.jpg',
  },
];
// Archivo: frontend/src/lib/mentorias-data.ts
import { BarChart3, Code2, Target, LineChart, BookOpen, Zap, Cpu, TrendingUp } from 'lucide-react';

export const mentorshipTopics = {
  es: [
    { id: 1, title: 'Trading en General', description: 'Fundamentos de trading, análisis técnico, gestión de riesgo y psicología del trading', icon: BarChart3 },
    { id: 2, title: 'fxDreema', description: 'Desarrollo con fxDreema Builder, optimización de EAs y resolución de dudas técnicas', icon: Code2 },
    { id: 3, title: 'StrategyQuant X', description: 'Generación de estrategias, optimización, WFA y exportación a plataformas', icon: Target },
    { id: 4, title: 'MetaTrader 4/5', description: 'Configuración, uso de EAs, backtesting y operativa en real', icon: LineChart },
    { id: 5, title: 'Python para Trading', description: 'Análisis de datos, backtesting, APIs de brokers y automatización', icon: BookOpen },
    { id: 6, title: 'PineScript y TradingView', description: 'Creación de indicadores personalizados y estrategias automatizadas', icon: Zap },
    { id: 7, title: 'MQL5', description: 'Desarrollo de EAs, indicadores personalizados y optimización de código', icon: Cpu },
    { id: 8, title: 'Performance, Darwinex y Zero', description: 'Revisión de performance, análisis de métricas y auditoría de cuentas', icon: TrendingUp },
  ],
  en: [
    { id: 1, title: 'General Trading', description: 'Trading fundamentals, technical analysis, risk management and trading psychology', icon: BarChart3 },
    { id: 2, title: 'fxDreema', description: 'fxDreema Builder development, EA optimization and technical troubleshooting', icon: Code2 },
    { id: 3, title: 'StrategyQuant X', description: 'Strategy generation, optimization, WFA and platform export', icon: Target },
    { id: 4, title: 'MetaTrader 4/5', description: 'Configuration, EA usage, backtesting and live trading', icon: LineChart },
    { id: 5, title: 'Python for Trading', description: 'Data analysis, backtesting, broker APIs and automation', icon: BookOpen },
    { id: 6, title: 'PineScript & TradingView', description: 'Custom indicators creation and automated strategies', icon: Zap },
    { id: 7, title: 'MQL5', description: 'EA development, custom indicators and code optimization', icon: Cpu },
    { id: 8, title: 'Performance, Darwinex and Zero', description: 'Performance review, metrics analysis and account audit', icon: TrendingUp },
  ],
};

export const packagesTranslated = (language: string) => [
  {
    name: language === 'es' ? 'Sesión Individual' : 'Individual Session',
    duration: language === 'es' ? '1 hora' : '1 hour',
    description: language === 'es'
      ? 'Perfecta para resolver dudas específicas o revisar una estrategia'
      : 'Perfect for resolving specific questions or reviewing a strategy',
    price: 70,
    currency: '$',
    features: language === 'es'
      ? [
        'Videollamada 1-a-1',
        'Revisión de código',
        'Feedback personalizado',
        'Grabación de sesión',
        'Material de apoyo',
      ]
      : [
        '1-on-1 Video call',
        'Code review',
        'Personalized feedback',
        'Session recording',
        'Support materials',
      ],
  },
  {
    name: language === 'es' ? 'Pack 5 Sesiones' : 'Pack 5 Sessions',
    duration: language === 'es' ? '5 horas' : '5 hours',
    description: language === 'es'
      ? 'Ideal para desarrollo de proyecto completo o aprendizaje profundo'
      : 'Ideal for complete project development or deep learning',
    price: 320,
    currency: '$',
    savings: 30,
    features: language === 'es'
      ? [
        'Todo del plan individual',
        'Seguimiento entre sesiones',
        'Revisión de progreso semanal',
        'Soporte por email ilimitado',
        'Material exclusivo',
        'Plan personalizado',
        'Acceso a repositorios privados',
      ]
      : [
        'Everything from individual plan',
        'Follow-up between sessions',
        'Weekly progress review',
        'Unlimited email support',
        'Exclusive materials',
        'Personalized plan',
        'Access to private repositories',
      ],
    popular: true,
  },
  {
    name: language === 'es' ? 'Club PQ Trader' : 'PQ Trader Club',
    duration: language === 'es' ? 'Mensual' : 'Monthly',
    description: language === 'es'
      ? 'Comunidad exclusiva en Skool - Laboratorio de Trading con StrategyQuant'
      : 'Exclusive Skool community - Trading Lab with StrategyQuant',
    price: 0,
    currency: '$',
    recurring: false,
    features: language === 'es'
      ? [
        'Acceso a comunidad Skool',
        'Estrategias exclusivas',
        'Soporte prioritario',
        'Recursos descargables',
        'Networking con traders',
        'Reuniones',
      ]
      : [
        'Access to Skool community',
        'Exclusive strategies',
        'Priority support',
        'Downloadable resources',
        'Networking with traders',
        'Meetings',
      ],
    free: true,
  },
];
