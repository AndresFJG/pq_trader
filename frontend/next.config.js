/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Comentado para mejor rendimiento en desarrollo
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
  // trailingSlash: true, // Solo necesario para export estático
};

module.exports = nextConfig;
