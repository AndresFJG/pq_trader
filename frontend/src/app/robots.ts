import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/success',
          '/checkout/cancel',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/success',
          '/checkout/cancel',
        ],
      },
    ],
    sitemap: 'https://pqtrader.com/sitemap.xml',
  };
}
