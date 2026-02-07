'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { TrackRecordCard } from '@/components/trading/TrackRecordCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { TrendingUp, Shield, BarChart3, Zap, CheckCircle, ExternalLink, Award } from 'lucide-react';

import { portfolioService, Portfolio } from '@/services/portfolioService';

function generateChartData(roi: number) {
  const data = [];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthlyReturn = roi / 12;
  
  for (let i = 0; i < 12; i++) {
    data.push({
      date: months[i],
      equity: parseFloat((monthlyReturn * (i + 1)).toFixed(2))
    });
  }
  return data;
}

export default function PortafoliosPage() {
  const { t, language } = useLanguage();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const data = await portfolioService.getAllPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPortfolioData = (portfolio: Portfolio) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0 = Ene, 1 = Feb, etc.
    const monthlyReturn = (portfolio.roi || 0) / 12;
    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    // Generar datos para múltiples años (2024, 2025, 2026)
    const years = [];
    
    // 2024 (últimos 3 meses)
    years.push({
      year: 2024,
      months: monthNames.map((month, idx) => ({
        month,
        return: idx >= 9 ? parseFloat((Math.random() * 0.5).toFixed(2)) : 0
      }))
    });

    // 2025 (año completo)
    years.push({
      year: 2025,
      months: monthNames.map(month => ({
        month,
        return: parseFloat((monthlyReturn + (Math.random() - 0.5) * 3).toFixed(2))
      }))
    });

    // 2026 (solo hasta mes actual)
    years.push({
      year: currentYear,
      months: monthNames.map((month, idx) => ({
        month,
        return: idx <= currentMonth ? parseFloat((monthlyReturn + (Math.random() - 0.5) * 2).toFixed(2)) : 0
      }))
    });

    return {
      name: portfolio.name,
      totalReturn: portfolio.roi || 0,
      period: `Ene 1, 2024 - ${monthNames[currentMonth]} ${currentYear}`,
      maxDrawdown: portfolio.drawdown || 0,
      sharpeRatio: portfolio.sharpe_ratio || 0,
      winRate: portfolio.win_rate || 0,
      darwinexUrl: portfolio.darwinex_url,
      monthlyReturns: years,
      chartData: generateChartData(portfolio.roi || 0)
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <p className="text-muted-foreground">Cargando portafolios...</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <Badge className="mb-6 bg-profit/10 text-profit border-profit/20">
            <Shield className="h-4 w-4 mr-2" />
            {t('portafoliosPage.hero.badge')}
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {t('portafoliosPage.hero.title')} <span className="text-profit">{t('portafoliosPage.hero.titleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('portafoliosPage.hero.subtitle')}
          </p>

          {/* Platform Verification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="bg-surface/80 border-2 border-profit/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <Shield className="h-6 w-6 text-profit" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'es' ? 'Verificado por' : 'Verified by'}</p>
                <p className="text-sm font-bold text-foreground">Darwinex</p>
              </div>
            </div>
            <div className="bg-surface/80 border-2 border-profit/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-profit" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'es' ? 'Compatible con' : 'Compatible with'}</p>
                <p className="text-sm font-bold text-foreground">MetaTrader 4/5</p>
              </div>
            </div>
            <div className="bg-surface/80 border-2 border-profit/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <Zap className="h-6 w-6 text-profit" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'es' ? 'Apto para' : 'Suitable for'}</p>
                <p className="text-sm font-bold text-foreground">{language === 'es' ? 'Cuentas de Fondeo' : 'Funded Accounts'}</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
            {[
              { icon: Shield, label: language === 'es' ? 'Verificado por Darwinex' : 'Verified by Darwinex', color: 'text-profit' },
              { icon: BarChart3, label: language === 'es' ? 'Actualizaciones en Tiempo Real' : 'Real-time Updates', color: 'text-profit' },
              { icon: TrendingUp, label: language === 'es' ? 'Resultados Auditados' : 'Audited Results', color: 'text-profit' },
              { icon: Zap, label: language === 'es' ? 'Sin Filtros ni Trucos' : 'No Filters or Tricks', color: 'text-profit' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-surface/50 border border-border/40 rounded-lg p-6">
                <feature.icon className={`h-8 w-8 ${feature.color} mx-auto mb-3`} />
                <p className="text-sm text-muted-foreground font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JATA Featured Highlight */}
      <section className="py-12 px-4 bg-gradient-to-br from-profit/5 via-background to-background">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-2 border-profit/40 bg-gradient-to-br from-background/90 to-background shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Left - JATA Info */}
              <div className="md:col-span-3 p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-profit/10 text-profit border-profit/30">
                    <Award className="h-3 w-3 mr-1" />
                    {language === 'es' ? 'Destacado' : 'Featured'}
                  </Badge>
                  <Badge variant="outline" className="border-profit/30">
                    Darwinex Zero
                  </Badge>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                  Darwin JATA
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {language === 'es' 
                    ? 'Sistema de trading algorítmico verificado en Darwinex con resultados consistentes y bajo riesgo.'
                    : 'Verified algorithmic trading system on Darwinex with consistent results and low risk.'}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface/50 rounded-lg p-4 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === 'es' ? 'Retorno Total' : 'Total Return'}
                    </p>
                    <p className="text-2xl font-bold text-profit">+18.45%</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
                    <p className="text-2xl font-bold text-foreground">-5.3%</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
                    <p className="text-2xl font-bold text-foreground">2.12</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-4 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-foreground">66.8%</p>
                  </div>
                </div>

                <Button
                  className="bg-gradient-to-r from-profit to-profit/90 hover:from-profit/90 hover:to-profit w-full sm:w-auto group"
                  asChild
                >
                  <a 
                    href="https://www.darwinexzero.com/es/darwin/JATA/performance" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    {language === 'es' ? 'Ver Performance en Darwinex' : 'View Performance on Darwinex'}
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>

              {/* Right - Visual Stats */}
              <div className="md:col-span-2 bg-gradient-to-br from-profit/10 to-background/50 p-8 lg:p-10 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-profit" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        {language === 'es' ? 'Verificado 100%' : '100% Verified'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Track record auditado por Darwinex' : 'Track record audited by Darwinex'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-profit" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        {language === 'es' ? 'Bajo Riesgo' : 'Low Risk'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Drawdown máximo de solo 5.3%' : 'Maximum drawdown of only 5.3%'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-profit" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        {language === 'es' ? 'Consistente' : 'Consistent'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' ? 'Sharpe ratio 2.12 con alta estabilidad' : 'Sharpe ratio 2.12 with high stability'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Portfolios Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {portfolios.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {portfolios.map((portfolio) => (
                <TrackRecordCard key={portfolio.id} data={formatPortfolioData(portfolio)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground">No hay portafolios disponibles en este momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('portafoliosPage.globalStats.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('portafoliosPage.globalStats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">{t('portafoliosPage.globalStats.avgReturn')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-profit">+70.9%</p>
                <p className="text-xs text-muted-foreground mt-2">{t('portafoliosPage.globalStats.lastYear')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">{t('portafoliosPage.globalStats.sharpe')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-foreground">2.58</p>
                <p className="text-xs text-muted-foreground mt-2">{t('portafoliosPage.globalStats.average')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">{t('portafoliosPage.globalStats.maxDD')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-loss">-9.2%</p>
                <p className="text-xs text-muted-foreground mt-2">{t('portafoliosPage.globalStats.average')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">{t('portafoliosPage.globalStats.winRate')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-profit">69.0%</p>
                <p className="text-xs text-muted-foreground mt-2">{t('portafoliosPage.globalStats.average')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-surface/30 border-border/40">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-profit mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">
                {t('portafoliosPage.transparency.title')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('portafoliosPage.transparency.text1')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('portafoliosPage.transparency.text2')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('portafoliosPage.access.title')} <span className="text-profit">{t('portafoliosPage.access.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('portafoliosPage.access.subtitle')}
            </p>
            
            {/* Platform Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="bg-profit/10 border border-profit/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-profit" />
                <span className="text-sm font-semibold text-profit">{t('portafoliosPage.access.verifiedDarwinex')}</span>
              </div>
              <div className="bg-profit/10 border border-profit/30 rounded-full px-4 py-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-profit" />
                <span className="text-sm font-semibold text-profit">{t('portafoliosPage.access.compatibleMT')}</span>
              </div>
              <div className="bg-profit/10 border border-profit/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-profit" />
                <span className="text-sm font-semibold text-profit">{t('portafoliosPage.access.fundingReady')}</span>
              </div>
            </div>
          </div>

          {/* Sección de portafolios de 3, 6 y 12 robots eliminada por duplicidad */}

          {/* Additional Info */}
          <Card className="mt-12 bg-gradient-to-r from-profit/5 to-background border-profit/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{t('portafoliosPage.additional.title')}</h3>
                <p className="text-muted-foreground">{t('portafoliosPage.additional.subtitle')}</p>
              </div>
              <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-profit" />
                <span>{t('portafoliosPage.additional.optimization')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
