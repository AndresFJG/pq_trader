'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  Shield, 
  Workflow, 
  Code, 
  BarChart3,
  CheckCircle,
  Sparkles,
  Cpu,
  LineChart,
  PlayCircle,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: '¿Qué es exactamente StrategyQuant X?',
    answer: 'StrategyQuant X es un software profesional que utiliza inteligencia artificial y machine learning para generar, validar y optimizar sistemas de trading automáticos (robots o EAs). No requiere conocimientos de programación y puede crear estrategias para Forex, Futuros, Acciones y Criptomonedas.'
  },
  {
    question: '¿Por qué personas de todo el mundo usan StrategyQuant?',
    answer: 'Trading cuantificado: Encuentra estrategias estadísticamente sólidas basadas en ventajas verificables sobre el mercado. Reduce errores humanos: Las estrategias algorítmicas operan sin emociones, sin olvidos y sin influencia del miedo o la codicia. Multiplica tu productividad: El software genera y valida millones de estrategias mientras tú haces otra cosa. Características únicas: Herramientas avanzadas que no encontrarás en ninguna otra plataforma del mercado.'
  },
  {
    question: '¿Por qué StrategyQuant es el mejor software de su categoría?',
    answer: 'StrategyQuant X combina generación automática con IA, validación estadística rigurosa (Monte Carlo, Walk-Forward), personalización total de workflows, exportación a múltiples plataformas y construcción de portafolios diversificados. Es el único software que integra todas estas capacidades profesionales en una sola herramienta.'
  },
  {
    question: '¿Cuánto puedo ganar con las estrategias?',
    answer: 'Los resultados varían según tu capital, gestión de riesgo y mercados elegidos. StrategyQuant es una herramienta profesional que te permite crear sistemas con ventaja estadística verificable, pero el trading conlleva riesgos. En nuestro Club aprenderás a crear estrategias robustas y gestionar expectativas realistas. Resultados pasados no garantizan rendimientos futuros.'
  },
  {
    question: '¿Qué incluye el Club StrategyQuant de PQ Trader?',
    answer: 'El Club incluye 4 webinars mensuales en vivo (grupos reducidos), biblioteca de plantillas y workflows optimizados, estrategias verificadas listas para usar, soporte técnico prioritario en español, acceso a comunidad privada de miembros, y descuentos en licencias de StrategyQuant X. Todo por $150/mes sin permanencia.'
  },
  {
    question: '¿Necesito conocimientos de programación?',
    answer: 'No, StrategyQuant X tiene una interfaz visual point & click. Sin embargo, el software te permite personalizar estrategias con código si lo deseas. En el Club te enseñamos ambos enfoques: uso sin programar y personalización avanzada.'
  }
];

export default function StrategyQuantPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('strategyquantPage.features.ai.title'),
      description: t('strategyquantPage.features.ai.description')
    },
    {
      icon: Code,
      title: t('strategyquantPage.features.noCoding.title'),
      description: t('strategyquantPage.features.noCoding.description')
    },
    {
      icon: Shield,
      title: t('strategyquantPage.features.robustness.title'),
      description: t('strategyquantPage.features.robustness.description')
    },
    {
      icon: Workflow,
      title: t('strategyquantPage.features.multiMarket.title'),
      description: t('strategyquantPage.features.multiMarket.description')
    },
    {
      icon: Target,
      title: t('strategyquantPage.features.optimization.title'),
      description: t('strategyquantPage.features.optimization.description')
    },
    {
      icon: BarChart3,
      title: t('strategyquantPage.features.portfolios.title'),
      description: t('strategyquantPage.features.portfolios.description')
    }
  ];

  const process = [
    {
      number: '01',
      title: t('strategyquantPage.process.step1.title'),
      description: t('strategyquantPage.process.step1.description'),
      icon: Sparkles
    },
    {
      number: '02',
      title: t('strategyquantPage.process.step2.title'),
      description: t('strategyquantPage.process.step2.description'),
      icon: Shield
    },
    {
      number: '03',
      title: t('strategyquantPage.process.step3.title'),
      description: t('strategyquantPage.process.step3.description'),
      icon: Code
    },
    {
      number: '04',
      title: t('strategyquantPage.process.step4.title'),
      description: t('strategyquantPage.process.step4.description'),
      icon: LineChart
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background via-profit/5 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Badge className="mb-6 bg-profit/10 text-profit border-profit/20 text-sm">
                <Zap className="h-3 w-3 mr-1" />
                {t('strategyquantPage.hero.badge')}
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                {t('strategyquantPage.hero.title')} <span className="text-profit">{t('strategyquantPage.hero.titleHighlight')}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                {t('strategyquantPage.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/mentorias#club-strategyquant">
                  <Button variant="profit" size="lg" className="text-lg">
                    {t('strategyquantPage.hero.cta')}
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#caracteristicas">
                  <Button variant="outline" size="lg" className="text-lg">
                    {t('strategyquantPage.features.title')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="border-profit/20 hover:border-profit/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-profit/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Cpu className="h-6 w-6 text-profit" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">
                        1000x {language === 'es' ? 'Más Rápido' : 'Faster'}
                      </h3>
                      <p className="text-lg font-bold text-profit mb-1">
                        {language === 'es' ? 'Millones de estrategias/día' : 'Millions of strategies/day'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'es' 
                          ? 'Lo que tardarías años en probar manualmente, StrategyQuant lo hace en horas'
                          : 'What would take you years to test manually, StrategyQuant does in hours'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-profit/20 hover:border-profit/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-profit/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="h-6 w-6 text-profit" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">
                        {language === 'es' ? 'Edge Cuantificado' : 'Quantified Edge'}
                      </h3>
                      <p className="text-lg font-bold text-profit mb-1">
                        95% {language === 'es' ? 'Confianza Estadística' : 'Statistical Confidence'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'es'
                          ? 'Solo estrategias con ventaja matemática verificable pasan los filtros'
                          : 'Only strategies with verifiable mathematical edge pass the filters'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-profit/20 hover:border-profit/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-profit/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-profit" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">
                        {language === 'es' ? 'Resultados Reales' : 'Real Results'}
                      </h3>
                      <p className="text-lg font-bold text-profit mb-1">
                        {language === 'es' ? 'Track Record Verificado' : 'Verified Track Record'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'es'
                          ? 'Estrategias testeadas con datos históricos reales de 20+ años'
                          : 'Strategies tested with real historical data from 20+ years'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="caracteristicas" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('strategyquantPage.benefits.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('strategyquantPage.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:border-profit/40 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-profit/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 text-profit" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-20 px-4 bg-surface/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-profit/10 text-profit border-profit/20">
              <PlayCircle className="h-3 w-3 mr-1" />
              {language === 'es' ? 'Videos Oficiales' : 'Official Videos'}
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              {language === 'es' ? 'Aprende con Tutoriales Oficiales' : 'Learn with Official Tutorials'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {language === 'es' 
                ? 'Demostraciones y guías directamente del equipo de StrategyQuant'
                : 'Demonstrations and guides directly from the StrategyQuant team'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Video 1 - Introducing StrategyQuant X */}
            <Card className="overflow-hidden hover:border-profit/40 transition-all">
              <CardContent className="p-0">
                <a 
                  href="https://www.youtube.com/watch?v=sa5RN9fjSVw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img 
                      src="https://img.youtube.com/vi/sa5RN9fjSVw/maxresdefault.jpg"
                      alt="Introducing StrategyQuant X"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <PlayCircle className="h-20 w-20 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </a>
                <div className="p-6">
                  <Badge className="mb-3 bg-profit/10 text-profit text-xs">
                    {language === 'es' ? 'Video Oficial' : 'Official Video'}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">Introducing StrategyQuant X</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Presentación oficial de la plataforma y sus características principales'
                      : 'Official presentation of the platform and its main features'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Video 2 - QuantDataManager */}
            <Card className="overflow-hidden hover:border-profit/40 transition-all">
              <CardContent className="p-0">
                <a 
                  href="https://www.youtube.com/watch?v=XCSwpbvBaGE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img 
                      src="https://img.youtube.com/vi/XCSwpbvBaGE/maxresdefault.jpg"
                      alt="Introducing QuantDataManager"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <PlayCircle className="h-20 w-20 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </a>
                <div className="p-6">
                  <Badge className="mb-3 bg-profit/10 text-profit text-xs">
                    {language === 'es' ? 'Video Oficial' : 'Official Video'}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">QuantDataManager</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Cómo gestionar y preparar datos históricos para tus estrategias'
                      : 'How to manage and prepare historical data for your strategies'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Curso Gratis */}
            <Card className="overflow-hidden border-2 border-profit/40 transition-all group">
              <CardContent className="p-0">
                <a 
                  href="https://www.youtube.com/playlist?list=PLpSheYEBcnu2f56PO4yOENEnJ0AZBKWgo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative"
                >
                  <div className="relative pb-[56.25%] overflow-hidden bg-gradient-to-br from-profit/20 to-background">
                    <div className="absolute inset-0 bg-[url('https://i.ytimg.com/vi/sa5RN9fjSVw/maxresdefault.jpg')] bg-cover bg-center opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-profit/60 to-profit/30 flex flex-col items-center justify-center">
                      <Badge className="mb-4 bg-profit text-background text-sm px-4 py-1">
                        {language === 'es' ? 'Curso Completo Gratis' : 'Free Complete Course'}
                      </Badge>
                      <PlayCircle className="h-24 w-24 text-white mb-3 group-hover:scale-110 transition-transform drop-shadow-lg" />
                      <p className="text-sm font-semibold text-white drop-shadow-md">
                        {language === 'es' ? 'Ver playlist completa' : 'View complete playlist'}
                      </p>
                      <p className="text-xs text-white/80 mt-1">
                        {language === 'es' ? '20+ videos educativos' : '20+ educational videos'}
                      </p>
                    </div>
                  </div>
                </a>
                <div className="p-6">
                  <Badge className="mb-3 bg-profit text-background text-xs">
                    {language === 'es' ? 'Playlist Oficial' : 'Official Playlist'}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">Free Course - Playlist Completa</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'es'
                      ? 'Serie completa de videos educativos oficiales de StrategyQuant'
                      : 'Complete series of official StrategyQuant educational videos'
                    }
                  </p>
                  <a href="https://www.youtube.com/playlist?list=PLpSheYEBcnu2f56PO4yOENEnJ0AZBKWgo" target="_blank" rel="noopener noreferrer">
                    <Button variant="profit" size="sm" className="w-full">
                      {language === 'es' ? 'Ver en YouTube' : 'Watch on YouTube'}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Club PQ Trader */}
            <Card className="overflow-hidden border-2 border-profit/40 transition-all group">
              <CardContent className="p-0">
                <div className="relative pb-[56.25%] bg-gradient-to-br from-profit/30 to-profit/10 overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Badge className="mb-4 bg-profit text-background">
                      {language === 'es' ? 'Contenido Exclusivo en Español' : 'Exclusive Content in Spanish'}
                    </Badge>
                    <Brain className="h-20 w-20 text-profit mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold">Club PQ Trader</p>
                  </div>
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs">
                    {language === 'es' ? 'Solo Miembros' : 'Members Only'}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-profit" />
                    {language === 'es' ? 'Tutoriales en Español' : 'Spanish Tutorials'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'es'
                      ? 'Webinars semanales en vivo, estrategias reales y soporte personalizado'
                      : 'Weekly live webinars, real strategies and personalized support'
                    }
                  </p>
                  <Link href="/mentorias#club-strategyquant">
                    <Button variant="profit" size="sm" className="w-full">
                      {language === 'es' ? 'Unirme al Club - $150/mes' : 'Join the Club - $150/month'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              {language === 'es'
                ? '¿Prefieres aprender en español con acompañamiento personalizado?'
                : 'Prefer to learn in Spanish with personalized guidance?'
              }
            </p>
            <Link href="/mentorias#club-strategyquant">
              <Button variant="profit" size="lg">
                {language === 'es' ? 'Ver Club StrategyQuant' : 'View StrategyQuant Club'}
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('strategyquantPage.process.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('common.fromConceptToLive') || 'Del concepto al trading en vivo con validación científica'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {process.map((step, index) => (
              <Card key={index} className="border-2 border-border/50 hover:border-profit/40 transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-profit/10 flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-profit" />
                      </div>
                      <div className="text-4xl font-bold text-profit/20 mt-2">{step.number}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Club Section */}
      <section className="py-20 px-4 bg-surface/20">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-profit/30 bg-gradient-to-br from-profit/5 to-background overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-profit text-background">
                  Club Exclusivo
                </Badge>
                <h2 className="text-4xl font-bold mb-4">
                  Club StrategyQuant PQ Trader
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Aprende a dominar la plataforma con sesiones en vivo, plantillas exclusivas y soporte personalizado
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-profit mr-2" />
                    Incluye
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">4 sesiones mensuales en vivo (grupos reducidos)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Biblioteca de plantillas y workflows optimizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Estrategias verificadas listas para usar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Soporte técnico prioritario</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Acceso a comunidad privada de miembros</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Descuentos en licencias de StrategyQuant X</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-surface/30 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Inversión mensual</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-profit">$150</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                    <Badge variant="outline" className="mt-3 border-profit/40 text-profit">
                      Sin permanencia
                    </Badge>
                  </div>

                  <Link href="/mentorias#club-strategyquant" className="block">
                    <Button variant="profit" size="lg" className="w-full">
                      Comenzar Ahora
                      <TrendingUp className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Cancela cuando quieras. Sin compromisos a largo plazo.
                  </p>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-4">
                  ¿Prefieres una sesión individual personalizada?
                </p>
                <Link href="/mentorias">
                  <Button variant="outline">
                    Ver Mentorías 1-a-1
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Learn */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              ¿Por qué aprender StrategyQuant X?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ventajas del trading algorítmico profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-profit hover:border-profit/60 transition-all">
              <CardContent className="p-6">
                <div className="bg-profit/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="h-5 w-5 text-profit" />
                </div>
                <h3 className="font-bold text-lg mb-2">Elimina el factor humano</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estrategias sin emociones ni errores de ejecución.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-profit hover:border-profit/60 transition-all">
              <CardContent className="p-6">
                <div className="bg-profit/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-profit" />
                </div>
                <h3 className="font-bold text-lg mb-2">Enfoque cuantitativo</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ventajas matemáticas comprobables con datos reales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-profit hover:border-profit/60 transition-all">
              <CardContent className="p-6">
                <div className="bg-profit/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5 text-profit" />
                </div>
                <h3 className="font-bold text-lg mb-2">Productividad 1000x</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Genera millones de estrategias automáticamente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-profit hover:border-profit/60 transition-all">
              <CardContent className="p-6">
                <div className="bg-profit/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 text-profit" />
                </div>
                <h3 className="font-bold text-lg mb-2">Funciones únicas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Herramientas que no existen en otras plataformas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Resolvemos tus dudas sobre StrategyQuant X
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="border-2 border-border hover:border-profit/40 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-surface/30 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-profit/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-profit" />
                    </div>
                    <h3 className="font-bold text-lg pr-4">{faq.question}</h3>
                  </div>
                  <ChevronDown 
                    className={`h-6 w-6 text-profit transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pl-20">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Descuento Especial */}
      <section className="py-20 px-4 bg-surface/20">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-profit/40 bg-gradient-to-br from-background to-profit/5">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-profit text-background">
                    Oferta Exclusiva PQ Trader
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">
                    Compra StrategyQuant X con Descuento
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Como miembro del Club PQ Trader tendrás acceso a descuentos especiales en la licencia oficial de StrategyQuant X. 
                    Además, recibirás soporte en español y acompañamiento personalizado.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Descuentos exclusivos para miembros del Club</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Soporte técnico en español incluido</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Formación completa sobre cómo usar el software</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-profit mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Plantillas y workflows pre-configurados</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-surface/30 rounded-lg p-8 text-center">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Prueba gratis por</p>
                    <div className="text-5xl font-bold text-profit mb-2">14 días</div>
                    <p className="text-sm text-muted-foreground">Sin compromisos ni tarjeta de crédito</p>
                  </div>
                  <div className="space-y-3">
                    <a href="https://strategyquant.com/" target="_blank" rel="noopener noreferrer">
                      <Button variant="profit" size="lg" className="w-full">
                        Probar StrategyQuant X Gratis
                      </Button>
                    </a>
                    <Link href="/mentorias#club-strategyquant">
                      <Button variant="outline" size="lg" className="w-full">
                        Unirme al Club - $150/mes
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Miembros del Club reciben código de descuento exclusivo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Empieza a crear tus propios sistemas de trading
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Únete al Club StrategyQuant y aprende de la mano de expertos
          </p>
          <Link href="/mentorias#club-strategyquant">
            <Button variant="profit" size="lg" className="text-lg px-12">
              Unirme al Club - $150/mes
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
