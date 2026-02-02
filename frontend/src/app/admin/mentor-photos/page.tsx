'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import MentorPhotoEditor from '@/components/mentor/MentorPhotoEditor';
import { getMentors } from '@/lib/mentors'; // Vamos a crear esto
import { useLanguage } from '@/lib/i18n';

export default function MentorPhotosPage() {
  const { language } = useLanguage();
  const [mentors, setMentors] = useState(getMentors(language));

  const handleMentorUpdate = (updatedMentor: any) => {
    setMentors(mentors.map(m => m.id === updatedMentor.id ? updatedMentor : m));
    // Aquí se podría guardar en la BD si es necesario
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
                ? 'Actualiza las fotos de perfil de los mentores con imágenes personalizadas o avatares predefinidos'
                : 'Update mentor profile photos with custom images or predefined avatars'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mentors.map((mentor) => (
              <MentorPhotoEditor
                key={mentor.id}
                mentor={mentor}
                onUpdate={handleMentorUpdate}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
