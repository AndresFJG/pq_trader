'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, TrendingUp, Award } from 'lucide-react';
import { CourseDetailsModal } from '@/components/modals/CourseDetailsModal';
import { useLanguage } from '@/lib/i18n';

// Mock data - en producción vendría de la API
const courses = [
  {
    id: '1',
    titleKey: 'courses.list.basicAlgo.title',
    descriptionKey: 'courses.list.basicAlgo.description',
    instructor: 'Carlos Martínez',
    price: 290,
    duration: 6,
    students: 245,
    rating: 4.8,
    levelKey: 'courses.level.beginner',
    topics: ['MT5', 'Backtesting', 'Estadística', 'Automatización'],
    modules: [
      'courses.list.basicAlgo.module1',
      'courses.list.basicAlgo.module2',
      'courses.list.basicAlgo.module3',
      'courses.list.basicAlgo.module4',
      'courses.list.basicAlgo.module5',
      'courses.list.basicAlgo.module6',
    ],
  },
  {
    id: '2',
    titleKey: 'courses.list.strategyquant.title',
    descriptionKey: 'courses.list.strategyquant.description',
    instructor: 'Ana García',
    price: 300,
    duration: 5,
    students: 189,
    rating: 4.9,
    levelKey: 'courses.level.intermediate',
    topics: ['StrategyQuant', 'Optimización', 'Robustez', 'Exportación'],
    modules: [
      'courses.list.strategyquant.module1',
      'courses.list.strategyquant.module2',
      'courses.list.strategyquant.module3',
      'courses.list.strategyquant.module4',
      'courses.list.strategyquant.module5',
    ],
  },
  {
    id: '3',
    titleKey: 'courses.list.fxdreema.title',
    descriptionKey: 'courses.list.fxdreema.description',
    instructor: 'Roberto Silva',
    price: 600,
    duration: 10,
    students: 156,
    rating: 4.7,
    levelKey: 'courses.level.beginner',
    topics: ['fxDreema', 'Indicadores', 'Grid Trading', 'EAs'],
    modules: [
      'courses.list.fxdreema.module1',
      'courses.list.fxdreema.module2',
      'courses.list.fxdreema.module3',
    ],
  },
  {
    id: '4',
    titleKey: 'courses.list.advancedData.title',
    descriptionKey: 'courses.list.advancedData.description',
    instructor: 'Carlos Martínez',
    price: 600,
    duration: 10,
    students: 98,
    rating: 4.9,
    levelKey: 'courses.level.advanced',
    topics: ['WFA', 'Montecarlo', 'QuantAnalyzer', 'VPS'],
    modules: [
      'courses.list.advancedData.module1',
      'courses.list.advancedData.module2',
      'courses.list.advancedData.module3',
      'courses.list.advancedData.module4',
    ],
  },
];

type Course = typeof courses[0];

export default function CursosPage() {
  const { t } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(t('coursesPage.filters.all'));
  const [selectedTopic, setSelectedTopic] = useState(t('coursesPage.filters.all'));

  const levels = [
    t('coursesPage.filters.all'),
    t('courses.level.beginner'),
    t('courses.level.intermediate'),
    t('courses.level.advanced')
  ];
  const topics = [t('coursesPage.filters.all'), 'Python', 'StrategyQuant', 'Risk Management'];

  // Filtrar cursos
  const filteredCourses = courses.filter((course) => {
    const allText = t('coursesPage.filters.all');
    const levelMatch = selectedLevel === allText || t(course.levelKey) === selectedLevel;
    const topicMatch = selectedTopic === allText || course.topics.includes(selectedTopic);
    return levelMatch && topicMatch;
  });

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
              <p className="text-3xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">{t('coursesPage.stats.activeCourses')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Users className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">5,324</p>
              <p className="text-sm text-muted-foreground">{t('coursesPage.stats.totalStudents')}</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">31</p>
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
                  key={level}
                  variant={level === selectedLevel ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={level === selectedLevel ? 'bg-profit hover:bg-profit/90' : ''}
                >
                  {level}
                </Button>
              ))}
            </div>

            {/* Topic Filter */}
            <div className="flex gap-2 flex-wrap">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className={topic === selectedTopic ? 'text-profit bg-profit/10' : 'text-muted-foreground hover:text-profit'}
                >
                  {topic}
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
                  setSelectedLevel(t('coursesPage.filters.all'));
                  setSelectedTopic(t('coursesPage.filters.all'));
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-profit/20" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-profit/90 text-background text-xs font-bold px-3 py-1 rounded-full">
                      {t(course.levelKey)}
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-profit transition-colors">
                    {t(course.titleKey)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {t(course.descriptionKey)}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} {t('coursesPage.card.hours')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} {t('coursesPage.card.students')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-profit">
                      <Star className="h-4 w-4 fill-profit" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-profit/10 text-profit px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-profit">${course.price}</p>
                      <p className="text-xs text-muted-foreground">{t('coursesPage.card.oneTimePayment')}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant="profit" 
                    className="w-full group-hover:shadow-lg group-hover:shadow-profit/20 transition-all"
                    onClick={() => handleOpenCourseDetails(course)}
                  >
                    {t('coursesPage.card.viewCourse')}
                  </Button>
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
