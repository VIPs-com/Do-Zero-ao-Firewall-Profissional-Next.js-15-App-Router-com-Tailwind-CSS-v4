import type { MetadataRoute } from 'next';
import { SITE_CONFIG, ROUTE_SEO } from '@/lib/seo';

/*
 * Sitemap dinâmico — gerado a partir do ROUTE_SEO em src/lib/seo.ts.
 * Ao adicionar uma nova rota ao ROUTE_SEO, ela aparece automaticamente aqui.
 *
 * Prioridades:
 *   1.0  — Home
 *   0.9  — Páginas de navegação (topicos, dashboard)
 *   0.8  — Conteúdo técnico principal (instalacao, dns, vpn, etc.)
 *   0.7  — Recursos de apoio (glossario, cheat-sheet)
 *   0.5  — Utilitários (quiz, certificado, evolucao)
 */
const PRIORITY_MAP: Record<string, number> = {
  '/': 1.0,
  '/topicos': 0.9,
  '/dashboard': 0.9,
  '/quiz': 0.5,
  '/certificado': 0.5,
  '/evolucao': 0.5,
  '/glossario': 0.7,
  '/cheat-sheet': 0.7,
};

const CHANGE_FREQ_MAP: Record<string, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  '/': 'weekly',
  '/evolucao': 'weekly',
  '/dashboard': 'daily',
  '/quiz': 'monthly',
  '/certificado': 'monthly',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return Object.keys(ROUTE_SEO).map((route) => ({
    url: route === '/' ? SITE_CONFIG.url : `${SITE_CONFIG.url}${route}`,
    lastModified: now,
    changeFrequency: CHANGE_FREQ_MAP[route] ?? 'monthly',
    priority: PRIORITY_MAP[route] ?? 0.8,
  }));
}
