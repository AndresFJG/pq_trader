'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, TrendingUp, Award } from 'lucide-react';
import { CourseDetailsModal } from '@/components/modals/CourseDetailsModal';

// Mock data - en producción vendría de la API
const courses = [
  {
    id: '1',
    title: 'Trading Algorítmico con Python',
    description: 'Aprende a crear estrategias automatizadas desde cero usando Python y bibliotecas especializadas.',
    instructor: 'Carlos Martínez',
    price: 299,
    duration: 40,
    students: 245,
    rating: 4.8,
    level: 'Principiante',
    topics: ['Python', 'Backtesting', 'MetaTrader', 'Estrategias Básicas'],
  },
  {
    id: '2',
    title: 'StrategyQuant Masterclass',
    description: 'Domina StrategyQuant para diseñar, testear y optimizar robots de trading sin programar.',
    instructor: 'Ana García',
    price: 249,
    duration: 30,
    students: 189,
    rating: 4.9,
    level: 'Intermedio',
    topics: ['StrategyQuant', 'Backtesting', 'Optimización', 'Walk-Forward'],
  },
  {
    id: '3',
    title: 'Gestión de Riesgo Avanzada',
    description: 'Aprende técnicas profesionales de gestión de riesgo y money management.',
    instructor: 'Roberto Silva',
    price: 199,
    duration: 25,
    students: 156,
    rating: 4.7,
    level: 'Avanzado',
    topics: ['Risk Management', 'Kelly Criterion', 'VaR', 'Sharpe Ratio'],
  },
];

const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];
const topics = ['Todos', 'Python', 'StrategyQuant', 'Risk Management'];

type Course = typeof courses[0];

export default function CursosPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <span className="text-sm text-profit font-medium">Catálogo Completo</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Cursos de Trading <span className="text-profit">Algorítmico</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Aprende de traders profesionales. Desde lo básico hasta estrategias avanzadas de trading cuantitativo.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Users className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">5,324</p>
              <p className="text-sm text-muted-foreground">Estudiantes Activos</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <Award className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Satisfacción</p>
            </div>
            <div className="bg-surface/50 border border-border/40 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-profit mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground">40+</p>
              <p className="text-sm text-muted-foreground">Horas de Contenido</p>
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
                  variant={level === 'Todos' ? 'default' : 'outline'}
                  size="sm"
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
                  className="text-muted-foreground hover:text-profit"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="group hover:border-profit/40 transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-profit/10 to-background">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-profit/20" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-profit/90 text-background text-xs font-bold px-3 py-1 rounded-full">
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
                      <span>{course.duration}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
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
                      <p className="text-xs text-muted-foreground">pago único</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant="profit" 
                    className="w-full group-hover:shadow-lg group-hover:shadow-profit/20 transition-all"
                    onClick={() => handleOpenCourseDetails(course)}
                  >
                    Ver Curso
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-profit/5 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Reserva una mentoría personalizada 1-a-1 con nuestros expertos
          </p>
          <Button 
            variant="profit" 
            size="lg"
            onClick={() => window.location.href = '/mentorias'}
          >
            Ver Mentorías
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
