import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Courses } from '@/components/sections/Courses';
import { Darwinex } from '@/components/sections/Darwinex';
import { TrackRecords } from '@/components/sections/TrackRecords';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/layouts/Footer';
import { Navbar } from '@/components/layouts/Navbar';
import { StructuredData, generateOrganizationSchema } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://pqtrader.com',
  },
};

export default function HomePage() {
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <StructuredData data={orgSchema} />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        <Navbar />
        <Hero />
        <Features />
        <Courses />
        <TrackRecords />
        <Darwinex />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
