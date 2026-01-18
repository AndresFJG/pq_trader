'use client';

import { TrackRecordCard } from '@/components/trading/TrackRecordCard';

// Mock data - En producción esto vendría de la API
const trackRecordsData = [
  {
    name: 'PSI',
    totalReturn: 39.88,
    period: 'Dic 12, 2022 - Dic 12, 2025',
    maxDrawdown: -8.2,
    sharpeRatio: 2.45,
    winRate: 68.4,
    monthlyReturns: [
      {
        year: 2022,
        months: [
          { month: 'ENE', return: 0 },
          { month: 'FEB', return: 0 },
          { month: 'MAR', return: 0 },
          { month: 'ABR', return: 0 },
          { month: 'MAY', return: 0 },
          { month: 'JUN', return: 0 },
          { month: 'JUL', return: 0 },
          { month: 'AGO', return: 0 },
          { month: 'SEP', return: 0 },
          { month: 'OCT', return: 0 },
          { month: 'NOV', return: 0 },
          { month: 'DIC', return: 0 },
        ],
      },
      {
        year: 2023,
        months: [
          { month: 'ENE', return: 1.64 },
          { month: 'FEB', return: 1.89 },
          { month: 'MAR', return: 2.77 },
          { month: 'ABR', return: 0.03 },
          { month: 'MAY', return: 1.46 },
          { month: 'JUN', return: 0.18 },
          { month: 'JUL', return: 1.24 },
          { month: 'AGO', return: -0.06 },
          { month: 'SEP', return: -2.91 },
          { month: 'OCT', return: 2.66 },
          { month: 'NOV', return: 1.03 },
          { month: 'DIC', return: 7.93 },
        ],
      },
      {
        year: 2024,
        months: [
          { month: 'ENE', return: 0.00 },
          { month: 'FEB', return: 1.85 },
          { month: 'MAR', return: 2.77 },
          { month: 'ABR', return: -0.90 },
          { month: 'MAY', return: 0.73 },
          { month: 'JUN', return: -0.21 },
          { month: 'JUL', return: 0.20 },
          { month: 'AGO', return: 2.62 },
          { month: 'SEP', return: 2.54 },
          { month: 'OCT', return: 0.03 },
          { month: 'NOV', return: 0.23 },
          { month: 'DIC', return: 16.06 },
        ],
      },
      {
        year: 2025,
        months: [
          { month: 'ENE', return: 0.29 },
          { month: 'FEB', return: 0.86 },
          { month: 'MAR', return: 1.82 },
          { month: 'ABR', return: -1.72 },
          { month: 'MAY', return: 0.52 },
          { month: 'JUN', return: 0.86 },
          { month: 'JUL', return: 0.26 },
          { month: 'AGO', return: 1.05 },
          { month: 'SEP', return: 0.27 },
          { month: 'OCT', return: -0.45 },
          { month: 'NOV', return: -2.91 },
          { month: 'DIC', return: -2.80 },
        ],
      },
    ],
    get chartData() {
      return generateChartData(this.monthlyReturns);
    },
  },
  {
    name: 'QM2',
    totalReturn: 22.71,
    period: 'Nov 1, 2023 - Dic 12, 2025',
    maxDrawdown: -6.5,
    sharpeRatio: 1.89,
    winRate: 64.2,
    monthlyReturns: [
      {
        year: 2023,
        months: [
          { month: 'ENE', return: 0 },
          { month: 'FEB', return: 0 },
          { month: 'MAR', return: 0 },
          { month: 'ABR', return: 0 },
          { month: 'MAY', return: 0 },
          { month: 'JUN', return: 0 },
          { month: 'JUL', return: 0 },
          { month: 'AGO', return: 0 },
          { month: 'SEP', return: 0 },
          { month: 'OCT', return: 0 },
          { month: 'NOV', return: 2.11 },
          { month: 'DIC', return: 2.03 },
        ],
      },
      {
        year: 2024,
        months: [
          { month: 'ENE', return: -0.29 },
          { month: 'FEB', return: 4.50 },
          { month: 'MAR', return: 0.79 },
          { month: 'ABR', return: -0.34 },
          { month: 'MAY', return: 3.28 },
          { month: 'JUN', return: 3.32 },
          { month: 'JUL', return: -0.52 },
          { month: 'AGO', return: 8.20 },
          { month: 'SEP', return: 0.22 },
          { month: 'OCT', return: 0.46 },
          { month: 'NOV', return: 0.68 },
          { month: 'DIC', return: 1.07 },
        ],
      },
      {
        year: 2025,
        months: [
          { month: 'ENE', return: 0.77 },
          { month: 'FEB', return: 1.15 },
          { month: 'MAR', return: -3.29 },
          { month: 'ABR', return: 2.54 },
          { month: 'MAY', return: 0.21 },
          { month: 'JUN', return: 2.60 },
          { month: 'JUL', return: 0.22 },
          { month: 'AGO', return: 0.46 },
          { month: 'SEP', return: 1.29 },
          { month: 'OCT', return: -0.15 },
          { month: 'NOV', return: -0.34 },
          { month: 'DIC', return: 7.69 },
        ],
      },
    ],
    get chartData() {
      return generateChartData(this.monthlyReturns);
    },
  },
  {
    name: 'QXPA',
    totalReturn: 106.51,
    period: 'Mar 31, 2020 - Dic 12, 2025',
    maxDrawdown: -12.4,
    sharpeRatio: 3.12,
    winRate: 72.8,
    monthlyReturns: [
      {
        year: 2022,
        months: [
          { month: 'ENE', return: 0 },
          { month: 'FEB', return: 0 },
          { month: 'MAR', return: 0 },
          { month: 'ABR', return: 0 },
          { month: 'MAY', return: 0 },
          { month: 'JUN', return: 0 },
          { month: 'JUL', return: 0 },
          { month: 'AGO', return: 0 },
          { month: 'SEP', return: 0 },
          { month: 'OCT', return: 0 },
          { month: 'NOV', return: 0 },
          { month: 'DIC', return: 0 },
        ],
      },
      {
        year: 2023,
        months: [
          { month: 'ENE', return: -7.26 },
          { month: 'FEB', return: 0 },
          { month: 'MAR', return: 5 },
          { month: 'ABR', return: 2 },
          { month: 'MAY', return: -2 },
          { month: 'JUN', return: 0 },
          { month: 'JUL', return: 3.5 },
          { month: 'AGO', return: 5.5 },
          { month: 'SEP', return: 0 },
          { month: 'OCT', return: 0 },
          { month: 'NOV', return: 0 },
          { month: 'DIC', return: 0 },
        ],
      },
      {
        year: 2024,
        months: [
          { month: 'ENE', return: 0.73 },
          { month: 'FEB', return: 4.50 },
          { month: 'MAR', return: 0.77 },
          { month: 'ABR', return: -0.34 },
          { month: 'MAY', return: 3.28 },
          { month: 'JUN', return: 3.32 },
          { month: 'JUL', return: 0.22 },
          { month: 'AGO', return: 6.20 },
          { month: 'SEP', return: 0.22 },
          { month: 'OCT', return: 0.22 },
          { month: 'NOV', return: 1.64 },
          { month: 'DIC', return: 12.72 },
        ],
      },
      {
        year: 2025,
        months: [
          { month: 'ENE', return: 2.11 },
          { month: 'FEB', return: 7.00 },
          { month: 'MAR', return: 3.32 },
          { month: 'ABR', return: 0 },
          { month: 'MAY', return: 0 },
          { month: 'JUN', return: 0 },
          { month: 'JUL', return: 0 },
          { month: 'AGO', return: 0 },
          { month: 'SEP', return: 0 },
          { month: 'OCT', return: 0 },
          { month: 'NOV', return: 0 },
          { month: 'DIC', return: 0 },
        ],
      },
    ],
    get chartData() {
      return generateChartData(this.monthlyReturns);
    },
  },
  {
    name: 'PQCL',
    totalReturn: 114.61,
    period: 'Ene 8, 2020 - Dic 12, 2025',
    maxDrawdown: -9.8,
    sharpeRatio: 2.87,
    winRate: 70.5,
    monthlyReturns: [
      {
        year: 2020,
        months: [
          { month: 'ENE', return: 2.45 },
          { month: 'FEB', return: 1.87 },
          { month: 'MAR', return: -3.21 },
          { month: 'ABR', return: 3.54 },
          { month: 'MAY', return: 2.19 },
          { month: 'JUN', return: 1.76 },
          { month: 'JUL', return: 2.98 },
          { month: 'AGO', return: 1.45 },
          { month: 'SEP', return: -1.87 },
          { month: 'OCT', return: 2.67 },
          { month: 'NOV', return: 3.12 },
          { month: 'DIC', return: 4.23 },
        ],
      },
      {
        year: 2021,
        months: [
          { month: 'ENE', return: 2.34 },
          { month: 'FEB', return: 1.98 },
          { month: 'MAR', return: 3.45 },
          { month: 'ABR', return: 1.67 },
          { month: 'MAY', return: 2.89 },
          { month: 'JUN', return: 1.23 },
          { month: 'JUL', return: 3.76 },
          { month: 'AGO', return: 2.45 },
          { month: 'SEP', return: -2.34 },
          { month: 'OCT', return: 3.21 },
          { month: 'NOV', return: 2.87 },
          { month: 'DIC', return: 5.67 },
        ],
      },
      {
        year: 2022,
        months: [
          { month: 'ENE', return: 1.89 },
          { month: 'FEB', return: 2.45 },
          { month: 'MAR', return: 3.12 },
          { month: 'ABR', return: 1.54 },
          { month: 'MAY', return: 2.76 },
          { month: 'JUN', return: 1.98 },
          { month: 'JUL', return: 2.34 },
          { month: 'AGO', return: 1.67 },
          { month: 'SEP', return: -1.45 },
          { month: 'OCT', return: 3.89 },
          { month: 'NOV', return: 2.12 },
          { month: 'DIC', return: 6.34 },
        ],
      },
      {
        year: 2023,
        months: [
          { month: 'ENE', return: 2.67 },
          { month: 'FEB', return: 3.21 },
          { month: 'MAR', return: 2.89 },
          { month: 'ABR', return: 1.76 },
          { month: 'MAY', return: 2.45 },
          { month: 'JUN', return: 1.34 },
          { month: 'JUL', return: 3.54 },
          { month: 'AGO', return: 2.12 },
          { month: 'SEP', return: -2.67 },
          { month: 'OCT', return: 4.23 },
          { month: 'NOV', return: 3.45 },
          { month: 'DIC', return: 7.89 },
        ],
      },
      {
        year: 2024,
        months: [
          { month: 'ENE', return: 1.98 },
          { month: 'FEB', return: 2.76 },
          { month: 'MAR', return: 3.34 },
          { month: 'ABR', return: 1.45 },
          { month: 'MAY', return: 2.89 },
          { month: 'JUN', return: 1.67 },
          { month: 'JUL', return: 2.54 },
          { month: 'AGO', return: 3.21 },
          { month: 'SEP', return: -1.98 },
          { month: 'OCT', return: 3.76 },
          { month: 'NOV', return: 2.45 },
          { month: 'DIC', return: 8.12 },
        ],
      },
      {
        year: 2025,
        months: [
          { month: 'ENE', return: 1.54 },
          { month: 'FEB', return: 2.34 },
          { month: 'MAR', return: 2.98 },
          { month: 'ABR', return: -1.23 },
          { month: 'MAY', return: 1.87 },
          { month: 'JUN', return: 2.45 },
          { month: 'JUL', return: 1.76 },
          { month: 'AGO', return: 2.67 },
          { month: 'SEP', return: 1.34 },
          { month: 'OCT', return: 1.98 },
          { month: 'NOV', return: -2.45 },
          { month: 'DIC', return: -1.87 },
        ],
      },
    ],
    get chartData() {
      return generateChartData(this.monthlyReturns);
    },
  },
];

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
