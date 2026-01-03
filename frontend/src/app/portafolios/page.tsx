import { Metadata } from 'next';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { TrackRecordCard } from '@/components/trading/TrackRecordCard';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, BarChart3, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Portafolios de Trading Verificados | Resultados Reales',
  description: 'Compra o alquila portafolios de trading algorítmico con resultados verificados. Robots de trading optimizados, backtesting completo, 3 niveles: Basic, Medium y Premium. Track record transparente.',
  keywords: [
    'portafolios trading',
    'robots trading venta',
    'comprar robot trading',
    'alquilar estrategia trading',
    'portafolio trading verificado',
    'EA trading',
    'expert advisor',
    'bot trading automatizado',
    'estrategias trading comprar'
  ],
  openGraph: {
    title: 'Portafolios de Trading Verificados | Compra o Alquila',
    description: 'Robots de trading con resultados reales. Desde €699. Backtesting completo, soporte 24/7, actualizaciones incluidas.',
    url: 'https://pqtrader.com/portafolios',
    type: 'website',
    images: ['/og-portafolios.jpg'],
  },
};

// Mock data - mismo que en TrackRecords.tsx
const portfoliosData = [
  {
    name: 'PSI',
    totalReturn: 39.88,
    period: 'Dic 12, 2022 - Dic 12, 2025',
    maxDrawdown: -8.2,
    sharpeRatio: 2.45,
    winRate: 68.4,
    monthlyReturns: [
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
    chartData: generateChartData(39.88, 36),
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
    chartData: generateChartData(22.71, 26),
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
    chartData: generateChartData(106.51, 68),
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
    ],
    chartData: generateChartData(114.61, 71),
  },
];

function generateChartData(totalReturn: number, months: number) {
  const data = [];
  let currentEquity = 0;
  const avgMonthlyReturn = totalReturn / months;
  const volatility = 2;

  for (let i = 0; i <= months; i++) {
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

export default function PortafoliosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 bg-profit/10 border border-profit/20 rounded-full px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-profit" />
            <span className="text-sm text-profit font-medium">Resultados Verificados</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Track Records <span className="text-profit">Reales</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Todos nuestros resultados están verificados y auditados por Darwinex. 
            Transparencia total en cada operación.
          </p>

          {/* Platform Verification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="bg-surface/80 border-2 border-profit/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <Shield className="h-6 w-6 text-profit" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Verificado por</p>
                <p className="text-sm font-bold text-foreground">Darwinex</p>
              </div>
            </div>
            <div className="bg-surface/80 border-2 border-profit/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-profit" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Compatible con</p>
                <p className="text-sm font-bold text-foreground">MetaTrader 4/5</p>
              </div>
            </div>
            <div className="bg-surface/80 border-2 border-profit/30 rounded-lg px-6 py-3 flex items-center gap-3">
              <Zap className="h-6 w-6 text-profit" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Apto para</p>
                <p className="text-sm font-bold text-foreground">Cuentas de Fondeo</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
            {[
              { icon: Shield, label: 'Verificado por Darwinex', color: 'text-profit' },
              { icon: BarChart3, label: 'Actualizaciones en Tiempo Real', color: 'text-profit' },
              { icon: TrendingUp, label: 'Resultados Auditados', color: 'text-profit' },
              { icon: Zap, label: 'Sin Filtros ni Trucos', color: 'text-profit' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-surface/50 border border-border/40 rounded-lg p-6">
                <feature.icon className={`h-8 w-8 ${feature.color} mx-auto mb-3`} />
                <p className="text-sm text-muted-foreground font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolios Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {portfoliosData.map((portfolio) => (
              <TrackRecordCard key={portfolio.name} data={portfolio} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Estadísticas Globales
            </h2>
            <p className="text-lg text-muted-foreground">
              Resumen del desempeño de todos nuestros sistemas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">Retorno Promedio</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-profit">+70.9%</p>
                <p className="text-xs text-muted-foreground mt-2">Último año</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-foreground">2.58</p>
                <p className="text-xs text-muted-foreground mt-2">Promedio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-loss">-9.2%</p>
                <p className="text-xs text-muted-foreground mt-2">Promedio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-sm text-muted-foreground">Win Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-profit">69.0%</p>
                <p className="text-xs text-muted-foreground mt-2">Promedio</p>
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
                Transparencia Total
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Todos los track records mostrados están verificados por Darwinex, 
                una plataforma regulada por la FCA (Financial Conduct Authority) del Reino Unido.
              </p>
              <p className="text-xs text-muted-foreground">
                Los resultados pasados no garantizan rendimientos futuros. 
                El trading implica riesgos y puede resultar en pérdidas de capital.
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
              Accede a Nuestros <span className="text-profit">Portafolios</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Sistemas de trading algorítmico con historial verificado. Elige el plan que se ajuste a tu capital.
            </p>
            
            {/* Platform Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="bg-profit/10 border border-profit/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-profit" />
                <span className="text-sm font-semibold text-profit">Verificado Darwinex</span>
              </div>
              <div className="bg-profit/10 border border-profit/30 rounded-full px-4 py-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-profit" />
                <span className="text-sm font-semibold text-profit">Compatible MetaTrader</span>
              </div>
              <div className="bg-profit/10 border border-profit/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-profit" />
                <span className="text-sm font-semibold text-profit">Apto Fondeo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="relative border-border/40 hover:border-profit/40 transition-all">
              <div className="absolute top-4 left-4 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-blue-500">BASIC</span>
              </div>
              <div className="absolute top-4 right-4 bg-profit/10 border border-profit/30 rounded-full p-2">
                <Shield className="h-5 w-5 text-profit" />
              </div>

              <CardHeader className="text-center pt-16 pb-8">
                <CardTitle className="text-2xl mb-4">3 Robots</CardTitle>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Optimización mensual</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Gestión de riesgo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Soporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Rentabilidad: <span className="font-bold text-profit">14.47%</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Drawdown: <span className="font-bold">0.5%</span></span>
                  </div>
                </div>
                
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Alquiler (1 año)</p>
                    <p className="text-3xl font-bold text-foreground">699 <span className="text-lg">€</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Compra (Indefinido)</p>
                    <p className="text-3xl font-bold text-profit">899 <span className="text-lg">€</span></p>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex-col gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/checkout?type=portafolio&name=Portafolio Basic - Alquiler 1 año&price=699&description=3 Robots con optimización mensual&id=basic-rent">
                    Alquilar
                  </Link>
                </Button>
                <Button variant="profit" className="w-full" asChild>
                  <Link href="/checkout?type=portafolio&name=Portafolio Basic - Compra&price=899&description=3 Robots de por vida&id=basic-buy">
                    Comprar
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Medium Plan - Popular */}
            <Card className="relative border-profit shadow-2xl shadow-profit/20 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-profit text-background text-xs font-bold px-6 py-2 rounded-full flex items-center gap-2">
                  ⭐ MEDIUM ⭐
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-profit/10 border border-profit/30 rounded-full p-2">
                <Shield className="h-5 w-5 text-profit" />
              </div>

              <CardHeader className="text-center pt-16 pb-8">
                <CardTitle className="text-2xl mb-4">6 Robots</CardTitle>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Optimización mensual</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Gestión de riesgo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Soporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Rentabilidad: <span className="font-bold text-profit">14.68%</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Drawdown: <span className="font-bold">0.29%</span></span>
                  </div>
                </div>
                
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Alquiler (1 año)</p>
                    <p className="text-3xl font-bold text-foreground">899 <span className="text-lg">€</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Compra (Indefinido)</p>
                    <p className="text-3xl font-bold text-profit">1699 <span className="text-lg">€</span></p>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex-col gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/checkout?type=portafolio&name=Portafolio Medium - Alquiler 1 año&price=899&description=6 Robots con optimización mensual&id=medium-rent">
                    Alquilar
                  </Link>
                </Button>
                <Button variant="profit" className="w-full" asChild>
                  <Link href="/checkout?type=portafolio&name=Portafolio Medium - Compra&price=1699&description=6 Robots de por vida&id=medium-buy">
                    Comprar
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border-border/40 hover:border-profit/40 transition-all">
              <div className="absolute top-4 left-4 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
                <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">⭐ PREMIUM ⭐</span>
              </div>
              <div className="absolute top-4 right-4 bg-profit/10 border border-profit/30 rounded-full p-2">
                <Shield className="h-5 w-5 text-profit" />
              </div>

              <CardHeader className="text-center pt-16 pb-8">
                <CardTitle className="text-2xl mb-4">12 Robots</CardTitle>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Optimización mensual</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Gestión de riesgo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Soporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Rentabilidad: <span className="font-bold text-profit">14.24%</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-profit" />
                    <span className="text-muted-foreground">Drawdown: <span className="font-bold">0.24%</span></span>
                  </div>
                </div>
                
                <div className="border-t border-border/40 pt-6 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Alquiler (1 año)</p>
                    <p className="text-3xl font-bold text-foreground">1699 <span className="text-lg">€</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Compra (Indefinido)</p>
                    <p className="text-3xl font-bold text-profit">3299 <span className="text-lg">€</span></p>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex-col gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/checkout?type=portafolio&name=Portafolio Premium - Alquiler 1 año&price=1699&description=12 Robots con optimización mensual&id=premium-rent">
                    Alquilar
                  </Link>
                </Button>
                <Button variant="profit" className="w-full" asChild>
                  <Link href="/checkout?type=portafolio&name=Portafolio Premium - Compra&price=3299&description=12 Robots de por vida&id=premium-buy">
                    Comprar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="mt-12 bg-gradient-to-r from-profit/5 to-background border-profit/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Apto para Darwinex y Cuentas de Fondeo</h3>
                <p className="text-muted-foreground">Todos nuestros portafolios están optimizados para operar en cuentas reales verificadas.</p>
              </div>
              <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-profit" />
                <span>Optimización mensual incluida en alquiler</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
