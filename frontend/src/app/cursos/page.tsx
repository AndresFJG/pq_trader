'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { CourseDetailsModal } from '@/components/modals/CourseDetailsModal';
import { useLanguage } from '@/lib/i18n';
import { courseService, Course } from '@/services/courseService';
import Link from 'next/link';

export default function CursosPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const loadCourses = useCallback(async () => {
    try {
      const data = await courseService.getAllCourses();
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

  const levels = useMemo(() => [
    { value: 'all', label: t('coursesPage.filters.all') },
    { value: 'beginner', label: t('courses.level.beginner') },
    { value: 'intermediate', label: t('courses.level.intermediate') },
    { value: 'advanced', label: t('courses.level.advanced') }
  ], [t]);

  const topics = useMemo(() => [
    { value: 'all', label: t('coursesPage.filters.all') },
    { value: 'Python', label: 'Python' },
    { value: 'StrategyQuant', label: 'StrategyQuant' },
    { value: 'Risk Management', label: 'Risk Management' }
  ], [t]);

  // Filtrar cursos
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
      const topicMatch = selectedTopic === 'all' || course.category === selectedTopic;
      return levelMatch && topicMatch;
    });
  }, [courses, selectedLevel, selectedTopic]);

  const handleOpenCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCourse(null), 200);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 bg-profit/10 border border-profit/20 rounded-full px-4 py-2 mb-6">
            <BookOpen className="h-4 w-4 text-profit" />
            <span className="text-sm text-profit font-medium">{t('coursesPage.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {t('coursesPage.title')} <span className="text-profit">{t('coursesPage.titleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('coursesPage.subtitle')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <BookOpen className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">{courses.length}</p>
              <p className="text-sm text-muted-foreground">{t('coursesPage.stats.activeCourses')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Users className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">
                {courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{t('coursesPage.stats.totalStudents')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">
                {courses.reduce((sum, course) => sum + (course.duration_hours || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">{t('coursesPage.stats.contentHours')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Level Filter */}
            <div className="flex gap-2 flex-wrap">
              {levels.map((level) => (
                <Button
                  key={level.value}
                  variant={level.value === selectedLevel ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel(level.value)}
                  className={level.value === selectedLevel ? 'bg-profit hover:bg-profit/90' : ''}
                >
                  {level.label}
                </Button>
              ))}
            </div>

            {/* Topic Filter */}
            <div className="flex gap-2 flex-wrap">
              {topics.map((topic) => (
                <Button
                  key={topic.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTopic(topic.value)}
                  className={topic.value === selectedTopic ? 'text-profit bg-profit/10' : 'text-muted-foreground hover:text-profit'}
                >
                  {topic.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">{t('coursesPage.noResults')}</p>
              <Button 
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedTopic('all');
                }}
                variant="outline"
                className="mt-4"
              >
                {t('coursesPage.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:border-profit/40 transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-profit/10 to-background">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-profit/20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-profit/90 text-background text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {course.level}
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-profit transition-colors">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollment_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-profit">
                      <Star className="h-4 w-4 fill-profit" />
                      <span className="font-medium">{course.rating || '5.0'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-profit/10 text-profit px-2 py-1 rounded">
                      {course.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-profit">${course.price}</p>
                      <p className="text-xs text-muted-foreground">{t('coursesPage.card.oneTimePayment')}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Link href={`/cursos/${course.slug}`} className="w-full">
                    <Button 
                      variant="profit" 
                      className="w-full group/btn relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-profit/30"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t('common.viewCourse')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-profit to-profit/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-profit/5 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('coursesPage.cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('coursesPage.cta.subtitle')}
          </p>
          <Button 
            variant="profit" 
            size="lg"
            onClick={() => window.location.href = '/mentorias'}
          >
            {t('coursesPage.cta.viewMentorships')}
          </Button>
        </div>
      </section>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          course={selectedCourse}
        />
      )}

      <Footer />
    </main>
  );
}
