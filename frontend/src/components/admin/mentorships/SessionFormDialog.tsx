'use client';

import { useEffect } from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const sessionSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  session_date: z.string().min(1, 'Fecha requerida'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  max_participants: z.coerce.number().min(1, 'Mínimo 1').max(50, 'Máximo 50'),
  meeting_link: z.string().url('URL inválida').optional().or(z.literal('')),
}).refine(
  (data) => {
    const start = data.start_time.split(':').map(Number);
    const end = data.end_time.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    return endMinutes > startMinutes;
  },
  {
    message: 'Hora de fin debe ser posterior a hora de inicio',
    path: ['end_time'],
  }
);

type SessionFormValues = z.infer<typeof sessionSchema>;

interface SessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorshipId: string;
  session?: any;
  onSuccess: () => void;
}

export function SessionFormDialog({
  open,
  onOpenChange,
  mentorshipId,
  session,
  onSuccess,
}: SessionFormDialogProps) {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: '',
      description: '',
      session_date: '',
      start_time: '',
      end_time: '',
      max_participants: 1,
      meeting_link: '',
    },
  });

  useEffect(() => {
    if (session) {
      form.reset({
        title: session.title || '',
        description: session.description || '',
        session_date: session.session_date?.split('T')[0] || '',
        start_time: session.start_time || '',
        end_time: session.end_time || '',
        max_participants: session.max_participants || 1,
        meeting_link: session.meeting_link || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        session_date: '',
        start_time: '',
        end_time: '',
        max_participants: 1,
        meeting_link: '',
      });
    }
  }, [session, form]);

  const onSubmit = async (data: SessionFormValues) => {
    try {
      if (session) {
        await api.put(
          `/mentorships/${mentorshipId}/sessions/${session.id}`,
          data
        );
        toast.success('Sesión actualizada');
      } else {
        await api.post(`/mentorships/${mentorshipId}/sessions`, data);
        toast.success('Sesión creada');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Editar Sesión' : 'Nueva Sesión'}
          </DialogTitle>
          <DialogDescription>
            Define un espacio en el calendario para que los usuarios reserven
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sesión individual 1:1" {...field} />
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe qué se tratará en esta sesión"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="session_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participantes Máximos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      1 para sesión individual, más para grupal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Inicio</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meeting_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link de Reunión (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://zoom.us/j/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Zoom, Google Meet, etc. Se mostrará solo a quienes reserven
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-profit hover:bg-profit/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Guardando...'
                  : session
                  ? 'Guardar Cambios'
                  : 'Crear Sesión'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
