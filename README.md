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
| Framework | Next.js (App Router) | 16.2.2 |
| Linguagem | TypeScript | ~5.8.2 |
| Estilização | Tailwind CSS | ^4.1.14 |
| Animações | Motion (Framer) | ^12.23.24 |
| Ícones | Lucide React | ^0.546.0 |
| Markdown | react-markdown | ^10.1.0 |
| IA (futuro) | @google/genai | ^1.29.0 |
| Runtime | React | ^19.0.0 |

---

## 📂 Estrutura de Pastas

```
📁 raiz/
├── 📁 app/                        ← App Router (Next.js)
│   ├── globals.css                ← Tokens de tema (dark/light)
│   ├── layout.tsx                 ← Root layout + anti-FOUC script
│   ├── page.tsx                   ← Home com topologia interativa
│   ├── providers.tsx              ← BadgeProvider global
│   │
│   ├── 📁 instalacao/             ← Módulo 1: Fundação & IP
│   ├── 📁 wan-nat/                ← Módulo 2: NAT & SNAT
│   ├── 📁 dns/                    ← Módulo 3: BIND9
│   ├── 📁 nginx-ssl/              ← Módulo 4: Nginx + SSL/TLS
│   ├── 📁 web-server/             ← Módulo 4b: Web Server
│   ├── 📁 lan-proxy/              ← Módulo 5: Squid Proxy
│   ├── 📁 dnat/                   ← Módulo 6: DNAT & Port Forwarding
│   ├── 📁 port-knocking/          ← Módulo 7: Port Knocking
│   ├── 📁 vpn-ipsec/              ← Módulo 8: VPN IPSec
│   ├── 📁 ataques-avancados/      ← Segurança ofensiva
│   ├── 📁 pivoteamento/           ← Riscos DMZ & pivoting
│   ├── 📁 audit-logs/             ← Monitoramento & auditoria
│   ├── 📁 evolucao/               ← Roadmap visual
│   ├── 📁 glossario/              ← Dicionário técnico
│   ├── 📁 cheat-sheet/            ← Referência rápida de comandos
│   ├── 📁 quiz/                   ← Avaliação gamificada
│   ├── 📁 dashboard/              ← Progresso + badges
│   └── 📁 certificado/            ← Certificado de conclusão
│
└── 📁 src/
    ├── 📁 components/
    │   ├── ClientLayout.tsx        ← Header, nav, dark mode toggle, footer
    │   ├── TopologyInteractive.tsx ← Diagrama de rede clicável (36KB)
    │   ├── GlobalSearch.tsx        ← Busca global ⌘K
    │   ├── DeepDiveModal.tsx       ← Modais de aprofundamento técnico
    │   ├── BadgeDisplay.tsx        ← Exibição de conquistas
    │   ├── CodeBlock.tsx           ← Bloco de código com syntax highlight
    │   ├── FluxoCard.tsx           ← Card de fluxo de dados
    │   ├── Steps.tsx               ← Passos numerados
    │   ├── ProgressBar.tsx         ← Barra de progresso
    │   ├── Boxes.tsx               ← Info/Warn/Highlight boxes
    │   └── LayerBadge.tsx          ← Badge de camada OSI
    │
    ├── 📁 context/
    │   └── BadgeContext.tsx        ← Estado global: badges, progresso, visitas
    │
    ├── 📁 data/
    │   ├── searchItems.ts          ← Índice de busca global
    │   └── deepDives.tsx           ← Conteúdo dos modais avançados
    │
    └── 📁 lib/
        └── utils.ts                ← cn() helper (clsx + tailwind-merge)
```

---

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento (http://localhost:3000)
npm run dev

# 3. Verificar TypeScript (lint)
npm run lint

# 4. Build de produção
npm run build

# 5. Rodar em produção
npm run start
```

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
| + | Ataques Avançados | `/ataques-avancados` | Reconhecimento ofensivo |
| + | Pivoteamento | `/pivoteamento` | Riscos de lateral movement |
| + | Audit Logs | `/audit-logs` | `tcpdump`, syslog, auditd |

---

## 🧠 Deep Dives (Modais Avançados)

Conteúdo técnico aprofundado disponível como modais em `/src/data/deepDives.tsx`:

| ID | Título | Categoria |
|---|---|---|
| `knocking-vs-stateful` | Port Knocking vs Stateful Firewall | Firewall |
| `kernel-hooks` | Os 5 Hooks do Netfilter (PREROUTING, INPUT, FORWARD…) | Kernel |
| `dns-failure-points` | Por que o DNS é a primeira coisa que quebra? | DNS |
| `squid-https-filtering` | Squid Proxy e o Desafio do HTTPS | Proxy |
| `ipsec-ike-phases` | As Fases do IKE — Fase 1 (ISAKMP) e Fase 2 (IPSec SA) | VPN |

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
- [ ] `npm run build` — 21 rotas geradas com sucesso
- [ ] `.env.production` configurado no servidor
- [ ] PM2 ou Docker configurado para restart automático
- [ ] SSL/HTTPS configurado no Nginx

---

## 🔒 Segurança da Aplicação

| Área | Prática Aplicada |
|---|---|
| Variáveis | `NEXT_PUBLIC_` apenas para o que o browser precisa |
| Secrets | Nunca no código — usar `.env` (ignorado no `.gitignore`) |
| Inputs | Sanitização de XSS antes de salvar no `localStorage` |
| Servidor | `iptables -P INPUT DROP` em produção |
| Dependências | `npm audit` mensal |
| Certificados | Renovação trimestral (ou automática com Certbot) |

---

## 🗺️ Roadmap

```
Fase 1 ✅ Concluída
  └── Migração Vite → Next.js App Router
  └── Sistema de Badges & Busca Global
  └── 21 rotas com conteúdo técnico
  └── Dark Mode corrigido completamente

Fase 2 🔄 Em andamento
  └── Server Components para redução de bundle
  └── SEO & Metadata API
  └── Performance Core Web Vitals
  └── Otimização TopologyInteractive.tsx (36KB)

Fase 3 🔮 Futuro
  └── Backend Node.js
  └── PostgreSQL / Supabase (substituir LocalStorage)
  └── Autenticação multi-usuário
  └── Suporte a múltiplos workshops simultâneos
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
