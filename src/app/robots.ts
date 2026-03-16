import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/personal-info/', '/checkout/', '/verify-2fa/', '/reset-password/'],
      },
    ],
    sitemap: 'https://criptojackpot.com/sitemap.xml',
  };
}
