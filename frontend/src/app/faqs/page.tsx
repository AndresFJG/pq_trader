'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: '¿Qué es PQ Trader?',
        a: 'PQ Trader es una plataforma educativa especializada en trading algorítmico. Ofrecemos cursos, mentorías y recursos para aprender a crear, optimizar y operar sistemas de trading automatizados de manera profesional.',
      },
      {
        q: '¿Necesito experiencia previa en trading?',
        a: 'No es necesario. Nuestros cursos están diseñados para todos los niveles, desde principiantes absolutos hasta traders avanzados que quieran automatizar sus estrategias.',
      },
      {
        q: '¿Qué herramientas voy a aprender?',
        a: 'Enseñamos a usar StrategyQuant X, MetaTrader 4/5, fxDreema, Python para trading, PineScript, MQL5 y análisis de performance con Darwinex.',
      },
    ],
  },
  {
    category: 'Cursos',
    questions: [
      {
        q: '¿Cómo accedo a los cursos?',
        a: 'Una vez registrado y realizado el pago, tendrás acceso inmediato al curso en tu dashboard. Podrás verlo las veces que quieras, a tu propio ritmo.',
      },
      {
        q: '¿Los cursos tienen certificado?',
        a: 'Sí, al completar un curso recibirás un certificado digital verificable que podrás compartir en LinkedIn y tu CV.',
      },
      {
        q: '¿Puedo descargar el contenido?',
        a: 'Las lecciones en video están disponibles para streaming. Los recursos adicionales (códigos, plantillas, PDFs) sí son descargables.',
      },
    ],
  },
  {
    category: 'Mentorías',
    questions: [
      {
        q: '¿Cómo funcionan las mentorías?',
        a: 'Las mentorías son sesiones 1-a-1 por videollamada donde trabajamos directamente en tus proyectos, estrategias o dudas específicas. Puedes elegir sesiones individuales o packs.',
      },
      {
        q: '¿Puedo elegir el horario de la mentoría?',
        a: 'Sí, una vez reservada, coordinaremos el horario que mejor se ajuste a tu disponibilidad y zona horaria.',
      },
      {
        q: '¿Las mentorías se graban?',
        a: 'Sí, todas las sesiones se graban y te enviamos el video para que puedas revisarlo cuando quieras.',
      },
    ],
  },
  {
    category: 'Pagos',
    questions: [
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express) y PayPal. Los pagos se procesan de forma segura a través de Stripe.',
      },
      {
        q: '¿Hay garantía de devolución?',
        a: 'Sí, ofrecemos garantía de devolución de 14 días en todos nuestros cursos. Si no estás satisfecho, te devolvemos el 100% de tu inversión.',
      },
      {
        q: '¿Puedo pagar en cuotas?',
        a: 'Actualmente no ofrecemos pagos fraccionados, pero puedes usar los planes de cuotas de tu tarjeta de crédito si tu banco lo permite.',
      },
    ],
  },
  {
    category: 'Soporte',
    questions: [
      {
        q: '¿Cómo contacto con soporte?',
        a: 'Puedes escribirnos a info@pqtrader.com o usar el chat en vivo de la plataforma. También estamos en Telegram @pqtrader para soporte rápido.',
      },
      {
        q: '¿Cuánto tardan en responder?',
        a: 'Nuestro tiempo de respuesta promedio es de 24 horas en días laborables. Para consultas urgentes, Telegram es la vía más rápida.',
      },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Preguntas <span className="text-profit">Frecuentes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Encuentra respuestas rápidas a las preguntas más comunes sobre PQ Trader
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-profit rounded-full" />
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <Card key={index} className="overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(index)}
                          className="w-full text-left p-6 hover:bg-surface/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-semibold text-foreground pr-8">
                              {faq.q}
                            </h3>
                            <ChevronDown 
                              className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>
                        {isOpen && (
                          <CardContent className="pt-0 pb-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.a}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron preguntas que coincidan con tu búsqueda.
                </p>
              </Card>
            )}
          </div>

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-r from-profit/10 to-profit/5 border-profit/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                ¿No encontraste tu respuesta?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nuestro equipo está aquí para ayudarte
              </p>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center rounded-md bg-profit text-background px-6 py-3 font-semibold hover:bg-profit/90 transition-colors"
              >
                Contactar Soporte
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
