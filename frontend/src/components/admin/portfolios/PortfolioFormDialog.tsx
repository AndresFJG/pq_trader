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

const portfolioSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  strategy: z.string().min(3, 'La estrategia es requerida'),
  performance: z.string().min(1, 'El rendimiento es requerido'),
  status: z.enum(['active', 'inactive', 'archived']),
  risk_level: z.enum(['low', 'medium', 'high']).optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio?: {
    id: string;
    title: string;
    description: string;
    strategy: string;
    performance: number;
    status: string;
    risk_level?: string;
  };
  onSuccess?: () => void;
}

export function PortfolioFormDialog({ open, onOpenChange, portfolio, onSuccess }: PortfolioFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!portfolio;

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '',
      description: '',
      strategy: '',
      performance: '',
      status: 'active',
      risk_level: 'medium',
    },
  });

  // Reset form with portfolio data when portfolio changes
  useEffect(() => {
    if (portfolio) {
      form.reset({
        title: portfolio.title || '',
        description: portfolio.description || '',
        strategy: portfolio.strategy || '',
        performance: portfolio.performance?.toString() || '',
        status: (portfolio.status as 'active' | 'inactive' | 'archived') || 'active',
        risk_level: (portfolio.risk_level as 'low' | 'medium' | 'high') || 'medium',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        strategy: '',
        performance: '',
        status: 'active',
        risk_level: 'medium',
      });
    }
  }, [portfolio, form]);

  async function onSubmit(data: PortfolioFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        strategy: data.strategy,
        performance: parseFloat(data.performance),
        status: data.status,
        risk_level: data.risk_level || null,
      };

      if (isEditing && portfolio) {
        await api.put(`/portfolios/${portfolio.id}`, payload);
      } else {
        await api.post('/portfolios', payload);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      alert(error.response?.data?.error || 'Error al guardar el portafolio');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Portafolio' : 'Crear Nuevo Portafolio'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información del portafolio'
              : 'Completa la información para crear un nuevo portafolio'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Portafolio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Estrategia Forex Agresiva" {...field} />
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
                      placeholder="Describe el portafolio y sus objetivos..."
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
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estrategia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Scalping, Day Trading" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="performance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rendimiento (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="12.5" {...field} />
                    </FormControl>
                    <FormDescription>Rendimiento total en %</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="risk_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Riesgo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el riesgo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Bajo</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="high">Alto</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
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
                {isEditing ? 'Guardar Cambios' : 'Crear Portafolio'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
