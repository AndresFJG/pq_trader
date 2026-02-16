'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function CTA() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-profit/10 via-profit/5 to-transparent rounded-2xl border border-profit/20 p-6 sm:p-10 md:p-12 lg:p-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-7 md:mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="xl" variant="profit" className="group w-full sm:w-auto text-sm sm:text-base">
                  {t('cta.start')}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition" />
                </Button>
              </Link>
              <Link href="/contacto" className="w-full sm:w-auto">
                <Button size="xl" variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                  {t('cta.sales')}
                </Button>
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-5 md:mt-6">
              {t('cta.noCreditCard')} &nbsp;&nbsp; {t('cta.cancelAnytime')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
