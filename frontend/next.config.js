/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Para exportar como sitio estático
  images: {
    unoptimized: true, // Necesario para exportación estática
    domains: ['localhost', 'api.pqtrader.com', 'darwinex.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
  trailingSlash: true, // Importante para hosting estático
};

module.exports = nextConfig;
