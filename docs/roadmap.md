# Roadmap Tecnico

```
Fase 1 ✅ Concluida — Fundacao
  ├── Migracao Vite -> Next.js App Router
  ├── Sistema de Badges & Busca Global (⌘K)
  ├── 21 rotas com conteudo tecnico completo
  ├── Topologia interativa clicavel
  └── Dark Mode corrigido (4 bugs resolvidos)

Sprint A ✅ Robustez
  ├── try/catch em todos os acessos a localStorage
  ├── next/font (Space Grotesk + JetBrains Mono) — self-hosted, zero CLS, LGPD-safe
  └── Web Share API funcional com fallback

Sprint B ✅ SEO
  ├── src/lib/seo.ts — fonte unica (SITE_CONFIG, ROUTE_SEO, buildMetadata)
  ├── Metadata por rota via layout.tsx Server Component
  ├── sitemap.ts + robots.ts dinamicos
  ├── opengraph-image + icon + apple-icon via next/og (edge runtime)
  └── JSON-LD LearningResource no root layout

Sprint C ✅ Acessibilidade WCAG 2.1 AA
  ├── Modais: role="dialog" + aria-modal + focus trap (useFocusTrap)
  ├── GlobalSearch: padrao WAI-ARIA combobox + listbox
  ├── prefers-reduced-motion global + useReducedMotion nos modais
  ├── :focus-visible com outline accent
  └── ESLint jsx-a11y como gate estatico

Sprint D ✅ PWA Lite + Headers de Seguranca
  ├── manifest.ts — PWA Lite (instalavel, sem service worker)
  ├── Icons dinamicos via next/og edge runtime
  ├── HSTS, X-Frame-Options, Permissions-Policy via next.config.ts
  └── Boundaries: error.tsx, not-found.tsx, loading.tsx

Sprint E ✅ CSP nonce per-request (Next.js 16)
  ├── middleware.ts -> proxy.ts (renomeacao Next.js 16)
  ├── Nonce criptografico propagado via x-nonce header
  ├── script-src 'self' 'nonce-XXX' 'strict-dynamic' — sem 'unsafe-inline'
  └── Trade-off: todas as rotas viram dynamic (aceito — nota A+ securityheaders.com)

Sprint G ✅ A11y do TopologyInteractive
  ├── SVG <title> + <desc> descrevendo a topologia
  ├── Nos clicaveis acessiveis por teclado (Enter/Space)
  └── Focus ring visivel via :focus-visible

Sprint F ✅ Performance & Code Splitting
  ├── TopologyInteractive, GlobalSearch, DeepDive -> next/dynamic lazy
  ├── Quiz: dados extraidos para src/data/quizQuestions.ts
  └── @next/bundle-analyzer condicional (ANALYZE=1)

Sprint M ✅ Maquiagem Cyber-Industrial
  ├── Tokens de cor por modulo (--module-<slug>) em globals.css
  ├── Utility classes .module-accent-<slug> + .module-hero
  └── Micro-interacoes: CodeBlock hover glow, badge unlock shine

Sprint T₀ ✅ Testes BadgeContext (vitest)
  ├── vitest + @testing-library/react + happy-dom
  └── 10 testes cobrindo badges, checklist, persistencia

Sprint T₁ ✅ Testes ClientLayout + GlobalSearch + SEO
  └── 18 testes adicionais (nav, tema, busca, metadata)

Sprint J ✅ Export/Import de Progresso
  ├── exportProgress() / importProgress() no BadgeContext
  ├── Botoes Download/Upload no Dashboard
  └── Badge time-traveler na primeira importacao

Sprint I.1 ✅ WireGuard (/wireguard)
  ├── Rota completa: teoria, config servidor/cliente, iptables
  ├── Badge wireguard-master + 3 checkpoints
  └── CONTENT_PAGES_COUNT 16 -> 17

Sprint I.2 ✅ Fail2ban (/fail2ban)
  ├── Rota completa: jails, filtros, monitoramento
  ├── Badge fail2ban-master + 3 checkpoints
  └── CONTENT_PAGES_COUNT 17 -> 18

Polish ✅ Module-accent em 18 paginas
  └── Border-top colorida + radial-gradient glow no hero de cada rota

Sprint T₂ ✅ E2E Playwright (12 testes)
  ├── playwright.config.ts — build prod + start (CSP nonce real)
  ├── e2e/fixtures.ts — resetStorage auto fixture (isolamento entre testes)
  ├── 7 arquivos spec: home topology, explorer badge, quiz, global search,
  │   theme toggle, export/import time-traveler, dashboard counters
  └── npm run test:e2e / test:e2e:ui / test:e2e:headed

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON implementada (Sprint J).

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---
[<- Voltar ao indice](README.md)
