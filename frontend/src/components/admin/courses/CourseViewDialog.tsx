'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  DollarSign,
  Calendar,
  BookOpen,
  Clock,
  Award,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  enrollment_count: number;
  is_published: boolean;
  created_at: string;
  duration?: string;
  modules?: number;
  lessons?: number;
  certificate?: boolean;
  requirements?: string[];
  what_you_learn?: string[];
}

interface CourseViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

const levelLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const levelColors = {
  beginner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export function CourseViewDialog({ open, onOpenChange, course }: CourseViewDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{course.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Vista detallada del curso
              </DialogDescription>
            </div>
            <Badge className={levelColors[course.level]}>
              {levelLabels[course.level]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Status & Basic Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${course.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Estudiantes</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.enrollment_count || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Creado</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(course.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${course.is_published ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.is_published ? 'Publicado' : 'Borrador'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {course.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-profit" />
                  Descripción
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {course.description}
                </p>
              </div>
            )}

            {/* Course Stats */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-profit" />
                Contenido del Curso
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duración</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.duration || '8 horas'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Módulos</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.modules || 12}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Certificado</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.certificate !== false ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            {course.what_you_learn && course.what_you_learn.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  ¿Qué aprenderás?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.what_you_learn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 dark:text-gray-400">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Requisitos
                </h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-profit mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID del Curso:</span>
                  <p className="font-mono text-gray-900 dark:text-white mt-1">{course.id}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Lecciones:</span>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">
                    {course.lessons || 45} lecciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
