'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercentage, getPercentageColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { portfolioService, Portfolio } from '@/services/portfolioService';

export function Darwinex() {
  const { t, language } = useLanguage();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const data = await portfolioService.getFeaturedPortfolios();
      // Limitar a 3 para esta sección
      setPortfolios(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-secondary/20">
        <div className="container mx-auto text-center">
          <p className="text-sm sm:text-base text-muted-foreground">Cargando portafolios...</p>
        </div>
      </section>
    );
  }

  if (portfolios.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
              {t('darwinex.title')} <span className="text-profit">{t('darwinex.titleHighlight')}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t('darwinex.subtitle')}
            </p>
          </div>
          <div className="text-center py-8 sm:py-10 md:py-12 bg-secondary/30 rounded-lg">
            <p className="text-sm sm:text-base text-muted-foreground">No hay portafolios disponibles en este momento</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            {t('darwinex.title')} <span className="text-profit">{t('darwinex.titleHighlight')}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('darwinex.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="border-border/50 hover:border-profit/50 transition">
              <CardHeader className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">{portfolio.name}</CardTitle>
                  <div className={`p-1.5 sm:p-2 rounded-lg ${portfolio.roi > 0 ? 'bg-profit/10' : 'bg-loss/10'}`}>
                    {portfolio.roi > 0 ? (
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-profit" />
                    ) : (
                      <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-loss" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
                {/* Return */}
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{t('darwinex.annualReturn')}</div>
                  <div className={`text-2xl sm:text-3xl font-bold ${getPercentageColor(portfolio.roi)}`}>
                    {formatPercentage(portfolio.roi)}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{t('darwinex.drawdown')}</div>
                    <div className="text-xs sm:text-sm font-semibold text-loss">
                      {formatPercentage(portfolio.drawdown)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{t('darwinex.sharpeRatio')}</div>
                    <div className="text-xs sm:text-sm font-semibold">{portfolio.sharpe_ratio.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{t('darwinex.winRate')}</div>
                    <div className="text-xs sm:text-sm font-semibold text-profit">
                      {portfolio.win_rate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{t('darwinex.trades')}</div>
                    <div className="text-xs sm:text-sm font-semibold">{portfolio.total_trades}</div>
                  </div>
                </div>

                {/* Live Indicator */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                  <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-profit animate-pulse" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {language === 'es' ? 'Actualización en tiempo real' : 'Real-time update'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            {language === 'es' ? 'Datos verificados por' : 'Data verified by'}{' '}
            <a href="https://www.darwinex.com" target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
              Darwinex
            </a>
            . {language === 'es' ? 'Última actualización:' : 'Last update:'} {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
          </p>
        </div>
      </div>
    </section>
  );
}
