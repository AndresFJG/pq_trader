'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, FileVideo, FileAudio, FileText, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function UploadHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" type="button">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guía de Subida de Archivos Multimedia</DialogTitle>
          <DialogDescription>
            Aprende a subir videos, audio, PDFs e imágenes a tus lecciones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipos de archivos permitidos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📋 Archivos Permitidos</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FileVideo className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Videos</p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    MP4, WebM, OGG, MOV, AVI
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FileAudio className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-300">Audio</p>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    MP3, WAV, OGG
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300">Documentos</p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    PDF, DOC, DOCX, PPT, PPTX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">Imágenes</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    JPG, PNG, GIF, WebP, SVG
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Límites */}
          <div>
            <h3 className="text-lg font-semibold mb-3">⚖️ Límites</h3>
            <Alert>
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Tamaño máximo por archivo: <strong>500 MB</strong></span>
              </AlertDescription>
            </Alert>
          </div>

          {/* Cómo usar */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🚀 Cómo Usar</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Elige el método</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click en "URL Externa" para YouTube/Vimeo o "Subir Archivo" para archivos locales
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Selecciona tu archivo</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click en la zona de "Drop" y selecciona el archivo desde tu ordenador
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Verifica y guarda</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Verifica el preview, espera a que suba (verás barra de progreso) y guarda la lección
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-3">💡 Tips</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Comprime videos grandes con HandBrake antes de subirlos</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Usa MP4 para videos (mejor compatibilidad)</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Nombra los archivos descriptivamente</p>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">No uses caracteres especiales en nombres de archivo</p>
              </div>
            </div>
          </div>

          {/* Solución de problemas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🔧 Solución de Problemas</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">❌ "Archivo demasiado grande"</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprime el archivo o divide en múltiples lecciones
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">❌ "Tipo no permitido"</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Convierte a MP4 (video) o MP3 (audio) y verifica la extensión
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">❌ "Error al subir"</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Verifica tu conexión a internet e intenta con un archivo más pequeño
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
