'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

interface Mentor {
  id: string;
  name: string;
  title: string;
  image: string;
}

interface MentorPhotoEditorProps {
  mentor: Mentor;
  onUpdate: (mentor: Mentor) => void;
}

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=luis',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=juan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=juanita',
];

export default function MentorPhotoEditor({ mentor, onUpdate }: MentorPhotoEditorProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'mentor-photo');
      formData.append('mentor_id', mentor.id);

      // Upload file
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      const imageUrl = uploadResponse.data.url;
      setPreviewUrl(imageUrl);

      // Update mentor with new image
      onUpdate({ ...mentor, image: imageUrl });
      setShowUploadDialog(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectAvatar = (avatarUrl: string) => {
    onUpdate({ ...mentor, image: avatarUrl });
    setShowUploadDialog(false);
  };

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-lg">{mentor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Photo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-profit/30">
            <Image
              src={previewUrl || mentor.image}
              alt={mentor.name}
              fill
              className="object-cover"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowUploadDialog(!showUploadDialog)}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Cambiar Foto
          </Button>
        </div>

        {/* Upload Dialog */}
        {showUploadDialog && (
          <div className="space-y-4 p-4 bg-background/50 rounded-lg border border-border/40">
            {/* File Upload */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Subir imagen personalizada
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="w-full"
              />
              {uploading && <p className="text-xs text-muted-foreground mt-2">Subiendo...</p>}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border/40"></div>
              <span className="text-xs text-muted-foreground">O</span>
              <div className="flex-1 h-px bg-border/40"></div>
            </div>

            {/* Avatar Options */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                O elige un avatar predefinido
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_AVATARS.map((avatarUrl) => (
                  <button
                    key={avatarUrl}
                    onClick={() => handleSelectAvatar(avatarUrl)}
                    className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-border/40 hover:border-profit transition-all"
                  >
                    <Image
                      src={avatarUrl}
                      alt="Avatar option"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
