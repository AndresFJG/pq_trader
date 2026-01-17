'use client';

import { AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface RiskDisclaimerProps {
  productType: 'futures' | 'cfds' | 'general';
  className?: string;
}

export function RiskDisclaimer({ productType, className = '' }: RiskDisclaimerProps) {
  const { language } = useLanguage();
  
  const disclaimers = {
    futures: {
      title: language === 'es' 
        ? 'Aviso Importante - Trading de Futuros'
        : 'Important Notice - Futures Trading',
      content: language === 'es' 
        ? [
            'Los sistemas de trading de futuros implican un riesgo sustancial de pérdida.',
            'Este servicio NO está registrado ante la CFTC/NFA como Asesor de Comercio de Productos Básicos (CTA).',
            'Los sistemas ofrecidos son herramientas educativas y no constituyen asesoramiento de inversión personalizado.',
            'Residentes de EE.UU.: Consulte con un asesor financiero registrado antes de utilizar estos sistemas.'
          ]
        : [
            'Futures trading systems involve substantial risk of loss.',
            'This service is NOT registered with CFTC/NFA as a Commodity Trading Advisor (CTA).',
            'The systems offered are educational tools and do not constitute personalized investment advice.',
            'US Residents: Consult with a registered financial advisor before using these systems.'
          ],
      critical: false
    },
    cfds: {
      title: language === 'es'
        ? 'Restricción Legal - CFDs'
        : 'Legal Restriction - CFDs',
      content: language === 'es'
        ? [
            '⚠️ Los CFDs están PROHIBIDOS para inversores minoristas en Estados Unidos.',
            'Estos productos NO están disponibles para residentes de EE.UU.',
            'Al continuar, confirma que NO es residente de Estados Unidos.',
            'La negociación de CFDs conlleva un alto riesgo de pérdida de capital.'
          ]
        : [
            '⚠️ CFDs are PROHIBITED for retail investors in the United States.',
            'These products are NOT available to US residents.',
            'By continuing, you confirm that you are NOT a US resident.',
            'CFD trading carries a high risk of capital loss.'
          ],
      critical: true
    },
    general: {
      title: language === 'es'
        ? 'Aviso de Riesgo'
        : 'Risk Warning',
      content: language === 'es'
        ? [
            'El trading algorítmico implica riesgos significativos.',
            'Los resultados pasados no garantizan rendimientos futuros.',
            'Opere solo con capital que pueda permitirse perder.',
            'Consulte con un asesor financiero registrado si tiene dudas.'
          ]
        : [
            'Algorithmic trading involves significant risks.',
            'Past results do not guarantee future returns.',
            'Trade only with capital you can afford to lose.',
            'Consult with a registered financial advisor if you have questions.'
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
              {language === 'es' ? 'Al utilizar nuestros servicios, acepta nuestros' : 'By using our services, you accept our'}{' '}
              <Link href="/terminos" className="text-profit hover:underline">
                {language === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}
              </Link>{' '}
              {language === 'es' ? 'y confirma haber leído nuestra' : 'and confirm you have read our'}{' '}
              <Link href="/politica-riesgo" className="text-profit hover:underline">
                {language === 'es' ? 'Política de Divulgación de Riesgos' : 'Risk Disclosure Policy'}
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
  const { language } = useLanguage();
  
  return (
    <div className="bg-loss/10 border-2 border-loss p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-loss flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-loss mb-1">
            {language === 'es' 
              ? 'Restricción para Residentes de Estados Unidos'
              : 'Restriction for United States Residents'
            }
          </p>
          <p className="text-xs text-muted-foreground">
            {language === 'es'
              ? 'Los CFDs no están disponibles para residentes de EE.UU. debido a restricciones regulatorias de la CFTC. Los sistemas de futuros son solo con fines educativos y no constituyen asesoramiento de inversión registrado.'
              : 'CFDs are not available to US residents due to CFTC regulatory restrictions. Futures systems are for educational purposes only and do not constitute registered investment advice.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
