'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, BookOpen, CheckCircle, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    titleKey?: string;
    title?: string;
    descriptionKey?: string;
    description?: string;
    instructor: string;
    price: number;
    duration: number;
    students: number;
    rating: number;
    levelKey?: string;
    level?: string;
    topics: string[];
    modules?: string[];
    benefits?: string[];
  };
}

export function CourseDetailsModal({ isOpen, onClose, course }: CourseDetailsModalProps) {
  const { t } = useLanguage();
  
  // Obtener valores traducidos
  const title = course.titleKey ? t(course.titleKey) : course.title || '';
  const description = course.descriptionKey ? t(course.descriptionKey) : course.description || '';
  const level = course.levelKey ? t(course.levelKey) : course.level || '';
  
  const modules = course.modules || [
    'Introducción al Trading Algorítmico',
    'Configuración del entorno de desarrollo',
    'Fundamentos de Python para Trading',
    'Análisis técnico con Pandas',
    'Backtesting de estrategias',
    'Optimización de parámetros',
    'Gestión de riesgo',
    'Implementación en vivo',
  ];

  const benefits = course.benefits || [
    'Acceso de por vida al contenido',
    'Actualizaciones gratuitas',
    'Certificado de finalización',
    'Soporte de instructores',
    'Grupo privado de estudiantes',
    'Proyectos prácticos incluidos',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                {title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {description}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="bg-profit/10 text-profit border-profit/20 px-3 py-1">
              {level}
            </Badge>
          </div>
        </DialogHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
          <div className="flex items-center gap-3">
            <div className="bg-profit/10 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-profit" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('coursesPage.duration')}</p>
              <p className="font-semibold">{course.duration} {t('coursesPage.card.hours')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-profit/10 p-2 rounded-lg">
              <Users className="h-5 w-5 text-profit" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('coursesPage.card.students')}</p>
              <p className="font-semibold">{course.students.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-profit/10 p-2 rounded-lg">
              <Star className="h-5 w-5 text-profit" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="font-semibold">{course.rating}/5.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-profit/10 p-2 rounded-lg">
              <Award className="h-5 w-5 text-profit" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('coursesPage.certificate')}</p>
              <p className="font-semibold">{t('coursesPage.included')}</p>
            </div>
          </div>
        </div>

        {/* Instructor */}
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-2">{t('coursesPage.instructor')}</h3>
          <div className="flex items-center gap-3 bg-surface/50 border border-border/40 rounded-lg p-4">
            <div className="bg-profit/10 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-profit" />
            </div>
            <div>
              <p className="font-semibold">{course.instructor}</p>
              <p className="text-sm text-muted-foreground">{t('coursesPage.professionalTrader')}</p>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-3">{t('coursesPage.topicsAndTechnologies')}</h3>
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="bg-profit/5 border-profit/20 text-profit">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-profit" />
            {t('coursesPage.courseContent')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {modules.map((module, index) => {
              // Si el módulo es una key de traducción, traducirla
              const moduleText = module.startsWith('courses.') ? t(module) : module;
              return (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{moduleText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-3">{t('coursesPage.includedBenefits')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-profit flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-border sticky bottom-0 bg-background pb-2">
          <div>
            <p className="text-3xl font-bold text-profit">${course.price}</p>
            <p className="text-sm text-muted-foreground">{t('coursesPage.oneTimePaymentAccess')}</p>
          </div>
          <Link href={`/checkout?type=curso&id=${course.id}&name=${encodeURIComponent(title)}&price=${course.price}&description=${encodeURIComponent(description)}&duration=${course.duration}`}>
            <Button variant="profit" size="lg" className="shadow-lg shadow-profit/20">
              {t('coursesPage.enrollNow')}
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
