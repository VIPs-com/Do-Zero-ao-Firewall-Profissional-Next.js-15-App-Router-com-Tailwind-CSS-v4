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
│   ├── 📁 topicos/                  ← Índice dos 95 tópicos práticos
│   ├── 📁 jornada/                  ← Jornada Unificada — as 3 trilhas em 69 módulos
│   ├── 📁 ferramentas/              ← Hub de 5 utilitários (CIDR/Regex/iptables/PS1/Base64)
│   ├── 📁 quiz/                     ← Avaliação gamificada (294 perguntas)
│   ├── 📁 dashboard/                ← Progresso + badges desbloqueados
│   ├── 📁 certificado/              ← Certificado de conclusão
│   │
│   │   ── v2.0 Fundamentos Linux ──────────────────────────────────
│   ├── 📁 fundamentos/              ← Índice da trilha Fundamentos
│   ├── 📁 fhs/ · /comandos/ · /editores/ · /processos/ · /permissoes/
│   ├── 📁 discos/ · /logs-basicos/ · /backup/ · /shell-script/ · /cron/
│   ├── 📁 pacotes/ · /boot/ · /comandos-avancados/ · /rsyslog/
│   │
│   │   ── v3.0 Servidores e Serviços (9) ────────────────────────
│   ├── 📁 dhcp/ · /samba/ · /apache/ · /openvpn/ · /traefik/
│   ├── 📁 ldap/ · /pihole/ · /nfs/ · /haproxy/
│   │
│   │   ── v4.0 Infraestrutura Moderna (9) ───────────────────────
│   ├── 📁 ansible/ · /monitoring/ · /kubernetes/ · /terraform/
│   ├── 📁 suricata/ · /ebpf/ · /service-mesh/ · /sre/ · /vault/
│   │
│   │   ── v5.0 Cloud & Platform Engineering (9) ──────────────────
│   ├── 📁 cicd/ · /opnsense/ · /nextcloud/ · /ebpf-avancado/
│   └── 📁 crowdsec/ · /tailscale/ · /proxmox-backup-server/ · /gpg/ · /resposta-incidentes/
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
│   ├── 07-dashboard-counters.spec.ts ← 3/190 checklist, 75% quiz, 0/68 badges
│   ├── 08-module-nav.spec.ts         ← Navegação sequencial Anterior/Próximo
│   └── 09-milestone-celebration.spec.ts ← Modal de conquista + confetti
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
    │   ├── quizQuestions.ts         ← barrel: QUIZ_QUESTIONS (294) de quiz/{firewall,fundamentos,avancados}.ts
    │   ├── searchItems.ts           ← Índice da busca global (268 itens)
    │   ├── courseOrder.ts           ← COURSE_ORDER (25) + FUNDAMENTOS_ORDER (17) + ADVANCED_ORDER (27)
    │   ├── journey.ts               ← Jornada Unificada: JOURNEY (69), getNextJourneyModule()
    │   └── deepDives.tsx            ← Conteúdo dos modais avançados
    │
    └── 📁 lib/
        ├── seo.ts                   ← SITE_CONFIG, ROUTE_SEO, buildMetadata()
        ├── seo.test.ts              ← Testes de SEO (Sprint T₁)
        ├── cidr.ts · regex.ts · iptables.ts · ps1.ts · base64.ts  ← lógica pura do hub /ferramentas
        ├── srs.ts · migrations.ts   ← motor SM-2 + migração versionada de localStorage
        ├── useFocusTrap.ts          ← Hook a11y: focus trap, ESC, restore focus
        └── utils.ts                 ← cn() helper (clsx + tailwind-merge)
```

**Path alias:** `@/` resolve para `src/`. Todos os imports de `src/` usam esse alias.

## Constantes críticas — manter em sincronia

| Constante | Arquivo | Valor |
|-----------|---------|-------|
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | **59** (base do badge deep-diver) |
| `totalTopics` | `app/dashboard/page.tsx` | **95** |
| `checklistItemsCount` | `app/dashboard/page.tsx` | **190** (igual a `ALL_CHECKLIST_IDS.length`) |
| Badges | `src/data/badges.ts` | **68** |
| searchItems | `src/data/searchItems.ts` | **268** |
| Texto na Home | `app/page.tsx` | "95 tópicos práticos" + stats: 95/69/68/7 |

Bugs surgem quando esses valores divergem — sempre revalidar ao alterar conteúdo.

---
[← Voltar ao indice](README.md)
