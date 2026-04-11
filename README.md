# 🛡️ Do Zero ao Firewall Profissional

> **Plataforma interativa de aprendizado em segurança de redes e firewalls Linux**  
> Construída com Next.js 16 · Tailwind CSS v4 · TypeScript · Gamificada com Badges

---

## 📌 Visão Geral

Este projeto é uma **plataforma educacional completa** que ensina segurança de redes do zero ao nível profissional, com foco no Modelo OSI aplicado na prática. O usuário constrói um laboratório Linux real com três zonas de segurança (WAN, DMZ, LAN), executando comandos reais em Ubuntu Server.

**Não é uma simulação. É infraestrutura de verdade.**

---

## 🗺️ Arquitetura do Laboratório

```
┌──────────────────────────────────────────────────────────────┐
│                         INTERNET (WAN)                       │
│                      eth0 · IP Público                       │
└────────────────────────────┬─────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │    🔥 FIREWALL    │  ← iptables + NAT
                    │   Ubuntu Server  │     Port Knocking
                    │  eth0 · eth1·eth2│     StrongSwan VPN
                    └──┬──────────┬───┘
                       │          │
          ┌────────────▼──┐  ┌────▼────────────┐
          │  🖥️  DMZ Zone  │  │  💻  LAN Zone   │
          │ 192.168.56.0/24│  │ 192.168.57.0/24 │
          │                │  │                 │
          │ ┌────────────┐ │  │ ┌─────────────┐ │
          │ │ Web Server │ │  │ │   Cliente   │ │
          │ │Nginx + SSL │ │  │ │Squid Proxy  │ │
          │ │  BIND9 DNS │ │  │ └─────────────┘ │
          │ └────────────┘ │  └─────────────────┘
          └────────────────┘
```

**Três zonas, níveis de confiança distintos, controladas pelo Firewall central.**

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | ^16.2.2 |
| Linguagem | TypeScript | ~5.8.2 |
| Estilização | Tailwind CSS | ^4.1.14 |
| Animações | Motion (Framer) | ^12.23.24 |
| Ícones | Lucide React | ^0.546.0 |
| Markdown | react-markdown | ^10.1.0 |
| Runtime | React | ^19.0.0 |
| Build | Turbopack | (built-in) |

**Sprints concluídos:** A (robustez) · B (SEO) · C (a11y WCAG 2.1 AA) · D (PWA Lite + headers) · E (CSP nonce via `proxy.ts`).

---

## 📂 Estrutura de Pastas

```
📁 raiz/
├── 📁 app/                         ← App Router (Next.js)
│   ├── globals.css                 ← Tokens de tema + classes reutilizáveis (@theme)
│   ├── layout.tsx                  ← Root + anti-FOUC + JSON-LD + nonce CSP
│   ├── page.tsx                    ← Home com topologia interativa
│   ├── providers.tsx               ← <BadgeProvider> global
│   ├── error.tsx                   ← Error boundary global ('use client')
│   ├── not-found.tsx               ← 404 (Server, robots noindex)
│   ├── loading.tsx                 ← Suspense fallback global
│   ├── manifest.ts                 ← Web App Manifest — PWA Lite
│   ├── sitemap.ts                  ← sitemap.xml gerado a partir de ROUTE_SEO
│   ├── robots.ts                   ← robots.txt dinâmico
│   ├── opengraph-image.tsx         ← OG 1200x630 via next/og (edge)
│   ├── icon.tsx                    ← favicon 32x32 via next/og (edge)
│   ├── apple-icon.tsx              ← apple-touch-icon 180x180 via next/og (edge)
│   │
│   ├── 📁 instalacao/              ← Módulo 1: Fundação & IP
│   ├── 📁 wan-nat/                 ← Módulo 2: NAT & SNAT
│   ├── 📁 dns/                     ← Módulo 3: BIND9
│   ├── 📁 nginx-ssl/               ← Módulo 4: Nginx + SSL/TLS
│   ├── 📁 web-server/              ← Módulo 4b: Web Server
│   ├── 📁 lan-proxy/               ← Módulo 5: Squid Proxy
│   ├── 📁 dnat/                    ← Módulo 6: DNAT & Port Forwarding
│   ├── 📁 port-knocking/           ← Módulo 7: Port Knocking
│   ├── 📁 vpn-ipsec/               ← Módulo 8: VPN IPSec
│   ├── 📁 nftables/                ← Módulo 9: nftables (sucessor iptables)
│   ├── 📁 ataques-avancados/       ← Segurança ofensiva
│   ├── 📁 pivoteamento/            ← Riscos DMZ & lateral movement
│   ├── 📁 audit-logs/              ← Monitoramento & auditoria
│   ├── 📁 evolucao/                ← Roadmap visual
│   ├── 📁 glossario/               ← Dicionário técnico
│   ├── 📁 cheat-sheet/             ← Referência rápida de comandos
│   ├── 📁 topicos/                 ← Índice de todos os 24 tópicos práticos
│   ├── 📁 quiz/                    ← Avaliação gamificada
│   ├── 📁 dashboard/               ← Progresso + badges
│   └── 📁 certificado/             ← Certificado de conclusão
│
├── 📄 proxy.ts                     ← Next.js 16 — CSP nonce per-request (Sprint E)
├── 📄 next.config.ts               ← Headers de segurança (HSTS, X-Frame-Options…)
│
└── 📁 src/
    ├── 📁 components/
    │   ├── ClientLayout.tsx         ← Header, nav, dark toggle, busca global
    │   ├── GlobalSearch.tsx         ← Busca global ⌘K (padrão WAI-ARIA combobox)
    │   ├── DeepDiveModal.tsx        ← Modais de aprofundamento (role=dialog + focus trap)
    │   │
    │   └── 📁 ui/                   ← Primitivos
    │       ├── TopologyInteractive.tsx  ← Diagrama de rede clicável (36KB)
    │       ├── CodeBlock.tsx            ← Bloco de código
    │       ├── Steps.tsx                ← Passos numerados
    │       ├── Boxes.tsx                ← Info / Warn / Highlight boxes
    │       ├── FluxoCard.tsx            ← Card de fluxo de dados
    │       ├── LayerBadge.tsx           ← Badge de camada OSI
    │       ├── ProgressBar.tsx          ← Barra de progresso
    │       └── BadgeDisplay.tsx         ← Exibição de conquistas
    │
    ├── 📁 context/
    │   └── BadgeContext.tsx         ← Estado global: badges, progresso, checkpoints
    │
    ├── 📁 data/
    │   ├── searchItems.ts           ← Índice da busca global (44 itens)
    │   └── deepDives.tsx            ← Conteúdo dos 6 modais avançados
    │
    └── 📁 lib/
        ├── seo.ts                   ← SITE_CONFIG, ROUTE_SEO, buildMetadata()
        ├── useFocusTrap.ts          ← Hook a11y — focus trap, ESC, restore focus
        └── utils.ts                 ← cn() helper (clsx + tailwind-merge)
```

**Path alias:** `@/` resolve para `src/`.

---

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento (http://localhost:3000)
npm run dev

# 3. Validação estática (sem testes — obrigatória antes do build)
npm run lint         # tsc --noEmit — typecheck TypeScript
npm run lint:eslint  # ESLint + jsx-a11y — acessibilidade WCAG 2.1 AA
npm run lint:all     # roda os dois em sequência

# 4. Build de produção (28/28 páginas — 21 próprias + assets SEO/PWA)
npm run build

# 5. Rodar em produção
npm run start
```

> **Sem testes.** `npm run lint` (typecheck) e `npm run lint:eslint` (a11y) são as duas validações estáticas obrigatórias antes do build.

---

## 🎨 Sistema de Temas (Dark / Light Mode)

### Como funciona

O tema é controlado pela classe `light` no elemento `<html>`. Por padrão, sem classe = dark mode.

```
<html>           → Dark Mode (padrão)
<html class="light"> → Light Mode
```

### Fluxo completo

```
1. layout.tsx → <script> síncrono lê localStorage ANTES do primeiro paint
2. Se theme === 'light' → adiciona class="light" no <html> (zero FOUC)
3. ClientLayout.tsx → botão ☀️/🌙 chama toggleTheme()
4. toggleTheme() → adiciona/remove class "light" + salva no localStorage
5. globals.css → html.light { } sobrescreve as CSS variables de cor
```

### Variáveis que mudam entre temas

| Token | Dark | Light |
|---|---|---|
| `--color-bg` | `#0d1117` | `#ffffff` |
| `--color-bg-2` | `#161b22` | `#f6f8fa` |
| `--color-bg-3` | `#21262d` | `#eaeef2` |
| `--color-border` | `#30363d` | `#d0d7de` |
| `--color-text` | `#e6edf3` | `#1f2328` |
| `--color-text-2` | `#8b949e` | `#656d76` |

**Cores invariantes** (não mudam entre temas): accent (laranja), camadas OSI, status (ok/warn/err/info).

### Armadilhas conhecidas (já corrigidas)

- ❌ `className="dark"` hardcoded no `<html>` — removido (era inerte)
- ❌ `html.light {}` ausente no CSS — corrigido (era o bug principal)
- ❌ Badge `night-owl` disparava no modo claro — corrigido
- ❌ FOUC ao carregar com tema salvo — corrigido com script anti-FOUC

---

## 🏆 Sistema de Gamificação (Badges)

### Badges disponíveis (17 total)

| Badge | ID | Condição de Desbloqueio |
|---|---|---|
| 🥉 Iniciante | `quiz-beginner` | Completar o quiz pela primeira vez |
| 🥇 Expert | `quiz-expert` | Score ≥ 80% no Quiz |
| 🏆 Mestre | `quiz-master` | Score 100% no Quiz |
| 🗺️ Explorador | `explorer` | Visitar 5+ páginas diferentes |
| 🤿 Mergulhador | `deep-diver` | Visitar todas as páginas de conteúdo |
| 🦉 Coruja Noturna | `night-owl` | **Ativar o Dark Mode** |
| 🔍 Investigador | `searcher` | Usar a busca global (⌘K) |
| 🖧 Topólogo | `topology-pro` | Clicar em 5+ elementos da topologia |
| 🛡️ Firewall Master | `firewall-master` | Configurar todas as regras de firewall |
| 📖 DNS Master | `dns-master` | Configurar zonas direta e reversa |
| 🔒 SSL Master | `ssl-master` | Gerar certificado e configurar HTTPS |
| 🔒 VPN Architect | `vpn-master` | Configurar VPN IPSec com StrongSwan |
| 🚪 Proxy Master | `proxy-master` | Configurar Squid com ACLs |
| 🔑 Knocking Master | `knocking-master` | Configurar Port Knocking |
| 🎓 Graduado | `certificado` | Gerar o certificado de conclusão |
| 🥷 Linux Ninja | `linux-ninja` | Completar todos os desafios |
| 💀 Pivoting Master | `pivoting-master` | Entender os riscos de pivoteamento |

### Como adicionar um novo badge

```typescript
// 1. src/context/BadgeContext.tsx — adicionar ao tipo
export type BadgeId = ... | 'novo-badge';

// 2. Adicionar a definição
export const BADGE_DEFS = {
  'novo-badge': { icon: '🆕', title: 'Novo', desc: 'Condição de desbloqueio' },
};

// 3. No componente, disparar o unlock
const { unlockBadge } = useBadges();
unlockBadge('novo-badge');
```

### Checkpoints de progresso (26 total)

```typescript
// src/context/BadgeContext.tsx
export const ALL_CHECKLIST_IDS = [
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona',
  'proxy-bloqueio', 'web-server', 'dnat-funciona', 'port-knocking',
  'snat-config', 'established-config', 'forward-config', 'audit-log',
  // ... (26 IDs no total)
];
```

---

## 🔍 Busca Global

Ativada com **⌘K** (Mac) ou **Ctrl+K** (Windows/Linux).

Para adicionar um novo item ao índice de busca:

```typescript
// src/data/searchItems.ts
{ 
  id: 'novo-id', 
  title: 'Título', 
  description: 'Descrição curta', 
  category: 'Tópico', // 'Tópico' | 'Glossário' | 'Página' | 'Comando'
  href: '/rota', 
  icon: Terminal 
}
```

---

## 📚 Conteúdo dos Módulos

| # | Módulo | Rota | Tecnologia Linux |
|---|---|---|---|
| 1 | Fundação & IP | `/instalacao` | `ip`, `sysctl`, VirtualBox |
| 2 | NAT & SNAT | `/wan-nat` | `iptables -t nat MASQUERADE` |
| 3 | DNS | `/dns` | BIND9, `named`, zonas |
| 4 | SSL/TLS | `/nginx-ssl` | Nginx, OpenSSL, HTTPS |
| 5 | Proxy | `/lan-proxy` | Squid, ACLs, `dstdomain` |
| 6 | Port Forwarding | `/dnat` | `iptables DNAT PREROUTING` |
| 7 | Port Knocking | `/port-knocking` | `iptables recent`, knockd |
| 8 | VPN IPSec | `/vpn-ipsec` | StrongSwan, IKEv2, ESP |
| 9 | nftables | `/nftables` | Sucessor moderno do iptables |
| + | Ataques Avançados | `/ataques-avancados` | Reconhecimento ofensivo |
| + | Pivoteamento | `/pivoteamento` | Riscos de lateral movement |
| + | Audit Logs | `/audit-logs` | `tcpdump`, syslog, auditd |

---

## 🧠 Deep Dives (Modais Avançados)

Conteúdo técnico aprofundado disponível como modais em `/src/data/deepDives.tsx`:

| ID | Título | Categoria |
|---|---|---|
| `knocking-vs-stateful` | Port Knocking vs Stateful Firewall | Firewall |
| `kernel-hooks` | Os Hooks do Netfilter (Kernel) | Kernel |
| `dns-failure-points` | Por que o DNS é a primeira coisa que quebra? | DNS |
| `squid-https-filtering` | Squid Proxy e o Desafio do HTTPS | Proxy |
| `ipsec-ike-phases` | As Fases do IKE (IPSec) | VPN |
| `nftables-vs-iptables` | nftables vs iptables — Por que migrar? | Firewall |

---

## 🗓️ Workflow Git do Projeto

```bash
# Criar feature/fix em branch separada — NUNCA direto na main
git checkout -b fix/nome-do-fix

# Commit semântico (uma linha só — PowerShell não aceita multilinha em -m)
git commit -m "fix(componente): descricao curta do que foi corrigido"
# ou
git commit -m "feat(modulo): adiciona novo modulo de VLANs"

# Push da branch
git push origin fix/nome-do-fix

# Merge limpo na main (squash = 1 commit por feature)
git checkout main
git merge --squash fix/nome-do-fix
git commit -m "fix(tema): descricao final"
git push origin main

# Limpeza
git branch -D fix/nome-do-fix
git push origin --delete fix/nome-do-fix
```

### Prefixos de commit semântico

| Prefixo | Uso |
|---|---|
| `feat` | Nova funcionalidade ou módulo |
| `fix` | Correção de bug |
| `docs` | Alteração em documentação |
| `style` | CSS, formatação (sem lógica) |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Deps, config, build |

### ⚠️ Atenção no PowerShell

```powershell
# ❌ Abre modo multilinha — o commit fica preso
git commit -m "mensagem
com quebra de linha"

# ✅ Sempre em uma linha só
git commit -m "fix(theme): corrige dark mode"
```

---

## 🚢 Deploy

### Desenvolvimento local

```bash
npm run dev      # http://localhost:3000
```

### Produção (Node.js + PM2)

```bash
npm run build
pm2 start npm --name "workshop-linux" -- run start
```

### Nginx como Proxy Reverso

```nginx
server {
    listen 80;
    server_name workshop.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Checklist de Deploy

- [ ] `npm install` executado sem erros
- [ ] `npm run lint` — zero erros TypeScript
- [ ] `npm run lint:eslint` — zero warnings de acessibilidade
- [ ] `npm run build` — **28/28 páginas** (21 próprias + sitemap + robots + opengraph-image + icon + apple-icon + manifest + `_not-found`)
- [ ] Verificar constantes críticas (`CONTENT_PAGES_COUNT = 16`, `totalTopics = 24`, `checklistItemsCount = 26`)
- [ ] `.env.production` com `NEXT_PUBLIC_SITE_URL=https://seu-dominio.tld`
- [ ] PM2 ou Docker configurado para restart automático
- [ ] SSL/HTTPS configurado no Nginx (HSTS já é emitido pelo `next.config.ts`)

> ⚠️ Após o Sprint E, **todas as rotas próprias são dinâmicas** (`ƒ`) porque o root layout lê `headers()` para aplicar o nonce CSP. Apenas `/sitemap.xml`, `/robots.txt` e `/manifest.webmanifest` permanecem estáticos (não passam pelo proxy via matcher).

---

## 🔒 Segurança da Aplicação

### Aplicação (Sprint D + E)

| Área | Prática Aplicada |
|---|---|
| Variáveis | `NEXT_PUBLIC_` apenas para o que o browser precisa |
| Secrets | Nunca no código — usar `.env` (ignorado no `.gitignore`) |
| Inputs | Sanitização de XSS antes de salvar no `localStorage` |
| Dependências | `npm audit` mensal |
| HSTS | `max-age=63072000; includeSubDomains; preload` via `next.config.ts` |
| Clickjacking | `X-Frame-Options: DENY` + `frame-ancestors 'none'` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Referrer | `strict-origin-when-cross-origin` |
| Permissions | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| Fingerprint | `poweredByHeader: false` (não vaza versão do Next.js) |
| **CSP** | **Nonce per-request via `proxy.ts`** — `script-src 'self' 'nonce-XXX' 'strict-dynamic'`, **sem `'unsafe-inline'`** |

**Como o CSP com nonce funciona (Sprint E):**

1. `proxy.ts` gera um nonce criptográfico (16 bytes base64) por requisição
2. Propaga via request header `x-nonce`
3. `app/layout.tsx` lê com `await headers()` e aplica `nonce={nonce}` nos dois `<script>` inline (anti-FOUC + JSON-LD)
4. A resposta ganha CSP com `'nonce-XXX' 'strict-dynamic'` em `script-src`

> `style-src 'unsafe-inline'` permanece — Tailwind v4 e motion/react injetam `<style>` dinâmicos. O Next.js ainda não propaga nonce para styles.

### Servidor (laboratório real)

| Área | Prática Aplicada |
|---|---|
| Firewall | `iptables -P INPUT DROP` em produção |
| Certificados | Renovação trimestral (ou automática com Certbot) |

---

## ♿ Acessibilidade — WCAG 2.1 AA (Sprint C)

- **Modais (`DeepDiveModal`, `GlobalSearch`):** `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`
- **Focus trap** via `useFocusTrap()` em `src/lib/useFocusTrap.ts` — Tab/Shift+Tab circulam, ESC fecha, foco restaurado ao desmontar
- **GlobalSearch** segue o padrão WAI-ARIA combobox + listbox (`aria-activedescendant`, `aria-expanded`, `aria-controls`)
- **Animações:** `useReducedMotion()` da `motion/react` nos modais + bloco `@media (prefers-reduced-motion: reduce)` global em `globals.css` (WCAG 2.3.3)
- **Foco visível:** `:focus-visible` global com outline `var(--color-accent)` (WCAG 2.4.7)
- **Lint estático:** `eslint-plugin-jsx-a11y` configurado em `eslint.config.mjs` — `npm run lint:eslint` com zero warnings é o alvo

---

## 📱 PWA Lite (Sprint D)

O app é instalável ("Adicionar à tela inicial") via Web App Manifest gerado em `app/manifest.ts`, **sem service worker**. Decisão deliberada — SW adiciona complexidade desproporcional ao escopo educacional.

- `display: 'standalone'` — abre como app sem chrome do browser
- Ícones servidos pelas rotas dinâmicas `/icon` e `/apple-icon` (`next/og` edge runtime, sem PNGs binários)
- `theme_color: '#e05a2b'` (laranja accent) · `background_color: '#0d1117'` (dark)

> ❌ **Não funciona offline.** Service worker foi avaliado e descartado.

---

## 🔎 SEO — Fonte Única (Sprint B)

Toda a metadata vive em **`src/lib/seo.ts`**:

- `SITE_CONFIG` — nome, URL base, keywords globais, theme color
- `ROUTE_SEO` — mapa `{ '/rota': { title, description } }` para as 21 rotas
- `buildMetadata(route)` — helper que gera `Metadata` completo (OG + Twitter + canonical)

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
3. A rota aparece automaticamente no `/sitemap.xml`

**Recursos SEO gerados automaticamente:**

| Recurso | Arquivo |
|---|---|
| `/sitemap.xml` | `app/sitemap.ts` (lê `ROUTE_SEO`) |
| `/robots.txt` | `app/robots.ts` |
| `/opengraph-image` (1200x630) | `app/opengraph-image.tsx` (edge runtime) |
| `/icon` (32x32) | `app/icon.tsx` (edge runtime) |
| `/apple-icon` (180x180) | `app/apple-icon.tsx` (edge runtime) |
| `/manifest.webmanifest` | `app/manifest.ts` |
| JSON-LD `LearningResource` | Injetado no `<head>` do root layout |

**URL base:** define via `NEXT_PUBLIC_SITE_URL` no `.env` (default: `https://workshop-linux.local`).

---

## 🗺️ Roadmap

```
Fase 1 ✅ Concluída — Fundação
  ├── Migração Vite → Next.js App Router
  ├── Sistema de Badges & Busca Global
  ├── 21 rotas com conteúdo técnico
  └── Dark Mode corrigido completamente

Sprint A ✅ Robustez
  ├── try/catch em todos os acessos a localStorage
  ├── next/font (Space Grotesk + JetBrains Mono) — self-hosted, zero CLS
  └── Web Share API funcional com fallback

Sprint B ✅ SEO
  ├── src/lib/seo.ts — fonte única (SITE_CONFIG, ROUTE_SEO, buildMetadata)
  ├── Metadata por rota via layout.tsx Server Component
  ├── sitemap.ts + robots.ts dinâmicos
  ├── opengraph-image + icon + apple-icon via next/og (edge)
  └── JSON-LD LearningResource no root layout

Sprint C ✅ Acessibilidade WCAG 2.1 AA
  ├── Modais: role="dialog" + aria-modal + focus trap (useFocusTrap)
  ├── GlobalSearch: padrão WAI-ARIA combobox + listbox
  ├── prefers-reduced-motion global + useReducedMotion nos modais
  ├── :focus-visible com outline accent
  └── ESLint jsx-a11y como gate de CI

Sprint D ✅ PWA Lite + Headers de Segurança
  ├── manifest.ts — PWA Lite (sem service worker, decisão deliberada)
  ├── Icons dinâmicos via next/og edge runtime
  ├── HSTS, X-Frame-Options, Permissions-Policy via next.config.ts
  └── Boundaries: error.tsx, not-found.tsx, loading.tsx

Sprint E ✅ CSP nonce per-request (Next.js 16)
  ├── middleware.ts → proxy.ts (renomeação Next.js 16)
  ├── Nonce criptográfico propagado via x-nonce header
  ├── script-src 'self' 'nonce-XXX' 'strict-dynamic' — sem 'unsafe-inline'
  └── Trade-off: todas as rotas viram dynamic (aceito em troca de nota A+)

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON se necessário.

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---

## 🛠️ Comandos Úteis de Manutenção

```bash
# Verificar vulnerabilidades nas dependências
npm audit

# Atualizar dependências (verificar breaking changes depois)
npm update

# Limpar cache do Next.js
rm -rf .next

# Ver tamanho do bundle por rota
npm run build # Olhar o output de cada rota

# Listar branches remotas
git branch -r

# Ver histórico limpo de commits
git log --oneline --graph
```

---

## 📖 Documentação Complementar

| Arquivo | Conteúdo |
|---|---|
| `DOCUMENTATION.md` | Manual técnico completo com checklist por módulo |
| `QUICKSTART.md` | Resumo de 1 página para onboarding rápido |
| `README.md` | Este arquivo — referência geral do projeto |

---

<div align="center">

**Workshop Linux — Do Zero ao Firewall Profissional**

Documentação técnica de estudo pessoal · Modelo OSI aplicado na prática

*O terminal não morde, ele ensina.*

</div>
