'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import MentorPhotoEditor from '@/components/mentor/MentorPhotoEditor';
import { useLanguage } from '@/lib/i18n';
import axios from 'axios';

export default function MentorPhotosPage() {
  const { language } = useLanguage();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const response = await axios.get(`${API_URL}/mentors`);
      
      if (response.data.success) {
        setMentors(response.data.data);
      } else {
        setError('Error al cargar mentores');
      }
    } catch (err: any) {
      console.error('Error fetching mentors:', err);
      setError(err.message || 'Error al cargar mentores');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorUpdate = (updatedMentor: any) => {
    setMentors(mentors.map(m => m.id === updatedMentor.id ? updatedMentor : m));
    // La imagen ya está guardada en Supabase Storage por el backend
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {language === 'es' ? 'Gestionar Fotos de Mentores' : 'Manage Mentor Photos'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'es'
                ? 'Actualiza las fotos de perfil de los mentores. Las imágenes se suben automáticamente a Supabase Storage.'
                : 'Update mentor profile photos. Images are automatically uploaded to Supabase Storage.'}
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando mentores...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && mentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay mentores disponibles</p>
            </div>
          )}

          {!loading && mentors.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {mentors.map((mentor) => (
                <MentorPhotoEditor
                  key={mentor.id}
                  mentor={mentor}
                  onUpdate={handleMentorUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
