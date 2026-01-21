import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';
import { ConditionalUI } from '@/components/layout/ConditionalUI';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://pqtrader.com'),
  title: {
    default: 'PQ Trader - Cursos y Mentorías de Trading Algorítmico | Aprende con Expertos',
    template: '%s | PQ Trader'
  },
  description:
    'Domina el trading algorítmico con mentorías personalizadas 1-a-1, cursos profesionales y portafolios verificados. Resultados reales, estrategias probadas. +1000 traders formados.',
  keywords: [
    'trading algorítmico',
    'cursos de trading',
    'mentorías de trading',
    'trading cuantitativo',
    'estrategias de trading',
    'backtesting',
    'python trading',
    'darwinex',
    'robots de trading',
    'formación trading',
    'aprende trading',
    'portafolios de trading',
    'trading profesional',
    'análisis técnico',
    'trading sistemático'
  ],
  authors: [{ name: 'PQ Trader', url: 'https://pqtrader.com' }],
  creator: 'PQ Trader',
  publisher: 'PQ Trader',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://pqtrader.com',
    siteName: 'PQ Trader',
    title: 'PQ Trader - Cursos y Mentorías de Trading Algorítmico',
    description:
      'Domina el trading algorítmico con mentorías 1-a-1, cursos profesionales y portafolios verificados. +1000 traders formados.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PQ Trader - Trading Algorítmico',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PQ Trader - Cursos y Mentorías de Trading Algorítmico',
    description: 'Domina el trading algorítmico con expertos. Mentorías 1-a-1 y cursos profesionales.',
    images: ['/og-image.jpg'],
    creator: '@pqtrader',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-google-search-console',
    // yandex: 'tu-codigo-yandex',
    // bing: 'tu-codigo-bing',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#161A1E',
                color: '#E8E8E8',
                border: '1px solid #2D3748',
              },
              success: {
                iconTheme: {
                  primary: '#00C853',
                  secondary: '#161A1E',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF3B30',
                  secondary: '#161A1E',
                },
              },
            }}
          />
          <ConditionalUI />
        </Providers>
      </body>
    </html>
  );
}
