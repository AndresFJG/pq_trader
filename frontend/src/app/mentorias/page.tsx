'use client';

import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, MessageCircle, Users, Award, CheckCircle, Target, Rocket, BookOpen, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';
import { getMentors } from '@/lib/mentors';
import { mentorshipTopics, packagesTranslated } from '../../lib/mentorias-data';

import React, { useEffect, useState } from 'react';
import type { Mentor as MentorBase } from '@/types/mentor';

// Extiende el tipo Mentor para reflejar todos los campos usados en la UI
type Mentor = MentorBase & {
  image: string;
  title: string;
  subtitle: string;
  students: number;
  rating: number;
  sessions: number;
  quote: string;
};

export default function MentoriasPage() {
  const { t, language } = useLanguage();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const topics = mentorshipTopics[language === 'es' ? 'es' : 'en'];
  const packages = packagesTranslated(language);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMentors();
        setMentors(data as Mentor[]);
      } catch (e) {
        setMentors([]);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 bg-profit/10 border border-profit/20 rounded-full px-4 py-2 mb-6">
            <Users className="h-4 w-4 text-profit" />
            <span className="text-sm text-profit font-medium">{t('mentorshipsPage.badge')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {t('mentorshipsPage.title')} <span className="text-profit">{t('mentorshipsPage.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('mentorshipsPage.subtitle')}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
            {[
              { icon: Video, label: t('mentorshipsPage.benefits.videoHD') },
              { icon: MessageCircle, label: t('mentorshipsPage.benefits.continuousSupport') },
              { icon: Calendar, label: t('mentorshipsPage.benefits.flexibleSchedule') },
              { icon: Award, label: t('mentorshipsPage.benefits.certificate') },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-surface/50 border border-border/40 rounded-lg p-4">
                <benefit.icon className="h-8 w-8 text-profit mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'es' ? 'Elige tu' : 'Choose your'} <span className="text-profit">{language === 'es' ? 'Plan de Mentoría' : 'Mentorship Plan'}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'es' 
                ? 'Sesiones personalizadas 1 a 1 enfocadas en tus necesidades específicas' 
                : 'Personalized 1-on-1 sessions focused on your specific needs'}
            </p>
            
            {/* Mentorship Topics - Professional List */}
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {language === 'es' ? 'Temas Disponibles para Mentoría' : 'Available Mentorship Topics'}
                </h3>
                <p className="text-sm text-muted-foreground/70">
                  {language === 'es' 
                    ? 'Elige los temas específicos en los que deseas recibir mentoría de nuestros expertos'
                    : 'Choose the specific topics you want to receive mentoring on from our experts'}
                </p>
              </div>
              <div className="bg-surface/30 border border-border/40 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                  {topics.map((topic: {
                    id: number;
                    title: string;
                    description: string;
                    icon: React.ElementType;
                  }) => {
                    const IconComponent = topic.icon;
                    return (
                      <div 
                        key={topic.id} 
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="flex-shrink-0">
                          <IconComponent className="w-4 h-4 text-profit/70" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-foreground">{topic.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg: {
              name: string;
              duration: string;
              description: string;
              price: number;
              features: string[];
              savings?: number;
              popular?: boolean;
              recurring?: boolean;
              free?: boolean;
            }) => (
              <Card 
                key={pkg.name}
                className={`relative ${pkg.popular ? 'border-profit shadow-lg shadow-profit/20' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-profit text-background text-xs font-bold px-4 py-1 rounded-full">
                      {language === 'es' ? 'MÁS POPULAR' : 'MOST POPULAR'}
                    </span>
                  </div>
                )}

                {/* Certification Badge */}
                <div className="absolute top-4 right-4 bg-profit/10 border border-profit/30 rounded-full p-2">
                  <Award className="h-4 w-4 text-profit" />
                </div>

                <CardHeader className="text-center pb-8 pt-12">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  {pkg.free ? (
                    <div className="flex flex-col items-center justify-center gap-4 mt-2">
                      <span className="text-2xl font-bold text-profit">Acceso Gratuito</span>
                      <a
                        href="https://www.skool.com/club-pqtrader-8889"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-profit hover:bg-profit/90 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-none border-none">
                          {language === 'es' ? 'Ir a la comunidad de Skool' : 'Go to Skool Community'}
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-profit">${pkg.price}</span>
                        {pkg.savings && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${pkg.price + pkg.savings}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.duration}</span>
                        {pkg.recurring && (
                          <Badge variant="outline" className="ml-2 border-profit/40 text-profit text-xs">
                            {language === 'es' ? 'Suscripción Mensual' : 'Monthly Subscription'}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-profit mt-0.5">✓</span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {!pkg.free && (
                  <CardFooter>
                    <Button 
                      variant={pkg.popular ? 'profit' : 'outline'} 
                      className="w-full"
                      asChild
                    >
                      <Link href={`/checkout?type=mentoria&name=${encodeURIComponent(pkg.name)}&price=${pkg.price}&description=${encodeURIComponent(pkg.description)}&id=${pkg.name.toLowerCase().replace(/\s+/g, '-')}&recurring=${pkg.recurring ? 'true' : 'false'}`}>
                        {pkg.recurring 
                          ? (language === 'es' ? 'Suscribirme Ahora' : 'Subscribe Now')
                          : (language === 'es' ? 'Comenzar Ahora' : 'Start Now')
                        }
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section - Detailed */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.mentors.title')} <span className="text-profit">{t('mentorshipsPage.mentors.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('mentorshipsPage.mentors.subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {mentors.map((mentor, index) => (
              <Card 
                key={mentor.id} 
                className="overflow-hidden border-border/40 hover:border-profit/40 transition-all"
              >
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  {/* Image/Info Side */}
                  <div className={`bg-gradient-to-br from-profit/10 to-background p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <div className="text-center mb-6">
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-profit/30">
                        <Image
                          src={mentor.image}
                          alt={mentor.name}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{mentor.name}</h3>
                      <p className="text-profit font-semibold mb-1">{mentor.title}</p>
                      <p className="text-sm text-muted-foreground mb-4">{mentor.subtitle}</p>
                      
                      {/* Stats */}
                      <div className="flex justify-center gap-6 mb-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-profit">{mentor.students}+</p>
                          <p className="text-xs text-muted-foreground">{t('mentorshipsPage.labels.students')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-profit">{mentor.rating}</p>
                          <p className="text-xs text-muted-foreground">{t('mentorshipsPage.labels.rating')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-profit">{mentor.sessions}+</p>
                          <p className="text-xs text-muted-foreground">{t('mentorshipsPage.labels.sessions')}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex justify-center gap-3">
                        <a 
                          href={mentor.linkedin}
                          className="p-2 bg-background hover:bg-profit/10 rounded-lg transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-5 w-5 text-profit" />
                        </a>
                        <a 
                          href={`mailto:${mentor.email}`}
                          className="p-2 bg-background hover:bg-profit/10 rounded-lg transition-colors"
                        >
                          <Mail className="h-5 w-5 text-profit" />
                        </a>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-2">
                      {mentor.achievements.map((achievement: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    {/* Quote */}
                    <div className="mb-6">
                      <div className="text-6xl text-profit/20 leading-none mb-2">&ldquo;</div>
                      <p className="text-lg italic text-foreground mb-2">{mentor.quote}</p>
                      <div className="text-6xl text-profit/20 leading-none text-right">&rdquo;</div>
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {mentor.bio}
                    </p>

                    {/* Specialties */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-profit" />
                        {t('mentorshipsPage.labels.specialties')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specialties.map((specialty: string) => (
                          <span
                            key={specialty}
                            className="text-xs bg-profit/10 text-profit px-3 py-1.5 rounded-full font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'es' ? '¿Cómo funciona?' : 'How it works?'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'es' 
                ? 'Proceso simple para comenzar tu mentoría' 
                : 'Simple process to start your mentorship'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '1', 
                icon: Users,
                title: t('mentorshipsPage.howItWorks.steps.step1.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step1.desc') 
              },
              { 
                step: '2', 
                icon: Calendar,
                title: t('mentorshipsPage.howItWorks.steps.step2.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step2.desc') 
              },
              { 
                step: '3', 
                icon: BookOpen,
                title: t('mentorshipsPage.howItWorks.steps.step3.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step3.desc') 
              },
              { 
                step: '4', 
                icon: Rocket,
                title: t('mentorshipsPage.howItWorks.steps.step4.title'), 
                desc: t('mentorshipsPage.howItWorks.steps.step4.desc') 
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-profit/10 border-2 border-profit rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="h-8 w-8 text-profit" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-profit text-background rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('mentorshipsPage.faqs.title')}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: t('mentorshipsPage.faqs.items.q1.q'),
                a: t('mentorshipsPage.faqs.items.q1.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q2.q'),
                a: t('mentorshipsPage.faqs.items.q2.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q3.q'),
                a: t('mentorshipsPage.faqs.items.q3.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q4.q'),
                a: t('mentorshipsPage.faqs.items.q4.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q5.q'),
                a: t('mentorshipsPage.faqs.items.q5.a')
              },
              {
                q: t('mentorshipsPage.faqs.items.q6.q'),
                a: t('mentorshipsPage.faqs.items.q6.a')
              }
            ].map((faq, idx) => (
              <Card key={idx} className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm pl-8">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-profit/10 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('mentorshipsPage.cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('mentorshipsPage.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="profit" size="lg" className="group" asChild>
              <Link href="/mentorias#planes">
                {t('mentorshipsPage.cta.startButton')}
                <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:contacto@pqtrader.com">
                {t('mentorshipsPage.cta.callButton')}
                <MessageCircle className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
