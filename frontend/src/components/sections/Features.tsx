'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Shield, Zap, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: BookOpen,
      titleKey: 'features.list.courses.title',
      descriptionKey: 'features.list.courses.description',
    },
    {
      icon: Users,
      titleKey: 'features.list.mentorships.title',
      descriptionKey: 'features.list.mentorships.description',
    },
    {
      icon: TrendingUp,
      titleKey: 'features.list.results.title',
      descriptionKey: 'features.list.results.description',
    },
    {
      icon: Shield,
      titleKey: 'features.list.payment.title',
      descriptionKey: 'features.list.payment.description',
    },
    {
      icon: Zap,
      titleKey: 'features.list.access.title',
      descriptionKey: 'features.list.access.description',
    },
    {
      icon: Award,
      titleKey: 'features.list.certificates.title',
      descriptionKey: 'features.list.certificates.description',
    },
  ];

  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {t('features.title')} <span className="text-profit">{t('features.titleHighlight')}</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-profit/50 transition-colors group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-profit/10 flex items-center justify-center group-hover:bg-profit/20 transition">
                    <Icon className="h-6 w-6 text-profit" />
                  </div>
                  <h3 className="text-xl font-semibold">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
