# ⚡ Quick Start Guide — Do Zero ao Firewall Profissional

> Resumo de 1 página para devs e novos integrantes. Para referência completa: [`docs/README.md`](docs/README.md).

---

## 🚀 Rodar em 3 Passos

```bash
npm install        # instalar dependências
npm run dev        # http://localhost:3000
npm test           # vitest — testes automatizados
npm run build      # build de produção — 30/30 páginas (23 próprias + assets SEO/PWA)
```

---

## 🔍 Validação (rodar antes de qualquer commit)

```bash
npm run lint         # tsc --noEmit — typecheck TypeScript
npm run lint:eslint  # ESLint + jsx-a11y — acessibilidade WCAG 2.1 AA
npm run lint:all     # roda lint + lint:eslint em sequência
npm test             # vitest — 4 suítes (BadgeContext, ClientLayout, GlobalSearch, SEO)
```

---

## 📂 Estrutura Crítica

| Pasta / Arquivo | O que é |
|---|---|
| `/app` | Rotas e Layouts (App Router) — 23 rotas próprias |
| `/app/globals.css` | Tokens de cor dark/light + classes reutilizáveis |
| `/app/layout.tsx` | Root layout + anti-FOUC + JSON-LD + nonce CSP |
| `/app/providers.tsx` | `<BadgeProvider>` global |
| `/app/error.tsx` · `not-found.tsx` · `loading.tsx` | Boundaries do App Router |
| `/app/manifest.ts` · `sitemap.ts` · `robots.ts` | PWA Lite + SEO automático |
| `/app/opengraph-image.tsx` · `icon.tsx` · `apple-icon.tsx` | Assets dinâmicos via `next/og` |
| `/proxy.ts` | **Next.js 16** — CSP nonce per-request (Sprint E) |
| `/next.config.ts` | Headers de segurança (HSTS, X-Frame-Options, Permissions-Policy…) |
| `/src/components/ui/` | Primitivos: CodeBlock, Steps, Boxes, FluxoCard, LayerBadge, ModuleNav… |
| `/src/components/ClientLayout.tsx` | Header, nav, toggle dark/light, busca global |
| `/src/context/BadgeContext.tsx` | Estado global: badges, progresso, checkpoints |
| `/src/data/quizQuestions.ts` | Perguntas do quiz extraídas (Sprint F) |
| `/src/data/searchItems.ts` | Índice da busca global ⌘K (71 itens) |
| `/src/data/courseOrder.ts` | Sequência de 21 módulos — usada pelo ModuleNav |
| `/src/data/deepDives.tsx` | Conteúdo dos 6 modais avançados |
| `/src/lib/seo.ts` | **Fonte única** — `SITE_CONFIG`, `ROUTE_SEO`, `buildMetadata()` |
| `/src/lib/useFocusTrap.ts` | Hook a11y — focus trap + ESC + restore focus |
| `/src/lib/utils.ts` | Helper `cn()` (clsx + tailwind-merge) |

---

## 🛠️ Tarefas Mais Comuns

**Nova página:**
```
1. Criar /app/nova-rota/page.tsx com 'use client';
2. Criar /app/nova-rota/layout.tsx (Server) exportando buildMetadata('/nova-rota')
3. Adicionar entrada em ROUTE_SEO['/nova-rota'] em src/lib/seo.ts
4. Registrar em ClientLayout.tsx → NAV_LINKS
5. Indexar em searchItems.ts → SEARCH_ITEMS
6. (Opcional) Adicionar à sequência em src/data/courseOrder.ts + inserir <ModuleNav> no rodapé
```

> O `sitemap.xml` é gerado automaticamente a partir de `ROUTE_SEO`.

**Novo badge:**
```
1. Adicionar ID ao tipo BadgeId em BadgeContext.tsx
2. Adicionar definição em BADGE_DEFS
3. Chamar unlockBadge('id') no componente
```

**Novo item de busca:**
```typescript
// src/data/searchItems.ts
{ id: 'id-unico', title: 'Título', description: 'Desc',
  category: 'Tópico', href: '/rota', icon: Terminal }
```

**Estilização:** use classes Tailwind diretamente no JSX. Evite criar arquivos `.css` separados — o Tailwind v4 usa `@theme` em `globals.css` (sem `tailwind.config.js`).

---

## ✅ Checklist de Deploy

- [ ] `npm install` — sem erros
- [ ] `npm run lint` — zero erros TypeScript
- [ ] `npm run lint:eslint` — zero warnings de acessibilidade
- [ ] `npm test` — vitest passando
- [ ] `npm run build` — 33/33 páginas (26 próprias + sitemap + robots + opengraph-image + icon + apple-icon + manifest + _not-found)
- [ ] Verificar constantes críticas (`CONTENT_PAGES_COUNT = 20`, `totalTopics = 44`, `checklistItemsCount = 60`)
- [ ] `.env.production` com `NEXT_PUBLIC_SITE_URL=https://seu-dominio.tld`
- [ ] PM2: `pm2 start npm --name "workshop-linux" -- run start`
- [ ] Nginx como proxy reverso (porta 3000)
- [ ] SSL/HTTPS ativo no Nginx (HSTS já declarado via `next.config.ts`)

> ⚠️ Após o Sprint E, **todas as rotas são dinâmicas** (`ƒ`) porque o root layout lê `headers()` para aplicar o nonce CSP. Trade-off aceito em troca de nota A+ no securityheaders.com.

---

## 🔒 Segurança da Aplicação (Sprint D + E)

**Headers estáticos** (`next.config.ts`):
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY` · `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `poweredByHeader: false` (não vaza versão do Next.js)

**CSP dinâmico** (`proxy.ts` — Next.js 16 renomeou `middleware.ts` → `proxy.ts`):
- Nonce criptográfico (16 bytes base64) gerado por requisição
- Propagado via request header `x-nonce` → lido em `layout.tsx` com `await headers()`
- Aplicado nos dois `<script>` inline (anti-FOUC + JSON-LD)
- `script-src 'self' 'nonce-XXX' 'strict-dynamic'` — **sem `'unsafe-inline'`**

**Regras de ouro:**
1. **Variáveis:** `NEXT_PUBLIC_` apenas para o que o browser precisa ler
2. **Secrets:** NUNCA commitar chaves — usar `.env` (no `.gitignore`)
3. **Inputs:** Sanitizar XSS antes de `localStorage.setItem`
4. **Servidor:** `iptables -P INPUT DROP` em produção (deny-all por padrão)

---

## ♿ Acessibilidade — WCAG 2.1 AA (Sprint C)

- Modais (`DeepDiveModal`, `GlobalSearch`) com `role="dialog"` + `aria-modal` + focus trap (`useFocusTrap()`)
- `useReducedMotion()` + `@media (prefers-reduced-motion: reduce)` global
- `:focus-visible` com outline `var(--color-accent)`
- `eslint-plugin-jsx-a11y` — zero warnings é o alvo

---

## 📱 PWA Lite (Sprint D)

Instalável ("Adicionar à tela inicial") **sem service worker** — decisão deliberada. `display: standalone`, ícones via `next/og` edge runtime, theme color laranja accent.

> **Não funciona offline.** Service worker foi avaliado e descartado (complexidade desproporcional ao escopo educacional).

---

## 🌗 Sistema de Temas

O tema é controlado pela classe `light` no `<html>`. Sem classe = dark (padrão).

```
<html>               → Dark Mode
<html class="light"> → Light Mode
```

Toggle em `ClientLayout.tsx` → `toggleTheme()` → salva em `localStorage`.  
Script síncrono em `layout.tsx` lê o `localStorage` antes do primeiro paint (zero FOUC).

---

## 📡 Arquitetura Simplificada

```
Usuário → Nginx → Next.js Server (3000) → Browser (LocalStorage)
              ↓
         proxy.ts (CSP nonce per-request)
              ↓
         app/layout.tsx (lê headers() + aplica nonce)
```

---

## ⚠️ Armadilhas Conhecidas

**PowerShell — aspas multilinha:**
```powershell
# ❌ Enter dentro de aspas = modo multilinha = commit travado
git commit -m "mensagem
longa"

# ✅ Sempre em uma única linha
git commit -m "fix(tema): descricao curta e direta"
```

**PowerShell — `&&` não funciona:**
```powershell
# ❌ não roda no PowerShell
npm run lint && npm run build

# ✅ rodar separado
npm run lint
npm run build
```

**.gitignore obrigatório:**
```
.next/
next-env.d.ts
tsconfig.tsbuildinfo
node_modules/
.env*
!.env.example
.claude/
```

---

## 💡 Stack Atual

`Next.js 16.2.2` · `React 19` · `TypeScript 5.8` · `Tailwind CSS v4` · `Turbopack` · `motion/react 12` · `Lucide React`

**Sprints concluídos:** A (robustez) · B (SEO) · C (a11y WCAG 2.1 AA) · D (PWA Lite + headers) · E (CSP nonce) · G (a11y Topology) · F (code splitting) · M (cyber tokens) · T₀/T₁ (testes) · J (export/import) · I.1 (WireGuard) · I.2 (Fail2ban) · Polish (module-accent) · T₂ (E2E Playwright) · R (realismo) · P (Diamond Polish) · L (Legacy Gold — TroubleshootingCard, zona reversa, FTP DNAT, xt_recent, dhparam, /offline) · SIGMA (Elite Lab — /laboratorio, /proxmox, Certbot, badges, 56 checkpoints) · SIGMA Fase 3 (badge 🔬 sigma-master, +6 busca, +5 tópicos, totalTopics 43) · W (Windows-to-Linux — WindowsComparisonBox, Terminal do Zero, Mindset SysAdmin, tabela equivalências) · W2 (RosettaStone 25 comandos, resgate-gold.sh, badge 🧭 explorador-mundos, FluxoCard OSI, seção certificado — 60 checkpoints, 25 badges) · Polish (ModuleNav Anterior/Próximo nas 20 páginas, courseOrder.ts 21 módulos, labels certbot nginx-ssl) · **Audit Fix (deep-diver 18→20, totalTopics 45→44, linux-ninja 15→45, .env.example limpo, comentários sincronizados)**
