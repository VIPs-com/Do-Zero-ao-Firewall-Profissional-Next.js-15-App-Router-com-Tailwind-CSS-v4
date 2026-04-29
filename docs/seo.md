# SEO — Fonte Unica (Sprint B)

Toda a configuração de metadata vive em **`src/lib/seo.ts`**. Isso é essencial para manter consistência: todas as 64 rotas apontam para o mesmo helper e aparecem automaticamente no sitemap.

## Arquivo central: `src/lib/seo.ts`

- `SITE_CONFIG` — nome do site, URL base, keywords globais, theme color, autor
- `ROUTE_SEO` — mapa `{ '/rota': { title, description } }` para as 64 rotas
- `buildMetadata(route)` — helper que gera `Metadata` completo com Open Graph + Twitter + canonical

## Como adicionar SEO a uma nova rota

1. Adicione a entrada em `src/lib/seo.ts`:
   ```typescript
   export const ROUTE_SEO = {
     // ...
     '/nova-rota': {
       title: 'Título Humano — Workshop Linux',
       description: 'Descrição concisa e rica em keywords (até 160 caracteres).',
     },
   };
   ```

2. Crie `app/nova-rota/layout.tsx` (Server Component):
   ```tsx
   import { buildMetadata } from '@/lib/seo';

   export const metadata = buildMetadata('/nova-rota');

   export default function Layout({ children }: { children: React.ReactNode }) {
     return children;
   }
   ```

3. A rota aparece automaticamente em `/sitemap.xml`.

## Por que esse padrão Client + Server?

Todas as páginas são Client Components (`'use client';`) para ter interatividade. Mas `metadata` só pode ser exportada de Server Components. A solução: cada rota tem um `layout.tsx` server-side que apenas repassa `children`. Isso dá o melhor dos dois mundos — estado reativo + metadata SEO.

## Recursos SEO gerados automaticamente

| Recurso | Arquivo | Como funciona |
|---|---|---|
| `/sitemap.xml` | `app/sitemap.ts` | Itera sobre `ROUTE_SEO` e emite `<url>` |
| `/robots.txt` | `app/robots.ts` | Permite tudo + aponta para o sitemap |
| `/opengraph-image` | `app/opengraph-image.tsx` | 1200x630 dinâmica via `next/og` (edge runtime) |
| `/icon` | `app/icon.tsx` | favicon 32x32 dinâmico via `next/og` |
| `/apple-icon` | `app/apple-icon.tsx` | apple-touch-icon 180x180 via `next/og` |
| `/manifest.webmanifest` | `app/manifest.ts` | Web App Manifest (PWA Lite) |
| JSON-LD `LearningResource` | `app/layout.tsx` (inline) | Schema.org injetado no `<head>` do root |

## URL base

Define via `NEXT_PUBLIC_SITE_URL` no `.env` (default: `https://workshop-linux.local`). Essa variável é lida por `SITE_CONFIG.url` e usada em canonical, OG, sitemap e robots.

---
[← Voltar ao indice](README.md)
