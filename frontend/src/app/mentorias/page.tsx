'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Clock, Video, MessageCircle, Users, Award, CheckCircle, Target, Rocket, BookOpen, Linkedin, Mail, Code2, BarChart3, LineChart, Zap, Cpu, TrendingUp, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';
import { getMentors } from '@/lib/mentors';
import { useState } from 'react';
import { mentorshipBookingService } from '@/services/mentorship.service';

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

export default function MentoriasPage() {
  const { t, language } = useLanguage();
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const upcomingSessions = [
    {
      id: '1',
      title: language === 'es' ? 'Trading Algorítmico: Introducción' : 'Algorithmic Trading: Introduction',
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
  
  // Get translated data
  const mentors = getMentors(language);
  
  // Temas de mentoría individuales
  const mentorshipTopics = language === 'es' ? [
    {
      id: 1,
      title: 'Trading en General',
      description: 'Fundamentos de trading, análisis técnico, gestión de riesgo y psicología del trading',
      icon: BarChart3
    },
    {
      id: 2,
      title: 'fxDreema',
      description: 'Desarrollo con fxDreema Builder, optimización de EAs y resolución de dudas técnicas',
      icon: Code2
    },
    {
      id: 3,
      title: 'StrategyQuant X',
      description: 'Generación de estrategias, optimización, WFA y exportación a plataformas',
      icon: Target
    },
    {
      id: 4,
      title: 'MetaTrader 4/5',
      description: 'Configuración, uso de EAs, backtesting y operativa en real',
      icon: LineChart
    },
    {
      id: 5,
      title: 'Python para Trading',
      description: 'Análisis de datos, backtesting, APIs de brokers y automatización',
      icon: BookOpen
    },
    {
      id: 6,
      title: 'PineScript y TradingView',
      description: 'Creación de indicadores personalizados y estrategias automatizadas',
      icon: Zap
    },
    {
      id: 7,
      title: 'MQL5',
      description: 'Desarrollo de EAs, indicadores personalizados y optimización de código',
      icon: Cpu
    },
    {
      id: 8,
      title: 'Performance, Darwinex y Zero',
      description: 'Revisión de performance, análisis de métricas y auditoría de cuentas',
      icon: TrendingUp
    }
  ] : [
    {
      id: 1,
      title: 'General Trading',
      description: 'Trading fundamentals, technical analysis, risk management and trading psychology',
      icon: BarChart3
    },
    {
      id: 2,
      title: 'fxDreema',
      description: 'fxDreema Builder development, EA optimization and technical troubleshooting',
      icon: Code2
    },
    {
      id: 3,
      title: 'StrategyQuant X',
      description: 'Strategy generation, optimization, WFA and platform export',
      icon: Target
    },
    {
      id: 4,
      title: 'MetaTrader 4/5',
      description: 'Configuration, EA usage, backtesting and live trading',
      icon: LineChart
    },
    {
      id: 5,
      title: 'Python for Trading',
      description: 'Data analysis, backtesting, broker APIs and automation',
      icon: BookOpen
    },
    {
      id: 6,
      title: 'PineScript & TradingView',
      description: 'Custom indicators creation and automated strategies',
      icon: Zap
    },
    {
      id: 7,
      title: 'MQL5',
      description: 'EA development, custom indicators and code optimization',
      icon: Cpu
    },
    {
      id: 8,
      title: 'Performance, Darwinex and Zero',
      description: 'Performance review, metrics analysis and account audit',
      icon: TrendingUp
    }
  ];
  
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
              {language === 'es' ? 'Elige tu' : 'Choose your'} <span className="text-profit">{language === 'es' ? 'Plan de Mentoría' : 'Mentorship Plan'}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'es' 
                ? 'Sesiones personalizadas 1 a 1 enfocadas en tus necesidades específicas' 
                : 'Personalized 1-on-1 sessions focused on your specific needs'}
            </p>
            
            {/* Mentorship Topics Grid */}
            <div className="mb-16">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {language === 'es' ? 'Temas Disponibles para Mentoría' : 'Available Mentorship Topics'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'es' 
                    ? 'Elige los temas específicos en los que deseas recibir mentoría de nuestros expertos'
                    : 'Choose the specific topics you want to receive mentoring on from our experts'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mentorshipTopics.map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <div key={topic.id} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-profit/5 to-profit/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Card className="relative border-border/40 hover:border-profit/40 transition-all duration-300 h-full">
                        <CardContent className="pt-8 pb-6 flex flex-col">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-profit/10 mb-4 group-hover:bg-profit/20 transition-colors">
                            <IconComponent className="w-6 h-6 text-profit" />
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">{topic.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
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
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-profit/30">
                        <Image
                          src={mentor.image}
                          alt={mentor.name}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
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
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowDatePicker(true);
                        }}
                      >
                        {t('mentorshipsPage.labels.bookSession')}
                        <Calendar className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'es' ? '¿Cómo funciona?' : 'How it works?'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'es' 
                ? 'Proceso simple para comenzar tu mentoría' 
                : 'Simple process to start your mentorship'}
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

      {/* Date Picker Dialog */}
      <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {language === 'es' ? 'Elige una fecha' : 'Choose a date'}
            </DialogTitle>
            <DialogDescription>
              {language === 'es' 
                ? `Selecciona el día que prefieres para tu mentoría con ${selectedMentor?.name}`
                : `Select the day you prefer for your mentoring session with ${selectedMentor?.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Simple date display - Next 7 days */}
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i + 1);
                const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`w-full p-3 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-profit/20 border-profit text-profit'
                        : 'border-border/40 text-foreground hover:border-profit/40 hover:bg-profit/5'
                    }`}
                  >
                    <div className="font-semibold">
                      {date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? '18:00 - 20:00' : '6:00 PM - 8:00 PM'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Time selection */}
            {selectedDate && (
              <div className="space-y-2 pt-4 border-t border-border/40">
                <p className="text-sm font-semibold text-foreground">
                  {language === 'es' ? 'Horarios disponibles' : 'Available times'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['09:00', '11:00', '14:00', '16:00', '18:00', '20:00'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg border transition-all text-sm font-medium ${
                        selectedTime === time
                          ? 'bg-profit/20 border-profit text-profit'
                          : 'border-border/40 text-foreground hover:border-profit/40'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDatePicker(false);
                  setSelectedTime(null);
                }}
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                variant="profit"
                className="flex-1"
                disabled={!selectedDate || !selectedTime || bookingLoading}
                onClick={async () => {
                  if (!selectedDate || !selectedTime || !selectedMentor) return;

                  try {
                    setBookingLoading(true);
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    
                    // Calculate end time (1 hour after start time)
                    const [hours, minutes] = selectedTime.split(':').map(Number);
                    const endHours = hours + 1;
                    const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                    // Create booking in database
                    const response = await mentorshipBookingService.bookSession({
                      mentor_id: selectedMentor.id,
                      scheduled_date: dateStr,
                      start_time: selectedTime,
                      end_time: endTime,
                      title: `${language === 'es' ? 'Mentoría con' : 'Mentorship with'} ${selectedMentor.name}`,
                      description: selectedMentor.subtitle
                    });

                    // Redirect to checkout with booking info
                    const bookingId = response.data.data.id;
                    window.location.href = `/checkout?type=mentoria&name=Sesión con ${selectedMentor.name}&price=${selectedMentor.price}&description=${encodeURIComponent(selectedMentor.subtitle)}&id=mentor-${selectedMentor.id}&booking_id=${bookingId}&date=${dateStr}`;
                  } catch (error: any) {
                    console.error('Booking error:', error);
                    alert(language === 'es' 
                      ? 'Error al reservar la sesión. Intenta de nuevo.'
                      : 'Error booking session. Please try again.');
                  } finally {
                    setBookingLoading(false);
                  }
                }}
              >
                {bookingLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {language === 'es' ? 'Reservando...' : 'Booking...'}
                  </>
                ) : (
                  <>
                    {language === 'es' ? 'Confirmar' : 'Confirm'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
