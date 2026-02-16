'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { portfolioService, Portfolio } from '@/services/portfolioService';
import { dashboardService, DashboardStats } from '@/services/dashboardService';

export function Hero() {
  const { t } = useLanguage();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioService.getFeaturedPortfolios()
      .then((data) => {
        // Filtrar solo el portafolio JATA (case-insensitive)
        const jata = (data || []).filter((p) => p.name.toLowerCase().includes('jata'));
        setPortfolios(jata);
      });
    dashboardService.getStats()
      .then(setStats);
    setLoading(false);
  }, []);

  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block">
              <span className="bg-profit/10 text-profit px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('hero.title')}{' '}
              <span className="text-profit">{t('hero.titleHighlight')}</span>{' '}
              {t('hero.titleSuffix')}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cursos">
                <Button size="xl" variant="profit" className="group w-full sm:w-auto">
                  <span>{t('hero.cta')}</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/mentorias">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  {t('hero.ctaSecondary')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-profit">{stats ? stats.totalUsers : '...'}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{t('hero.stats.students')}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-profit">{stats ? (stats.totalCourses ? stats.totalCourses.toFixed(1) : '0.0') : '...'}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{t('hero.stats.rating')}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl sm:text-3xl font-bold text-profit">{stats ? stats.totalCourses : '...'}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{t('hero.stats.courses')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Trading Chart Visual */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {loading ? (
                <div className="text-center text-muted-foreground py-16">Cargando portafolios...</div>
              ) : portfolios.length > 0 ? (
                portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="relative bg-secondary/50 backdrop-blur-xl rounded-2xl p-6 sm:p-7 md:p-8 border border-border shadow-2xl min-h-[180px] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-profit" />
                          <span className="font-bold text-lg sm:text-xl">{portfolio.name}</span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          Periodo: Ene 1, 2024 - FEB 2026
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-profit" />
                          <span className="text-xl sm:text-2xl font-bold text-profit">{portfolio.roi >= 0 ? '+' : ''}{portfolio.roi}%</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground mt-1">Retorno Total</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-border pt-3 sm:pt-4 mt-3 sm:mt-4">
                      <div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Win Rate</div>
                        <div className="text-base sm:text-lg font-semibold text-profit">{portfolio.win_rate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Sharpe Ratio</div>
                        <div className="text-base sm:text-lg font-semibold">{portfolio.sharpe_ratio}</div>
                      </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-profit/10 backdrop-blur-xl rounded-lg p-2 sm:p-3 border border-profit/20">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-profit" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-16">No hay portafolios disponibles</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
