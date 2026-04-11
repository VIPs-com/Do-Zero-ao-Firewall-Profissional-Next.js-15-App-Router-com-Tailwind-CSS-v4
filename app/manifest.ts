import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

/*
 * Web App Manifest — PWA Lite (sem service worker).
 *
 * Permite "Adicionar à tela inicial" no mobile e instalação como app
 * standalone no desktop (Chrome, Edge). Não há suporte offline porque
 * isso exigiria um service worker — decisão deliberada do Sprint D para
 * manter o escopo educacional simples.
 *
 * Os ícones são gerados dinamicamente por app/icon.tsx e app/apple-icon.tsx
 * via next/og — sem PNGs binários no repositório.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.title,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0d1117',
    theme_color: SITE_CONFIG.themeColor,
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['education', 'productivity', 'developer', 'security'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
