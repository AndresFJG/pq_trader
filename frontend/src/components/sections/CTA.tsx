'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-profit/10 via-profit/5 to-transparent rounded-2xl border border-profit/20 p-12 md:p-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para transformar tu trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a cientos de traders que ya están automatizando sus estrategias y
              obteniendo resultados consistentes. Comienza tu prueba gratuita hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="xl" variant="profit" className="group">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="xl" variant="outline">
                  Hablar con Ventas
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              ✓ Sin tarjeta de crédito requerida &nbsp;&nbsp; ✓ Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
