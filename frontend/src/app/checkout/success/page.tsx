'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(true);
  const [isProcessing, setIsProcessing] = useState(true);
  const [enrollmentCreated, setEnrollmentCreated] = useState(false);

  useEffect(() => {
    // Detener confetti después de 5 segundos
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Verificar sesión y crear enrollment
  useEffect(() => {
    const verifyAndCreateEnrollment = async () => {
      if (!sessionId) {
        setIsProcessing(false);
        return;
      }

      try {
        console.log('🔍 Verificando sesión:', sessionId);
        
        const response = await api.post('/stripe/verify-session', { sessionId });
        
        if (response.data.success) {
          console.log('✅ Enrollment procesado:', response.data);
          setEnrollmentCreated(true);
          toast.success('¡Acceso al curso activado!');
        }
      } catch (error: any) {
        console.error('❌ Error verificando sesión:', error);
        
        // No mostrar error si el enrollment ya existe
        if (error.response?.data?.alreadyEnrolled) {
          setEnrollmentCreated(true);
          toast.success('Ya tienes acceso a este curso');
        } else {
          toast.error('Error al activar el acceso. Recarga la página o contacta con soporte.');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    verifyAndCreateEnrollment();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-background">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-profit/10 border-4 border-profit rounded-full mb-6">
              {isProcessing ? (
                <Loader2 className="h-12 w-12 text-profit animate-spin" />
              ) : (
                <CheckCircle className="h-12 w-12 text-profit" />
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ¡Pago <span className="text-profit">Exitoso</span>!
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              {isProcessing 
                ? 'Activando tu acceso al curso...'
                : enrollmentCreated 
                  ? 'Tu compra ha sido procesada y tienes acceso al curso'
                  : 'Tu compra ha sido procesada correctamente'
              }
            </p>
            
            {sessionId && (
              <p className="text-sm text-muted-foreground">
                ID de transacción: <span className="font-mono text-foreground">{sessionId}</span>
              </p>
            )}
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Próximos Pasos</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-profit/10 rounded-full flex-shrink-0">
                    <Mail className="h-5 w-5 text-profit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Revisa tu Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Te hemos enviado un correo de confirmación con todos los detalles de tu compra
                      y las instrucciones de acceso.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-profit/10 rounded-full flex-shrink-0">
                    <Download className="h-5 w-5 text-profit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Accede a tu Contenido</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ya puedes acceder a tu compra desde tu panel de usuario.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">
                        Ir al Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-profit/10 rounded-full flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-profit" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Comienza tu Aprendizaje</h3>
                    <p className="text-sm text-muted-foreground">
                      Si compraste una mentoría, el mentor se pondrá en contacto contigo en las próximas 24 horas
                      para coordinar la primera sesión.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Soporte */}
          <Card className="bg-gradient-to-r from-profit/5 to-background border-profit/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">¿Necesitas Ayuda?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier duda.
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button variant="profit" size="lg" asChild>
              <Link href="/dashboard">
                <CheckCircle className="mr-2 h-5 w-5" />
                Ir al Dashboard
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

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Cargando...</p>
    </div>}>
      <SuccessContent />
    </Suspense>
  );
}
