'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Courses() {
  const { t, language } = useLanguage();
  
  // TODO: Conectar con API real - GET /api/courses (featured)
  const courses: any[] = [];
  
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t('courses.title')} <span className="text-profit">{t('courses.titleHighlight')}</span>
            </h2>
            <p className="text-muted-foreground">{t('courses.subtitle')}</p>
          </div>
          <Link href="/cursos">
            <Button variant="outline" className="group">
              {t('common.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col hover:shadow-lg transition">
              <CardHeader>
                <div className="aspect-video bg-secondary rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-profit/10 text-profit px-2 py-1 rounded">
                    {t(course.levelKey)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-profit text-profit" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{t(course.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm">{t(course.descriptionKey)}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-profit">${course.price}</span>
                </div>
                <Link href={`/cursos/${course.id}`}>
                  <Button variant="profit">{t('common.viewCourse')}</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
