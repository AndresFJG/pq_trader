'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { courseService, Course } from '@/services/courseService';

export function Courses() {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = useCallback(async () => {
    try {
      const data = await courseService.getFeaturedCourses();
      setCourses(data);
    } catch (error) {
      console.error('❌ Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-muted-foreground">Cargando cursos...</p>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {t('courses.title')} <span className="text-profit">{t('courses.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground mb-8">{t('courses.subtitle')}</p>
          <div className="text-center py-12 bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground">No hay cursos disponibles en este momento</p>
          </div>
        </div>
      </section>
    );
  }
  
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
                <div className="aspect-video bg-secondary rounded-lg mb-4 overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📊</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-profit/10 text-profit px-2 py-1 rounded capitalize">
                    {course.level}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-profit text-profit" />
                    <span className="text-sm font-medium">{course.rating || '5.0'}</span>
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration_hours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollment_count || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-profit">${course.price}</span>
                </div>
                <Link href={`/cursos/${course.slug}`}>
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
