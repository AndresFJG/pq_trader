import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import { courseService, Course } from '@/services/courseService';

// Generar las rutas estáticas para todos los cursos
export async function generateStaticParams() {
  try {
    // Usar fetch directamente para evitar problemas con axios en el servidor
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${API_URL}/courses`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Error fetching courses for static params');
      return [];
    }
    
    const data = await response.json();
    const courses = data.data || [];
    
    return courses.map((course: Course) => ({
      slug: course.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getCourse(slug: string): Promise<Course | null> {
  try {
    return await courseService.getCourseById(slug);
  } catch (error) {
    console.error('Error loading course:', error);
    return null;
  }
}

// Función para obtener los módulos según el curso
function getCourseModules(slug: string): string[] {
  const modules: Record<string, string[]> = {
    'curso-basico-trading-algoritmico': [
      'Fundamentos del enfoque cuantitativo y microestructura',
      'Operativa técnica y gestión de plataforma (MT5)',
      'Construcción lógica de estrategias y gestión de riesgo',
      'Evaluación estadística y análisis de métricas de rendimiento',
      'Pruebas de robustez y validación de datos no vistos',
      'Implementación en real, monitoreo y mejora continua'
    ],
    'strategyquant-masterclass': [
      'Fundamentos y Flujo de Trabajo',
      'Configuración y Gestión de Datos',
      'Motor de Generación',
      'Evaluación y Robustez',
      'Exportación e Implementación'
    ],
    'fxdreema-masterclass': [
      'Fundamentos y Lógica: Variables y desarrollo de indicadores',
      'Mecánicas Operativas: Eventos (On Tick, On Trade, On Timer)',
      'Filtros de tiempo y acciones de trading',
      'Gestión de riesgos (Trailing Stop y Breakeven)',
      'Estrategias Avanzadas: Trend Follow, Scalping, Grid',
      'Optimización para obtener un edge estadístico sólido'
    ],
    'teoria-mercado-real-datos-optimizacion-robustez': [
      'Optimización Profesional y Walk Forward Analysis',
      'Calidad de Datos y Robustez',
      'Tests de Montecarlo para medir probabilidad de éxito',
      'Gestión de Portafolios con QuantAnalyzer',
      'Implementación en Vivo: VPS y auditoría de cuentas',
      'Análisis de performance en tiempo real'
    ]
  };
  
  return modules[slug] || [
    'Fundamentos de trading algorítmico',
    'Implementación de estrategias',
    'Backtesting y optimización',
    'Gestión de riesgo profesional'
  ];
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }

  // Obtener los módulos del curso
  const modules = getCourseModules(params.slug);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-7xl">
          <Link href="/cursos">
            <Button
              variant="ghost"
              className="mb-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Cursos
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <span className="inline-block bg-profit/10 text-profit px-3 py-1 rounded-full text-sm font-medium capitalize mb-4">
                {course.level}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {course.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-profit" />
                  <span className="text-foreground font-medium">{course.duration_hours} horas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-profit" />
                  <span className="text-foreground font-medium">{course.enrollment_count || 0} estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-profit fill-profit" />
                  <span className="text-foreground font-medium">{course.rating || '5.0'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-profit" />
                  <span className="text-foreground font-medium">{course.category}</span>
                </div>
              </div>

              {/* Course Image */}
              {course.thumbnail && (
                <div className="aspect-video rounded-lg overflow-hidden mb-8">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* What you'll learn */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-profit" />
                    Lo que aprenderás
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {modules.map((module, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-profit shrink-0 mt-0.5" />
                        <span>{module}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Course Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-5xl font-bold text-profit mb-2">${course.price}</p>
                    <p className="text-sm text-muted-foreground">Pago único</p>
                  </div>

                  <Link href={`/checkout?type=course&id=${course.id}&price=${course.price}`}>
                    <Button variant="profit" size="lg" className="w-full mb-4">
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Comprar Ahora
                    </Button>
                  </Link>

                  <div className="space-y-3 pt-6 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nivel:</span>
                      <span className="font-medium capitalize">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duración:</span>
                      <span className="font-medium">{course.duration_hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estudiantes:</span>
                      <span className="font-medium">{course.enrollment_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoría:</span>
                      <span className="font-medium">{course.category}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Este curso incluye:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-profit" />
                        Acceso de por vida
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-profit" />
                        Certificado de finalización
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-profit" />
                        Recursos descargables
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-profit" />
                        Soporte del instructor
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
