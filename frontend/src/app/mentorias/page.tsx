'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, MessageCircle, Users, Award, CheckCircle, Target, Rocket, BookOpen, Linkedin, Mail, Code2, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

// Profesionales/Mentores - Traducidos
const getMentors = (language: string) => [
  {
    id: '1',
    name: 'Carlos Martínez',
    title: language === 'es' ? 'Fundador & CEO' : 'Founder & CEO',
    subtitle: language === 'es' ? 'Especialista en Trading Algorítmico' : 'Algorithmic Trading Specialist',
    bio: language === 'es' 
      ? 'Más de 12 años de experiencia en mercados financieros. Ex-trader en Goldman Sachs y fundador de PQ Trader. Profesor de Trading Cuantitativo en la Universidad Tecnológica. Ha desarrollado más de 500 estrategias algorítmicas verificadas.'
      : 'Over 12 years of experience in financial markets. Ex-trader at Goldman Sachs and founder of PQ Trader. Professor of Quantitative Trading at the Technological University. Has developed over 500 verified algorithmic strategies.',
    quote: language === 'es' 
      ? 'El éxito en trading algorítmico está en los datos, no en las emociones.'
      : 'Success in algorithmic trading is in the data, not in emotions.',
    specialties: [
      'Python & Trading',
      language === 'es' ? 'Backtesting Avanzado' : 'Advanced Backtesting',
      language === 'es' ? 'Estrategias Cuantitativas' : 'Quantitative Strategies',
      'Risk Management',
      'Portfolio Optimization'
    ],
    experience: language === 'es' ? '12+ años' : '12+ years',
    students: 2500,
    rating: 4.9,
    sessions: 450,
    price: 70,
    image: '👨‍💼',
    linkedin: 'https://linkedin.com',
    email: 'carlos@pqtrader.com',
    achievements: language === 'es' ? [
      'Ex-Quant Trader Goldman Sachs',
      'Profesor Universitario',
      '500+ estrategias desarrolladas',
      'Speaker internacional'
    ] : [
      'Ex-Quant Trader Goldman Sachs',
      'University Professor',
      '500+ strategies developed',
      'International Speaker'
    ]
  },
  {
    id: '2',
    name: 'Ana García',
    title: 'Head of Machine Learning',
    subtitle: language === 'es' ? 'Experta en IA aplicada al Trading' : 'AI Expert Applied to Trading',
    bio: language === 'es'
      ? 'PhD en Ciencias de la Computación con especialización en Machine Learning. 8 años desarrollando modelos predictivos para fondos hedge. Pionera en aplicación de Deep Learning a mercados financieros.'
      : 'PhD in Computer Science with specialization in Machine Learning. 8 years developing predictive models for hedge funds. Pioneer in applying Deep Learning to financial markets.',
    quote: language === 'es' 
      ? 'La IA no reemplaza al trader, lo potencia.'
      : 'AI doesn\'t replace the trader, it empowers them.',
    specialties: [
      'Machine Learning',
      'Deep Learning',
      language === 'es' ? 'NLP para Trading' : 'NLP for Trading',
      'Feature Engineering',
      'Model Optimization'
    ],
    experience: language === 'es' ? '8+ años' : '8+ years',
    students: 1800,
    rating: 4.8,
    sessions: 320,
    price: 70,
    image: '👩‍💻',
    linkedin: 'https://linkedin.com',
    email: 'ana@pqtrader.com',
    achievements: language === 'es' ? [
      'PhD Computer Science',
      'Ex-Citadel Securities',
      '15+ papers publicados',
      'TensorFlow Contributor'
    ] : [
      'PhD Computer Science',
      'Ex-Citadel Securities',
      '15+ papers published',
      'TensorFlow Contributor'
    ]
  },
  {
    id: '3',
    name: 'Roberto Silva',
    title: 'Chief Risk Officer',
    subtitle: language === 'es' ? 'Especialista en Gestión de Riesgo' : 'Risk Management Specialist',
    bio: language === 'es'
      ? 'Más de 15 años gestionando riesgo en fondos hedge y bancos de inversión. Experto en VaR, stress testing y optimización de portfolios. Ha gestionado portfolios de +$500M.'
      : 'Over 15 years managing risk in hedge funds and investment banks. Expert in VaR, stress testing, and portfolio optimization. Has managed portfolios of +$500M.',
    quote: language === 'es'
      ? 'No importa cuán buena sea tu estrategia si no sabes gestionar el riesgo.'
      : 'It doesn\'t matter how good your strategy is if you don\'t know how to manage risk.',
    specialties: [
      'Risk Management',
      'Portfolio Theory',
      'VaR & CVaR',
      'Position Sizing',
      'Diversification'
    ],
    experience: language === 'es' ? '15+ años' : '15+ years',
    students: 1200,
    rating: 4.9,
    sessions: 520,
    price: 70,
    image: '👨‍🏫',
    linkedin: 'https://linkedin.com',
    email: 'roberto@pqtrader.com',
    achievements: language === 'es' ? [
      'Ex-JP Morgan Risk Manager',
      'CFA Charterholder',
      '$500M+ gestionados',
      'Consultor FMI'
    ] : [
      'Ex-JP Morgan Risk Manager',
      'CFA Charterholder',
      '$500M+ managed',
      'IMF Consultant'
    ]
  },
  {
    id: '4',
    name: 'Laura Fernández',
    title: 'HFT Specialist',
    subtitle: language === 'es' ? 'Experta en High Frequency Trading' : 'High Frequency Trading Expert',
    bio: language === 'es'
      ? '10 años desarrollando sistemas de alta frecuencia. Ex-ingeniera en Jane Street y Tower Research. Especialista en low latency, microestructura de mercado y market making.'
      : '10 years developing high-frequency systems. Ex-engineer at Jane Street and Tower Research. Specialist in low latency, market microstructure, and market making.',
    quote: language === 'es'
      ? 'En HFT, los microsegundos son millones.'
      : 'In HFT, microseconds are millions.',
    specialties: [
      'C++ & Low Latency',
      'Market Making',
      language === 'es' ? 'Microestructura' : 'Microstructure',
      'FPGA Trading',
      'Arbitrage Strategies'
    ],
    experience: language === 'es' ? '10+ años' : '10+ years',
    students: 800,
    rating: 4.7,
    sessions: 280,
    price: 70,
    image: '👩‍💼',
    linkedin: 'https://linkedin.com',
    email: 'laura@pqtrader.com',
    achievements: [
      'Ex-Jane Street Capital',
      'FPGA Developer',
      'Latency < 100 nanosec',
      'Patent holder'
    ]
  },
  {
    id: '5',
    name: 'David López',
    title: 'Crypto Trading Lead',
    subtitle: language === 'es' ? 'Especialista en Criptomonedas' : 'Cryptocurrency Specialist',
    bio: language === 'es'
      ? '7 años en mercados cripto. Fundador de un market maker en Binance. Experto en DeFi, arbitraje cross-exchange y trading de volatilidad en derivados cripto.'
      : '7 years in crypto markets. Founder of a market maker on Binance. Expert in DeFi, cross-exchange arbitrage, and volatility trading in crypto derivatives.',
    quote: language === 'es'
      ? 'Crypto es el wild west del trading algorítmico.'
      : 'Crypto is the wild west of algorithmic trading.',
    specialties: [
      'Crypto Trading',
      'DeFi Strategies',
      'Cross-Exchange Arbitrage',
      'MEV & Flashbots',
      'Derivatives'
    ],
    experience: language === 'es' ? '7+ años' : '7+ years',
    students: 1500,
    rating: 4.8,
    sessions: 380,
    price: 190,
    image: '👨‍💻',
    linkedin: 'https://linkedin.com',
    email: 'david@pqtrader.com',
    achievements: [
      'Market Maker Binance',
      'DeFi Protocol Founder',
      'Smart Contract Auditor',
      'Crypto OG since 2017'
    ]
  },
];

const packages = [
  {
    name: 'Sesión Individual',
    duration: '1 hora',
    description: 'Perfecta para resolver dudas específicas o revisar una estrategia',
    price: 70,
    features: [
      'Videollamada 1-a-1',
      'Revisión de código',
      'Feedback personalizado',
      'Grabación de sesión',
      'Material de apoyo'
    ],
  },
  {
    name: 'Pack 5 Sesiones',
    duration: '5 horas',
    description: 'Ideal para desarrollo de proyecto completo o aprendizaje profundo',
    price: 320,
    savings: 30,
    features: [
      'Todo del plan individual',
      'Seguimiento entre sesiones',
      'Revisión de progreso semanal',
      'Soporte por email ilimitado',
      'Material exclusivo',
      'Plan personalizado',
      'Acceso a repositorios privados'
    ],
    popular: true,
  },
  {
    name: 'Club de Trading StrategyQuant',
    duration: 'Mensual',
    description: 'Comunidad exclusiva en Skool - Laboratorio de Trading con StrategyQuant',
    price: 150,
    recurring: true,
    features: [
      'Acceso a comunidad Skool',
      'Mentorías grupales semanales',
      'Estrategias exclusivas',
      'Análisis de mercado diario',
      'Soporte prioritario',
      'Recursos descargables',
      'Networking con traders',
      'Mínimo 10 miembros activos'
    ],
  },
];

// Mentorías Grupales - Traducidas
const getGroupSessions = (language: string) => [
  {
    id: '1',
    title: language === 'es' ? 'Introducción al Trading Algorítmico' : 'Introduction to Algorithmic Trading',
    mentor: 'Carlos Martínez',
    level: language === 'es' ? 'Principiante' : 'Beginner',
    date: language === 'es' ? '15 Enero 2026' : 'January 15, 2026',
    time: '18:00 - 20:00',
    duration: language === 'es' ? '2 horas' : '2 hours',
    spots: 8,
    spotsLeft: 3,
    price: 49,
    topics: language === 'es' ? [
      'Conceptos básicos de trading algorítmico',
      'Python para trading',
      'Tu primera estrategia',
      'Backtesting básico'
    ] : [
      'Basic algorithmic trading concepts',
      'Python for trading',
      'Your first strategy',
      'Basic backtesting'
    ],
    description: language === 'es'
      ? 'Sesión introductoria perfecta para comenzar en el mundo del trading algorítmico. Aprende las bases y desarrolla tu primera estrategia.'
      : 'Perfect introductory session to start in the world of algorithmic trading. Learn the basics and develop your first strategy.',
  },
  {
    id: '2',
    title: language === 'es' ? 'Machine Learning en Trading' : 'Machine Learning in Trading',
    mentor: 'Ana García',
    level: language === 'es' ? 'Intermedio' : 'Intermediate',
    date: language === 'es' ? '18 Enero 2026' : 'January 18, 2026',
    time: '19:00 - 21:30',
    duration: language === 'es' ? '2.5 horas' : '2.5 hours',
    spots: 10,
    spotsLeft: 5,
    price: 79,
    topics: language === 'es' ? [
      'Modelos predictivos',
      'Feature engineering',
      'Overfitting y validación',
      'Random Forest y XGBoost'
    ] : [
      'Predictive models',
      'Feature engineering',
      'Overfitting and validation',
      'Random Forest and XGBoost'
    ],
    description: language === 'es'
      ? 'Aprende a aplicar Machine Learning a tus estrategias. Desde feature engineering hasta modelos avanzados.'
      : 'Learn to apply Machine Learning to your strategies. From feature engineering to advanced models.',
  },
  {
    id: '3',
    title: language === 'es' ? 'Gestión de Riesgo Avanzada' : 'Advanced Risk Management',
    mentor: 'Roberto Silva',
    level: language === 'es' ? 'Avanzado' : 'Advanced',
    date: language === 'es' ? '22 Enero 2026' : 'January 22, 2026',
    time: '17:00 - 19:30',
    duration: language === 'es' ? '2.5 horas' : '2.5 hours',
    spots: 6,
    spotsLeft: 2,
    price: 89,
    topics: language === 'es' ? [
      'VaR y CVaR',
      'Position sizing óptimo',
      'Portfolio optimization',
      'Stress testing'
    ] : [
      'VaR and CVaR',
      'Optimal position sizing',
      'Portfolio optimization',
      'Stress testing'
    ],
    description: language === 'es'
      ? 'Técnicas profesionales de gestión de riesgo. Aprende cómo los fondos hedge protegen su capital.'
      : 'Professional risk management techniques. Learn how hedge funds protect their capital.',
  },
  {
    id: '4',
    title: language === 'es' ? 'Trading de Criptomonedas' : 'Cryptocurrency Trading',
    mentor: 'David López',
    level: language === 'es' ? 'Intermedio' : 'Intermediate',
    date: language === 'es' ? '25 Enero 2026' : 'January 25, 2026',
    time: '20:00 - 22:00',
    duration: language === 'es' ? '2 horas' : '2 hours',
    spots: 12,
    spotsLeft: 7,
    price: 59,
    topics: language === 'es' ? [
      'Particularidades del mercado crypto',
      'APIs de exchanges',
      'Estrategias de arbitraje',
      'DeFi y oportunidades'
    ] : [
      'Crypto market peculiarities',
      'Exchange APIs',
      'Arbitrage strategies',
      'DeFi and opportunities'
    ],
    description: language === 'es'
      ? 'Domina el mercado crypto. Desde lo básico hasta estrategias avanzadas de arbitraje y DeFi.'
      : 'Master the crypto market. From basics to advanced arbitrage and DeFi strategies.',
  },
];

export default function MentoriasPage() {
  const { t, language } = useLanguage();
  
  // Get translated data
  const mentors = getMentors(language);
  const groupSessions = getGroupSessions(language);
  
  const packagesTranslated = [
    {
      name: language === 'es' ? 'Sesión Individual' : 'Individual Session',
      duration: language === 'es' ? '1 hora' : '1 hour',
      description: language === 'es' 
        ? 'Perfecta para resolver dudas específicas o revisar una estrategia'
        : 'Perfect for resolving specific questions or reviewing a strategy',
      price: 70,
      features: language === 'es' 
        ? [
            'Videollamada 1-a-1',
            'Revisión de código',
            'Feedback personalizado',
            'Grabación de sesión',
            'Material de apoyo'
          ]
        : [
            '1-on-1 Video call',
            'Code review',
            'Personalized feedback',
            'Session recording',
            'Support materials'
          ],
    },
    {
      name: language === 'es' ? 'Pack 5 Sesiones' : 'Pack 5 Sessions',
      duration: language === 'es' ? '5 horas' : '5 hours',
      description: language === 'es'
        ? 'Ideal para desarrollo de proyecto completo o aprendizaje profundo'
        : 'Ideal for complete project development or deep learning',
      price: 320,
      savings: 30,
      features: language === 'es'
        ? [
            'Todo del plan individual',
            'Seguimiento entre sesiones',
            'Revisión de progreso semanal',
            'Soporte por email ilimitado',
            'Material exclusivo',
            'Plan personalizado',
            'Acceso a repositorios privados'
          ]
        : [
            'Everything from individual plan',
            'Follow-up between sessions',
            'Weekly progress review',
            'Unlimited email support',
            'Exclusive materials',
            'Personalized plan',
            'Access to private repositories'
          ],
      popular: true,
    },
    {
      name: language === 'es' ? 'Club de Trading StrategyQuant' : 'StrategyQuant Trading Club',
      duration: language === 'es' ? 'Mensual' : 'Monthly',
      description: language === 'es'
        ? 'Comunidad exclusiva en Skool - Laboratorio de Trading con StrategyQuant'
        : 'Exclusive Skool community - Trading Lab with StrategyQuant',
      price: 150,
      recurring: true,
      features: language === 'es'
        ? [
            'Acceso a comunidad Skool',
            'Mentorías grupales semanales',
            'Estrategias exclusivas',
            'Análisis de mercado diario',
            'Soporte prioritario',
            'Recursos descargables',
            'Networking con traders',
            'Mínimo 10 miembros activos'
          ]
        : [
            'Access to Skool community',
            'Weekly group mentorships',
            'Exclusive strategies',
            'Daily market analysis',
            'Priority support',
            'Downloadable resources',
            'Networking with traders',
            'Minimum 10 active members'
          ],
    },
  ];
  
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 bg-profit/10 border border-profit/20 rounded-full px-4 py-2 mb-6">
            <Users className="h-4 w-4 text-profit" />
            <span className="text-sm text-profit font-medium">{t('mentorshipsPage.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {t('mentorshipsPage.title')} <span className="text-profit">{t('mentorshipsPage.titleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('mentorshipsPage.subtitle')}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
            {[
              { icon: Video, label: t('mentorshipsPage.benefits.videoHD') },
              { icon: MessageCircle, label: t('mentorshipsPage.benefits.continuousSupport') },
              { icon: Calendar, label: t('mentorshipsPage.benefits.flexibleSchedule') },
              { icon: Award, label: t('mentorshipsPage.benefits.certificate') },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-surface/50 border border-border/40 rounded-lg p-4">
                <benefit.icon className="h-8 w-8 text-profit mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.individual.title')} <span className="text-profit">{t('mentorshipsPage.individual.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t('mentorshipsPage.individual.subtitle')}
            </p>
            
            {/* Mentorship Topics */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4 font-medium">{t('mentorshipsPage.individual.topicsTitle')}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.trading')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.fxdreema')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.sqx')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.mt45')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.python')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.pinescript')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.mql5')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.performance')}
                </Badge>
                <Badge variant="outline" className="bg-profit/10 border-profit/30 text-profit px-4 py-2 text-sm font-semibold">
                  {t('mentorshipsPage.individual.topics.darwinex')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packagesTranslated.map((pkg) => (
              <Card 
                key={pkg.name}
                className={`relative ${pkg.popular ? 'border-profit shadow-lg shadow-profit/20' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-profit text-background text-xs font-bold px-4 py-1 rounded-full">
                      {language === 'es' ? 'MÁS POPULAR' : 'MOST POPULAR'}
                    </span>
                  </div>
                )}

                {/* Certification Badge */}
                <div className="absolute top-4 right-4 bg-profit/10 border border-profit/30 rounded-full p-2">
                  <Award className="h-4 w-4 text-profit" />
                </div>

                <CardHeader className="text-center pb-8 pt-12">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-profit">${pkg.price}</span>
                    {pkg.savings && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${pkg.price + pkg.savings}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                    {pkg.recurring && (
                      <Badge variant="outline" className="ml-2 border-profit/40 text-profit text-xs">
                        {language === 'es' ? 'Suscripción Mensual' : 'Monthly Subscription'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-profit mt-0.5">✓</span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={pkg.popular ? 'profit' : 'outline'} 
                    className="w-full"
                    asChild
                  >
                    <Link href={`/checkout?type=mentoria&name=${encodeURIComponent(pkg.name)}&price=${pkg.price}&description=${encodeURIComponent(pkg.description)}&id=${pkg.name.toLowerCase().replace(/\s+/g, '-')}&recurring=${pkg.recurring ? 'true' : 'false'}`}>
                      {pkg.recurring 
                        ? (language === 'es' ? 'Suscribirme Ahora' : 'Subscribe Now')
                        : (language === 'es' ? 'Comenzar Ahora' : 'Start Now')
                      }
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section - Detailed */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.mentors.title')} <span className="text-profit">{t('mentorshipsPage.mentors.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('mentorshipsPage.mentors.subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {mentors.map((mentor, index) => (
              <Card 
                key={mentor.id} 
                className="overflow-hidden border-border/40 hover:border-profit/40 transition-all"
              >
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  {/* Image/Info Side */}
                  <div className={`bg-gradient-to-br from-profit/10 to-background p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="text-center mb-6">
                      <div className="text-8xl mb-4">{mentor.image}</div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{mentor.name}</h3>
                      <p className="text-profit font-semibold mb-1">{mentor.title}</p>
                      <p className="text-sm text-muted-foreground mb-4">{mentor.subtitle}</p>
                      
                      {/* Stats */}
                      <div className="flex justify-center gap-6 mb-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-profit">{mentor.students}+</p>
                          <p className="text-xs text-muted-foreground">{t('mentorshipsPage.labels.students')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-profit">{mentor.rating}</p>
                          <p className="text-xs text-muted-foreground">{t('mentorshipsPage.labels.rating')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-profit">{mentor.sessions}+</p>
                          <p className="text-xs text-muted-foreground">{t('mentorshipsPage.labels.sessions')}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex justify-center gap-3">
                        <a 
                          href={mentor.linkedin}
                          className="p-2 bg-background hover:bg-profit/10 rounded-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-5 w-5 text-profit" />
                        </a>
                        <a 
                          href={`mailto:${mentor.email}`}
                          className="p-2 bg-background hover:bg-profit/10 rounded-lg transition-colors"
                        >
                          <Mail className="h-5 w-5 text-profit" />
                        </a>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-2">
                      {mentor.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    {/* Quote */}
                    <div className="mb-6">
                      <div className="text-6xl text-profit/20 leading-none mb-2">&ldquo;</div>
                      <p className="text-lg italic text-foreground mb-2">{mentor.quote}</p>
                      <div className="text-6xl text-profit/20 leading-none text-right">&rdquo;</div>
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {mentor.bio}
                    </p>

                    {/* Specialties */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-profit" />
                        {t('mentorshipsPage.labels.specialties')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs bg-profit/10 text-profit px-3 py-1.5 rounded-full font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-border/40">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t('mentorshipsPage.labels.priceFrom')}</p>
                        <p className="text-3xl font-bold text-profit">
                          ${mentor.price}
                          <span className="text-base font-normal text-muted-foreground">/{t('mentorshipsPage.labels.session').toLowerCase()}</span>
                        </p>
                      </div>
                      <Button 
                        variant="profit" 
                        size="lg"
                        className="group"
                        asChild
                      >
                        <Link href={`/checkout?type=mentoria&name=Sesión con ${mentor.name}&price=${mentor.price}&description=${encodeURIComponent(mentor.subtitle)}&id=mentor-${mentor.id}`}>
                          {t('mentorshipsPage.labels.bookSession')}
                          <Calendar className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Group Sessions */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.groupSessions.title')} <span className="text-profit">{t('mentorshipsPage.groupSessions.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('mentorshipsPage.groupSessions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {groupSessions.map((session) => (
              <Card key={session.id} className="border-border/40 hover:border-profit/40 transition-all overflow-hidden">
                <div className="bg-gradient-to-r from-profit/10 to-background p-4 border-b border-border/40">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">con {session.mentor}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      session.level === 'Principiante' ? 'bg-blue-500/10 text-blue-500' :
                      session.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {session.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {session.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.time}
                    </div>
                  </div>
                </div>

                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">{session.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">{t('mentorshipsPage.groupSessions.topicsTitle')}</h4>
                    <ul className="space-y-2">
                      {session.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span>{session.spotsLeft} {t('mentorshipsPage.groupSessions.spotsOf')} {session.spots} {t('mentorshipsPage.groupSessions.spotsLeft')}</span>
                      </div>
                      <p className="text-3xl font-bold text-profit">
                        ${session.price}
                      </p>
                    </div>
                    <Button 
                      variant="profit" 
                      size="lg"
                      disabled={session.spotsLeft === 0}
                      asChild={session.spotsLeft > 0}
                    >
                      {session.spotsLeft === 0 ? (
                        t('mentorshipsPage.groupSessions.soldOut')
                      ) : (
                        <Link href={`/checkout?type=mentoria-grupal&name=${encodeURIComponent(session.title)}&price=${session.price}&description=${encodeURIComponent(session.description)}&id=${session.id}`}>
                          {t('mentorshipsPage.groupSessions.reserveButton')}
                        </Link>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Group Benefits */}
          <Card className="bg-gradient-to-r from-profit/5 to-background border-profit/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                {t('mentorshipsPage.groupSessions.whyGroup')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-profit/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-profit" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{t('mentorshipsPage.groupSessions.whyGroupBenefits.networking.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('mentorshipsPage.groupSessions.whyGroupBenefits.networking.desc')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-profit/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-profit" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{t('mentorshipsPage.groupSessions.whyGroupBenefits.affordable.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('mentorshipsPage.groupSessions.whyGroupBenefits.affordable.desc')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-profit/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-profit" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{t('mentorshipsPage.groupSessions.whyGroupBenefits.recordings.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('mentorshipsPage.groupSessions.whyGroupBenefits.recordings.desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.howItWorks.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('mentorshipsPage.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '1', 
                icon: Users,
                title: t('mentorshipsPage.howItWorks.steps.step1.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step1.desc') 
              },
              { 
                step: '2', 
                icon: Calendar,
                title: t('mentorshipsPage.howItWorks.steps.step2.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step2.desc') 
              },
              { 
                step: '3', 
                icon: BookOpen,
                title: t('mentorshipsPage.howItWorks.steps.step3.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step3.desc') 
              },
              { 
                step: '4', 
                icon: Rocket,
                title: t('mentorshipsPage.howItWorks.steps.step4.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step4.desc') 
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-profit/10 border-2 border-profit rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="h-8 w-8 text-profit" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-profit text-background rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.faqs.title')}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: t('mentorshipsPage.faqs.items.q1.q'),
                a: t('mentorshipsPage.faqs.items.q1.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q2.q'),
                a: t('mentorshipsPage.faqs.items.q2.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q3.q'),
                a: t('mentorshipsPage.faqs.items.q3.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q4.q'),
                a: t('mentorshipsPage.faqs.items.q4.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q5.q'),
                a: t('mentorshipsPage.faqs.items.q5.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q6.q'),
                a: t('mentorshipsPage.faqs.items.q6.a')
              }
            ].map((faq, idx) => (
              <Card key={idx} className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm pl-8">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-profit/10 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('mentorshipsPage.cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('mentorshipsPage.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="profit" size="lg" className="group" asChild>
              <Link href="/mentorias#planes">
                {t('mentorshipsPage.cta.startButton')}
                <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:contacto@pqtrader.com">
                {t('mentorshipsPage.cta.callButton')}
                <MessageCircle className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
