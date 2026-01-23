'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical,
  PlayCircle,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { LessonFormDialog } from '@/components/admin/courses/LessonFormDialog';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number;
  video_url?: string;
  content?: string;
  order_index: number;
  is_free: boolean;
}

interface Course {
  id: number;
  title: string;
  slug: string;
}

export default function CourseLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();

  const fetchData = async () => {
    try {
      // Obtener curso
      const courseRes = await api.get(`/courses/${courseId}`);
      if (courseRes.data.success) {
        setCourse(courseRes.data.data);
      }

      // Obtener lecciones
      const lessonsRes = await api.get(`/courses/${courseId}/lessons`);
      if (lessonsRes.data.success) {
        setLessons(lessonsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleCreateLesson = () => {
    setEditingLesson(undefined);
    setIsDialogOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta lección?')) return;

    try {
      await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
      toast.success('Lección eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Error al eliminar la lección');
    }
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-profit mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/courses">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Cursos
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lecciones del Curso
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {course?.title}
            </p>
          </div>
          <Button
            onClick={handleCreateLesson}
            className="bg-profit hover:bg-profit/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Lección
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Lecciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lecciones Gratuitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter(l => l.is_free).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Duración Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.reduce((acc, l) => acc + l.duration, 0)} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lecciones</CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <PlayCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay lecciones</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando la primera lección de este curso
              </p>
              <Button onClick={handleCreateLesson}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Lección
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-profit/50 transition-colors"
                >
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-shrink-0">
                    {lesson.is_free ? (
                      <PlayCircle className="h-5 w-5 text-profit" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">
                        Lección {index + 1}
                      </span>
                      {lesson.is_free && (
                        <Badge variant="secondary" className="text-xs">
                          Gratis
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium mb-1">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>⏱️ {lesson.duration} min</span>
                      {lesson.video_url && (
                        <span>🎥 Video incluido</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLesson(lesson)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Form Dialog */}
      <LessonFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        courseId={courseId}
        lesson={editingLesson}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
