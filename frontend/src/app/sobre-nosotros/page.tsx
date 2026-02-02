'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Award, TrendingUp, Rocket, Shield } from 'lucide-react';
import Image from 'next/image';

const values = [
  {
    icon: Target,
    title: 'Excelencia Educativa',
    description: 'Contenido actualizado y práctico basado en experiencia real de trading.',
  },
  {
    icon: Users,
    title: 'Comunidad Activa',
    description: 'Red de traders que se apoyan mutuamente y comparten conocimientos.',
  },
  {
    icon: Award,
    title: 'Resultados Verificables',
    description: 'Estrategias probadas y métricas reales, sin promesas irreales.',
  },
  {
    icon: Shield,
    title: 'Transparencia Total',
    description: 'Mostramos lo bueno y lo malo del trading algorítmico sin filtros.',
  },
];

const stats = [
  { value: '500+', label: 'Estudiantes Activos' },
  { value: '15+', label: 'Cursos Disponibles' },
  { value: '1000+', label: 'Horas de Contenido' },
  { value: '4.8/5', label: 'Valoración Media' },
];

export default function SobreNosotrosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Sobre <span className="text-profit">PQ Trader</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Somos una plataforma educativa dedicada a democratizar el trading algorítmico. 
            Nuestra misión es formar traders que dominen las herramientas profesionales 
            y construyan sistemas de trading sostenibles basados en datos, no en emociones.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-surface/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-profit mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Nuestra <span className="text-profit">Historia</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  PQ Trader nació en 2020 de la frustración de no encontrar recursos educativos 
                  de calidad sobre trading algorítmico en español. Lo que comenzó como un canal 
                  de YouTube con tutoriales gratuitos, creció hasta convertirse en una plataforma 
                  completa de formación.
                </p>
                <p>
                  Fundada por traders profesionales con más de 10 años de experiencia en mercados 
                  financieros, combinamos conocimiento técnico profundo con metodología pedagógica 
                  efectiva. No vendemos sueños ni promesas de riqueza fácil.
                </p>
                <p>
                  Hoy, PQ Trader es la comunidad hispana de trading algorítmico más activa, con 
                  cientos de estudiantes que han aprendido a crear, optimizar y operar sistemas 
                  automatizados de manera profesional.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-profit/20 to-background border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="h-32 w-32 text-profit/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestros <span className="text-profit">Valores</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían todo lo que hacemos en PQ Trader
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-profit/10 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-profit" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestro <span className="text-profit">Equipo</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traders e ingenieros apasionados por enseñar trading algorítmico
            </p>
          </div>

          <Card className="p-8 text-center bg-gradient-to-br from-profit/5 to-background">
            <Rocket className="h-16 w-16 text-profit mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Estamos Contratando
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Si eres un trader experimentado con pasión por enseñar, 
              o un desarrollador interesado en finanzas cuantitativas, 
              nos encantaría conocerte.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center rounded-md bg-profit text-background px-6 py-3 font-semibold hover:bg-profit/90 transition-colors"
            >
              Únete al Equipo
            </a>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
