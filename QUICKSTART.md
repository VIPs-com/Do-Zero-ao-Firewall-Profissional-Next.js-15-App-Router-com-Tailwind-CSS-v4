# ⚡ Quick Start Guide — Do Zero ao Firewall Profissional

> Resumo de 1 página para devs e novos integrantes. Para referência completa: `DOCUMENTATION.md`.

---

## 🚀 Rodar em 3 Passos

```bash
npm install        # instalar dependências
npm run dev        # http://localhost:3000
npm run build      # build de produção (valida 21 rotas)
```

---

## 📂 Estrutura Crítica

| Pasta / Arquivo | O que é |
|---|---|
| `/app` | Rotas e Layouts (App Router) — cada pasta = 1 URL |
| `/app/globals.css` | Tokens de cor dark/light + componentes CSS |
| `/app/layout.tsx` | Root layout + script anti-FOUC do tema |
| `/src/components` | UI: CodeBlock, Steps, TopologyInteractive... |
| `/src/components/ClientLayout.tsx` | Header, nav, toggle dark/light, footer |
| `/src/context/BadgeContext.tsx` | Estado global: badges, progresso, checkpoints |
| `/src/data/searchItems.ts` | Índice da busca global ⌘K |
| `/src/data/deepDives.tsx` | Conteúdo dos modais avançados |
| `/src/lib/utils.ts` | Helper `cn()` (clsx + tailwind-merge) |

---

## 🛠️ Tarefas Mais Comuns

**Nova página:**
```
1. Criar /app/nova-rota/page.tsx
2. Adicionar 'use client'; se precisar de hooks
3. Registrar em ClientLayout.tsx → NAV_LINKS
4. Indexar em searchItems.ts → SEARCH_ITEMS
```

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

**Estilização:** use classes Tailwind diretamente no JSX. Evite criar arquivos `.css` separados.

---

## ✅ Checklist de Deploy

- [ ] `npm install` — sem erros
- [ ] `npm run lint` — zero erros TypeScript
- [ ] `npm run build` — 21 rotas geradas com `○ (Static)`
- [ ] `.env.production` configurado no servidor
- [ ] PM2: `pm2 start npm --name "workshop-linux" -- run start`
- [ ] Nginx configurado como proxy reverso (porta 3000)
- [ ] SSL/HTTPS ativo no Nginx

---

## 🔒 Regras de Ouro (Segurança)

1. **Variáveis:** `NEXT_PUBLIC_` apenas para o que o browser precisa ler
2. **Secrets:** NUNCA commitar chaves privadas — usar `.env` (no `.gitignore`)
3. **Inputs:** Sanitizar XSS antes de qualquer `localStorage.setItem`
4. **Servidor:** `iptables -P INPUT DROP` em produção (deny-all por padrão)

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

**.gitignore obrigatório para Next.js:**
```
.next/
next-env.d.ts
tsconfig.tsbuildinfo
node_modules/
.env*
!.env.example
```

---

## 💡 Stack Atual

`Next.js 16.2.2` · `React 19` · `TypeScript 5.8` · `Tailwind CSS v4` · `Turbopack`
