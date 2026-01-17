'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Courses() {
  const { t, language } = useLanguage();
  
  // Mock data - En producción vendrá de la API
  const courses = [
    {
      id: '1',
      titleKey: 'courses.list.basicAlgo.title',
      descriptionKey: 'courses.list.basicAlgo.description',
      price: 290,
      duration: 6,
      levelKey: 'courses.level.beginner',
      enrolled: 245,
      rating: 4.8,
      thumbnail: '/courses/basic-algo.jpg',
    },
    {
      id: '2',
      titleKey: 'courses.list.strategyquant.title',
      descriptionKey: 'courses.list.strategyquant.description',
      price: 300,
      duration: 5,
      levelKey: 'courses.level.intermediate',
      enrolled: 189,
      rating: 4.9,
      thumbnail: '/courses/sqx.jpg',
    },
    {
      id: '3',
      titleKey: 'courses.list.fxdreema.title',
      descriptionKey: 'courses.list.fxdreema.description',
      price: 600,
      duration: 10,
      levelKey: 'courses.level.beginner',
      enrolled: 156,
      rating: 4.7,
      thumbnail: '/courses/fxdreema.jpg',
    },
  {
    id: '4',
    titleKey: 'courses.list.advancedData.title',
    descriptionKey: 'courses.list.advancedData.description',
    price: 600,
    duration: 10,
    levelKey: 'courses.level.advanced',
    enrolled: 98,
    rating: 4.9,
    thumbnail: '/courses/advanced-data.jpg',
  },
];
  
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
