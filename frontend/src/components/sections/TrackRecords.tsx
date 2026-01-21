'use client';

import { TrackRecordCard } from '@/components/trading/TrackRecordCard';

// TODO: Conectar con Darwinex API real
// Estos datos vienen directamente de la API de Darwinex
const trackRecordsData: any[] = [];

// Función auxiliar para generar datos de gráfico desde retornos mensuales reales
function generateChartData(monthlyReturns: { year: number; months: { month: string; return: number }[] }[]) {
  const data: { date: string; equity: number }[] = [];
  let currentEquity = 0;

  monthlyReturns.forEach((yearData) => {
    yearData.months.forEach((monthData) => {
      currentEquity += monthData.return;
      
      // Determinar el mes basado en el nombre del mes
      const monthIndex = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'].indexOf(monthData.month);
      
      const date = new Date(yearData.year, monthIndex);
      
      data.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        equity: parseFloat(currentEquity.toFixed(2)),
      });
    });
  });

  return data;
}

export function TrackRecords() {
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
          {trackRecordsData.map((record) => (
            <TrackRecordCard key={record.name} data={record} />
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
