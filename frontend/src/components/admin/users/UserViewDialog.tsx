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
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Crown,
  CheckCircle2,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription_tier: string;
  created_at: string;
}

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const roleLabels = {
  admin: 'Administrador',
  user: 'Usuario',
};

const roleColors = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
};

const tierLabels = {
  free: 'Gratis',
  basic: 'Básico',
  premium: 'Premium',
  enterprise: 'Enterprise',
};

const tierColors = {
  free: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  basic: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  premium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  enterprise: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export function UserViewDialog({ open, onOpenChange, user }: UserViewDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{user.name}</DialogTitle>
              <DialogDescription className="mt-2">
                Vista detallada del usuario
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                {roleLabels[user.role as keyof typeof roleLabels] || user.role}
              </Badge>
              <Badge className={tierColors[user.subscription_tier as keyof typeof tierColors]}>
                {tierLabels[user.subscription_tier as keyof typeof tierLabels] || user.subscription_tier}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* User Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Mail className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Calendar className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Miembro desde</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Role Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-profit" />
                Permisos y Rol
              </h3>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  {user.role === 'admin' ? (
                    <Shield className="h-6 w-6 text-purple-600" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.role === 'admin' 
                        ? 'Acceso completo al panel de administración' 
                        : 'Acceso a cursos y contenido de usuario'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-profit" />
                Plan de Suscripción
              </h3>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <Crown className={`h-6 w-6 ${
                    user.subscription_tier === 'enterprise' ? 'text-red-600' :
                    user.subscription_tier === 'premium' ? 'text-yellow-600' :
                    user.subscription_tier === 'basic' ? 'text-green-600' :
                    'text-gray-600'
                  }`} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Plan {tierLabels[user.subscription_tier as keyof typeof tierLabels] || user.subscription_tier}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.subscription_tier === 'enterprise' && 'Acceso ilimitado + mentoría personalizada'}
                      {user.subscription_tier === 'premium' && 'Acceso a todos los cursos premium'}
                      {user.subscription_tier === 'basic' && 'Acceso a cursos básicos'}
                      {user.subscription_tier === 'free' && 'Contenido gratuito limitado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Características de la Cuenta
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Cuenta verificada</span>
                </div>
                {user.role === 'admin' && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Permisos de administrador</span>
                  </div>
                )}
                {(user.subscription_tier === 'premium' || user.subscription_tier === 'enterprise') && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Certificados disponibles</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">ID del Usuario:</span>
                <p className="font-mono text-gray-900 dark:text-white mt-1">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
