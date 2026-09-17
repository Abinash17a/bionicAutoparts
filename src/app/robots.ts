import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.usausedautopart.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/confirmation',
          '/checkout',
          '/payment',
          '/zen',
          '/zen2',
          '/zenpay',
          '/contact?',
          '/parts?search=',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
