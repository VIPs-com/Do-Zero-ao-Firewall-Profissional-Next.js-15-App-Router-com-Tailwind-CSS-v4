# Workshop Linux — Do Zero ao Firewall Profissional

Plataforma educacional interativa em português que ensina segurança de redes Linux (iptables, NAT, DNS, SSL, VPN, etc.) de forma gamificada. Laboratório real com três zonas: WAN, DMZ e LAN.

**Next.js 16.2.3** · **React 19** · **TypeScript 5.8** · **Tailwind CSS v4** · **Turbopack**

---

## Comandos

```bash
npm run dev          # servidor local em http://localhost:3000
npm run lint         # tsc --noEmit — typecheck rápido (SEMPRE antes do build)
npm run lint:eslint  # ESLint + jsx-a11y (acessibilidade WCAG 2.1 AA)
npm run lint:all     # roda lint + lint:eslint em sequência
npm run test         # vitest run — 6 suítes · 57 testes (BadgeContext, ClientLayout, GlobalSearch, SEO, courseOrder, ModuleNav)
npm run test:watch   # vitest watch mode
npm run test:e2e     # Playwright E2E — build prod + start (CSP nonce real)
npm run test:e2e:ui  # Playwright com UI interativa
npm run test:e2e:headed # Playwright com browser visível
npm run build        # valida TypeScript + gera 50 rotas próprias (build reporta 69/69 incluindo /sitemap, /robots, /opengraph-image, /icon, /apple-icon, /manifest.webmanifest, /_not-found)
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
  [rota]/page.tsx           # 50 rotas — todas 'use client' (25 COURSE_ORDER + 16 trilha Fundamentos + 4 v3.0 + 5 suporte: /, /dashboard, /topicos, /offline, /web-server)
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
    quizQuestions.ts        # perguntas do quiz — 254 perguntas (firewall=105, fundamentos=60, avancados=89; Sprint SEARCH-COMPLETE: +1 K8s Deployment vs StatefulSet)
    searchItems.ts          # 220 itens indexados para GlobalSearch (CMD+K / Ctrl+K) — todos os módulos têm ≥3 itens
    courseOrder.ts          # COURSE_ORDER (25 módulos Firewall) + FUNDAMENTOS_ORDER (15 módulos Fundamentos) para ModuleNav
    deepDives.tsx           # conteúdo dos modais de aprofundamento (6 deep dives)
  components/ui/            # primitivos: CodeBlock, Steps, Boxes, FluxoCard, LayerBadge, ModuleNav
  lib/
    utils.ts                # re-exporta cn() — clsx + tailwind-merge
    seo.ts                  # SITE_CONFIG, ROUTE_SEO (47 rotas), buildMetadata()
    useFocusTrap.ts         # hook a11y — focus trap, ESC handler, restore focus

e2e/                        # Playwright E2E (Sprint T₂)
  fixtures.ts               # resetStorage auto fixture — limpa localStorage antes de cada teste
  01-home-topology.spec.ts  # SVG role=img + aria-labelledby
  02-explorer-badge.spec.ts # seed direto + trackPageVisit smoke test
  03-quiz-expert-badge.spec.ts # clique completo + seed score=100
  04-global-search.spec.ts  # busca ⌘K → navega → ESC fecha
  05-theme-persistence.spec.ts # toggle dark/light + badge night-owl
  06-export-import-time-traveler.spec.ts # download + setInputFiles + badge
  07-dashboard-counters.spec.ts # 3/91 checklist + 75% quiz + 0/34 badges
  10-fundamentos-trail.spec.ts  # /fundamentos índice, visita /fhs, checkpoints, badge, ModuleNav (8 casos)
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
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | 49 (Sprint AVANCADOS-INDEX: +/avancados) |
| `totalTopics` | `app/dashboard/page.tsx` | 85 (Counter-Sync: 27b+47b sub-entries + s08 SSH Proxy = 85) |
| `checklistItemsCount` | `app/dashboard/page.tsx` | 160 (Sprint CONTENT-PIVOTING: +3 ataques + 3 pivoteamento) |
| Texto na Home | `app/page.tsx` | "85 tópicos práticos" + stats: 85/59/56/7 |
| Badges | `src/context/BadgeContext.tsx` | 56 (Sprint Advanced-Trail: +advanced-master) |
| searchItems | `src/data/searchItems.ts` | 220 (Sprint SEARCH-COMPLETE: +35 — 3º item para todos os módulos com cobertura dupla + /quiz/certificado/topicos completos) |

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
- `ROUTE_SEO` — mapa `{ '/rota': { title, description } }` para as 37 rotas
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
4. `npm run build` — 71/71 rotas (49 páginas próprias + /sitemap + /robots + /opengraph-image + /icon + /apple-icon + /manifest.webmanifest + /_not-found + rotas dinâmicas proxy)
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
- ✅ Sprint Badge V2 + Search+1: badge 🎯 course-master (visitar todos os 21 módulos), searchItems 71→72 (Módulos do Curso → /dashboard#modulos), badges 25→26
- ✅ Sprint UI-H (Hybrid Progress): `ProgressDropdown` no header (X/21 + lista dos 21 módulos com ✓/atual/pendente, focus trap, ESC/click-fora) — sidebar esquerda preservada, zero mudanças em BadgeContext/courseOrder (ContinueFloatingButton removido pois ModuleNav no rodapé já cobre a navegação)
- ✅ Sprint PV (Polish Visual): FluxoCard "Anatomia do Log" + HighlightBox Prefix em /audit-logs (única página sem FluxoCard); /offline migrado de cores hardcoded para tokens de tema (dark/light mode correto); WindowsComparisonBox dig↔nslookup em /dns; FluxoCard "3 Interfaces WAN/DMZ/LAN" em /instalacao; home polida (stats em cards 45/21/26/7, cursor piscante no terminal, whileInView nos features, tokens no terminal mock)
- ✅ Sprint CE (Celebração & Engajamento): 3 camadas — Micro: feedback visual instantâneo no quiz (verde/vermelho por opção + chip); Macro: `MilestoneCelebration` modal + canvas-confetti lazy para course-master/quiz-master (+ celebração visual para outros 3); Meta: card "Próxima Conquista" no dashboard com barra de progresso + CTA inteligente. BadgeContext: MILESTONE_BADGES distingue milestones de badges comuns.
- ✅ Sprint CERT (Certificado Compartilhável): Web Share API + fallback "Copiar link" (clipboard, 3s feedback); `@media print` em globals.css oculta toda a UI e exibe só o certificado em A4; ciclo motivacional completo: course-master → modal → /certificado → compartilhar/imprimir.
- ✅ Sprint ANIM (Micro-animações): `@keyframes checklist-pop` + `button > svg.text-ok` em globals.css — pop spring ao marcar qualquer checkpoint, cobre os 15+ arquivos de página sem tocar em nenhum; barra "Checklist do Lab" no dashboard com `transition-[width] duration-700`.
- ✅ Sprint CE-E2E (Cobertura E2E milestone modal): `e2e/09-milestone-celebration.spec.ts` — 6 casos: modal aparece, título correto, ESC fecha, × fecha, CTA navega, toast NÃO aparece para milestones. Total: 9 specs E2E.
- ✅ Sprint EVOL (Roadmap Visual): `/evolucao` enriquecida com seção `#roadmap-evolucao` — 3 fases (v2.0/v3.0/v4.0) com grids de módulos disponíveis/em breve; botão localStorage "Me avise sobre v2.0" com estado persistente; +1 searchItem (t-roadmap-evolucao).
- ✅ Sprint I.3 (Módulo Hardening): `/hardening` — SSH (PasswordAuthentication no, Ed25519), sysctl security (SYN cookies, ASLR, rp_filter), AppArmor (aa-enforce Nginx, aa-logprof); badge 🔐 hardening-master; 3 checkpoints; module-accent-hardening #a3e635; CONTENT_PAGES_COUNT 20→21, checklistItemsCount 60→63, totalTopics 45→46, COURSE_ORDER 21→22 módulos.
- ✅ Sprint TOPICOS: tópico #46 Hardening adicionado em `/topicos` (novo grupo "Hardening Linux").
- ✅ Sprint I.4 (Módulo Docker): `/docker` — bridge/host/none drivers, redes customizadas + DNS interno, port mapping = DNAT automático, chains DOCKER/DOCKER-USER no iptables, docker-compose redes declarativas (frontend/backend/internal); badge 🐳 docker-master (28º badge); 3 checkpoints (docker-installed, docker-bridge, docker-iptables); module-accent-docker #2496ed; CONTENT_PAGES_COUNT 21→22, checklistItemsCount 63→66, totalTopics 46→47, COURSE_ORDER 22→23 módulos, linux-ninja threshold 47→50; tópicos #47+47b em /topicos (grupo "Docker & Containers"); /evolucao v3.0 atualizado com Docker marcado como disponível.
- ✅ Sprint F1-F3 (Trilha Fundamentos Linux v2.0): 10 módulos paralelos para iniciantes (`/fundamentos` índice + `/fhs` + `/comandos` + `/editores` + `/processos` + `/permissoes` + `/discos` + `/logs-basicos` + `/backup` + `/shell-script` + `/cron`); FUNDAMENTOS_ORDER em courseOrder.ts; ModuleNav com prop `order`; badge 🐧 fundamentos-master (29º badge); 10 checkpoints (fhs-explorado, comandos-praticados, ...); module-accent-fundamentos #6366f1; CTA "Novo no Linux?" na home; nav link Fundamentos; +11 searchItems (85 total); checklistItemsCount 66→76; totalTopics 47→57; linux-ninja threshold 50→57; +8 testes FUNDAMENTOS_ORDER em courseOrder.test.ts; /evolucao v2.0 com 10 módulos Fundamentos marcados como disponíveis.
- ✅ Sprint Polish-F (Fundamentos Rich Edition): 7 módulos básicos enriquecidos (/processos, /permissoes, /discos, /logs-basicos, /backup, /shell-script, /cron) com FluxoCard, WindowsComparisonBox, InfoBox/WarnBox extras e exercícios guiados expandidos — sem mudanças em constantes.
- ✅ Sprint I.5 (Módulo SSH com 2FA): `/ssh-2fa` — TOTP teoria (HMAC + RFC 6238), libpam-google-authenticator + qrencode, /etc/pam.d/sshd, sshd_config KbdInteractiveAuthentication, teste em sessão separada, rollback, Fail2ban jail para TOTP; badge 📱 ssh-2fa-master (30º badge); 3 checkpoints (totp-instalado, pam-configurado, ssh-2fa-testado); module-accent-ssh-2fa #f59e0b; CONTENT_PAGES_COUNT 22→23, checklistItemsCount 76→79, totalTopics 57→58, COURSE_ORDER 23→24 módulos, linux-ninja threshold 57→59; tópico #48 em /topicos (grupo "Hardening Linux"); /evolucao v3.0 SSH 2FA marcado disponível; +2 searchItems (87 total); E2E 07-dashboard-counters 3/79 + 0/30.
- ✅ Sprint I.6 (Módulo Docker Compose): `/docker-compose` — anatomia completa do docker-compose.yml (services/networks/volumes/secrets), stack básica Nginx, redes declarativas frontend/backend/internal com `internal: true`, volumes nomeados vs bind mount vs tmpfs, .env files + Docker Secrets, stack completa Nginx+App+PostgreSQL com healthcheck e deploy.replicas, comandos essenciais (up/down/ps/logs/top/exec/scale), troubleshooting; badge 🐙 compose-master (31º badge); 3 checkpoints (compose-instalado, compose-stack, compose-networks); module-accent-compose #1d63ed; CONTENT_PAGES_COUNT 23→24, checklistItemsCount 79→82, totalTopics 58→59, COURSE_ORDER 24→25 módulos, linux-ninja threshold 59→62; tópico #49 em /topicos (grupo "Docker & Containers"); /evolucao v3.0 Docker Compose marcado disponível; +2 searchItems (89 total); E2E 07-dashboard-counters 3/82 + 0/31.
- ✅ Sprint Polish-I + Quiz++ (Módulos Intermediários Rich Edition): 3 módulos enriquecidos com FluxoCard + WindowsComparisonBox + exercícios guiados — /wireguard (geração de chaves, wg0.conf, wg-quick, wg show, diagnósticos, segundo peer, troubleshooting handshake), /fail2ban (tail auth.log → failregex → maxretry → iptables REJECT → auto-unban; GPO vs jail.local; SSH jail, custom filter, log analysis), /nftables (add table → chain → rule → list ruleset → persist; Windows Firewall/netsh vs nftables; basic ruleset, blocklist set, iptables-translate); fix crítico: /nftables não chamava `trackPageVisit` — corrigido com useEffect; Quiz expandido de 33→50 perguntas (+17: WireGuard×3, Fail2ban×3, nftables×3, Hardening×2, Docker Networking×2, Docker Compose×2, SSH 2FA/TOTP×2); sem mudanças em constantes de badge/checkpoint.
- ✅ Sprint F4 (Módulo Instalação de Programas): `/pacotes` — apt (update/upgrade/install/purge/autoremove/search), dpkg (instalar .deb, listar, dpkg -S), repositórios (/etc/apt/sources.list, PPAs, repositórios de terceiros com GPG), snap (sandboxed, auto-update, quando usar), pip3 + venv (melhor prática Python); badge 📦 pacotes-master (32º badge); 3 checkpoints (apt-atualizado, pacote-instalado, repo-adicionado); module-accent-pacotes #22c55e; CONTENT_PAGES_COUNT 24→25, checklistItemsCount 82→85, totalTopics 59→60, FUNDAMENTOS_ORDER 10→11 módulos, linux-ninja threshold 62→63; tópico F11 em /topicos (grupo "Fundamentos Linux"); /evolucao v2.0 Instalação de Programas marcado disponível; +2 searchItems (91 total); E2E 07-dashboard-counters 3/85 + 0/32.
- ✅ Sprint F5 (Processo de Boot): `/boot` — BIOS/UEFI (POST, diferença, efibootmgr), GRUB2 (/etc/default/grub, update-grub, parâmetros de kernel), kernel+initrd (uname -r, /proc/cmdline, dmesg), systemd PID 1 (targets: poweroff/rescue/multi-user/graphical, systemctl get-default, systemd-analyze blame), logs de boot (journalctl -b), modo recovery/rescue; badge 🖥️ boot-master (33º badge); 3 checkpoints (bios-uefi-entendido, grub-configurado, systemd-targets-explorados); module-accent-boot warn; CONTENT_PAGES_COUNT 25→26, checklistItemsCount 85→88, totalTopics 60→61, FUNDAMENTOS_ORDER 11→12 módulos, linux-ninja threshold 63→66; tópico F12 em /topicos; /evolucao v2.0 Boot marcado disponível; +2 searchItems (93 total); E2E 07-dashboard-counters 3/88 + 0/33.
- ✅ Sprint F6 (Comandos Avançados): `/comandos-avancados` — sed (substituição in-place, sed -i.bak, filtro de linhas), dd (backup de disco, gravar ISO, zerar disco, WarnBox disk destroyer), nc/NetCat (testar portas, listener, banner grabbing, transferência de arquivo), links simbólicos vs hard links (ln -s, ln, inodes, uso em Nginx/Apache), compactação/descompactação (tar+gzip/bzip2/xz, zip/unzip, tabela comparativa); badge 🔧 cmd-avancados-master (34º badge); 3 checkpoints (sed-dominado, links-criados, compactacao-praticada); module-accent-comandos-avancados layer-5; CONTENT_PAGES_COUNT 26→27, checklistItemsCount 88→91, totalTopics 61→62, FUNDAMENTOS_ORDER 12→13, linux-ninja threshold 66→68; tópico F13 em /topicos; /evolucao v2.0 marcado disponível; +2 searchItems (95 total); E2E 07-dashboard-counters 3/91 + 0/34.
- ✅ Sprint F7 (Logs Centralizados com Rsyslog): `/rsyslog` — rsyslog vs journald (quando usar cada), /etc/rsyslog.conf (facilities: kern/auth/daemon/mail/user, priorities: emerg→debug), sintaxe facility.priority, servidor central de logs (imtcp/imudp porta 514, template RemoteLogs por hostname), cliente remoto (@@servidor:514), logrotate (rotate/compress/delaycompress/postrotate), filtros avançados por $programname, integração SIEM; badge 📡 rsyslog-master (35º badge); 3 checkpoints (rsyslog-configurado, log-remoto-enviado, logrotate-configurado); module-accent-rsyslog layer-4; CONTENT_PAGES_COUNT 27→28, checklistItemsCount 91→94, totalTopics 62→63, FUNDAMENTOS_ORDER 13→14, linux-ninja threshold 68→70; tópico F14 em /topicos; /evolucao v2.0 Logs Centralizados marcado disponível (v2.0 COMPLETO!); +2 searchItems (97 total); E2E 07-dashboard-counters 3/94 + 0/35.
- ✅ Sprint I.7 (Servidor DHCP): `/dhcp` — DORA (Discover/Offer/Request/Ack), isc-dhcp-server instalação, /etc/default/isc-dhcp-server interface LAN, dhcpd.conf (subnet, range, routers, dns-servers), reservas por MAC address, leases (/var/lib/dhcp/dhcpd.leases), integração iptables portas 67/68 UDP, DHCP Relay, troubleshooting tcpdump+journalctl; badge 🌐 dhcp-master (36º badge); 3 checkpoints (dhcp-instalado, dhcp-subnet, dhcp-reserva); module-accent-dhcp info; CONTENT_PAGES_COUNT 28→29, checklistItemsCount 94→97, totalTopics 63→64, linux-ninja threshold 70→72; tópico S01 em /topicos (novo grupo "Servidores e Serviços"); /evolucao v3.0 DHCP marcado disponível; +2 searchItems (99 total); E2E 07-dashboard-counters 3/97 + 0/36.
- ✅ Sprint I.8 (Samba File Sharing): `/samba` — SMB/CIFS, smb.conf (workgroup, netbios name, shares público/privado/homes), smbpasswd (usuário Samba separado do Linux), permissões (valid users, create mask, directory mask), firewall (137/138 UDP + 139/445 TCP), acesso Windows Explorer (\\\\IP\\pasta), smbclient, mount.cifs + /etc/fstab, smbstatus, troubleshooting 4 passos; badge 🗂️ samba-master (37º badge); 3 checkpoints (samba-instalado, samba-share, samba-windows); module-accent-samba layer-6; CONTENT_PAGES_COUNT 29→30, checklistItemsCount 97→100, totalTopics 64→65, linux-ninja threshold 72→75; tópico S02 em /topicos; /evolucao v3.0 Samba marcado disponível; +2 searchItems (101 total); E2E 3/100 + 0/37.
- ✅ Sprint I.9 (Apache Web Server): `/apache` — estrutura apache2 (/etc/apache2/ sites-available/enabled, mods-available/enabled, conf-available/enabled), VirtualHosts por nome (a2ensite/a2dissite), módulos essenciais (mod_rewrite, mod_ssl, mod_headers, mod_proxy, mod_deflate, mod_expires), .htaccess performance warning, HTTPS com Certbot (certbot --apache) + certificado autoassinado (openssl req -x509), proxy reverso (ProxyPass/ProxyPassReverse + WebSocket via proxy_wstunnel), Apache vs Nginx tabela comparativa 9 critérios, WindowsComparisonBox (IIS ↔ Apache); badge 🌍 apache-master (38º badge); 3 checkpoints (apache-instalado, apache-vhost, apache-ssl); module-accent-apache warn; CONTENT_PAGES_COUNT 30→31, checklistItemsCount 100→103, totalTopics 65→66, linux-ninja threshold 75→77; tópico S03 em /topicos; /evolucao v3.0 Apache marcado disponível (5 disponíveis · 4 em breve); +2 searchItems (103 total); E2E 3/103 + 0/38.
- ✅ Sprint I.10 (OpenVPN): `/openvpn` — OpenVPN vs WireGuard vs IPSec (tabela comparativa 7 critérios), PKI com Easy-RSA (init-pki, build-ca, build-server, gen-dh, ta.key), server.conf (porta 1194 UDP, dev tun, split/full tunnel, AES-256-GCM, TLS 1.2+), script gerar-cliente.sh (certs inline no .ovpn), iptables NAT+FORWARD para sub-rede 10.8.0.0/24, revogação de certificados com CRL + cron de renovação, WindowsComparisonBox (VPN nativa Windows SSTP/L2TP ↔ OpenVPN), troubleshooting (4 erros comuns); badge 🔒 openvpn-master (39º badge); 3 checkpoints (openvpn-instalado, openvpn-pki, openvpn-cliente); module-accent-openvpn layer-3; CONTENT_PAGES_COUNT 31→32, checklistItemsCount 103→106, totalTopics 66→67, linux-ninja threshold 77→79; tópico S04 em /topicos; /evolucao v3.0 OpenVPN marcado disponível (6 disponíveis · 3 em breve); +2 searchItems (105 total); E2E 3/106 + 0/39.
- ✅ Sprint I.11 (Traefik Proxy Reverso): `/traefik` — Traefik vs Nginx tabela comparativa (8 critérios), stack básica docker-compose (traefik+whoami, exposedbydefault=false), HTTPS automático com ACME/Let's Encrypt (tlschallenge, acme.json, volume letsencrypt), middlewares (redirect HTTP→HTTPS, basicauth com htpasswd, rate-limit, HSTS security headers), dashboard seguro com BasicAuth+HTTPS, stack completa (traefik+app+postgres, redes public/internal), WindowsComparisonBox (IIS ARR ↔ Traefik), troubleshooting (4 erros); badge 🔀 traefik-master (40º badge); 3 checkpoints (traefik-instalado, traefik-https, traefik-middleware); module-accent-traefik accent-2; CONTENT_PAGES_COUNT 32→33, checklistItemsCount 106→109, totalTopics 67→68, linux-ninja threshold 79→81; tópico S05 em /topicos; /evolucao v3.0 Traefik marcado disponível (7 disponíveis · 2 em breve); +2 searchItems (107 total); E2E 3/109 + 0/40.
- ✅ Sprint I.12 (LDAP / OpenLDAP): `/ldap` — DIT e conceitos (DN, dc, ou, cn, uid, objectClass), tabela sem LDAP vs com LDAP, instalação slapd + dpkg-reconfigure, estrutura LDIF (OUs: usuarios/grupos), ldapadd com bind DN e senha, usuários com inetOrgPerson+posixAccount+shadowAccount, slappasswd SSHA, ldapsearch/ldapmodify/ldappasswd/ldapdelete, grupos com groupOfNames, LDAPS (TLS autoassinado + OLC ldapmodify), PAM com libpam-ldapd+nslcd+nsswitch.conf (login SSH via LDAP), WindowsComparisonBox (Active Directory ↔ OpenLDAP), troubleshooting (4 erros); badge 👥 ldap-master (41º badge); 3 checkpoints (ldap-instalado, ldap-usuarios, ldap-autenticacao); module-accent-ldap layer-7; CONTENT_PAGES_COUNT 33→34, checklistItemsCount 109→112, totalTopics 68→69, linux-ninja threshold 81→84; tópico S06 em /topicos.
- ✅ Sprint I.16 (Kubernetes / K3s): `/kubernetes` — K3s vs K8s vs minikube (tabela 7 critérios), conceitos core (Pod/Deployment/Service/Ingress/ConfigMap/Secret/Namespace/PV), instalação K3s (1 comando curl, kubeconfig, multi-nó com token), kubectl (get/describe/logs/exec/apply/scale/rollout/rollback), manifestos YAML (Deployment com RollingUpdate + readinessProbe, Service ClusterIP/NodePort, Namespace), ConfigMap+Secret (base64, from-literal, docker-registry secret), Ingress com Traefik (TLS, cert-manager, ClusterIssuer Let's Encrypt, multi-host rules), NetworkPolicy (default-deny, allow por podSelector/namespaceSelector — requer Calico/Cilium em K3s), PersistentVolumeClaim (local-path provisioner K3s, StorageClass, PostgreSQL com PVC), Helm (repo add/update, install/upgrade/rollback, requirements), WindowsComparisonBox (Windows Containers/AKS ↔ K3s), troubleshooting (CrashLoopBackOff, ImagePullBackOff, Service sem Endpoints, PVC Pending); badge ☸️ k8s-master (45º badge); 3 checkpoints (k8s-instalado, k8s-deploy, k8s-network); module-accent-kubernetes layer-3; CONTENT_PAGES_COUNT 37→38, checklistItemsCount 121→124, totalTopics 72→73, linux-ninja threshold 90→93; tópico I03 em /topicos; /evolucao v4.0 Kubernetes marcado disponível (3 disponíveis · 5 em breve); +2 searchItems (119 total); E2E 3/124 + 0/45.
- ✅ Sprint I.15 (Prometheus + Grafana): `/monitoring` — 3 pilares da observabilidade (métricas/logs/traces), arquitetura pull do Prometheus (TSDB, scraping 15s), Docker Compose com prometheus+node_exporter+alertmanager+grafana, prometheus.yml (scrape_configs, múltiplos targets, relabel_configs), PromQL (rate/irate/increase/sum/avg, filtros por label, queries típicas de CPU/memória/disco), dashboards prontos (ID 1860 Node Exporter Full, tabela com 5 IDs), provisioning automático via grafana/provisioning/, alertas (alert_rules.yml, for: duração, labels severity, annotations), Alertmanager (routes, group_by, repeat_interval, receivers email+Slack, inhibit_rules), instrumentação da própria app (prometheus_client Python), WindowsComparisonBox (Windows perfmon/Azure Monitor ↔ Prometheus+Grafana), troubleshooting (4 erros); badge 📊 monitoring-master (44º badge); 3 checkpoints (monitoring-instalado, monitoring-dashboard, monitoring-alertas); module-accent-monitoring warn; CONTENT_PAGES_COUNT 36→37, checklistItemsCount 118→121, totalTopics 71→72, linux-ninja threshold 88→90; tópico I02 em /topicos; /evolucao v4.0 Prometheus+Grafana marcado disponível (2 disponíveis · 6 em breve); +2 searchItems (117 total); E2E 3/121 + 0/44.
- ✅ Sprint I.14 (Ansible para SysAdmins): `/ansible` — Ansible vs Puppet/Chef/Salt (tabela 6 critérios), instalação via PPA + pip3, inventário INI (grupos, host/group vars), comandos ad-hoc (ping, apt, service, copy, setup), playbooks YAML (hosts/become/vars/tasks/handlers), variáveis e templates Jinja2 (loop, when, register, debug), roles (ansible-galaxy init, tasks/handlers/templates/files/defaults/meta), playbook real de servidor firewall (usuário deploy, SSH hardening via lineinfile, iptables com módulo ansible.builtin.iptables, Nginx), Ansible Galaxy (requirements.yml, geerlingguy), Vault (create/edit/view, --ask-vault-pass, --vault-password-file), WindowsComparisonBox (PowerShell DSC/GPO ↔ Ansible); badge ⚙️ ansible-master (43º badge); 3 checkpoints (ansible-instalado, ansible-playbook, ansible-roles); module-accent-ansible err (vermelho Ansible); CONTENT_PAGES_COUNT 35→36, checklistItemsCount 115→118, totalTopics 70→71, linux-ninja threshold 86→88; tópico I01 em /topicos (novo grupo "Infraestrutura Moderna"); /evolucao v4.0 Ansible marcado disponível (1 disponível · 7 em breve); +2 searchItems (115 total); E2E 3/118 + 0/43.
- ✅ Sprint I.13 (Pi-hole): `/pihole` — DNS sinkhole explicado (fluxo query bloqueada vs permitida), instalação Docker Compose (macvlan para IP fixo na LAN) + script one-line, porta 53 conflito systemd-resolved, configurar DHCP (Sprint I.7) para distribuir Pi-hole como DNS, iptables DNAT para forçar DNS (bypass prevention), blocklists + pihole -g gravity update, whitelist/blacklist/regex blacklist, pihole disable temporário, dashboard (estatísticas/Query Log/listas/DNS), pihole -c terminal monitor, Unbound como resolver recursivo local (porta 5335, privacidade máxima), WindowsComparisonBox (DNS Forwarder Windows ↔ Pi-hole); badge 🕳️ pihole-master (42º badge); 3 checkpoints (pihole-instalado, pihole-dhcp, pihole-bloqueando); module-accent-pihole ok; CONTENT_PAGES_COUNT 34→35, checklistItemsCount 112→115, totalTopics 69→70, linux-ninja threshold 84→86; tópico S07 em /topicos; /evolucao v3.0 COMPLETO (9 disponíveis · 0 em breve ✅); +4 searchItems (113 total); E2E 3/115 + 0/42.
- ✅ Sprint I.17 (Terraform IaC): `/terraform` — Terraform vs Ansible (provisionamento vs configuração), instalação (HashiCorp apt + OpenTofu), 7 conceitos core (Provider/Resource/Data Source/Variable/Output/State/Module), projeto Docker provider (main.tf+variables.tf+outputs.tf), workflow init→plan→apply→destroy, .tfvars, workspaces, state remoto (S3+locking DynamoDB, Terraform Cloud, GitLab HTTP), módulos reutilizáveis (estrutura, source local/registry, variáveis+outputs), provider AWS (EC2+Security Group+EIP+user_data), lifecycle (prevent_destroy, ignore_changes), depends_on, count e for_each, WindowsComparisonBox (ARM Templates/Bicep ↔ HCL); badge 🏗️ terraform-master (46º badge); 3 checkpoints (terraform-instalado, terraform-plan, terraform-modulos); module-accent-terraform layer-6; CONTENT_PAGES_COUNT 38→39, checklistItemsCount 124→127, totalTopics 73→74, linux-ninja threshold 93→95; tópico I04 em /topicos; /evolucao v4.0 Terraform marcado disponível (4 disponíveis · 4 em breve); +2 searchItems (121 total); E2E 3/127 + 0/46.
- ✅ Sprint I.18 (Suricata IDS/IPS): `/suricata` — IDS vs IPS vs Firewall (tabela comparativa), arquitetura af-packet (passivo) vs NFQUEUE (inline), instalação via PPA OISF, suricata.yaml (HOME_NET, af-packet, eve-log), anatomia de regras (ação/protocolo/cabeçalho/opções: alert/drop/pass/reject, msg/sid/rev/content/pcre/flow/threshold), Emerging Threats (suricata-update, et/open ~40.000 regras, cron de atualização), EVE JSON (eve.json, jq queries: top IPs, filtro por sid, alertas em tempo real), modo IPS NFQUEUE (nftables queue + bypass + fail-closed, suricata -q 0 -D, teste com drop temporário), integração Grafana/Loki/SIEM, WindowsComparisonBox (Windows Defender ATP ↔ Suricata), 4 erros comuns expansíveis; badge 🛡️ suricata-master (47º badge); 3 checkpoints (suricata-instalado, suricata-regras, suricata-ips); module-accent-suricata #dc2626; CONTENT_PAGES_COUNT 39→40, checklistItemsCount 127→130, totalTopics 74→75, linux-ninja threshold 95→97; tópico I05 em /topicos; /evolucao v4.0 Suricata marcado disponível (5 disponíveis · 3 em breve); +2 searchItems (123 total); E2E 3/130 + 0/47.
- ✅ Sprint I.19 (eBPF & XDP): `/ebpf` — eBPF como "JavaScript do kernel" (verificador estático + JIT), FluxoCard Código→Compilar→Verificador→JIT→Hook, 3 casos de uso (Observabilidade/Networking/Segurança), instalação (kernel-headers + bpfcc-tools + bpftrace + xdp-tools), BCC tools (execsnoop/opensnoop/tcpconnect/biolatency/profile/tcplife/fileslower com exemplos de saída), bpftrace scripting (tracepoint:syscalls execve, latência de syscall em histograma, top procs), XDP (modos native/generic/offloaded, ações XDP_PASS/DROP/TX/REDIRECT, exemplo C xdp_drop_icmp.c, xdp-loader/xdp-filter), Cilium CNI (K3s + Helm, Hubble observabilidade, CiliumNetworkPolicy), Falco runtime security (regras YAML, detecção anomalias), WindowsComparisonBox (ETW/WFP ↔ eBPF/XDP/Falco), 4 erros comuns expansíveis; badge ⚡ ebpf-master (48º badge); 3 checkpoints (ebpf-instalado, ebpf-trace, ebpf-xdp); module-accent-ebpf #8b5cf6; CONTENT_PAGES_COUNT 40→41, checklistItemsCount 130→133, totalTopics 75→76, linux-ninja threshold 97→99; tópico I06 em /topicos; /evolucao v4.0 eBPF marcado disponível (6 disponíveis · 2 em breve); +2 searchItems (125 total); E2E 3/133 + 0/48.
- ✅ Sprint I.20 (Service Mesh com Istio): `/service-mesh` — problema dos microserviços sem mesh (retry/timeout duplicado, TLS manual, zero visibilidade), comparativo Istio vs Linkerd vs Consul vs Cilium (tabela 7 critérios), arquitetura FluxoCard (istiod→Envoy sidecar→mTLS→Telemetria→Kiali/Grafana), instalação (istioctl precheck, perfil demo, injeção automática de sidecar, addons prometheus/kiali/jaeger), mTLS STRICT com PeerAuthentication + SPIFFE/X.509, AuthorizationPolicy (deny-all + allow por principal SPIFFE), VirtualService (canary 90/10, roteamento por header A/B test, retry+timeout, injeção de falhas), DestinationRule (subsets por label, circuit breaker com outlierDetection), Ingress Gateway (Gateway + VirtualService para tráfego externo, TLS terminação), observabilidade (Kiali service graph, Jaeger distributed tracing, Grafana dashboards), WindowsComparisonBox (IIS ARR/WCF ↔ Istio), 4 erros comuns expansíveis; badge 🕸️ service-mesh-master (49º badge); 3 checkpoints (service-mesh-instalado, service-mesh-mtls, service-mesh-traffic); module-accent-service-mesh #06b6d4; CONTENT_PAGES_COUNT 41→42, checklistItemsCount 133→136, totalTopics 76→77, linux-ninja threshold 99→102; tópico I07 em /topicos; /evolucao v4.0 Service Mesh marcado disponível (7 disponíveis · 1 em breve); +2 searchItems (127 total); E2E 3/136 + 0/49.
- ✅ Sprint I.21 (SRE & SLOs): `/sre` — hierarquia SLI/SLO/SLA (cards comparativos + regra de ouro SLA < SLO), FluxoCard Da métrica ao contrato, error budget como ferramenta de decisão (tabela de noves, budget sobrando→acelerar vs esgotado→frear, error budget pertence ao produto não a uma equipe), implementação com Prometheus (recording rules SLI disponibilidade e latência P99, burn rate 1h e 6h, alertas burn rate crítico 14.4× e alto 6×, dashboard Grafana com budget restante em %), on-call sustentável (alertas acionáveis vs não-acionáveis, urgência page/slack/ticket, estrutura de runbook completo), postmortem blameless (Just Culture, template 5 seções: resumo/timeline/causa raiz/fatores contribuintes/ações corretivas, linguagem sistêmica vs culpa), toil (tabela com 5 exemplos de toil e como eliminar), WindowsComparisonBox (ITIL/ITSM ↔ SRE moderno), 4 armadilhas comuns expansíveis; badge 🎯 sre-master (50º badge); 3 checkpoints (sre-slo-definido, sre-error-budget, sre-postmortem); module-accent-sre #f59e0b (âmbar); CONTENT_PAGES_COUNT 42→43, checklistItemsCount 136→139, totalTopics 77→78, linux-ninja threshold 102→104; tópico I08 em /topicos; /evolucao v4.0 COMPLETO (8 disponíveis · 0 em breve ✅); +2 searchItems (129 total); E2E 3/139 + 0/50.
- ✅ Sprint I.22 (CI/CD com GitHub Actions): `/cicd` — anatomia de workflow (Workflow/Job/Step/Action/Runner/Artifact em cards), FluxoCard Push→Lint+Test→Build→Staging→Prod com aprovação, primeiro workflow CI completo (lint+test em paralelo, upload artifact coverage, needs: para encadear build), Docker build+push no ghcr.io (docker/login-action, docker/metadata-action tags semver+sha, docker/build-push-action com cache BuildKit gha), environments (staging automático + production com required reviewers, SSH deploy via docker compose), matrix strategy (node 18/20/22 × ubuntu/windows, fail-fast: false, exclude), secrets (escopos Repository/Environment/Organization, mascarar valor dinâmico, GITHUB_TOKEN automático), self-hosted runner (useradd github-runner, config.sh, svc.sh install como systemd, group docker, sudoers NOPASSWD), reusable workflows (workflow_call com inputs/secrets), notificação Slack em falha, WindowsComparisonBox (Azure DevOps/Jenkins ↔ GitHub Actions), 4 erros comuns expansíveis; badge 🚀 cicd-master (51º badge); 3 checkpoints (cicd-pipeline, cicd-secrets, cicd-runner); module-accent-cicd #2563eb; CONTENT_PAGES_COUNT 43→44, checklistItemsCount 139→142, totalTopics 78→79, linux-ninja threshold 104→106; tópico C01 em /topicos (novo grupo "Cloud & Platform Engineering"); /evolucao v5.0 CI/CD marcado disponível (1 disponível · 3 em breve); +2 searchItems (131 total); E2E 3/142 + 0/51.
- ✅ Sprint I.23 (OPNsense / pfSense): `/opnsense` — OPNsense vs pfSense (tabela 7 critérios), instalação VM (3 NICs: WAN/LAN/DMZ), mapa da Web UI, regras de firewall por interface (pf avaliado ingress), Aliases, Port Forward = DNAT (equivalências iptables), VPN WireGuard + OpenVPN wizard, Suricata IDS/IPS plugin (3 etapas), CARP HA (FluxoCard: MASTER→BACKUP→VIP), API REST + backup automático, WindowsComparisonBox (RRAS/NPS ↔ OPNsense); badge 🔥 opnsense-master (52º badge); 3 checkpoints (opnsense-instalado, opnsense-regras, opnsense-vpn); module-accent-opnsense #d94f00; CONTENT_PAGES_COUNT 44→45, checklistItemsCount 142→145, totalTopics 79→80, linux-ninja threshold 106→108; tópico C02 em /topicos; /evolucao v5.0 OPNsense disponível (2 disponíveis · 2 em breve); +2 searchItems (133 total); E2E 3/145 + 0/52.
- ✅ Sprint I.24 (Nextcloud — Nuvem Pessoal): `/nextcloud` — Nextcloud vs ownCloud/Seafile/Google Drive (tabela), Docker Compose stack completa (Nextcloud+MariaDB+Redis+Traefik com labels ACME), FluxoCard Traefik→Nextcloud→MariaDB→Redis, wizard pós-instalação (occ config:system, Redis cache, cron container), tabela de 8 apps (Calendar/Contacts/Talk/Collabora/Mail/Deck/Maps/Backup), integração LDAP (link → Sprint I.12), object storage MinIO S3-compatible, script bash backup 3-2-1 (local+remoto+cloud), WindowsComparisonBox (OneDrive/SharePoint ↔ Nextcloud); badge ☁️ nextcloud-master (53º badge); 3 checkpoints (nextcloud-instalado, nextcloud-ssl, nextcloud-apps); module-accent-nextcloud #0082c9; CONTENT_PAGES_COUNT 45→46, checklistItemsCount 145→148, totalTopics 80→81, linux-ninja threshold 108→111; tópico C03 em /topicos; /evolucao v5.0 Nextcloud disponível (3 disponíveis · 1 em breve); +2 searchItems (135 total); E2E 3/148 + 0/53.
- ✅ Sprint I.25 (eBPF Avançado + Cilium): `/ebpf-avancado` — Cilium vs kube-proxy/flannel (por que O(1) eBPF map vs O(N) iptables), instalação K3s sem CNI + helm install Cilium (kubeProxyReplacement=true, Hubble Relay+UI), Hubble CLI (observe --verdict DROPPED, port-forward relay:4245, Hubble UI service map), CiliumNetworkPolicy L3/L4 (default-deny + whitelist por labels), L7 (HTTP path/method, rules/http), DNS (toFQDNs com update dinâmico), eBPF LB (DSR, cilium bpf lb list, tabela iptables vs eBPF), Tetragon (TracingPolicy Sigkill para nc/ncat, detectar acesso /etc/shadow, tetra getevents), eBPF maps avançados (LRU_HASH, PERCPU_HASH, RINGBUF, PROG_ARRAY — tabela de tipos), bpftrace avançado (kprobes latência read(), uprobes app Go, top I/O disco), WindowsComparisonBox (Azure CNI+Defender ↔ Cilium+Tetragon); badge 🧬 ebpf-avancado-master (54º badge); 3 checkpoints (cilium-instalado, hubble-habilitado, tetragon-seguranca); module-accent-ebpf-avancado #6d28d9; CONTENT_PAGES_COUNT 46→47, checklistItemsCount 148→151, totalTopics 81→82, linux-ninja threshold 111→113; tópico C04 em /topicos; /evolucao v5.0 COMPLETO (4 disponíveis · 0 em breve ✅); +2 searchItems (137 total); E2E 3/151 + 0/54.
- ✅ Sprint Quiz++ (cobertura de 23 módulos): +58 perguntas em `src/data/quizQuestions.ts` cobrindo todos os módulos sem coverage (F4-F7, I.7-I.25); total quiz 50→108 perguntas.
- ✅ Fixes de consistência: deep-diver desc "20 páginas"→"47 páginas", BadgeContext comment "20 rotas"→"47 rotas", home stats 58/24/30→82/47/54, fundamentos-master trigger 10→14 checkpoints (Sprint F1-F7 completo).
- ✅ Sprint SSH-PROXY (SSH como Proxy SOCKS): `/ssh-proxy` — SOCKS5 dinâmico (-D), port forwarding local (-L) e remoto (-R), Jump Host (-J/ProxyJump), autossh com systemd para túneis persistentes, ~/.ssh/config completo com ControlMaster, WindowsComparisonBox PuTTY/plink ↔ OpenSSH, 4 erros comuns; badge 🚇 ssh-proxy-master (55º badge); 3 checkpoints (ssh-dinamico, ssh-local, ssh-jump); module-accent-ssh-proxy #0ea5e9; CONTENT_PAGES_COUNT 47→48, checklistItemsCount 151→154, totalTopics 82→83, linux-ninja threshold 113→115; tópico S08 em /topicos; /evolucao v3.0 10 disponíveis ✅; +2 searchItems (139 total); E2E 3/154 + 0/55; +3 quiz questions (total 111).
- ✅ Sprint Quiz Completo: +17 perguntas em `src/data/quizQuestions.ts` — 1 pergunta adicional por módulo que só tinha 2 (F5, F7, I.7-I.13, I.15, I.17-I.24); todos os módulos agora têm ≥3 questões; total 105→122 perguntas.
- ✅ Sprint Quiz Fundamentos F1-F10: +30 perguntas em `src/data/quizQuestions.ts` cobrindo os 10 módulos originais da trilha Fundamentos que tinham zero cobertura (FHS, Comandos Essenciais, Editores de Texto, Gerenciamento de Processos, Permissões e Usuários, Discos e Partições, Logs Básicos, Backup, Shell Script, Cron); 3 perguntas por módulo; total 122→152 perguntas.
- ✅ Sprint Polish-Stale: corrige todas as referências "10 módulos" → "15 módulos" da trilha Fundamentos (app/page.tsx hero, app/cron/page.tsx checkpoint, src/data/courseOrder.ts comment, src/lib/seo.ts description).
- ✅ Sprint Counter-Sync + Evolucao Fix: totalTopics 84→85 (TOPICS.length confirmado = 85 via node: s08 SSH Proxy + sub-entries 27b/47b); home stats '84'→'85' e "84 tópicos" → "85 tópicos"; /evolucao "Roadmap em 3 fases" → "4 fases (v2.0→v5.0)"; botão "Me avise sobre v3.0" → "Me avise sobre novos módulos" (v3.0 COMPLETO).
- ✅ Sprint Advanced-Trail: `ADVANCED_ORDER` (19 módulos v3.0→v5.0) em `courseOrder.ts`; badge 🌐 advanced-master (56º — visitar todos os 19); seção "Módulos Avançados" no dashboard com barra de progresso + grid de módulos (links, ✓ visitado); MILESTONE_BADGES inclui advanced-master; home stats badges 55→56; 6 novos testes vitest para ADVANCED_ORDER (57 testes total); E2E 07-dashboard-counters 0/55→0/56.
- ✅ Sprint Advanced-Nav: `ModuleNav` estendido para aceitar `SimpleModule[]` (prev/next derivados do índice quando não há campos explícitos); ModuleNav adicionado em todos os 19 módulos avançados substituindo navs hardcoded díspares; fix de import mislocado em monitoring/page.tsx (import Python no code block interferiu com lastIndexOf).
- ✅ Sprint PROGRESS-DROPDOWN: `ProgressDropdown` reescrito com 3 abas — Firewall (25), Fundamentos (15), Avançados (19); botão exibe total X/59; barra de progresso e lista de módulos por aba; cores distintas por trilha (accent/indigo/info); a11y preservada (role=tablist, aria-selected, focus trap).
- ✅ fix(home): stats módulos 48→59 (25+15+19 trilhas); deep-diver desc atualizado "48+ de 59".
- ✅ Sprint QUIZ-TRAIL: campo `trail: QuizTrail` adicionado a todas as 152 questões via script (firewall=50, fundamentos=45, avancados=57); seletor de trilha (4 opções: Todas/Firewall/Fundamentos/Avançados) na tela de início do quiz com radio semantico + contagem por trilha.
- ✅ Sprint TOPICOS-TRAIL: filtro de trilha (🗂️ Todas / 🔥 Firewall / 🐧 Fundamentos / 🚀 Avançados) adicionado à página `/topicos` acima dos filtros de camada OSI existentes; mapeamento group→trail via `TRAIL_BY_GROUP` sem modificar os 85 objetos Topic; filtros de trilha e camada são independentes (AND); radio semantico (role=radiogroup/radio, aria-checked).
- ✅ Sprint AVANCADOS-INDEX: página `/avancados` — índice da trilha avançada espelhando /fundamentos; 19 módulos em 3 seções (v3.0 Servidores/v4.0 Infraestrutura/v5.0 Cloud); progress bar com checkpoint do primeiro módulo de cada; hero com CTA inteligente (Começar/Continuar/Revisar); nav link 🚀 Avançados adicionado em ClientLayout.tsx; CONTENT_PAGES_COUNT 48→49; deep-diver desc "49+ páginas (61 disponíveis)"; SEO /avancados em seo.ts; +2 searchItems (145 total); layout.tsx com buildMetadata.
- ✅ Sprint GLOSSARIO-ADVANCED: +12 termos ao glossário (mTLS, Sidecar Proxy, VirtualService, Circuit Breaker, CNI, NetworkPolicy, Pipeline CI/CD, GitOps, IDS/IPS, CARP, Burn Rate, Trace/Tracing); total 73→85 termos; trackPageVisit adicionado em /glossario, /certificado, /evolucao (3 páginas COURSE_ORDER que não contavam para deep-diver); deep-diver "(61 disponíveis)"→"(62 disponíveis)"; +4 searchItems glossário (148 total); /cheat-sheet +11 comandos (SSH Proxy, CI/CD, Monitoring, K8s rollout) e DEVOPS/SERVERS_CATEGORIES atualizadas.
- ✅ Sprint QUIZ-FIX: SSH-PROXY 3 questões corrigidas trail 'avancados'→'fundamentos' (fundamentos 42→45, avancados 60→57; total 151).
- ✅ Sprint QUIZ-COVER: +13 questões para módulos com <3 cobertura — DNAT(+2), Port Knocking(+2), Diagnóstico SSL(+2), Camada 3(+1), Análise de Pacotes(+1), systemd(+1), Hardening(+1), Docker(+1), Compose(+1), SSH 2FA(+1); total 151→164 (firewall=62, fundamentos=45, avancados=57).
- ✅ Sprint QUIZ-LATE-MODULES: +9 questões para módulos sem cobertura — Pivoteamento (🎭 +3: FORWARD DROP, reverse shell, egress filtering), Laboratório (🧪 +3: vmx/svm check, KVM tipo 1 vs VirtualBox tipo 2, virsh/libvirt), Proxmox (🖥️ +3: porta 8006, bridges vmbr, pveversion); total 164→173 (firewall=71, fundamentos=45, avancados=57).
- ✅ Sprint QUIZ-UX: Fisher-Yates shuffle em cada sessão (questões embaralhadas aleatoriamente); seletor de tamanho de sessão — Rápido (20 questões ~5min) / Normal (40) / Completo (todas); aria-label="Começar Quiz" estabiliza E2E; E2E test atualizado para novo aria-label.
- ✅ Sprint SEARCH-EXPAND: +15 itens de busca para 15 módulos com cobertura única — ataques-avancados, pivoteamento, hardening, docker, fundamentos, fhs, comandos, editores, processos, permissoes, discos, logs-basicos, backup, shell-script, cron; searchItems 148→163.
- ✅ Sprint CONTENT-ATAQUES: `/ataques-avancados` enriquecida — 6 tipos de ataque (recon nmap, fragmentação, SYN flood+connlimit, ARP spoofing+arptables, timing attack/SPA, DNS rebinding), FluxoCard Cyber Kill Chain, WindowsComparisonBox, tcpdump analysis, WarnBox ético; 3 checkpoints (ataques-recon, ataques-syn, ataques-arp); checklistItemsCount 154→157, linux-ninja 115→117.
- ✅ Sprint CONTENT-PIVOTING: `/pivoteamento` enriquecida — FluxoCard cadeia 6 etapas, FORWARD DROP com logging, egress filtering completo, anti-DNS-tunneling DNAT, tabela técnicas evasão×defesa, script completo anti-pivoteamento, WindowsComparisonBox (Azure NSG ↔ iptables), detecção de IoC, exercícios guiados; 3 checkpoints (pivote-forward-drop, pivote-egress, pivote-honeypot); checklistItemsCount 157→160, linux-ninja 117→120.
- ✅ Sprint CONTENT-LABORATORIO: `/laboratorio` enriquecida — FluxoCard evolução do lab (VirtualBox→KVM→Proxmox→Cluster HA), WarnBox requisitos de hardware, WindowsComparisonBox (Hyper-V ↔ KVM/libvirt com virsh vs PowerShell); sem mudanças em constantes (checkpoints já existiam).
- ✅ Sprint WINDOWS-POLISH (3 rounds): WindowsComparisonBox adicionada a 10 páginas do COURSE_ORDER que não tinham — Round 1: audit-logs (Event Viewer/Sysmon ↔ auditd/iptables LOG), wan-nat (RRAS/ICS ↔ iptables MASQUERADE), dnat (RRAS Port Forward ↔ PREROUTING DNAT), hardening (GPO/CIS ↔ sshd+sysctl+AppArmor); Round 2: docker (Docker Desktop/HyperV ↔ Docker Engine nativo), nginx-ssl (IIS+win-acme ↔ Nginx+Certbot), lan-proxy (ISA Server/WPAD ↔ Squid transparente), proxmox (Hyper-V/vSphere ↔ Proxmox VE); Round 3: ssh-2fa (Windows Hello/Duo ↔ PAM+TOTP), port-knocking (Azure JIT/netsh ↔ knockd+iptables). Nenhum curso principal da trilha v1.0 sem WindowsComparisonBox agora.
- ✅ Sprint FUNDAMENTOS-WINDOWS: WindowsComparisonBox adicionada a fhs (C:\Windows↔/etc, Registry↔/proc), editores (Notepad/PowerShell↔nano/vim), comandos (dir↔ls, type↔cat, 20+ equivalências), vpn-ipsec (RRAS IKEv2↔StrongSwan) — 100% de cobertura WindowsComparisonBox em todos os módulos.
- ✅ Sprint ERROS-COMUNS (3 rodadas): seção "Erros Comuns e Soluções" (4 cards por página) adicionada a 33 módulos — 100% de cobertura em todos os módulos de conteúdo (v1.0/v2.0/v3.0/v4.0/v5.0). Sem mudanças em constantes.
- ✅ Sprint DEEP-DIVES-V2: +2 deep dives — "Docker Networking Internals" (bridge docker0, veth pairs, iptables DOCKER chains, DOCKER-USER, redes customizadas + DNS interno) em /docker; "Kubernetes Service Discovery" (CoreDNS, ClusterIP como ficção iptables, kube-proxy vs Cilium eBPF O(1)) em /kubernetes; total 6→8 deep dives; categoria DeepDive estendida com 'Containers' e 'Kubernetes'; imports Network/Server de lucide adicionados.
- ✅ Sprint DEEP-DIVES-V3: +4 deep dives — "Ansible Idempotência e Ciclo de Execução" (ok vs changed, handlers acumulados, modules vs command), "SRE Error Budget — Matemática dos Noves" (tabela de noves, burn rate 1×/14.4×, decisão com budget), "eBPF Maps — Memória Compartilhada" (5 tipos HASH/ARRAY/LRU/PERF/RINGBUF, cilium bpf lb list, O(1) vs O(N)), "GitHub Actions — Pipeline Seguro" (secrets, permissões mínimas, concurrency, environments, artifacts); total 8→12 deep dives; categorias 'Ansible' | 'SRE' | 'eBPF' | 'CI/CD' adicionadas; imports GitBranch/Activity/Cpu/Rocket de lucide.
- ✅ Sprint GLOSSARIO-V2: +15 termos atingindo 100 total — TOTP (RFC 6238 + PAM), PAM, SMB/CIFS, DN, objectClass, PFS, XDP, SLI, Postmortem, Toil, ACME, Cilium, Artifact, Runner, DHCP Relay.
- ✅ Sprint GLOSSARIO-V3: +15 termos atingindo 115 total — Idempotência, Handler Ansible, eBPF Verifier, BPF Map, CrashLoopBackOff, ImagePullBackOff, ForceNew Terraform, Concurrency GitHub Actions, mTLS, SPIFFE, VirtualService Istio, Envoy Proxy, PodDisruptionBudget, Recording Rule Prometheus, Deployment Strategy.
- ✅ Sprint CHEAT-V2: +11 comandos no cheat-sheet expandindo 11 categorias de 2→3 itens — DNS (dig PTR+MX), Proxy (squid -k), systemd (systemd-analyze blame), Logs (logrotate -f), DHCP (journalctl DORA), Samba (testparm -s), Apache (apachectl -S), LDAP (slapcat backup), Suricata (eve.json jq alertas), Pi-hole (pihole -c terminal), Monitoring (targets API); total 69→80 comandos.
- ✅ Sprint CHEAT-V3: +17 comandos — DNS 3º (dig +trace), Proxy 3º (squid access.log awk), nftables (list ruleset, -f atômico, flush ruleset), Traefik (API routers jq, logs grep error, acme.json certs), eBPF (bpftrace execve, bpftool prog list, cilium bpf lb list), SRE (promtool check rules, amtool alert query, kubectl describe hpa), Service Mesh (istioctl analyze, proxy-status, hubble observe DROPPED); categorias devops expandidas; total 80→97.
- ✅ Sprint QUIZ-200: +27 perguntas de profundidade cobrindo conntrack/chains/policy-DROP, DNAT/connlimit, DNS reversa/recursivo-vs-autoritativo, HSTS/ssl_session_cache, IPSec PFS/IKEv2, WireGuard AllowedIPs/Noise, Fail2ban failregex/bantime-1, nftables list-ruleset, Hardening tcp_syncookies/PasswordAuthentication, Port Knocking SPA, Squid proxy transparente, Docker host network, Ansible gather_facts, PromQL rate(), K8s readiness+liveness, Suricata af-packet, SRE toil, CI/CD matrix; total 173→200 (firewall=92, fundamentos=45, avancados=63).
- ✅ Sprint SEARCH-V2: +17 itens de busca — terceiro item (glossário técnico) para cada módulo avançado com apenas 2 itens: dhcp (DORA), samba (smb.conf shares), apache (VirtualHost a2ensite), openvpn (Easy-RSA PKI), traefik (labels autodiscovery), ldap (LDIF), pihole (DNS sinkhole), ansible (Vault AES-256), monitoring (Alertmanager), kubernetes (Helm), terraform (módulos reutilizáveis), ebpf (XDP), ebpf-avancado (Tetragon), sre (burn rate alerts), opnsense (pf ingress), nextcloud (WebDAV), ssh-proxy (autossh); searchItems 163→180.
- ✅ Sprint EXERCICIOS (COMPLETO — 100% cobertura): seções "Exercícios Guiados" com 3 labs hands-on adicionadas a todos os módulos de conteúdo (59 páginas). Lotes: Round 1-4 (docker/hardening/audit-logs/dnat/nginx-ssl/lan-proxy/port-knocking/wan-nat/opnsense/vpn-ipsec/dns/nextcloud/proxmox); Round 5 (ataques-avancados/cicd/instalacao/laboratorio/service-mesh/sre); Fundamentos v2.0 (fhs/comandos/editores/processos/permissoes/discos/backup/logs-basicos/shell-script/cron/pacotes/boot/comandos-avancados/rsyslog); v1.0 restantes (fail2ban/wireguard/nftables/ssh-2fa/pivoteamento/ssh-proxy); v3.0 (dhcp/samba/apache/openvpn/pihole); v4.0 (docker-compose/ansible/monitoring/kubernetes/ldap/traefik/terraform/suricata/ebpf/ebpf-avancado). Sem mudanças em constantes.
- ✅ Sprint QUIZ-FUNDAMENTOS-DEPTH: +15 perguntas de profundidade — 1 pergunta adicional para cada um dos 15 módulos da trilha Fundamentos (/fhs: /proc/mounts vs /etc/fstab, /comandos: find vs locate, /editores: Vim :%s global, /processos: strace syscalls, /permissoes: bit SUID, /discos: noatime, /logs-basicos: journalctl -b, /backup: tar gzip diferenças, /shell-script: heredoc, /cron: @reboot, /pacotes: apt-mark hold, /boot: initrd, /comandos-avancados: sed -i.bak, /rsyslog: auth vs authpriv, /ssh-proxy: ControlMaster); total 200→215 (firewall=92, fundamentos=60, avancados=63).
- ✅ Sprint QUIZ-AVANCADOS-DEPTH: +19 perguntas de profundidade — 1 pergunta adicional para cada um dos 19 módulos da trilha Avançados (/dhcp: deny unknown-clients, /samba: security=user vs ads, /apache: mod_security WAF, /openvpn: tls-auth/tls-crypt HMAC, /traefik: middleware vs router, /ldap: OLC slapd.d, /pihole: DNS sinkhole 0.0.0.0, /ansible: gather_facts false, /monitoring: recording rules, /kubernetes: PodDisruptionBudget, /terraform: count vs for_each, /suricata: NFQUEUE fail-open, /ebpf: verifier estático, /ebpf-avancado: BPF Host Routing, /service-mesh: mTLS STRICT, /sre: burn rate 1x vs 14.4x, /cicd: concurrency cancelamento, /opnsense: CARP failover, /nextcloud: Redis cache memória); total 215→234 (firewall=92, fundamentos=60, avancados=82).
- ✅ Sprint QUIZ-FIREWALL-DEPTH: +9 perguntas para os 9 módulos da trilha Firewall com apenas 3 questões — Diagnóstico (ss vs netstat), Análise de Pacotes (tcpdump filtro BPF), Diagnóstico SSL (openssl s_client showcerts), systemd (drop-in override), Compose (healthcheck + depends_on condition), SSH 2FA (por que testar em 2ª sessão), Pivoteamento (egress vs ingress filtering), Laboratório (CPU nested virtualization), Proxmox (ZFS snapshots COW); total 234→243 (firewall=101, fundamentos=60, avancados=82).
- ✅ Sprint QUIZ-SCENARIOS: +10 questões de cenário real de diagnóstico em produção — DNS sem conectividade IP, iptables ordem de regras, certbot force-renewal, Docker sem internet (ip_forward+MASQUERADE), Ansible always-changed (command vs módulo idempotente), K8s CrashLoopBackOff (endpoints+DNS), Prometheus InstanceDown falso, Terraform ForceNew vs tags, GitHub Actions secrets não injetados, SRE error budget negativo; total 243→253 (firewall=105, fundamentos=60, avancados=88).
- ✅ Sprint DEEP-DIVES-V3 FIX: corrigidos IDs errados em vpn-ipsec ('ipsec-deep'→'ipsec-ike-phases') e lan-proxy ('squid-https'→'squid-https-filtering'); adicionado deep dive 'nftables-vs-iptables' à página /nftables; todos os 12 deep dives agora acessíveis.
- ✅ Sprint SEARCH-COMPLETE: +35 itens de busca — 3º item adicionado para TODOS os módulos com cobertura dupla (31 módulos de conteúdo: dns/web-server/dnat/port-knocking/ataques-avancados/pivoteamento/hardening/docker-compose/ssh-2fa/docker/laboratorio/proxmox/fundamentos/fhs/comandos/editores/processos/permissoes/discos/logs-basicos/backup/shell-script/cron/pacotes/boot/comandos-avancados/rsyslog/avancados + dashboard/evolucao) + /topicos (2→3) + /quiz (1→3) + /certificado (1→3); 100% dos módulos com ≥3 itens; searchItems 185→220. +1 quiz question K8s (Deployment vs StatefulSet — stateless vs identity estável); total 253→254 (avancados=88→89).
- ✅ Sprint DEEP-DIVES-V4: +4 deep dives — "TLS 1.3 Handshake Detalhado" (ClientHello/ServerHello, 0-RTT, ALPN) em /nginx-ssl, "WireGuard Noise Protocol" (ChaCha20-Poly1305, Curve25519 ECDH, handshake 1-RTT) em /wireguard, "Fail2ban Arquitetura Interna" (inotify watcher, thread pool, backoff, jails independentes) em /fail2ban, "Hardening Defense in Depth" (princípio mínimo privilégio, layers sysctl/AppArmor/SSH/audit) em /hardening; total 12→16 deep dives; wiring dos botões "Aprofundar" adicionado às 4 páginas.
- ✅ Sprint UX-TABS: navegação por 3 abas em 8 páginas extensas — /ansible (Conceito / Playbooks & Roles / Vault & Galaxy), /kubernetes (Conceito / Recursos & kubectl / Avançado), /terraform (Conceito / Configuração HCL / Módulos & State), /monitoring (Conceito / Stack & Dashboards / PromQL & Alertas), /cicd (Conceito / Pipeline & Jobs / Secrets & Deploy), /service-mesh (Conceito / mTLS & Traffic / Observabilidade), /suricata (Conceito & Regras / Configuração / IPS & Integração), /ldap (Conceito & LDIF / Operações & Grupos / PAM & Segurança); padrão idêntico ao /nftables (useState + border-b-2 -mb-px + border-[var(--mod)] ativo); useState import adicionado em terraform/monitoring/ldap; zero mudanças em constantes de badge/checkpoint.
- ✅ Sprint UX-PAGES: /topicos — seção "Por onde começar?" com 3 cards de trilha (barra de progresso dinâmica por trilha via trailStats useMemo + isTopicVisited useCallback), ✓ verde por tópico visitado, pill de trilha nos cabeçalhos de grupo quando filtro "Todas" ativo; /cheat-sheet — 4 abas (⚡ Comandos / 🔄 Workflows / 🪟 Windows↔Linux / 📜 Scripts & VIM) com hidden attribute preservando estado de busca, feedback "Copiado!" 2s por botão de cópia via copiedId state + handleCopy useCallback; zero mudanças em constantes.
- ✅ Sprint EVOLUCAO-FIX: /evolucao corrigida — ssh-proxy movido de PHASE_V2 para PHASE_V3 (slug correto para v3.0 Servidores e Serviços); PHASE_V2.status '17 disponíveis' → '16 disponíveis'; PHASE_V3.status '9 disponíveis' → '10 disponíveis'; roadmap agora reflete exatamente as 4 trilhas: v1.0 (25 módulos) + v2.0 (16 módulos Fundamentos) + v3.0 (10 módulos Servidores) + v4.0 (8 módulos Infraestrutura) + v5.0 (4 módulos Cloud).
- ✅ Sprint UX-TABS-2 (5 páginas restantes): navegação por 3 abas em /ebpf (Conceito & Ferramentas / bpftrace & XDP / Cilium & Segurança), /sre (SLI/SLO/SLA / Implementação / Postmortem & Toil), /opnsense (Conceito & Install / Firewall & VPN / HA & API), /nextcloud (Conceito & Stack / Config & Apps / Storage & Backup), /ebpf-avancado (Cilium & Hubble / Políticas & LB / Tetragon & Maps); padrão idêntico ao UX-TABS original; 100% de cobertura de abas nas 13 páginas extensas do workshop; zero mudanças em constantes de badge/checkpoint.
- ✅ Sprint UX-TABS-3 (19 páginas restantes sem abas): navegação por 3 abas adicionada a /docker (🐳 Conceito & Drivers / ⚙️ iptables & Segurança / 🔧 Exercícios & Ref.), /docker-compose (📦 Conceito & yml / 🌐 Redes & Volumes / 🚀 Stack Completa & Exercícios), /wan-nat (🌐 SNAT & Fundamentos / ⚙️ Persistência & Serviços / 🔬 Diagnóstico & Exercícios), /wireguard (🔒 Conceito & Chaves / ⚙️ Configuração / 🔧 Diagnóstico & Exercícios), /audit-logs (📋 Anatomia & Análise / 🔍 Forense & Port Knocking / ⚙️ Exercícios & Referência), /ssh-2fa (📱 TOTP & Teoria / ⚙️ Configuração PAM & SSH / 🔧 Exercícios & Referência), /fail2ban (📋 Conceito / ⚙️ Config / 🔧 Exercícios), /hardening (🔐 SSH & sysctl / 🛡️ AppArmor / 🔬 Exercícios & Ref.), /port-knocking (🚪 Conceito & Segurança / ⚙️ Implementação / 🔧 Exercícios & Ref.), /lan-proxy (🔗 Conceito & Fluxo / ⚙️ Configuração Squid / 🔧 Exercícios & Ref.), /dnat (🔀 DNAT & Fundamentos / ⚙️ Múltiplos Serviços / 🔧 Exercícios & Ref.), /nginx-ssl (🌐 Reverse Proxy & SSL / 🔒 Certbot & Headers / 🔧 Exercícios & Ref.), /traefik (🔀 Conceito & Stack / ⚙️ Middlewares & Dashboard / 🔧 Troubleshooting & Exercícios), /openvpn (🔒 Conceito & PKI / ⚙️ Configuração / 🔧 Troubleshooting & Exercícios), /apache (🌍 Instalação & VirtualHost / 🔒 HTTPS & Proxy Reverso / 🔧 Exercícios & Referência), /samba (📁 Instalação & smb.conf / 🌐 Firewall & Acesso / 🔧 Diagnóstico & Exercícios), /pivoteamento (🎭 Vetor de Ataque / 🛡️ Egress & Evasão / 🔍 Defesa & Exercícios), /proxmox (🖥️ Instalação & Rede / ⚙️ VMs & Snapshots / 🔗 Cluster & Exercícios), /laboratorio (🧪 VirtualBox & Escolha / 🔧 KVM / libvirt / 🖥️ Proxmox & Exercícios); 100% de cobertura de abas em todas as páginas extensas; zero mudanças em constantes de badge/checkpoint.
- ❌ Backend/Supabase: DESCARTADO — localStorage atende ao escopo educacional. Portabilidade via export/import JSON implementada (Sprint J).
- ⏸️ Service Worker offline: AVALIAR DEPOIS — complexidade desproporcional ao caso de uso.

Para detalhes completos: docs/ (índice em docs/README.md) · QUICKSTART.md · README.md
