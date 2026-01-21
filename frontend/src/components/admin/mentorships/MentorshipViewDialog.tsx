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
  Clock,
  User,
  CheckCircle2,
} from 'lucide-react';

interface Mentorship {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  mentor_id: string;
  status: string;
  created_at: string;
  max_participants?: number;
}

interface MentorshipViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorship: Mentorship | null;
}

const statusLabels = {
  active: 'Activa',
  inactive: 'Inactiva',
  full: 'Completa',
  scheduled: 'Programada',
  pending: 'Pendiente',
};

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  full: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
};

export function MentorshipViewDialog({ open, onOpenChange, mentorship }: MentorshipViewDialogProps) {
  if (!mentorship) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{mentorship.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Vista detallada de la mentoría
              </DialogDescription>
            </div>
            <Badge className={statusColors[mentorship.status as keyof typeof statusColors] || statusColors.active}>
              {statusLabels[mentorship.status as keyof typeof statusLabels] || mentorship.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${mentorship.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duración</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mentorship.duration} min
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Creado</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(mentorship.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-profit" />
                Descripción
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {mentorship.description}
              </p>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información Adicional
              </h3>
              <div className="space-y-3">
                {mentorship.max_participants && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Participantes Máximos</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {mentorship.max_participants} personas
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <User className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID del Mentor</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {mentorship.mentor_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID de la Mentoría:</span>
                  <p className="font-mono text-gray-900 dark:text-white mt-1">{mentorship.id}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1 capitalize">
                    {statusLabels[mentorship.status as keyof typeof statusLabels] || mentorship.status}
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
