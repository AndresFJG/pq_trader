'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 border-4 border-red-500 rounded-full mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pago <span className="text-red-500">Cancelado</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tu pago no ha sido procesado. No se ha realizado ningún cargo.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué sucedió?</h2>
              
              <p className="text-muted-foreground mb-6">
                El proceso de pago fue cancelado o interrumpido. Esto puede ocurrir por varias razones:
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span className="text-muted-foreground">Cancelaste el pago voluntariamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span className="text-muted-foreground">Hubo un problema con tu método de pago</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span className="text-muted-foreground">Se perdió la conexión durante el proceso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span className="text-muted-foreground">La sesión expiró</span>
                </li>
              </ul>

              <p className="text-sm text-muted-foreground">
                No te preocupes, puedes intentar nuevamente cuando estés listo. 
                Tu carrito sigue disponible.
              </p>
            </CardContent>
          </Card>

          {/* Soporte */}
          <Card className="bg-gradient-to-r from-blue-500/5 to-background border-blue-500/20 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">¿Necesitas Ayuda?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Si experimentaste algún problema técnico, nuestro equipo está aquí para ayudarte.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:soporte@pqtrader.com">
                    <Mail className="mr-2 h-4 w-4" />
                    soporte@pqtrader.com
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Navegación */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="profit" size="lg" asChild>
              <Link href="/checkout">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Intentar Nuevamente
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Volver al Inicio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
