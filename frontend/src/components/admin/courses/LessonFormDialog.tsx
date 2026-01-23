'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const lessonSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duration: z.string().min(1, 'La duración es requerida'),
  video_url: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  content: z.string().optional(),
  order_index: z.string().min(1, 'El orden es requerido'),
  is_free: z.boolean().default(false),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lesson?: {
    id: number;
    title: string;
    description: string;
    duration: number;
    video_url?: string;
    content?: string;
    order_index: number;
    is_free: boolean;
  };
  onSuccess?: () => void;
}

export function LessonFormDialog({
  open,
  onOpenChange,
  courseId,
  lesson,
  onSuccess,
}: LessonFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!lesson;

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      video_url: '',
      content: '',
      order_index: '1',
      is_free: false,
    },
  });

  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration.toString(),
        video_url: lesson.video_url || '',
        content: lesson.content || '',
        order_index: lesson.order_index.toString(),
        is_free: lesson.is_free,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        duration: '',
        video_url: '',
        content: '',
        order_index: '1',
        is_free: false,
      });
    }
  }, [lesson, form]);

  const onSubmit = async (data: LessonFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        duration: parseInt(data.duration),
        order_index: parseInt(data.order_index),
        course_id: parseInt(courseId),
      };

      if (isEditing) {
        await api.put(`/courses/${courseId}/lessons/${lesson.id}`, payload);
        toast.success('Lección actualizada correctamente');
      } else {
        await api.post(`/courses/${courseId}/lessons`, payload);
        toast.success('Lección creada correctamente');
      }

      onSuccess?.();
      form.reset();
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      toast.error(error.response?.data?.error || 'Error al guardar la lección');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Lección' : 'Nueva Lección'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los detalles de la lección'
              : 'Completa los datos para crear una nueva lección'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Introducción a Python" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe de qué trata esta lección..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Posición en la lista
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Video</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/embed/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    URL embebida de YouTube, Vimeo, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido Adicional</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Texto adicional, recursos, notas..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Contenido de texto que se mostrará debajo del video
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Lección Gratuita</FormLabel>
                    <FormDescription>
                      Los usuarios podrán ver esta lección sin comprar el curso
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear Lección'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
