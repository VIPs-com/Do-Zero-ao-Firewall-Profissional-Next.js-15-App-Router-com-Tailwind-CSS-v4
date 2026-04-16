# Arquitetura & Estrutura de Pastas

## Diagrama de sistema

```
Usuário → Nginx (Proxy Reverso) → Next.js Server (porta 3000)
              │
              ▼
       proxy.ts (Sprint E)
     gera nonce CSP per-request
              │
              ▼
   ┌──────────────────────────┐
   │    App Router /app       │
   │  layout.tsx lê headers() │
   │  e propaga nonce         │
   └──┬────────────────────┬──┘
      │                    │
  Client Components    Server Components
  (Interatividade)     (Performance)
           │
   ┌───────▼──────┐
   │ BadgeContext │  ← Estado global
   │ localStorage │  ← Persistência única (Backend descartado)
   └──────────────┘
```

> **Persistência:** `localStorage` é a fonte de verdade. Backend/Supabase foi **descartado** (localStorage atende ao escopo educacional; portabilidade via export/import JSON se necessário).

## Estrutura de pastas comentada

```
📁 raiz/
│
├── 📁 app/                          ← Coração do App Router
│   ├── globals.css                  ← Tokens @theme dark/light + classes reutilizáveis
│   ├── layout.tsx                   ← Root + anti-FOUC + JSON-LD + nonce CSP
│   ├── page.tsx                     ← Home: hero, topologia, features
│   ├── providers.tsx                ← <BadgeProvider> global
│   ├── error.tsx                    ← Error boundary ('use client')
│   ├── not-found.tsx                ← 404 (Server, robots noindex)
│   ├── loading.tsx                  ← Suspense fallback global
│   ├── manifest.ts                  ← Web App Manifest (PWA Lite)
│   ├── sitemap.ts                   ← sitemap.xml dinâmico (lê ROUTE_SEO)
│   ├── robots.ts                    ← robots.txt dinâmico
│   ├── opengraph-image.tsx          ← OG 1200x630 via next/og (edge)
│   ├── icon.tsx                     ← favicon 32x32 via next/og (edge)
│   ├── apple-icon.tsx               ← apple-touch-icon 180x180 via next/og (edge)
│   │
│   ├── 📁 instalacao/               ← Módulo 1: Fundação & IP
│   ├── 📁 wan-nat/                  ← Módulo 2: NAT & SNAT
│   ├── 📁 dns/                      ← Módulo 3: BIND9
│   ├── 📁 nginx-ssl/                ← Módulo 4: Nginx + SSL/TLS
│   ├── 📁 web-server/               ← Módulo 4b: Web Server
│   ├── 📁 lan-proxy/                ← Módulo 5: Squid Proxy
│   ├── 📁 dnat/                     ← Módulo 6: DNAT & Port Forwarding
│   ├── 📁 port-knocking/            ← Módulo 7: Port Knocking
│   ├── 📁 vpn-ipsec/                ← Módulo 8: VPN IPSec
│   ├── 📁 nftables/                 ← Módulo 9: nftables (sucessor iptables)
│   ├── 📁 ataques-avancados/        ← Segurança ofensiva
│   ├── 📁 pivoteamento/             ← Riscos DMZ & lateral movement
│   ├── 📁 audit-logs/               ← Monitoramento & auditoria
│   ├── 📁 evolucao/                 ← Roadmap visual
│   ├── 📁 glossario/                ← Dicionário de termos
│   ├── 📁 cheat-sheet/              ← Referência rápida de comandos
│   ├── 📁 wireguard/                ← Módulo 10: WireGuard VPN (Sprint I.1)
│   ├── 📁 fail2ban/                 ← Módulo 11: Fail2ban (Sprint I.2)
│   ├── 📁 topicos/                  ← Índice dos 26 tópicos práticos
│   ├── 📁 quiz/                     ← Avaliação gamificada
│   ├── 📁 dashboard/                ← Progresso + badges desbloqueados
│   └── 📁 certificado/              ← Certificado de conclusão
│
├── 📄 proxy.ts                      ← Sprint E: CSP nonce per-request
├── 📄 next.config.ts                ← Headers de segurança estáticos
├── 📄 playwright.config.ts          ← E2E: build prod + start, chromium, webServer
│
├── 📁 e2e/                          ← Playwright E2E (Sprint T₂ — 12 testes)
│   ├── fixtures.ts                  ← resetStorage auto fixture (isola localStorage)
│   ├── 01-home-topology.spec.ts     ← SVG a11y: role=img + aria-labelledby
│   ├── 02-explorer-badge.spec.ts    ← Badge seed-direto + trackPageVisit smoke
│   ├── 03-quiz-expert-badge.spec.ts ← Clique completo no quiz + seed score=100
│   ├── 04-global-search.spec.ts     ← ⌘K abre, navega, ESC fecha
│   ├── 05-theme-persistence.spec.ts ← Toggle dark/light + badge night-owl
│   ├── 06-export-import-time-traveler.spec.ts ← Download + upload + badge
│   └── 07-dashboard-counters.spec.ts ← 3/35 checklist, 75% quiz, 0/21 badges
│
└── 📁 src/
    ├── 📁 components/
    │   ├── ClientLayout.tsx          ← Header, nav, dark/light toggle, busca global
    │   ├── GlobalSearch.tsx          ← Busca global ⌘K (WAI-ARIA combobox)
    │   ├── DeepDiveModal.tsx         ← Modais com role=dialog + focus trap
    │   │
    │   └── 📁 ui/                    ← Primitivos
    │       ├── TopologyInteractive.tsx  ← Diagrama de rede clicável (36KB)
    │       ├── CodeBlock.tsx            ← Bloco de código com cabeçalho
    │       ├── Steps.tsx                ← Passos numerados
    │       ├── Boxes.tsx                ← Info / Warn / Highlight boxes
    │       ├── FluxoCard.tsx            ← Card de fluxo de dados
    │       ├── LayerBadge.tsx           ← Badge de camada OSI
    │       ├── ProgressBar.tsx          ← Barra de progresso
    │       └── BadgeDisplay.tsx         ← Exibição de conquistas
    │
    ├── 📁 context/
    │   ├── BadgeContext.tsx          ← Estado global: badges, visitas, checkpoints
    │   └── BadgeContext.test.tsx    ← Testes vitest (Sprint T₀)
    │
    ├── 📁 test/
    │   └── setup.ts                ← Setup global: jest-dom, localStorage.clear()
    │
    ├── 📁 data/
    │   ├── quizQuestions.ts         ← Perguntas do quiz extraídas (Sprint F)
    │   ├── searchItems.ts           ← Índice da busca global (54 itens)
    │   └── deepDives.tsx            ← Conteúdo dos 6 modais avançados
    │
    └── 📁 lib/
        ├── seo.ts                   ← SITE_CONFIG, ROUTE_SEO, buildMetadata()
        ├── seo.test.ts              ← Testes de SEO (Sprint T₁)
        ├── useFocusTrap.ts          ← Hook a11y: focus trap, ESC, restore focus
        └── utils.ts                 ← cn() helper (clsx + tailwind-merge)
```

**Path alias:** `@/` resolve para `src/`. Todos os imports de `src/` usam esse alias.

## Constantes críticas — manter em sincronia

| Constante | Arquivo | Valor |
|-----------|---------|-------|
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | **18** (exclui home/quiz/dashboard/certificado/topicos) |
| `totalTopics` | `app/dashboard/page.tsx` | **26** |
| `checklistItemsCount` | `app/dashboard/page.tsx` | **35** (igual a `ALL_CHECKLIST_IDS.length`) |
| Texto na Home | `app/page.tsx` | "26 tópicos práticos" |

Bugs surgem quando esses valores divergem — sempre revalidar ao alterar conteúdo.

---
[← Voltar ao indice](README.md)
