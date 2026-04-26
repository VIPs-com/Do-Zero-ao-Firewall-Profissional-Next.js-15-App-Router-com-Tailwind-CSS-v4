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
npm run test         # vitest run — 6 suítes · 51 testes (BadgeContext, ClientLayout, GlobalSearch, SEO, courseOrder, ModuleNav)
npm run test:watch   # vitest watch mode
npm run test:e2e     # Playwright E2E — build prod + start (CSP nonce real)
npm run test:e2e:ui  # Playwright com UI interativa
npm run test:e2e:headed # Playwright com browser visível
npm run build        # valida TypeScript + gera 47 rotas próprias (build reporta 52/52 incluindo /sitemap, /robots, /opengraph-image, /icon, /apple-icon, /manifest.webmanifest, /_not-found)
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
  [rota]/page.tsx           # 47 rotas — todas 'use client' (25 COURSE_ORDER + 15 trilha Fundamentos + 2 v3.0 + 5 suporte: /, /dashboard, /topicos, /offline, /web-server)
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
    quizQuestions.ts        # perguntas do quiz extraídas (Sprint F — code splitting) — 50 perguntas (Sprint Polish-I: +17)
    searchItems.ts          # 103 itens indexados para GlobalSearch (CMD+K / Ctrl+K)
    courseOrder.ts          # COURSE_ORDER (25 módulos Firewall) + FUNDAMENTOS_ORDER (14 módulos Fundamentos) para ModuleNav
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
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | 31 (Sprint I.9: +apache) |
| `totalTopics` | `app/dashboard/page.tsx` | 66 (Sprint I.9: +Apache) |
| `checklistItemsCount` | `app/dashboard/page.tsx` | 103 (Sprint I.9: +3 checkpoints apache) |
| Texto na Home | `app/page.tsx` | "58 tópicos práticos" + stats: 58/24/30/7 |
| Badges | `src/context/BadgeContext.tsx` | 38 (Sprint I.9: +apache-master) |
| searchItems | `src/data/searchItems.ts` | 103 (Sprint I.9: +2 Apache) |

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
4. `npm run build` — 46/46 páginas (41 próprias + /sitemap + /robots + /opengraph-image + /icon + /apple-icon + /manifest.webmanifest + /_not-found)
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
- ❌ Backend/Supabase: DESCARTADO — localStorage atende ao escopo educacional. Portabilidade via export/import JSON implementada (Sprint J).
- ⏸️ Service Worker offline: AVALIAR DEPOIS — complexidade desproporcional ao caso de uso.

Para detalhes completos: docs/ (índice em docs/README.md) · QUICKSTART.md · README.md
