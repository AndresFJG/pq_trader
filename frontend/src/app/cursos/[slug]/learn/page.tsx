'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layouts/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  FileText,
  Download,
  Clock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number;
  video_url?: string;
  content?: string;
  order_index: number;
  is_free: boolean;
  completed?: boolean;
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  level: string;
  duration_hours: number;
  instructor_id: number;
}

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, authLoading, router]);

  // Cargar curso y verificar enrollment
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user) return;

      try {
        // Obtener información del curso
        const courseRes = await api.get(`/courses/${slug}`);
        if (courseRes.data.success) {
          setCourse(courseRes.data.data);
        }

        // Verificar enrollment
        const enrollmentRes = await api.get('/enrollments/my-courses');
        if (enrollmentRes.data.success) {
          const userCourse = enrollmentRes.data.data.find(
            (c: any) => c.slug === slug
          );

          if (!userCourse) {
            toast.error('No tienes acceso a este curso');
            router.push(`/cursos/${slug}`);
            return;
          }

          setEnrollment(userCourse);
        }

        // Obtener lecciones del curso (por ahora usaremos datos de ejemplo)
        // TODO: Crear endpoint /courses/:slug/lessons
        const mockLessons: Lesson[] = [
          {
            id: 1,
            title: 'Introducción al curso',
            description: 'Bienvenida y descripción general del contenido',
            duration: 10,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            order_index: 1,
            is_free: true,
            completed: false,
          },
          {
            id: 2,
            title: 'Configuración del entorno',
            description: 'Instalar las herramientas necesarias',
            duration: 15,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            order_index: 2,
            is_free: false,
            completed: false,
          },
          {
            id: 3,
            title: 'Primeros pasos',
            description: 'Tu primera estrategia de trading',
            duration: 20,
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            order_index: 3,
            is_free: false,
            completed: false,
          },
        ];

        setLessons(mockLessons);
        setCurrentLesson(mockLessons[0]);
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourseData();
    }
  }, [user, slug, router]);

  const handleLessonComplete = async (lessonId: number) => {
    try {
      // TODO: Crear endpoint para marcar lección como completada
      // await api.post(`/enrollments/lessons/${lessonId}/complete`);
      
      setLessons(lessons.map(l => 
        l.id === lessonId ? { ...l, completed: true } : l
      ));
      
      toast.success('Lección completada');
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Error al marcar como completada');
    }
  };

  const goToNextLesson = () => {
    if (!currentLesson) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const goToPreviousLesson = () => {
    if (!currentLesson) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return null;
  }

  const completedLessons = lessons.filter(l => l.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 flex">
        {/* Sidebar - Lecciones */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-80' : 'w-0 lg:w-0'
          } overflow-hidden`}
        >
          <div className="p-6 border-b border-border">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <h2 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium text-profit">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedLessons} de {lessons.length} lecciones completadas
              </p>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-200px)]">
            <div className="p-4 space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    currentLesson.id === lesson.id
                      ? 'border-profit bg-profit/5'
                      : 'border-border hover:border-profit/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {lesson.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-profit" />
                      ) : lesson.is_free || enrollment ? (
                        <PlayCircle className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Lección {index + 1}</span>
                        {lesson.is_free && (
                          <Badge variant="secondary" className="text-xs">Gratis</Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-medium mb-1 line-clamp-1">{lesson.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration} min</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Toggle Sidebar Button (Mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-card border border-border rounded-lg"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Video Player */}
          <div className="bg-black aspect-video w-full">
            {currentLesson.video_url ? (
              <iframe
                src={currentLesson.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay video disponible</p>
                  <p className="text-sm text-gray-400">Lee el contenido a continuación</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content */}
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
                  <p className="text-muted-foreground">{currentLesson.description}</p>
                </div>
                {!currentLesson.completed && (
                  <Button
                    onClick={() => handleLessonComplete(currentLesson.id)}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar completada
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentLesson.duration} minutos</span>
                </div>
                <Badge variant="secondary">{course.level}</Badge>
              </div>
            </div>

            {/* Lesson Content */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contenido de la lección</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                {currentLesson.content || (
                  <div className="text-muted-foreground">
                    <p className="mb-4">
                      Esta lección contiene información importante sobre el tema. 
                      Asegúrate de ver el video completo y tomar notas.
                    </p>
                    <h3>Objetivos de aprendizaje:</h3>
                    <ul>
                      <li>Comprender los conceptos fundamentales</li>
                      <li>Aplicar lo aprendido en casos prácticos</li>
                      <li>Desarrollar habilidades técnicas necesarias</li>
                    </ul>
                    <h3>Recursos adicionales:</h3>
                    <ul>
                      <li>Documentación oficial</li>
                      <li>Ejercicios prácticos</li>
                      <li>Material descargable</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={goToPreviousLesson}
                variant="outline"
                disabled={lessons.findIndex(l => l.id === currentLesson.id) === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lección anterior
              </Button>
              <Button
                onClick={goToNextLesson}
                disabled={lessons.findIndex(l => l.id === currentLesson.id) === lessons.length - 1}
              >
                Siguiente lección
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
