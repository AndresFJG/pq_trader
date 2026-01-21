/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'api.pqtrader.com', 'darwinex.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
  // Permitir errores de TypeScript en build (para desarrollo)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Permitir warnings de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
