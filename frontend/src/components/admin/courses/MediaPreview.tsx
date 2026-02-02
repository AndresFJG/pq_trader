'use client';

import { useState } from 'react';
import { FileVideo, FileAudio, FileText, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPreviewProps {
  url: string;
  type?: 'video' | 'audio' | 'pdf' | 'image' | 'external';
  title?: string;
}

export function MediaPreview({ url, type, title }: MediaPreviewProps) {
  const [loading, setLoading] = useState(true);

  // Detectar tipo de media automáticamente
  const detectType = (): 'video' | 'audio' | 'pdf' | 'image' | 'external' => {
    if (type) return type;
    
    if (url.includes('youtube.com') || url.includes('vimeo.com')) {
      return 'external';
    }
    
    const ext = url.split('.').pop()?.toLowerCase();
    
    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext || '')) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
      return 'audio';
    }
    if (ext === 'pdf') {
      return 'pdf';
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return 'image';
    }
    
    return 'external';
  };

  const mediaType = detectType();

  // Construir URL completa
  const getFullUrl = () => {
    if (url.startsWith('http')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}`;
  };

  const fullUrl = getFullUrl();

  // Renderizar según tipo de media
  const renderMedia = () => {
    switch (mediaType) {
      case 'video':
        return (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FileVideo className="h-16 w-16 text-gray-400 animate-pulse" />
              </div>
            )}
            <video
              controls
              className="w-full h-full"
              onLoadedData={() => setLoading(false)}
              preload="metadata"
            >
              <source src={fullUrl} />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        );

      case 'audio':
        return (
          <div className="w-full p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <FileAudio className="h-12 w-12 text-white" />
              <div className="text-white">
                <h3 className="font-semibold">{title || 'Audio de la lección'}</h3>
                <p className="text-sm opacity-90">Archivo de audio</p>
              </div>
            </div>
            <audio
              controls
              className="w-full"
              onLoadedData={() => setLoading(false)}
              preload="metadata"
            >
              <source src={fullUrl} />
              Tu navegador no soporta la reproducción de audio.
            </audio>
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-12 w-12 text-red-600" />
                <div>
                  <h3 className="font-semibold">{title || 'Documento PDF'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Archivo PDF de la lección
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="default">
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en nueva pestaña
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={fullUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </a>
              </Button>
            </div>
            <div className="mt-4 w-full h-[600px] border rounded-lg overflow-hidden">
              <iframe
                src={fullUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="w-full">
            {loading && (
              <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <ImageIcon className="h-16 w-16 text-gray-400 animate-pulse" />
              </div>
            )}
            <img
              src={fullUrl}
              alt={title || 'Imagen de la lección'}
              className="w-full rounded-lg"
              onLoad={() => setLoading(false)}
            />
          </div>
        );

      case 'external':
        return (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || 'Video de la lección'}
            />
          </div>
        );

      default:
        return (
          <div className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Tipo de archivo no soportado para preview
            </p>
            <Button asChild variant="outline" className="mt-4">
              <a href={fullUrl} download>
                <Download className="h-4 w-4 mr-2" />
                Descargar archivo
              </a>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderMedia()}
    </div>
  );
}
