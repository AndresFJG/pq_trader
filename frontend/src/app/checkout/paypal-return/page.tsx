'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PayPalReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando tu pago...');
  
  const orderId = searchParams.get('token'); // PayPal Order ID

  useEffect(() => {
    const capturePayment = async () => {
      if (!orderId) {
        setStatus('error');
        setMessage('No se encontró información del pago');
        return;
      }

      try {
        const authToken = localStorage.getItem('token');
        
        if (!authToken) {
          setStatus('error');
          setMessage('No estás autenticado');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/paypal/order/${orderId}/capture`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus('success');
          setMessage('¡Pago completado exitosamente!');
          
          // Redirigir al dashboard después de 3 segundos
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Error al capturar el pago');
        }
      } catch (error: any) {
        console.error('Error capturing PayPal payment:', error);
        setStatus('error');
        setMessage('Error al procesar el pago');
      }
    };

    capturePayment();
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-profit animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-profit" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-loss" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Procesando pago...'}
            {status === 'success' && '¡Pago exitoso!'}
            {status === 'error' && 'Error en el pago'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="text-center text-sm text-muted-foreground">
              Serás redirigido a tu dashboard en unos segundos...
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-2">
              <Button
                onClick={() => router.push('/checkout')}
                className="w-full"
                variant="outline"
              >
                Intentar de nuevo
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Ir al Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
