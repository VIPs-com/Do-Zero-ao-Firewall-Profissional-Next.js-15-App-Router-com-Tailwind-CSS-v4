# PWA Lite & Boundaries (Sprint D)

## PWA Lite — sem service worker

O app e **instalavel** ("Adicionar a tela inicial") via Web App Manifest gerado em `app/manifest.ts`, mas **nao funciona offline**. Decisao deliberada: service worker adiciona complexidade desproporcional ao escopo educacional.

```typescript
// app/manifest.ts (trecho)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Workshop Linux — Do Zero ao Firewall Profissional',
    short_name: 'Workshop Linux',
    description: '...',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#e05a2b',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
```

- `display: 'standalone'` — abre como app sem chrome do browser
- Icones servidos pelas rotas dinamicas `/icon` e `/apple-icon` (`next/og` edge runtime — sem PNGs binarios no repo)
- `theme_color: '#e05a2b'` (laranja accent) · `background_color: '#0d1117'` (dark)

## Boundaries do App Router

| Arquivo | Proposito | Notas |
|---|---|---|
| `app/error.tsx` | Captura runtime errors, exibe UI amigavel + botao "Tentar novamente" via `reset()` | **Obrigatoriamente `'use client'`** |
| `app/not-found.tsx` | 404 page com `robots: noindex` | Server Component (bundle minimo para bots) |
| `app/loading.tsx` | Suspense fallback global com spinner + `role="status"` + `aria-busy` | Server Component |

---
[<- Voltar ao indice](README.md)
