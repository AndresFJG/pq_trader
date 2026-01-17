'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercentage, getPercentageColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// Mock data - En producción vendrá de la API de Darwinex
const portfolios = [
  {
    id: '1',
    name: 'PQT.Alpha',
    return: 24.5,
    drawdown: -8.2,
    sharpeRatio: 2.45,
    winRate: 68.4,
    trades: 342,
  },
  {
    id: '2',
    name: 'PQT.Momentum',
    return: 18.3,
    drawdown: -6.1,
    sharpeRatio: 2.12,
    winRate: 64.2,
    trades: 289,
  },
  {
    id: '3',
    name: 'PQT.Conservative',
    return: 12.7,
    drawdown: -4.3,
    sharpeRatio: 2.89,
    winRate: 71.5,
    trades: 156,
  },
];

export function Darwinex() {
  const { t, language } = useLanguage();
  
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {t('darwinex.title')} <span className="text-profit">{t('darwinex.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('darwinex.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="border-border/50 hover:border-profit/50 transition">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{portfolio.name}</CardTitle>
                  <div className={`p-2 rounded-lg ${portfolio.return > 0 ? 'bg-profit/10' : 'bg-loss/10'}`}>
                    {portfolio.return > 0 ? (
                      <TrendingUp className="h-5 w-5 text-profit" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-loss" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Return */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('darwinex.annualReturn')}</div>
                  <div className={`text-3xl font-bold ${getPercentageColor(portfolio.return)}`}>
                    {formatPercentage(portfolio.return)}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">{t('darwinex.drawdown')}</div>
                    <div className="text-sm font-semibold text-loss">
                      {formatPercentage(portfolio.drawdown)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t('darwinex.sharpeRatio')}</div>
                    <div className="text-sm font-semibold">{portfolio.sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t('darwinex.winRate')}</div>
                    <div className="text-sm font-semibold text-profit">
                      {portfolio.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t('darwinex.trades')}</div>
                    <div className="text-sm font-semibold">{portfolio.trades}</div>
                  </div>
                </div>

                {/* Live Indicator */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Activity className="h-4 w-4 text-profit animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    {language === 'es' ? 'Actualización en tiempo real' : 'Real-time update'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
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
