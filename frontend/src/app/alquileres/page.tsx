'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { Download, Shield, TrendingUp, Zap, CheckCircle, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { RiskDisclaimer, USRestrictionBanner } from '@/components/legal/RiskDisclaimer';

export default function AlquileresPage() {
  const { t, language, translations } = useLanguage();
  
  const benefits = [
    {
      icon: Shield,
      title: t('alquileresPage.benefits.benefit1.title'),
      description: t('alquileresPage.benefits.benefit1.description'),
    },
    {
      icon: Zap,
      title: t('alquileresPage.benefits.benefit2.title'),
      description: t('alquileresPage.benefits.benefit2.description'),
    },
    {
      icon: Target,
      title: t('alquileresPage.benefits.benefit3.title'),
      description: t('alquileresPage.benefits.benefit3.description'),
    },
    {
      icon: BarChart3,
      title: t('alquileresPage.benefits.benefit4.title'),
      description: t('alquileresPage.benefits.benefit4.description'),
    },
  ];
  
  const rentalPlans = [
    {
      id: '1',
      name: t('alquileresPage.plans.individual.name'),
      type: language === 'es' ? 'Para Cuentas de Fondeo' : 'For Funded Accounts',
      description: t('alquileresPage.plans.individual.description'),
      features: translations.alquileresPage.plans.individual.features,
      pricing: [
        { period: language === 'es' ? 'Mensual' : 'Monthly', price: 50, unit: language === 'es' ? '$/mes' : '$/month' },
        { period: language === 'es' ? 'Trimestral' : 'Quarterly', price: 130, unit: language === 'es' ? '$/3 meses' : '$/3 months', savings: t('alquileresPage.plans.individual.cta') },
        { period: language === 'es' ? 'Semestral' : 'Semiannual', price: 250, unit: language === 'es' ? '$/6 meses' : '$/6 months', savings: t('alquileresPage.plans.individual.cta'), popular: true }
      ],
      stats: {
        winRate: '65%',
        sharpe: '2.1',
        maxDD: '-8%'
      },
      cta: t('alquileresPage.plans.individual.cta')
    },
    {
      id: '2',
      name: t('alquileresPage.plans.portfolioFondeo.name'),
      type: language === 'es' ? 'Pack de 3 Sistemas' : 'Pack of 3 Systems',
      description: t('alquileresPage.plans.portfolioFondeo.description'),
      features: translations.alquileresPage.plans.portfolioFondeo.features,
      pricing: [
        { period: language === 'es' ? 'Mensual' : 'Monthly', price: 120, unit: language === 'es' ? '$/mes' : '$/month' },
        { period: language === 'es' ? 'Trimestral' : 'Quarterly', price: 320, unit: language === 'es' ? '$/3 meses' : '$/3 months', savings: t('alquileresPage.plans.portfolioFondeo.savings') },
        { period: language === 'es' ? 'Semestral' : 'Semiannual', price: 600, unit: language === 'es' ? '$/6 meses' : '$/6 months', savings: t('alquileresPage.plans.portfolioFondeo.savings'), popular: true }
      ],
      stats: {
        winRate: '68%',
        sharpe: '2.4',
        maxDD: '-6%'
      },
      badge: t('alquileresPage.plans.portfolioFondeo.popular'),
      cta: t('alquileresPage.plans.portfolioFondeo.cta')
    },
    {
      id: '3',
      name: t('alquileresPage.plans.portfolioDarwinex.name'),
      type: language === 'es' ? 'Trading en Vivo' : 'Live Trading',
      description: t('alquileresPage.plans.portfolioDarwinex.description'),
      features: translations.alquileresPage.plans.portfolioDarwinex.features,
      pricing: [
        { period: language === 'es' ? 'Mensual' : 'Monthly', price: 200, unit: language === 'es' ? '$/mes' : '$/month' },
        { period: language === 'es' ? 'Trimestral' : 'Quarterly', price: 550, unit: language === 'es' ? '$/3 meses' : '$/3 months', savings: t('alquileresPage.plans.portfolioDarwinex.savings') },
        { period: language === 'es' ? 'Semestral' : 'Semiannual', price: 1050, unit: language === 'es' ? '$/6 meses' : '$/6 months', savings: t('alquileresPage.plans.portfolioDarwinex.savings'), popular: true }
      ],
      stats: {
        winRate: '70%',
        sharpe: '2.6',
        maxDD: '-5%'
      },
      cta: t('alquileresPage.plans.portfolioDarwinex.cta')
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl">
          {/* US Restriction Banner */}
          <div className="mb-8">
            <USRestrictionBanner />
          </div>

          <div className="text-center">
            <Badge className="mb-6 bg-profit/10 text-profit border-profit/20">
              <Download className="h-3 w-3 mr-1" />
              {t('alquileresPage.hero.badge')}
            </Badge>
          
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('alquileresPage.hero.title')} <span className="text-profit">{t('alquileresPage.hero.titleHighlight')}</span>
            </h1>
          
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('alquileresPage.hero.subtitle')}
            </p>

            <div className="mt-6">
              <Link href="#estadisticas">
                <Button variant="outline" size="sm">
                  {t('alquileresPage.hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <RiskDisclaimer productType="general" />
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('alquileresPage.plans.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('alquileresPage.plans.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rentalPlans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden hover:border-profit/40 transition-all">
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-profit text-background">{plan.badge}</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-profit font-medium">{plan.type}</p>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 p-4 bg-surface/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                      <p className="text-sm font-bold text-profit">{plan.stats.winRate}</p>
                    </div>
                    <div className="text-center border-x border-border/40">
                      <p className="text-xs text-muted-foreground">Sharpe</p>
                      <p className="text-sm font-bold">{plan.stats.sharpe}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Max DD</p>
                      <p className="text-sm font-bold text-loss">{plan.stats.maxDD}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Options */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    {plan.pricing.map((option, index) => (
                      <Link 
                        key={index}
                        href={`/checkout?type=alquiler&id=${plan.id}-${option.period.toLowerCase()}&name=${encodeURIComponent(plan.name + ' - ' + option.period)}&price=${option.price}&description=${encodeURIComponent(plan.description)}&period=${option.period}`}
                        className="block"
                      >
                        <div 
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                            option.popular 
                              ? 'border-profit/40 bg-profit/5 hover:border-profit' 
                              : 'border-border/40 hover:border-profit/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{option.period}</span>
                            {option.popular && (
                              <Badge variant="outline" className="text-xs border-profit/40 text-profit">
                                {t('alquileresPage.pricing.bestValue')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-profit">{option.price}</span>
                            <span className="text-sm text-muted-foreground">{option.unit}</span>
                          </div>
                          {option.savings && (
                            <p className="text-xs text-profit mt-1">{option.savings}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <p className="text-xs text-muted-foreground text-center w-full">
                    {t('alquileresPage.pricing.selectPeriod')}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-surface/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('alquileresPage.whyRent.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:border-profit/40 transition-all">
                <CardHeader>
                  <div className="bg-profit/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-profit" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="estadisticas" className="py-16 px-4 bg-surface/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('alquileresPage.stats.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('alquileresPage.stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">$50</p>
              <p className="text-sm text-muted-foreground">{t('alquileresPage.stats.fromMonth')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Shield className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">{t('alquileresPage.stats.verified')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Zap className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">{t('alquileresPage.stats.support')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Target className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">70%</p>
              <p className="text-sm text-muted-foreground">{t('alquileresPage.stats.winRate')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="border-profit/20 bg-gradient-to-br from-profit/5 to-background">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-3xl font-bold mb-4">
                {t('alquileresPage.cta.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('alquileresPage.cta.subtitle')}
              </p>
              <Link href="/mentorias">
                <Button className="bg-profit hover:bg-profit/90 text-white" size="lg">
                  {t('alquileresPage.cta.button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
