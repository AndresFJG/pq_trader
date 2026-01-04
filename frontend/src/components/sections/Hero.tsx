'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-profit/10 text-profit px-4 py-2 rounded-full text-sm font-medium">
                🚀 Resultados reales verificados por Darwinex
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Aprende Trading{' '}
              <span className="text-profit">Algorítmico</span>{' '}
              con Expertos
            </h1>

            <p className="text-xl text-muted-foreground">
              Domina el trading algorítmico desde cero. Cursos prácticos, mentorías personalizadas
              y estrategias probadas con resultados reales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cursos">
                <Button size="xl" variant="profit" className="group w-full sm:w-auto">
                  <span>Ver Cursos</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/mentorias">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Reservar Mentoría
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-profit">500+</div>
                <div className="text-sm text-muted-foreground">Estudiantes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-profit">4.8</div>
                <div className="text-sm text-muted-foreground">Rating Promedio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-profit">15+</div>
                <div className="text-sm text-muted-foreground">Cursos</div>
              </div>
            </div>
          </div>

          {/* Right Content - Trading Chart Visual */}
          <div className="relative">
            <div className="bg-secondary/50 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
              <div className="space-y-6">
                {/* Mock Trading Interface */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-profit" />
                    <span className="font-semibold">Portafolio Live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-profit" />
                    <span className="text-lg font-bold text-profit">+24.5%</span>
                  </div>
                </div>

                {/* Mock Chart Bars */}
                <div className="flex items-end justify-between h-48 gap-2">
                  {[60, 80, 45, 90, 70, 100, 75, 85].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className={`w-full rounded-t ${
                          height > 70 ? 'bg-profit' : 'bg-loss'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                    <div className="text-lg font-semibold text-profit">68.4%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                    <div className="text-lg font-semibold">2.45</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-3 -right-3 bg-profit/10 backdrop-blur-xl rounded-lg p-3 border border-profit/20">
              <TrendingUp className="h-5 w-5 text-profit" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
