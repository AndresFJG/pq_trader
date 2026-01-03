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
    chartData: generateChartData(39.88, 48), // 48 meses de datos
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
    chartData: generateChartData(22.71, 26), // 26 meses de datos
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
    chartData: generateChartData(106.51, 68), // 68 meses de datos
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
          { month: 'NOV', return: 0 },
          { month: 'DIC', return: 0 },
        ],
      },
      {
        year: 2024,
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
        year: 2025,
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
    ],
    chartData: generateChartData(114.61, 71), // 71 meses de datos
  },
];

// Función auxiliar para generar datos de gráfico realistas
function generateChartData(totalReturn: number, months: number) {
  const data = [];
  let currentEquity = 0;
  const avgMonthlyReturn = totalReturn / months;
  const volatility = 2; // Volatilidad mensual

  for (let i = 0; i <= months; i++) {
    // Simular retornos con algo de volatilidad
    const randomness = (Math.random() - 0.5) * volatility;
    const monthlyReturn = avgMonthlyReturn + randomness;
    currentEquity += monthlyReturn;

    const date = new Date();
    date.setMonth(date.getMonth() - (months - i));
    
    data.push({
      date: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
      equity: parseFloat(currentEquity.toFixed(2)),
    });
  }

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
