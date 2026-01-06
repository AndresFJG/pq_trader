'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Building, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  regions: string[];
  description: string;
  processingTime: string;
}

export function PaymentMethods({ userCountry = 'ES' }: { userCountry?: string }) {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: t('payments.card'),
      icon: CreditCard,
      regions: ['global'],
      description: t('payments.cardDesc'),
      processingTime: t('payments.instant'),
    },
    {
      id: 'paypal',
      name: t('payments.paypal'),
      icon: Globe,
      regions: ['global'],
      description: t('payments.paypalDesc'),
      processingTime: t('payments.instant'),
    },
    {
      id: 'mercadopago',
      name: t('payments.mercadopago'),
      icon: Smartphone,
      regions: ['LATAM'],
      description: t('payments.mercadopagoDesc'),
      processingTime: t('payments.instant'),
    },
    {
      id: 'pix',
      name: t('payments.pix'),
      icon: Smartphone,
      regions: ['BR'],
      description: t('payments.pixDesc'),
      processingTime: t('payments.instant'),
    },
    {
      id: 'sepa',
      name: t('payments.sepa'),
      icon: Building,
      regions: ['EU'],
      description: t('payments.sepaDesc'),
      processingTime: `1-3 ${t('payments.businessDays')}`,
    },
  ];

  // Filter payment methods based on user region
  const availableMethods = paymentMethods.filter((method) => {
    if (method.regions.includes('global')) return true;
    if (method.regions.includes('LATAM') && ['AR', 'MX', 'CO', 'CL', 'PE'].includes(userCountry)) return true;
    if (method.regions.includes('BR') && userCountry === 'BR') return true;
    if (method.regions.includes('EU') && ['ES', 'FR', 'DE', 'IT', 'PT'].includes(userCountry)) return true;
    return false;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{t('checkout.paymentMethod')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-2 border-profit bg-profit/5'
                : 'border-2 border-border hover:border-profit/40'
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id ? 'bg-profit/20' : 'bg-surface/50'
                }`}>
                  <method.icon className={`h-5 w-5 ${
                    selectedMethod === method.id ? 'text-profit' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{method.name}</h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    {method.description}
                  </p>
                  <p className="text-xs text-profit">
                    ⚡ {method.processingTime}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'border-profit bg-profit'
                    : 'border-border'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-background rounded-full" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-surface/30 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">Pago Seguro</p>
            <p className="text-xs text-muted-foreground">
              Todos los pagos son procesados de forma segura. No almacenamos información de tarjetas.
              Usamos encriptación SSL de 256 bits.
            </p>
          </div>
        </div>
      </div>

      <Button variant="profit" size="lg" className="w-full mt-6">
        Proceder al Pago
      </Button>
    </div>
  );
}
