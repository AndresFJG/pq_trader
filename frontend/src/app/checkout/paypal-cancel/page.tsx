'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PayPalCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Pago cancelado</CardTitle>
          <CardDescription>
            Has cancelado el proceso de pago con PayPal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            No te preocupes, no se ha realizado ningún cargo. Puedes intentar nuevamente cuando lo desees.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => router.back()}
              className="w-full"
            >
              Volver al checkout
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
              variant="outline"
            >
              Ir al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
