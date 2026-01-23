'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Trash2, Users, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CourseFormDialog } from './CourseFormDialog';
import { CourseViewDialog } from './CourseViewDialog';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  enrollment_count: number;
  is_published: boolean;
  created_at: string;
}

const fetcher = (url: string) => api.get(url).then((res: any) => res.data.data);

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

const statusColors = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  published: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
};

interface CoursesTableProps {
  searchQuery: string;
}

export function CoursesTable({ searchQuery }: CoursesTableProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: courses, error, isLoading, mutate } = useSWR<Course[]>('/courses', fetcher);

  const filteredCourses = courses?.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleView = (course: Course) => {
    setViewingCourse(course);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;
    
    try {
      await api.delete(`/courses/${courseId}`);
      mutate(); // Refresh data
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error al eliminar el curso');
    }
  };

  const handleSaveSuccess = () => {
    mutate(); // Refresh data after edit
  };

  // Map Course to the format expected by CourseFormDialog
  const getCourseForDialog = (course: Course | null) => {
    if (!course) return undefined;
    return {
      id: course.id,
      title: course.title,
      level: course.level,
      price: course.price,
      status: (course.is_published ? 'published' : 'draft') as 'draft' | 'published'
    };
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-profit" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12 text-red-500">
          Error al cargar los cursos
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No se encontraron cursos
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <Badge className={levelColors[course.level]}>
                        {levelLabels[course.level]}
                      </Badge>
                    </TableCell>
                    <TableCell>${course.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        {course.enrollment_count || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[course.is_published ? 'published' : 'draft']}>
                        {course.is_published ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(course.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleView(course)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(course)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/lessons`}>
                              <BookOpen className="h-4 w-4 mr-2" />
                              Gestionar Lecciones
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <CourseFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        course={getCourseForDialog(editingCourse)}
        onSuccess={handleSaveSuccess}
      />

      {/* View Dialog */}
      <CourseViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        course={viewingCourse}
      />
    </>
  );
}
