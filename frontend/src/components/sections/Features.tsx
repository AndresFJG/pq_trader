'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Shield, Zap, Award } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Cursos Completos',
    description: 'Desde principiante hasta avanzado, aprende a tu propio ritmo con material estructurado.',
  },
  {
    icon: Users,
    title: 'Mentorías 1-a-1',
    description: 'Sesiones personalizadas con traders experimentados para resolver tus dudas específicas.',
  },
  {
    icon: TrendingUp,
    title: 'Resultados Reales',
    description: 'Visualiza nuestros portafolios en tiempo real integrados con Darwinex.',
  },
  {
    icon: Shield,
    title: 'Pago Seguro',
    description: 'Pagos protegidos con Stripe. Cancela tu suscripción cuando quieras.',
  },
  {
    icon: Zap,
    title: 'Acceso Inmediato',
    description: 'Comienza a aprender inmediatamente después de tu suscripción.',
  },
  {
    icon: Award,
    title: 'Certificados',
    description: 'Obtén certificados al completar cursos y demuestra tus habilidades.',
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            ¿Por qué elegir <span className="text-profit">PQ Trader</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para dominar el trading algorítmico en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-profit/50 transition-colors group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-profit/10 flex items-center justify-center group-hover:bg-profit/20 transition">
                    <Icon className="h-6 w-6 text-profit" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
