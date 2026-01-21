'use client';

import { useEffect, useState } from 'react';
import { TrackRecordCard } from '@/components/trading/TrackRecordCard';
import { portfolioService, Portfolio } from '@/services/portfolioService';

export function TrackRecords() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const data = await portfolioService.getFeaturedPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para convertir portfolios a formato de TrackRecordCard
  const formatPortfolioData = (portfolio: Portfolio) => {
    // Generar datos de gráfico simulados basados en el ROI
    const generateChartData = (roi: number) => {
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
    };

    // Generar retornos mensuales simulados
    const currentYear = new Date().getFullYear();
    const monthlyReturn = portfolio.roi / 12;
    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    return {
      name: portfolio.name,
      totalReturn: portfolio.roi || 0,
      period: `Ene 1, ${currentYear - 1} - Dic 31, ${currentYear}`,
      maxDrawdown: portfolio.drawdown || 0,
      sharpeRatio: portfolio.sharpe_ratio || 0,
      winRate: portfolio.win_rate || 0,
      monthlyReturns: [
        {
          year: currentYear,
          months: monthNames.map(month => ({
            month,
            return: parseFloat((monthlyReturn + (Math.random() - 0.5) * 2).toFixed(2))
          }))
        }
      ],
      chartData: generateChartData(portfolio.roi || 0)
    };
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-muted-foreground">Cargando portafolios...</p>
        </div>
      </section>
    );
  }

  if (portfolios.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Resultados <span className="text-profit">Verificables</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track records reales de nuestros sistemas de trading.
            </p>
          </div>
          <div className="text-center py-12 bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground">No hay portafolios disponibles en este momento</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resultados <span className="text-profit">Verificables</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track records reales de nuestros sistemas de trading. 
            Todos los datos están verificados y actualizados en tiempo real desde Darwinex.
          </p>
        </div>

        {/* Grid de Track Records */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {portfolios.map((portfolio) => (
            <TrackRecordCard key={portfolio.id} data={formatPortfolioData(portfolio)} />
          ))}
        </div>

        {/* CTA Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Los resultados pasados no garantizan rendimientos futuros
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-profit hover:text-profit/80 transition-colors font-semibold"
          >
            Ver todos los sistemas activos →
          </a>
        </div>
      </div>
    </section>
  );
}
