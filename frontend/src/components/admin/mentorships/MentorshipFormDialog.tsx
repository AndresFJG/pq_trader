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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const mentorshipSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duration: z.string().min(1, 'La duración es requerida'),
  price: z.string().min(1, 'El precio es requerido'),
  status: z.enum(['active', 'inactive', 'full']),
  max_participants: z.string().optional(),
});

type MentorshipFormValues = z.infer<typeof mentorshipSchema>;

interface MentorshipFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorship?: {
    id: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    status: string;
    max_participants?: number;
  };
  onSuccess?: () => void;
}

export function MentorshipFormDialog({ open, onOpenChange, mentorship, onSuccess }: MentorshipFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!mentorship;

  const form = useForm<MentorshipFormValues>({
    resolver: zodResolver(mentorshipSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      price: '',
      status: 'active',
      max_participants: '',
    },
  });

  // Reset form with mentorship data when mentorship changes
  useEffect(() => {
    if (mentorship) {
      form.reset({
        title: mentorship.title || '',
        description: mentorship.description || '',
        duration: mentorship.duration?.toString() || '',
        price: mentorship.price?.toString() || '',
        status: (mentorship.status as 'active' | 'inactive' | 'full') || 'active',
        max_participants: mentorship.max_participants?.toString() || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        duration: '',
        price: '',
        status: 'active',
        max_participants: '',
      });
    }
  }, [mentorship, form]);

  async function onSubmit(data: MentorshipFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        duration: parseInt(data.duration),
        price: parseFloat(data.price),
        status: data.status,
        max_participants: data.max_participants ? parseInt(data.max_participants) : null,
      };

      if (isEditing && mentorship) {
        await api.put(`/mentorships/${mentorship.id}`, payload);
      } else {
        await api.post('/mentorships', payload);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving mentorship:', error);
      alert(error.response?.data?.error || 'Error al guardar la mentoría');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Mentoría' : 'Crear Nueva Mentoría'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información de la mentoría'
              : 'Completa la información para crear una nueva mentoría'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la Mentoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Mentoría de Trading Avanzado" {...field} />
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
                      placeholder="Describe el contenido de la mentoría..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} />
                    </FormControl>
                    <FormDescription>Duración en minutos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participantes Máximos</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormDescription>Opcional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Activa</SelectItem>
                        <SelectItem value="inactive">Inactiva</SelectItem>
                        <SelectItem value="full">Completa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Guardar Cambios' : 'Crear Mentoría'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
