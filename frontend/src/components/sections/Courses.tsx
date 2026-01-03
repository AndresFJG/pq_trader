'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

// Mock data - En producción vendrá de la API
const courses = [
  {
    id: '1',
    title: 'Trading Algorítmico con Python',
    description: 'Aprende a crear estrategias automatizadas desde cero usando Python y bibliotecas especializadas.',
    price: 299,
    duration: 40,
    level: 'Principiante',
    enrolled: 245,
    rating: 4.8,
    thumbnail: '/courses/python.jpg',
  },
  {
    id: '2',
    title: 'StrategyQuant Masterclass',
    description: 'Domina StrategyQuant para diseñar, testear y optimizar robots de trading sin programar.',
    price: 249,
    duration: 30,
    level: 'Intermedio',
    enrolled: 189,
    rating: 4.9,
    thumbnail: '/courses/sqx.jpg',
  },
  {
    id: '3',
    title: 'Gestión de Riesgo Avanzada',
    description: 'Aprende técnicas profesionales de gestión de riesgo y money management.',
    price: 199,
    duration: 25,
    level: 'Avanzado',
    enrolled: 156,
    rating: 4.7,
    thumbnail: '/courses/risk.jpg',
  },
];

export function Courses() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Cursos Destacados</h2>
            <p className="text-xl text-muted-foreground">
              Aprende con contenido estructurado y práctico
            </p>
          </div>
          <Link href="/cursos">
            <Button variant="outline" className="group">
              Ver Todos
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
                    {course.level}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-profit text-profit" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm">{course.description}</p>
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
                  <Button variant="profit">Ver Curso</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
