import { AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface RiskDisclaimerProps {
  productType: 'futures' | 'cfds' | 'general';
  className?: string;
}

export function RiskDisclaimer({ productType, className = '' }: RiskDisclaimerProps) {
  const disclaimers = {
    futures: {
      title: 'Aviso Importante - Trading de Futuros',
      content: [
        'Los sistemas de trading de futuros implican un riesgo sustancial de pérdida.',
        'Este servicio NO está registrado ante la CFTC/NFA como Asesor de Comercio de Productos Básicos (CTA).',
        'Los sistemas ofrecidos son herramientas educativas y no constituyen asesoramiento de inversión personalizado.',
        'Residentes de EE.UU.: Consulte con un asesor financiero registrado antes de utilizar estos sistemas.'
      ],
      critical: false
    },
    cfds: {
      title: 'Restricción Legal - CFDs',
      content: [
        '⚠️ Los CFDs están PROHIBIDOS para inversores minoristas en Estados Unidos.',
        'Estos productos NO están disponibles para residentes de EE.UU.',
        'Al continuar, confirma que NO es residente de Estados Unidos.',
        'La negociación de CFDs conlleva un alto riesgo de pérdida de capital.'
      ],
      critical: true
    },
    general: {
      title: 'Aviso de Riesgo',
      content: [
        'El trading algorítmico implica riesgos significativos.',
        'Los resultados pasados no garantizan rendimientos futuros.',
        'Opere solo con capital que pueda permitirse perder.',
        'Consulte con un asesor financiero registrado si tiene dudas.'
      ],
      critical: false
    }
  };

  const disclaimer = disclaimers[productType];

  return (
    <Card className={`border-2 ${disclaimer.critical ? 'border-loss bg-loss/5' : 'border-yellow-500/50 bg-yellow-500/5'} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${disclaimer.critical ? 'bg-loss/10' : 'bg-yellow-500/10'}`}>
            {disclaimer.critical ? (
              <AlertTriangle className="h-6 w-6 text-loss" />
            ) : (
              <Shield className="h-6 w-6 text-yellow-500" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-3 ${disclaimer.critical ? 'text-loss' : 'text-yellow-600 dark:text-yellow-500'}`}>
              {disclaimer.title}
            </h3>
            <ul className="space-y-2 mb-4">
              {disclaimer.content.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className={disclaimer.critical ? 'text-loss' : 'text-yellow-500'}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-muted-foreground pt-3 border-t border-border/40">
              Al utilizar nuestros servicios, acepta nuestros{' '}
              <Link href="/terminos" className="text-profit hover:underline">
                Términos y Condiciones
              </Link>{' '}
              y confirma haber leído nuestra{' '}
              <Link href="/politica-riesgo" className="text-profit hover:underline">
                Política de Divulgación de Riesgos
              </Link>
              .
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function USRestrictionBanner() {
  return (
    <div className="bg-loss/10 border-2 border-loss p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-loss flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-loss mb-1">
            Restricción para Residentes de Estados Unidos
          </p>
          <p className="text-xs text-muted-foreground">
            Los CFDs no están disponibles para residentes de EE.UU. debido a restricciones regulatorias de la CFTC.
            Los sistemas de futuros son solo con fines educativos y no constituyen asesoramiento de inversión registrado.
          </p>
        </div>
      </div>
    </div>
  );
}
