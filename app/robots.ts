import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

/*
 * robots.txt dinâmico.
 * Tudo público — site é educacional e aberto.
 * Apenas o /_next/ e /api/ (se existir no futuro) ficam bloqueados.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
