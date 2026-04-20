# Workshop Linux — Do Zero ao Firewall Profissional

Plataforma educacional interativa em português que ensina segurança de redes Linux (iptables, NAT, DNS, SSL, VPN, etc.) de forma gamificada. Laboratório real com três zonas: WAN, DMZ e LAN.

**Next.js 16.2.2** · **React 19** · **TypeScript 5.8** · **Tailwind CSS v4** · **Turbopack**

---

## Comandos

```bash
npm run dev          # servidor local em http://localhost:3000
npm run lint         # tsc --noEmit — typecheck rápido (SEMPRE antes do build)
npm run lint:eslint  # ESLint + jsx-a11y (acessibilidade WCAG 2.1 AA)
npm run lint:all     # roda lint + lint:eslint em sequência
npm run test         # vitest run — 6 suítes · 42 testes (BadgeContext, ClientLayout, GlobalSearch, SEO, courseOrder, ModuleNav)
npm run test:watch   # vitest watch mode
npm run test:e2e     # Playwright E2E — build prod + start (CSP nonce real)
npm run test:e2e:ui  # Playwright com UI interativa
npm run test:e2e:headed # Playwright com browser visível
npm run build        # valida TypeScript + gera 26 rotas próprias (build reporta 33/33 incluindo /sitemap, /robots, /opengraph-image, /icon, /apple-icon, /manifest.webmanifest, /_not-found)
npm run start        # servidor de produção na porta 3000
```

> `npm run lint` (typecheck), `npm run lint:eslint` (a11y) e `npm test` (vitest) são as três validações obrigatórias antes do build.

---

## Estrutura de Pastas

```
app/                        # App Router — cada pasta = 1 rota pública
  layout.tsx                # root layout + next/font + JSON-LD + metadata global
  globals.css               # tokens de cor dark/light — @theme block, sem tailwind.config.js
  providers.tsx             # wraps tree em <BadgeProvider>
  error.tsx                 # error boundary global ('use client' obrigatório)
  not-found.tsx             # 404 page (Server Component, robots noindex)
  loading.tsx               # Suspense fallback global (Server Component)
  manifest.ts               # Web App Manifest — PWA Lite (sem service worker)
  sitemap.ts                # sitemap.xml dinâmico gerado a partir de ROUTE_SEO
  robots.ts                 # robots.txt dinâmico
  opengraph-image.tsx       # OG image 1200x630 gerada via next/og (edge runtime)
  icon.tsx                  # favicon 32x32 dinâmico via next/og (edge runtime)
  apple-icon.tsx            # apple-touch-icon 180x180 via next/og (edge runtime)
  [rota]/page.tsx           # 26 rotas — todas 'use client'
  [rota]/layout.tsx         # Server Component que exporta metadata via buildMetadata('/rota')

src/
  components/
    ClientLayout.tsx        # navbar sticky, menu mobile, toggle de tema, busca global
    TopologyInteractive.tsx # diagrama de rede interativo (36KB — maior arquivo)
  context/
    BadgeContext.tsx        # fonte única de verdade para todo o progresso do usuário
    BadgeContext.test.tsx   # testes vitest do BadgeContext (Sprint T₀)
  test/
    setup.ts                # setup global: jest-dom, localStorage.clear(), RTL cleanup
  data/
    quizQuestions.ts        # perguntas do quiz extraídas (Sprint F — code splitting)
    searchItems.ts          # 71 itens indexados para GlobalSearch (CMD+K / Ctrl+K)
    courseOrder.ts          # sequência de 21 módulos para ModuleNav (Anterior / Próximo)
    deepDives.tsx           # conteúdo dos modais de aprofundamento (6 deep dives)
  components/ui/            # primitivos: CodeBlock, Steps, Boxes, FluxoCard, LayerBadge, ModuleNav
  lib/
    utils.ts                # re-exporta cn() — clsx + tailwind-merge
    seo.ts                  # SITE_CONFIG, ROUTE_SEO (26 rotas), buildMetadata()
    useFocusTrap.ts         # hook a11y — focus trap, ESC handler, restore focus

e2e/                        # Playwright E2E (Sprint T₂)
  fixtures.ts               # resetStorage auto fixture — limpa localStorage antes de cada teste
  01-home-topology.spec.ts  # SVG role=img + aria-labelledby
  02-explorer-badge.spec.ts # seed direto + trackPageVisit smoke test
  03-quiz-expert-badge.spec.ts # clique completo + seed score=100
  04-global-search.spec.ts  # busca ⌘K → navega → ESC fecha
  05-theme-persistence.spec.ts # toggle dark/light + badge night-owl
  06-export-import-time-traveler.spec.ts # download + setInputFiles + badge
  07-dashboard-counters.spec.ts # 3/60 checklist + 75% quiz + 0/25 badges
playwright.config.ts        # build prod + start, chromium, webServer timeout 180s
```

**Path alias:** `@/` resolve para `src/`. Todos os imports de `src/` usam esse alias.

---

## Estado e localStorage

Todo o progresso do usuário vive no `BadgeContext` (React Context) e persiste em `localStorage`:

| Chave | Conteúdo |
|-------|----------|
| `workshop-badges` | Array de BadgeId desbloqueados |
| `workshop-visited-pages` | Array de pathnames visitados |
| `workshop-topo-clicks` | Contador inteiro de cliques na topologia |
| `workshop-clicked-risks` | Array de risk IDs clicados |
| `workshop-checklist-v2` | Record de string para boolean dos checkpoints |
| `workshop-quiz-score` | Inteiro 0 a 100 |
| `workshop-theme` | "light" ou ausente (dark e o padrao) |

---

## Constantes Criticas — Manter em Sincronia

Esses valores DEVEM ser consistentes. Bugs surgem quando divergem:

| Constante | Arquivo | Valor |
|-----------|---------|-------|
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | 20 (+ /laboratorio + /proxmox) |
| `totalTopics` | `app/dashboard/page.tsx` | 45 (Sprint Topics: tópico #45 RosettaStone adicionado) |
| `checklistItemsCount` | `app/dashboard/page.tsx` | 60 (ALL_CHECKLIST_IDS.length) |
| Texto na Home | `app/page.tsx` | "45 tópicos práticos" |

---

## Sistema de Temas

Tailwind v4 configurado inteiramente via CSS custom properties em `app/globals.css` — NAO existe `tailwind.config.js`.

- Dark mode e o PADRAO (sem classe no html)
- Light mode: adicionar `class="light"` ao html
- Toggle: ClientLayout.tsx → toggleTheme() → salva "light" no localStorage
- Anti-FOUC: script sincrono em layout.tsx le localStorage ANTES do primeiro paint

Tokens de cor: `bg`, `bg-2`, `bg-3`, `border`, `border-2`, `accent`, `accent-2`, `layer-1` a `layer-7` (OSI), `ok`, `warn`, `err`, `info`, `text`, `text-2`, `text-3`.

Classes CSS reutilizaveis (globals.css): `.btn-primary`, `.btn-outline`, `.section-label`, `.section-title`, `.code-block`, `.info-box`, `.highlight-box`, `.warn-box`, `.layer-badge`.

NUNCA criar arquivos CSS separados — usar classes Tailwind diretamente no JSX.

---

## Fonts e Icones

- Space Grotesk — fonte sans-serif do corpo (via `next/font/google`, self-hosted)
- JetBrains Mono — fonte monospace e codigo (via `next/font/google`, self-hosted)
- Lucide React — todos os icones
- motion/react (Framer Motion v12) — animacoes

> **NUNCA** voltar a usar `@import url('fonts.googleapis.com/...')` em `globals.css`.
> next/font self-hospeda, elimina layout shift e mantém conformidade LGPD/GDPR.

---

## SEO — Fonte Única de Verdade

Toda configuração de metadata vive em **`src/lib/seo.ts`**:

- `SITE_CONFIG` — nome, URL base, keywords globais, theme color
- `ROUTE_SEO` — mapa `{ '/rota': { title, description } }` para as 26 rotas
- `buildMetadata(route)` — helper que gera objeto `Metadata` completo com OG + Twitter + canonical

**Para adicionar SEO a uma nova rota:**

1. Adicione a entrada em `ROUTE_SEO['/nova-rota']`
2. Crie `app/nova-rota/layout.tsx`:
   ```tsx
   import { buildMetadata } from '@/lib/seo';
   export const metadata = buildMetadata('/nova-rota');
   export default function Layout({ children }: { children: React.ReactNode }) {
     return children;
   }
   ```
3. A rota aparece automaticamente no `sitemap.xml`

**Como funciona com `'use client'`:** todas as páginas são Client Components. Metadata só é exportável de Server Components, então cada rota tem um `layout.tsx` server-side que apenas repassa `children`. Isso dá o melhor dos dois mundos: estado reativo nas páginas + metadata SEO.

**URL base:** define via `NEXT_PUBLIC_SITE_URL` no `.env` (default: `https://workshop-linux.local`).

**Recursos gerados automaticamente:**

- `/sitemap.xml` — via `app/sitemap.ts` (lê `ROUTE_SEO`)
- `/robots.txt` — via `app/robots.ts`
- `/opengraph-image` — imagem 1200x630 dinâmica via `app/opengraph-image.tsx` (edge runtime)
- `/icon` — favicon 32x32 dinâmico via `app/icon.tsx` (edge runtime)
- `/apple-icon` — apple-touch-icon 180x180 via `app/apple-icon.tsx` (edge runtime)
- `/manifest.webmanifest` — Web App Manifest via `app/manifest.ts`
- JSON-LD `LearningResource` — injetado no `<head>` do root layout

---

## PWA Lite & Headers de Segurança (Sprint D + E)

**PWA Lite — sem service worker.** O app é instalável ("Adicionar à tela inicial") via Web App Manifest gerado em `app/manifest.ts`, mas não funciona offline. Decisão deliberada: service worker adiciona complexidade desproporcional ao escopo educacional.

- `display: 'standalone'` — abre como app sem chrome do browser
- Ícones servidos pelas rotas dinâmicas `/icon` e `/apple-icon` (`next/og` edge runtime, sem PNGs binários)
- `theme_color: '#e05a2b'` (laranja accent), `background_color: '#0d1117'` (dark)

**Boundaries do App Router:**

- `app/error.tsx` — captura runtime errors, mostra UI amigável + botão "Tentar novamente" via `reset()`. Obrigatoriamente `'use client'`.
- `app/not-found.tsx` — 404 page com `robots: noindex`. Server Component (bundle mínimo para bots).
- `app/loading.tsx` — Suspense fallback global com spinner + `role="status"` + `aria-busy`.

**Headers de segurança estáticos em `next.config.ts`:**

| Header | Valor | Função |
|--------|-------|--------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Força HTTPS por 2 anos (HSTS preload-ready) |
| `X-Frame-Options` | `DENY` | Bloqueia iframe (defesa adicional ao `frame-ancestors`) |
| `X-Content-Type-Options` | `nosniff` | Impede MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vaza apenas origem em navegação cross-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Desativa APIs sensíveis e FLoC |
| `X-DNS-Prefetch-Control` | `on` | Acelera navegação via prefetch DNS |

Também: `poweredByHeader: false` (não vaza versão do Next.js), `compress: true` (gzip/brotli) e `turbopack: { root: __dirname }` (silencia o warning de múltiplos lockfiles em worktrees).

### Sprint E — CSP por requisição com nonce (`proxy.ts`)

O `Content-Security-Policy` **não** é mais estático. Ele é gerado por requisição em **`proxy.ts`** (Next.js 16 renomeou `middleware.ts` → `proxy.ts`):

1. `proxy.ts` gera um nonce criptográfico (16 bytes base64) por requisição
2. Propaga via request header `x-nonce`
3. `app/layout.tsx` lê com `await headers()` e aplica `nonce={nonce}` nos dois `<script>` inline (anti-FOUC + JSON-LD)
4. O CSP da resposta inclui `'nonce-XXX' 'strict-dynamic'` em script-src — sem `'unsafe-inline'`

**Diretivas finais do CSP (produção):**

```
default-src 'self';
script-src 'self' 'nonce-XXX' 'strict-dynamic';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self' data:;
connect-src 'self';
frame-src 'none';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests
```

`style-src 'unsafe-inline'` permanece — Tailwind v4 e motion/react injetam `<style>` dinâmicos. Resolver isso exigiria ou hash de cada estilo (impraticável) ou nonce em styles (Next.js ainda não propaga nonce para styles).

**Trade-off ACEITO no Sprint E:** ler `headers()` no root layout torna **todas as rotas dinâmicas** (`ƒ` em vez de `○`). Para um site educacional leve sem necessidade de cache CDN agressivo, o ganho de segurança (nota A+ no securityheaders.com) compensa.

**Rotas estáticas após Sprint E:** apenas `/sitemap.xml`, `/robots.txt` e `/manifest.webmanifest` (não passam pelo proxy via matcher).

---

## Workflow Git

```bash
# NUNCA commitar direto na main
git checkout -b fix/nome-do-fix
git commit -m "fix(componente): descricao curta em uma linha"
git push origin fix/nome-do-fix

# Merge na main via squash
git checkout main
git merge --squash fix/nome-do-fix
git commit -m "fix(componente): descricao final"
git push origin main
git branch -D fix/nome-do-fix
```

Prefixos semanticos: feat / fix / docs / style / refactor / chore

---

## ATENCAO — Armadilhas PowerShell

```powershell
# && NAO funciona no PowerShell — rodar separado
npm run lint
npm run build

# Aspas multilinha em -m TRAVAM o commit (aparece >> esperando fechar)
# SEMPRE em uma linha so:
git commit -m "fix(tema): descricao curta e direta"

# Para reescrever arquivos com encoding correto:
@"conteudo"@ | Set-Content arquivo -Encoding UTF8
```

---

## Acessibilidade — WCAG 2.1 AA

Conformidade implementada no Sprint C:

**Modais (DeepDiveModal, GlobalSearch):**
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`
- Focus trap via `useFocusTrap()` em `src/lib/useFocusTrap.ts` (Tab/Shift+Tab circulam, ESC fecha, foco restaurado ao desmontar)
- Padrão WAI-ARIA combobox + listbox no GlobalSearch (`aria-activedescendant`, `aria-expanded`, `aria-controls`)

**Animações:**
- `useReducedMotion()` da `motion/react` aplicado nos modais
- Bloco `@media (prefers-reduced-motion: reduce)` global em `globals.css` zera animações/transições/scroll-behavior
- WCAG 2.3.3 (Animation from Interactions)

**Foco visível:**
- `:focus-visible` global com outline `var(--color-accent)` em `globals.css`
- WCAG 2.4.7 (Focus Visible)

**Lint estático:**
- `eslint-plugin-jsx-a11y` configurado em `eslint.config.mjs` (flat config)
- Regras estritas: `aria-props`, `aria-proptypes`, `role-has-required-aria-props`, `tabindex-no-positive`, `label-has-associated-control`, etc.
- `npm run lint:eslint` — zero warnings é o alvo, qualquer regressão a11y é pega no CI

---

## Checklist Antes de Qualquer Commit

1. `npm run lint` — zero erros TypeScript
2. `npm run lint:eslint` — zero warnings de acessibilidade
3. `npm test` — suíte vitest passando
4. `npm run build` — 33/33 páginas (26 próprias + sitemap + robots + opengraph-image + icon + apple-icon + manifest.webmanifest + _not-found)
5. Verificar consistência dos números da tabela de constantes

---

## Roadmap

- ✅ Sprint A: Robustez — try/catch localStorage, next/font, share funcional
- ✅ Sprint B: SEO — metadata por rota, sitemap.ts, robots.ts, OG image, JSON-LD
- ✅ Sprint C: Acessibilidade WCAG 2.1 AA — modais (role/aria/focus trap), prefers-reduced-motion, ESLint jsx-a11y
- ✅ Sprint D: PWA Lite + Headers — manifest.ts, icon/apple-icon dinâmicos, HSTS/Permissions-Policy no next.config, error/not-found/loading boundaries
- ✅ Sprint E: CSP nonce per-request via proxy.ts (Next.js 16) — remove 'unsafe-inline' do script-src, todas as rotas viram dynamic (trade-off aceito)
- ✅ Sprint G: A11y do TopologyInteractive — SVG title/desc, nós teclado-acessíveis, focus ring
- ✅ Sprint F: Performance & Code Splitting — TopologyInteractive/GlobalSearch/DeepDive lazy, quizQuestions.ts extraído, bundle-analyzer
- ✅ Sprint M: Maquiagem Cyber-Industrial — tokens de cor por módulo, micro-interações globais, module-accent-<slug>
- ✅ Sprint T₀: Testes BadgeContext — vitest + @testing-library/react + happy-dom (10 testes)
- ✅ Sprint T₁: Testes ClientLayout + GlobalSearch + SEO — 18 testes adicionais
- ✅ Sprint J: Export/Import de progresso via JSON + badge time-traveler
- ✅ Sprint I.1: WireGuard — rota /wireguard, badge wireguard-master, 3 checkpoints, deep dive
- ✅ Sprint I.2: Fail2ban — rota /fail2ban, badge fail2ban-master, 3 checkpoints
- ✅ Polish: module-accent glow aplicado em todas as 18 páginas de conteúdo
- ✅ Sprint T₂: E2E Playwright — 12 testes em 7 specs, build prod + start, resetStorage fixture, CSP nonce real
- ✅ Sprint R: Realismo — alinhamento com material original (Aula 1+2), persistência iptables, systemd scripts, LOG, regras e-mail, +6 quiz, +15 cheat-sheet, +11 glossário
- ✅ Sprint P: Diamond Polish — FluxoCard em 5 páginas (dns, dnat, port-knocking, vpn-ipsec, nginx-ssl), "Erros Comuns" em 10 páginas, saídas esperadas em 3 páginas, audit-logs refatorado com componentes UI, certificado com 10 competências
- ✅ Sprint L: Legacy Gold — TroubleshootingCard (OSI Ladder interativo), zona DNS reversa, FTP DNAT (21+50000:51000), SSH 2222, /proc/net/xt_recent, IPSec iptables prereqs, dhparam+TLS hardening, MSS Clamping, conntrack tuning, tcpdump duplo, Netplan YAML, scripts bash para download, página /offline terminal-style
- ✅ Sprint SIGMA: Resgate Total + Elite Lab — /laboratorio (VirtualBox vs KVM vs Proxmox, KVM/libvirt completo), /proxmox (VE produção: bridges vmbr, VMs, snapshots, cluster HA), Certbot + HTTP-01 challenge em /nginx-ssl, badges proxmox-pioneer + resgate-gold, CONTENT_PAGES_COUNT 18→20, checklistItemsCount 35→45, totalTopics 26→38
- ✅ Sprint SIGMA Fase 2: Integração dos 20 arquivos bônus — /port-knocking (admin em ação, bot invisibility), /audit-logs (forense: scripts audit-knock + knock-monitor, rotação 90 dias), /wan-nat (5 funções simultâneas + conntrack mágico), /dnat (PREROUTING kernel: 5 hooks Netfilter, troca cirúrgica, tcpdump duplo), /lan-proxy (FluxoCard timeline t=0ms→t=52ms, HTTP vs HTTPS), checklistItemsCount 45→56
- ✅ Sprint SIGMA Fase 3: Polimento final — badge 🔬 sigma-master (11 checkpoints Fase 2), +6 itens de busca (Ctrl+K encontra todas as seções avançadas), +5 tópicos (IDs 38–42) nos grupos existentes, totalTopics 38→43, SEO enriquecido para 5 rotas
- ✅ Sprint W: Windows-to-Linux — WindowsComparisonBox (Boxes.tsx), seções "Terminal do Zero" + "Mindset SysAdmin" em /instalacao, tabela Windows↔Linux em /cheat-sheet#windows-linux, +3 checkpoints, checklistItemsCount 56→59, totalTopics 43→45, +3 searchItems (69 total)
- ✅ Sprint W2: RosettaStone.tsx (25 comandos, busca + filtro por categoria), resgate-gold.sh (Botão de Pânico), badge 🧭 explorador-mundos, FluxoCard Troubleshooting Mental Map em /instalacao, seção "Como apresentar profissionalmente" em /certificado, checklistItemsCount 59→60, badges 24→25, searchItems 69→71
- ✅ Sprint Polish: ModuleNav (Anterior / Próximo) nas 20 páginas de conteúdo, courseOrder.ts com sequência de 21 módulos, labels "▶ Saída esperada" certbot em /nginx-ssl, link avulso /web-server removido de nginx-ssl
- ✅ Sprint Audit Fix: reconciliação pós-Cursor review — deep-diver.desc (18→20), comentário CONTENT_PAGES_COUNT (16 rotas → 20 rotas completas), app/layout.tsx middleware.ts → proxy.ts, comentários dashboard sincronizados, threshold linux-ninja (15→45), .env.example limpo (só NEXT_PUBLIC_SITE_URL), totalTopics 45→44 (alinhado ao array TOPICS), hero "40+" → "44 tópicos práticos"
- ✅ Sprint V + Topics + UX: Playwright E2E fixes (3/35→3/60, 0/21→0/25, fallback quiz 27→33), spec ModuleNav 08-module-nav.spec.ts (8 specs total), tópico #45 RosettaStone (totalTopics 44→45), seção "Módulos do Curso" no dashboard (mapa visual 21 módulos com ✓/número)
- ✅ Sprint T₃: testes vitest para courseOrder.ts (9 invariantes — 21 módulos, sem duplicatas, bidirecionalidade, chain completa) e ModuleNav.tsx (5 casos — null, início, meio, fim, path interno); total 6 suítes · 42 testes
- ❌ Backend/Supabase: DESCARTADO — localStorage atende ao escopo educacional. Portabilidade via export/import JSON implementada (Sprint J).
- ⏸️ Service Worker offline: AVALIAR DEPOIS — complexidade desproporcional ao caso de uso.

Para detalhes completos: docs/ (índice em docs/README.md) · QUICKSTART.md · README.md
