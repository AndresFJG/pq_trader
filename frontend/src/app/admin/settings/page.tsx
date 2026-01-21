'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  // Estos estados vendrían del backend verificando las variables de entorno
  const stripeConfigured = true;
  const paypalConfigured = false;
  const emailConfigured = true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Administra la configuración general de la plataforma
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Configura la información básica de tu plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del Sitio</Label>
              <Input id="siteName" defaultValue="PQ Trader" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">URL del Sitio</Label>
              <Input id="siteUrl" defaultValue="https://pqtrader.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Descripción</Label>
            <Textarea
              id="siteDescription"
              defaultValue="Plataforma de educación en trading algorítmico"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de Soporte Visible</Label>
              <Input
                id="supportEmail"
                type="email"
                defaultValue="support@pqtrader.com"
              />
              <p className="text-xs text-gray-500">Email mostrado a los usuarios</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-gray-500">Opcional, mostrado en footer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Integraciones</CardTitle>
          <CardDescription>
            Verificación del estado de servicios externos configurados en el servidor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              {emailConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <Label className="text-base">Servicio de Email (SMTP)</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Envío de emails automáticos
                </p>
              </div>
            </div>
            <Badge
              className={
                emailConfigured
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }
            >
              {emailConfigured ? 'Configurado' : 'No Configurado'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              {stripeConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <Label className="text-base">Stripe Payments</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Procesamiento de tarjetas de crédito
                </p>
              </div>
            </div>
            <Badge
              className={
                stripeConfigured
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }
            >
              {stripeConfigured ? 'Configurado' : 'No Configurado'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              {paypalConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <Label className="text-base">PayPal</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pagos vía PayPal
                </p>
              </div>
            </div>
            <Badge
              className={
                paypalConfigured
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }
            >
              {paypalConfigured ? 'Configurado' : 'No Configurado'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Negocio</CardTitle>
          <CardDescription>
            Ajusta los parámetros comerciales de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="commission">Comisión de Plataforma (%)</Label>
              <Input id="commission" type="number" defaultValue="15" min="0" max="100" />
              <p className="text-xs text-gray-500">Comisión por venta de curso</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPrice">Precio Mínimo de Curso ($)</Label>
              <Input id="minPrice" type="number" defaultValue="29" min="0" />
              <p className="text-xs text-gray-500">Precio mínimo permitido</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Máx. Estudiantes por Mentoría</Label>
              <Input id="maxStudents" type="number" defaultValue="20" min="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundDays">Días de Garantía de Reembolso</Label>
              <Input id="refundDays" type="number" defaultValue="30" min="0" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
          <CardDescription>
            Habilita o deshabilita características de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Registro de Usuarios</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permitir nuevos registros en la plataforma
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Mantenimiento</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mostrar página de mantenimiento a los usuarios
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comentarios en Cursos</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permitir comentarios en lecciones
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Certificados Automáticos</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generar certificados al completar cursos
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones por Email</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enviar emails de confirmación y recordatorios
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Demo</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permitir acceso demo sin registro
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
