# Workshop Linux — Do Zero ao Firewall Profissional

Plataforma educacional interativa em português que ensina segurança de redes Linux (iptables, NAT, DNS, SSL, VPN, etc.) de forma gamificada. Laboratório real com três zonas: WAN, DMZ e LAN.

**Next.js 16.2.2** · **React 19** · **TypeScript 5.8** · **Tailwind CSS v4** · **Turbopack**

---

## Comandos

```bash
npm run dev      # servidor local em http://localhost:3000
npm run lint     # tsc --noEmit — SEMPRE rodar antes do build
npm run build    # valida TypeScript + gera 23 rotas estáticas
npm run start    # servidor de produção na porta 3000
```

> Não há testes. `npm run lint` é a única validação estática configurada.

---

## Estrutura de Pastas

```
app/                        # App Router — cada pasta = 1 rota pública
  layout.tsx                # root layout + script anti-FOUC (lê localStorage antes do React hidratar)
  globals.css               # tokens de cor dark/light — @theme block, sem tailwind.config.js
  providers.tsx             # wraps tree em <BadgeProvider>
  [rota]/page.tsx           # 23 rotas — todas 'use client'

src/
  components/
    ClientLayout.tsx        # navbar sticky, menu mobile, toggle de tema, busca global
    TopologyInteractive.tsx # diagrama de rede interativo (36KB — maior arquivo)
  context/
    BadgeContext.tsx        # fonte única de verdade para todo o progresso do usuário
  data/
    searchItems.ts          # 44 itens indexados para GlobalSearch (CMD+K / Ctrl+K)
    deepDives.tsx           # conteúdo dos modais de aprofundamento (6 deep dives)
  components/ui/            # primitivos: CodeBlock, Steps, Boxes, FluxoCard, LayerBadge
  lib/utils.ts              # re-exporta cn() — clsx + tailwind-merge
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
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | 16 (exclui home/quiz/dashboard/certificado/topicos) |
| `totalTopics` | `app/dashboard/page.tsx` | 24 |
| `checklistItemsCount` | `app/dashboard/page.tsx` | 26 (deve igualar ALL_CHECKLIST_IDS.length) |
| Texto na Home | `app/page.tsx` | "24 topicos praticos" |

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

- Space Grotesk — fonte sans-serif do corpo
- JetBrains Mono — fonte monospace e codigo
- Lucide React — todos os icones
- motion/react (Framer Motion v12) — animacoes

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

## Checklist Antes de Qualquer Commit

1. `npm run lint` — zero erros TypeScript
2. `npm run build` — 23 rotas como Static
3. Verificar consistência dos números da tabela de constantes

---

## Roadmap

- Sprint 4A (proximo): PWA — manifest.json, service worker, modo offline
- Sprint 4B: SEO — sitemap.ts, robots.ts, Schema.org, OG image
- Sprint 4C: Acessibilidade — WCAG 2.1, prefers-reduced-motion
- Fase 3 (futuro): Backend + Supabase substituindo localStorage

Para detalhes completos: DOCUMENTATION.md (v2.0) · QUICKSTART.md · README.md
