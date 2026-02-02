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
import { Loader2, Upload, X, FileVideo, FileAudio, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { UploadHelpDialog } from './UploadHelpDialog';

const lessonSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duration: z.string().min(1, 'La duración es requerida'),
  video_url: z.string().optional(),
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [useExternalUrl, setUseExternalUrl] = useState(true);
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
      setUploadedFileUrl(lesson.video_url || '');
      setUseExternalUrl(!lesson.video_url || lesson.video_url.startsWith('http'));
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
      setSelectedFile(null);
      setUploadedFileUrl('');
      setUseExternalUrl(true);
    }
  }, [lesson, form]);

  // Manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (500 MB máximo)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('El archivo es demasiado grande. Tamaño máximo: 500 MB');
        return;
      }

      // Validar tipo
      const allowedTypes = [
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        'application/pdf',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de archivo no permitido. Solo videos, audio, PDFs e imágenes.');
        return;
      }

      setSelectedFile(file);
      setUploadedFileUrl('');
    }
  };

  // Subir archivo al servidor
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/lesson-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        return response.data.data.url;
      }
      return null;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data?.error || 'Error al subir el archivo');
      return null;
    } finally {
      setUploadProgress(0);
    }
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="h-5 w-5" />;
    if (file.type === 'application/pdf') return <FileText className="h-5 w-5" />;
    if (file.type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const onSubmit = async (data: LessonFormValues) => {
    setIsLoading(true);
    try {
      let finalVideoUrl = data.video_url || '';

      // Si hay un archivo seleccionado, subirlo primero
      if (!useExternalUrl && selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (!uploadedUrl) {
          toast.error('Error al subir el archivo');
          setIsLoading(false);
          return;
        }
        finalVideoUrl = uploadedUrl;
      } else if (!useExternalUrl && uploadedFileUrl) {
        finalVideoUrl = uploadedFileUrl;
      }

      const payload = {
        ...data,
        video_url: finalVideoUrl,
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

            {/* Selector de tipo de video */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Archivo Multimedia *</FormLabel>
                <UploadHelpDialog />
              </div>
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={useExternalUrl ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setUseExternalUrl(true);
                    setSelectedFile(null);
                  }}
                >
                  URL Externa
                </Button>
                <Button
                  type="button"
                  variant={!useExternalUrl ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseExternalUrl(false)}
                >
                  Subir Archivo
                </Button>
              </div>

              {useExternalUrl ? (
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
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
              ) : (
                <div className="space-y-3">
                  {/* Input de archivo */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="video/*,audio/*,application/pdf,image/*"
                      onChange={handleFileSelect}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedFile ? 'Cambiar archivo' : 'Click para seleccionar archivo'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Videos, audio, PDFs, imágenes (Max: 500 MB)
                      </p>
                    </label>
                  </div>

                  {/* Preview del archivo seleccionado */}
                  {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {getFileIcon(selectedFile)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Archivo ya subido */}
                  {!selectedFile && uploadedFileUrl && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          Archivo subido correctamente
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {uploadedFileUrl}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Barra de progreso */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Subiendo archivo...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
