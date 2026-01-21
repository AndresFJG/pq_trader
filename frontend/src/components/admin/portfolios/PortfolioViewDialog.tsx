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
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string;
  strategy: string;
  performance: number;
  status: string;
  created_at: string;
  risk_level?: string;
}

interface PortfolioViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio: Portfolio | null;
}

const statusLabels = {
  active: 'Activo',
  inactive: 'Inactivo',
  archived: 'Archivado',
};

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  archived: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const riskLabels = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
};

const riskColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export function PortfolioViewDialog({ open, onOpenChange, portfolio }: PortfolioViewDialogProps) {
  if (!portfolio) return null;

  const isPositive = portfolio.performance >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{portfolio.title}</DialogTitle>
              <DialogDescription className="mt-2">
                Vista detallada del portafolio
              </DialogDescription>
            </div>
            <Badge className={statusColors[portfolio.status as keyof typeof statusColors] || statusColors.active}>
              {statusLabels[portfolio.status as keyof typeof statusLabels] || portfolio.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Performance Card */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rendimiento Total</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isPositive ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                    <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{portfolio.performance}%
                    </p>
                  </div>
                </div>
                {portfolio.risk_level && (
                  <Badge className={riskColors[portfolio.risk_level as keyof typeof riskColors]}>
                    Riesgo {riskLabels[portfolio.risk_level as keyof typeof riskLabels]}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-profit" />
                Descripción
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {portfolio.description}
              </p>
            </div>

            {/* Strategy Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-profit" />
                Estrategia
              </h3>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                  {portfolio.strategy}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información del Usuario
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <User className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID del Usuario</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {portfolio.user_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Creación</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(portfolio.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Warning */}
            {portfolio.risk_level === 'high' && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-300">Nivel de Riesgo Alto</p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    Este portafolio tiene un nivel de riesgo alto. Se recomienda supervisión constante.
                  </p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID del Portafolio:</span>
                  <p className="font-mono text-gray-900 dark:text-white mt-1">{portfolio.id}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1 capitalize">
                    {statusLabels[portfolio.status as keyof typeof statusLabels] || portfolio.status}
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
