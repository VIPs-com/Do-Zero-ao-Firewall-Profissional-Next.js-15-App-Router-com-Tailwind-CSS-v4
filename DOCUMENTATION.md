# 📖 Documentação Oficial — Do Zero ao Firewall Profissional

> **Versão:** 3.0 (pós-Sprint E) · **Stack:** Next.js 16 · Tailwind CSS v4 · TypeScript 5.8  
> Este documento é o ponto único de verdade do projeto. Serve como manual de onboarding, guia de desenvolvimento, referência técnica do laboratório e roadmap estratégico.  
> *Se você chegou agora na equipe, comece pela Seção 1. Se é um dev voltando após um tempo, vá direto à Seção 3.*

---

## Índice

1. [Boas-Vindas & Visão do Projeto](#1-boas-vindas--visão-do-projeto)
2. [Início Rápido — Rodar em 3 Minutos](#2-início-rápido--rodar-em-3-minutos)
3. [Arquitetura & Estrutura de Pastas](#3-arquitetura--estrutura-de-pastas)
4. [Sistema de Temas (Dark / Light Mode)](#4-sistema-de-temas-dark--light-mode)
5. [Sistema de Gamificação — Badges & Progresso](#5-sistema-de-gamificação--badges--progresso)
6. [Busca Global](#6-busca-global)
7. [Como Desenvolver — Tarefas Comuns](#7-como-desenvolver--tarefas-comuns)
8. [Módulos do Laboratório Linux](#8-módulos-do-laboratório-linux)
9. [SEO — Fonte Única (Sprint B)](#9-seo--fonte-única-sprint-b)
10. [Acessibilidade — WCAG 2.1 AA (Sprint C)](#10-acessibilidade--wcag-21-aa-sprint-c)
11. [PWA Lite & Boundaries (Sprint D)](#11-pwa-lite--boundaries-sprint-d)
12. [Segurança — Headers e CSP Nonce (Sprint D + E)](#12-segurança--headers-e-csp-nonce-sprint-d--e)
13. [Deploy & Infraestrutura](#13-deploy--infraestrutura)
14. [Manutenção Preventiva](#14-manutenção-preventiva)
15. [Workflow Git do Projeto](#15-workflow-git-do-projeto)
16. [Roadmap Técnico](#16-roadmap-técnico)
17. [Glossário Técnico](#17-glossário-técnico)
18. [Apresentação Executiva — Slide Deck](#18-apresentação-executiva--slide-deck)

---

## 1. Boas-Vindas & Visão do Projeto

### O que é esse projeto?

Uma **plataforma educacional interativa** que ensina segurança de redes e firewalls Linux do zero ao nível profissional. O usuário constrói um laboratório real com três zonas de segurança (WAN, DMZ e LAN), executando comandos reais em Ubuntu Server — não é simulação.

### Qual é a missão?

Democratizar o conhecimento de infraestrutura Linux através de uma plataforma gamificada, de alta performance e com foco no Modelo OSI aplicado na prática.

### Para quem serve?

| Perfil | O que encontra aqui |
|---|---|
| **Aluno/Estudante** | 8 módulos técnicos progressivos com lab real |
| **Dev Frontend** | Componentes Next.js, sistema de badges, busca global |
| **Dev Full-stack** | Arquitetura, deploy, segurança da aplicação |
| **Novo integrante** | Este documento completo + QUICKSTART.md |

### Topologia do laboratório

```
┌─────────────────────────────────────────────────────┐
│                   INTERNET (WAN)                    │
│               eth0 · IP Público                     │
└───────────────────────┬─────────────────────────────┘
                        │
               ┌────────▼────────┐
               │   🔥 FIREWALL   │  ← iptables · NAT
               │  Ubuntu Server  │     Port Knocking
               │ eth0·eth1·eth2  │     StrongSwan VPN
               └──┬──────────┬──┘
                  │          │
     ┌────────────▼──┐  ┌────▼─────────────┐
     │  🖥️  DMZ Zone │  │  💻  LAN Zone    │
     │192.168.56.0/24│  │ 192.168.57.0/24  │
     │               │  │                  │
     │  Web Server   │  │    Cliente       │
     │  Nginx + SSL  │  │  Squid Proxy     │
     │  BIND9 DNS    │  │                  │
     └───────────────┘  └──────────────────┘
```

---

## 2. Início Rápido — Rodar em 3 Minutos

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev
# Acesse: http://localhost:3000

# 3. Checar TypeScript (zero erros = OK)
npm run lint

# 4. Build de produção
npm run build

# 5. Iniciar servidor de produção
npm run start
```

### Scripts disponíveis

| Script | Comando | O que faz |
|---|---|---|
| `dev` | `next dev --port=3000` | Servidor local com hot-reload (Turbopack) |
| `build` | `next build` | Compila + gera **28/28** páginas (21 próprias + assets SEO/PWA) |
| `start` | `next start --port=3000` | Servidor de produção |
| `lint` | `tsc --noEmit` | Valida TypeScript sem gerar arquivos |
| `lint:eslint` | `eslint app src` | ESLint + `jsx-a11y` — acessibilidade WCAG 2.1 AA |
| `lint:all` | `tsc --noEmit && eslint app src` | Roda lint + lint:eslint em sequência |

> **Sem testes.** `npm run lint` (typecheck) e `npm run lint:eslint` (a11y) são as duas validações estáticas obrigatórias antes do build.

> ⚠️ Após o Sprint E, **todas as rotas próprias são dinâmicas** (`ƒ`) porque o root layout lê `headers()` para aplicar o nonce CSP. Apenas `/sitemap.xml`, `/robots.txt` e `/manifest.webmanifest` permanecem estáticos.

### Stack completa

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
| A11y Lint | eslint-plugin-jsx-a11y | (flat config) |

---

## 3. Arquitetura & Estrutura de Pastas

### Diagrama de sistema

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

### Estrutura de pastas comentada

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
│   ├── 📁 topicos/                  ← Índice dos 24 tópicos práticos
│   ├── 📁 quiz/                     ← Avaliação gamificada
│   ├── 📁 dashboard/                ← Progresso + badges desbloqueados
│   └── 📁 certificado/              ← Certificado de conclusão
│
├── 📄 proxy.ts                      ← Sprint E: CSP nonce per-request
├── 📄 next.config.ts                ← Headers de segurança estáticos
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
    │   └── BadgeContext.tsx          ← Estado global: badges, visitas, checkpoints
    │
    ├── 📁 data/
    │   ├── searchItems.ts            ← Índice da busca global (44 itens)
    │   └── deepDives.tsx             ← Conteúdo dos 6 modais avançados
    │
    └── 📁 lib/
        ├── seo.ts                    ← SITE_CONFIG, ROUTE_SEO, buildMetadata()
        ├── useFocusTrap.ts           ← Hook a11y: focus trap, ESC, restore focus
        └── utils.ts                  ← cn() helper (clsx + tailwind-merge)
```

**Path alias:** `@/` resolve para `src/`. Todos os imports de `src/` usam esse alias.

### Constantes críticas — manter em sincronia

| Constante | Arquivo | Valor |
|-----------|---------|-------|
| `CONTENT_PAGES_COUNT` | `src/context/BadgeContext.tsx` | **16** (exclui home/quiz/dashboard/certificado/topicos) |
| `totalTopics` | `app/dashboard/page.tsx` | **24** |
| `checklistItemsCount` | `app/dashboard/page.tsx` | **26** (igual a `ALL_CHECKLIST_IDS.length`) |
| Texto na Home | `app/page.tsx` | "24 tópicos práticos" |

Bugs surgem quando esses valores divergem — sempre revalidar ao alterar conteúdo.

---

## 4. Sistema de Temas (Dark / Light Mode)

### Regra fundamental

```
<html>               → Dark Mode (padrão — sem classe)
<html class="light"> → Light Mode
```

O Tailwind CSS v4 usa `@theme` para definir tokens. O bloco `html.light {}` no `globals.css` sobrescreve apenas as variáveis que mudam.

### Fluxo completo (sem FOUC)

```
1. layout.tsx carrega
      ↓
2. <script> síncrono no <head> lê localStorage ANTES do primeiro paint
      ↓
3. Se theme === 'light' → adiciona class="light" no <html> imediatamente
      ↓
4. React hidrata → ClientLayout lê classList do DOM para estado inicial
      ↓
5. Usuário clica ☀️/🌙 → toggleTheme() → adiciona/remove 'light' + salva localStorage
      ↓
6. globals.css → html.light { } entra em efeito via CSS variables
```

### Tokens de cor por tema

| Token CSS | Dark | Light | Muda? |
|---|---|---|---|
| `--color-bg` | `#0d1117` | `#ffffff` | ✅ |
| `--color-bg-2` | `#161b22` | `#f6f8fa` | ✅ |
| `--color-bg-3` | `#21262d` | `#eaeef2` | ✅ |
| `--color-border` | `#30363d` | `#d0d7de` | ✅ |
| `--color-border-2` | `#484f58` | `#afb8c1` | ✅ |
| `--color-text` | `#e6edf3` | `#1f2328` | ✅ |
| `--color-text-2` | `#8b949e` | `#656d76` | ✅ |
| `--color-text-3` | `#7d8590` | `#818b98` | ✅ |
| `--color-accent` | `#e05a2b` | `#e05a2b` | ❌ invariante |
| `--color-ok/warn/err/info` | — | — | ❌ invariante |
| Camadas OSI (layer-1 a 7) | — | — | ❌ invariante |

### ⚠️ Bugs históricos (já corrigidos — não repetir)

| Bug | Causa | Correção aplicada |
|---|---|---|
| Tema não mudava visualmente | `html.light {}` ausente no CSS | Bloco adicionado ao `globals.css` |
| Flash branco ao carregar | `useEffect` rodava tarde demais | Script síncrono no `<head>` |
| Ícone Sol/Lua incorreto | `useState(true)` sem ler o DOM | Estado derivado de `classList` |
| Badge 🦉 no momento errado | `unlockBadge` no bloco `else` invertido | Movido para ativação do dark mode |

---

## 5. Sistema de Gamificação — Badges & Progresso

### Arquivo central: `src/context/BadgeContext.tsx`

Gerencia três dimensões de progresso:
- **Badges** — conquistas desbloqueáveis (17 total)
- **Páginas visitadas** — para badges de exploração
- **Checkpoints** — validações técnicas concluídas (26 total)

### Tabela de badges

| Ícone | Título | ID | Como desbloquear |
|---|---|---|---|
| 🥉 | Iniciante | `quiz-beginner` | Completar o quiz pela 1ª vez |
| 🥇 | Expert | `quiz-expert` | Score ≥ 80% no quiz |
| 🏆 | Mestre | `quiz-master` | Score 100% no quiz |
| 🗺️ | Explorador | `explorer` | Visitar 5+ páginas |
| 🤿 | Mergulhador | `deep-diver` | Visitar todas as páginas de conteúdo |
| 🦉 | Coruja Noturna | `night-owl` | **Ativar o dark mode** |
| 🔍 | Investigador | `searcher` | Usar a busca global (⌘K) |
| 🖧 | Topólogo | `topology-pro` | Clicar em 5+ elementos da topologia |
| 🛡️ | Firewall Master | `firewall-master` | Configurar todas as regras de firewall |
| 📖 | DNS Master | `dns-master` | Configurar zonas direta e reversa |
| 🔒 | SSL Master | `ssl-master` | Gerar certificado e configurar HTTPS |
| 🔒 | VPN Architect | `vpn-master` | Configurar VPN IPSec com StrongSwan |
| 🚪 | Proxy Master | `proxy-master` | Configurar Squid com ACLs |
| 🔑 | Knocking Master | `knocking-master` | Configurar Port Knocking |
| 🎓 | Graduado | `certificado` | Gerar o certificado de conclusão |
| 🥷 | Linux Ninja | `linux-ninja` | Completar todos os desafios |
| 💀 | Pivoting Master | `pivoting-master` | Entender os riscos de pivoteamento |

### Como adicionar um novo badge

```typescript
// Passo 1 — src/context/BadgeContext.tsx: adicionar ao tipo
export type BadgeId = ... | 'meu-badge';

// Passo 2 — Adicionar a definição no BADGE_DEFS
'meu-badge': {
  icon: '🆕',
  title: 'Nome do Badge',
  desc: 'Condição clara de desbloqueio'
},

// Passo 3 — No componente que dispara o unlock
const { unlockBadge } = useBadges();
unlockBadge('meu-badge');
```

### Exemplo completo de componente com badge

```tsx
'use client';
import { useBadges } from '@/context/BadgeContext';

export default function MeuComponente() {
  const { unlockBadge } = useBadges();

  const handleDesafioCompleto = () => {
    // lógica do desafio...
    unlockBadge('firewall-master');
  };

  return (
    <button onClick={handleDesafioCompleto}>
      Marcar como concluído
    </button>
  );
}
```

### Checkpoints de validação (26 IDs)

```typescript
// src/context/BadgeContext.tsx — ALL_CHECKLIST_IDS
[
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona',
  'proxy-bloqueio', 'web-server', 'dnat-funciona', 'port-knocking',
  'snat-config', 'established-config', 'forward-config', 'audit-log',
  'dns-recursivo', 'dns-reverso', 'dns-firewall', 'dnat-web',
  'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping',
  'vpn-psk', 'pivoting-risk'
]
```

---

## 6. Busca Global

**Ativação:** `⌘K` (Mac) ou `Ctrl+K` (Windows/Linux)

**Arquivo:** `src/data/searchItems.ts`

**Categorias disponíveis:** `'Tópico'` | `'Glossário'` | `'Página'` | `'Comando'`

### Como adicionar item à busca

```typescript
// src/data/searchItems.ts — adicionar ao array SEARCH_ITEMS
{
  id: 'id-unico',          // string único
  title: 'Título visível',
  description: 'Descrição curta que aparece nos resultados',
  category: 'Tópico',      // uma das 4 categorias
  href: '/rota-da-pagina',
  icon: Terminal,          // ícone do lucide-react
}
```

### Deep Dives — Modais avançados

Arquivo: `src/data/deepDives.tsx`

| ID | Título | Categoria |
|---|---|---|
| `knocking-vs-stateful` | Port Knocking vs Stateful Firewall | Firewall |
| `kernel-hooks` | Os Hooks do Netfilter (Kernel) | Kernel |
| `dns-failure-points` | Por que o DNS é a primeira coisa que quebra? | DNS |
| `squid-https-filtering` | Squid Proxy e o Desafio do HTTPS | Proxy |
| `ipsec-ike-phases` | As Fases do IKE (IPSec) | VPN |
| `nftables-vs-iptables` | nftables vs iptables — Por que migrar? | Firewall |

Os modais seguem o padrão a11y (`role="dialog"` + focus trap) — veja Seção 10.

---

## 7. Como Desenvolver — Tarefas Comuns

### Adicionar uma nova página

```
1. Criar pasta:  /app/nova-rota/
2. Criar arquivo: /app/nova-rota/page.tsx
3. Adicionar 'use client'; se precisar de hooks/interatividade
4. Registrar no menu: src/components/ClientLayout.tsx → NAV_LINKS
5. Indexar na busca: src/data/searchItems.ts → SEARCH_ITEMS
```

```tsx
// /app/nova-rota/page.tsx — estrutura mínima
'use client';

export default function NovaRota() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="section-title">Título</h1>
      <p className="text-text-2">Conteúdo</p>
    </div>
  );
}
```

### Adicionar ao menu de navegação

```typescript
// src/components/ClientLayout.tsx — array NAV_LINKS
const NAV_LINKS = [
  // ... links existentes
  { href: '/nova-rota', label: 'Nova Rota', icon: '🔧' },
];
```

### Usar componentes existentes

```tsx
import { CodeBlock }    from '@/components/ui/CodeBlock';
import { Steps }        from '@/components/ui/Steps';
import { ProgressBar }  from '@/components/ui/ProgressBar';
import { FluxoCard }    from '@/components/ui/FluxoCard';
import { LayerBadge }   from '@/components/ui/LayerBadge';

// Classes de box (definidas em globals.css)
<div className="info-box">     Informação azul      </div>
<div className="warn-box">     Aviso amarelo         </div>
<div className="highlight-box"> Destaque laranja     </div>
```

### Variáveis de ambiente

```bash
# .env.local (desenvolvimento — nunca commitar)
NEXT_PUBLIC_API_URL=https://api.meuprojeto.com   # Visível no browser
STRIPE_SECRET_KEY=sk_test_...                     # NUNCA no cliente

# .env.example (commitar — serve como modelo)
NEXT_PUBLIC_API_URL=
```

```tsx
// No componente — uso correto
const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // ✅ funciona no browser
const secret = process.env.STRIPE_SECRET_KEY;    // ✅ undefined no browser (seguro)
```

### Prevenção de XSS em inputs

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Remove tags HTML antes de salvar no localStorage
  const sanitized = e.target.value.replace(/<[^>]*>?/gm, '').trim();
  localStorage.setItem('chave', sanitized);
};
```

---

## 8. Módulos do Laboratório Linux

*Para cada módulo: Conceito → Por que importa → Exemplo real → Checklist → Erros comuns*

---

### 🚀 Módulo 1 — Instalação & Fundação

**Conceito:** O laboratório simula uma rede corporativa real com três zonas (WAN, DMZ, LAN). Antes de configurar qualquer serviço, a fundação de IP e roteamento precisa estar sólida.

**Por que importa:** Sem roteamento ativo no kernel, o Firewall não encaminha pacotes — vira apenas um host comum.

**Exemplo prático:**
```bash
# Habilitar roteamento de pacotes no kernel Linux
sysctl -w net.ipv4.ip_forward=1

# Tornar permanente (reinicializações)
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

**Checklist de validação:**
- [ ] O Firewall pinga o Gateway da WAN?
- [ ] O Firewall pinga o Web Server na DMZ?
- [ ] O Firewall pinga o Cliente na LAN?

**Erros comuns:**
- **Gateway ausente:** VM sem gateway não sabe como sair da própria rede.
- **Interfaces trocadas:** Confundir `eth0` (WAN) com `eth1` (LAN) no VirtualBox gera caos silencioso.

---

### 🌐 Módulo 2 — WAN & NAT

**Conceito:** O NAT (Network Address Translation) permite que a rede interna inteira navegue na internet usando um único IP público. O Masquerade é o NAT dinâmico — ideal quando o IP da WAN muda.

**Por que importa:** IPs privados (192.168.x.x, 10.x.x.x) não são roteáveis na internet. Sem NAT, a rede interna fica isolada.

**Exemplo prático:**
```bash
# SNAT dinâmico — substitui o IP de origem pelo IP da eth0
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Listar regras NAT para validar
iptables -t nat -L -n -v
```

**Checklist de validação:**
- [ ] O cliente da LAN consegue `ping 8.8.8.8`?
- [ ] A regra aparece no `iptables -t nat -L -n`?

**Erros comuns:**
- **Masquerade na interface errada:** Aplicar na `eth1` (LAN) em vez da `eth0` (WAN).
- **FORWARD ausente:** O NAT traduz o IP, mas a chain FORWARD ainda precisa autorizar a passagem entre interfaces.

---

### 📖 Módulo 3 — DNS BIND9

**Conceito:** O DNS traduz nomes amigáveis (`www.workshop.local`) em IPs que as máquinas entendem. O BIND9 é o servidor DNS padrão em ambientes Linux corporativos.

**Por que importa:** Se o DNS falha, a rede "para" mesmo com a internet funcionando. É o serviço mais crítico da infraestrutura — e o primeiro a ser culpado por qualquer problema.

**Exemplo prático:**
```bash
# Consultar zona direta
dig @192.168.56.100 www.workshop.local

# Verificar sintaxe do arquivo de configuração
named-checkconf

# Verificar arquivo de zona
named-checkzone workshop.local /etc/bind/db.workshop.local
```

**Checklist de validação:**
- [ ] O `named-checkconf` não retorna erros?
- [ ] A zona reversa resolve o IP de volta para o nome?
- [ ] O cliente da LAN resolve `www.workshop.local` via `dig`?

**Erros comuns:**
- **Ponto final ausente:** `ns1.workshop.local` sem ponto no arquivo de zona causa resolução incorreta.
- **Serial não incrementado:** Alterar a zona sem aumentar o serial faz os resolvers ignorarem a atualização.
- **Porta 53 bloqueada:** Verificar se o iptables não está bloqueando UDP/TCP 53 no Firewall.

---

### 🔒 Módulo 4 — Nginx & SSL/TLS

**Conceito:** O SSL/TLS criptografa o canal entre navegador e servidor. O Nginx atua como servidor web e termina a conexão HTTPS antes de repassar ao backend.

**Por que importa:** HTTPS é obrigatório. Sem ele, senhas e dados trafegam em texto puro — visíveis para qualquer um na mesma rede Wi-Fi.

**Exemplo prático:**
```bash
# Gerar chave privada e CSR (Certificate Signing Request)
openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr

# Gerar certificado autoassinado (para laboratório)
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# Permissão correta na chave privada — apenas root lê
chmod 600 server.key
```

**Checklist de validação:**
- [ ] O cadeado aparece no navegador (mesmo que autoassinado)?
- [ ] O Nginx redireciona automaticamente porta 80 → 443?
- [ ] `curl -I https://www.workshop.local` retorna 200?

**Erros comuns:**
- **Permissão errada na chave:** `.key` deve ser `600` — qualquer permissão maior é risco de segurança.
- **Mixed Content:** Site HTTPS que carrega imagens via HTTP exibe cadeado amarelo/quebrado.

---

### 🚪 Módulo 5 — Squid Proxy

**Conceito:** O Proxy é um intermediário entre o usuário e a internet. Recebe a requisição, aplica as ACLs (listas de controle de acesso) e decide se permite ou bloqueia.

**Por que importa:** Empresas precisam controlar o acesso para evitar perda de produtividade, infecções por malware e vazamento de dados.

**Exemplo prático:**
```bash
# squid.conf — ACL de bloqueio por arquivo de lista
acl negados url_regex -i "/etc/squid/negados.txt"
http_access deny negados

# squid.conf — bloqueio por domínio (melhor para HTTPS)
acl redes_sociais dstdomain .facebook.com .instagram.com .tiktok.com
http_access deny redes_sociais

# Monitorar acessos em tempo real
tail -f /var/log/squid/access.log
```

**Checklist de validação:**
- [ ] Sites em `negados.txt` retornam página de bloqueio?
- [ ] O log mostra os acessos em tempo real?
- [ ] O cliente da LAN está configurado para usar o proxy?

**Erros comuns:**
- **Ordem das ACLs:** `http_access allow all` antes dos bloqueios anula tudo — ordem importa.
- **HTTPS e url_regex:** O Squid sem SSL Bump não vê a URL completa de sites HTTPS, apenas o domínio. Use `dstdomain`.

---

### 🎯 Módulo 6 — DNAT & Port Forwarding

**Conceito:** O DNAT (Destination NAT) redireciona pacotes que chegam na WAN para servidores dentro da rede. É como dizer "quem bater na porta 80 da minha casa, mando para o servidor interno".

**Por que importa:** Permite hospedar serviços (web, e-mail, VPN) atrás de um firewall sem expor os servidores diretamente.

**Exemplo prático:**
```bash
# Redirecionar porta 80 da WAN para o Web Server na DMZ
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 \
  -j DNAT --to-destination 192.168.56.120

# Autorizar o pacote atravessar o Firewall (OBRIGATÓRIO)
iptables -A FORWARD -p tcp -d 192.168.56.120 --dport 80 -j ACCEPT
```

**Checklist de validação:**
- [ ] Acesso ao IP da WAN na porta 80 chega no servidor interno?
- [ ] A regra FORWARD correspondente existe?

**Erros comuns:**
- **Esquecer o FORWARD:** O DNAT muda o destino, mas o filtro FORWARD ainda bloqueia o pacote.
- **Gateway do servidor interno:** O servidor na DMZ deve usar o Firewall como gateway, senão a resposta de retorno não sabe por onde voltar.

---

### 🔑 Módulo 7 — Port Knocking

**Conceito:** Técnica de segurança por obscuridade. Todas as portas ficam `filtered` (invisíveis). Uma sequência secreta de "batidas" em portas específicas abre temporariamente o acesso.

**Por que importa:** Um servidor SSH com Port Knocking é invisível para scanners automáticos. Se o atacante não sabe a sequência, não sabe nem que existe um SSH.

**Exemplo prático:**
```bash
# Sequência: bater em 1000, 2000, 3000 — abre SSH por 10 segundos
iptables -A INPUT -p tcp --dport 22 -m recent --rcheck --name FASE3 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -m recent --rcheck --name FASE2 \
  -m recent --name FASE3 --set -j DROP
iptables -A INPUT -p tcp --dport 2000 -m recent --rcheck --name FASE1 \
  -m recent --name FASE2 --set -j DROP
iptables -A INPUT -p tcp --dport 1000 -m recent --name FASE1 --set -j DROP

# Validar — deve mostrar "filtered"
nmap -p 22 IP_DO_FIREWALL
```

**Checklist de validação:**
- [ ] `nmap` mostra a porta 22 como `filtered`?
- [ ] Após a sequência correta, o SSH conecta em menos de 10s?

**Erros comuns:**
- **Timeout curto demais:** Bater as portas lentamente faz o sistema esquecer a etapa anterior.
- **Regra ESTABLISHED ausente:** Sem ela, a conexão cai quando o timer de abertura expira.

---

### 🛡️ Módulo 8 — VPN IPSec

**Conceito:** Cria um túnel criptografado entre dois Firewalls através da internet, interligando redes distantes como se fossem a mesma rede física.

**Por que importa:** É o padrão corporativo para conectar filiais (Site-to-Site) e para acesso remoto seguro de funcionários.

**Exemplo prático:**
```bash
# Verificar status do túnel VPN (StrongSwan)
ipsec statusall

# Status esperado para túnel ativo:
# ESTABLISHED — Fase 1 OK (canal de negociação)
# INSTALLED    — Fase 2 OK (túnel de dados ativo)

# Testar conectividade entre redes
ping -c 4 10.0.0.1   # IP na rede da Filial a partir da Matriz
```

**Checklist de validação:**
- [ ] `ipsec statusall` mostra `ESTABLISHED` e `INSTALLED`?
- [ ] A rede da Matriz pinga a rede da Filial?
- [ ] As portas UDP 500 e 4500 estão abertas no Firewall?

**Erros comuns:**
- **PSK diferente nos dois lados:** A chave pré-compartilhada deve ser idêntica — qualquer diferença impede a Fase 1.
- **Firewall bloqueando UDP 500/4500:** O IKE (negociação de chaves) usa essas portas. Sem elas, o túnel nunca sobe.

---

### 🧱 Módulo 9 — nftables (sucessor moderno do iptables)

**Conceito:** `nftables` unifica `iptables`, `ip6tables`, `arptables` e `ebtables` em um único framework com sintaxe mais limpa, tabelas multi-família e melhor performance via pattern matching compilado.

**Por que importa:** É o **padrão oficial do kernel Linux moderno** — distribuições novas já migraram. `iptables` continua funcionando via `iptables-nft` (wrapper), mas entender nftables é essencial para operar ambientes atuais.

**Exemplo prático:**
```bash
# Criar tabela e chain básica
nft add table inet filter
nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }

# Permitir SSH e tráfego estabelecido
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input tcp dport 22 accept

# Listar tudo
nft list ruleset

# Salvar ruleset (Debian/Ubuntu)
nft list ruleset > /etc/nftables.conf
```

**Checklist de validação:**
- [ ] `nft list ruleset` mostra as tabelas e chains criadas?
- [ ] Conexões estabelecidas sobrevivem a reloads (`ct state`)?
- [ ] Regras persistem após reboot (`nftables.service` ativo)?

**Erros comuns:**
- **Priority errado:** A chain padrão filter tem `priority 0` (equivalente a INPUT do iptables). Priority menor executa antes.
- **Misturar iptables-legacy e nft:** Em sistemas que usam `iptables-nft`, rodar `iptables-legacy` cria duas pilhas paralelas — confuso e instável.

> Ver deep dive `nftables-vs-iptables` em `/nftables` para comparação completa.

---

## 9. SEO — Fonte Única (Sprint B)

Toda a configuração de metadata vive em **`src/lib/seo.ts`**. Isso é essencial para manter consistência: todas as 21 rotas apontam para o mesmo helper e aparecem automaticamente no sitemap.

### Arquivo central: `src/lib/seo.ts`

- `SITE_CONFIG` — nome do site, URL base, keywords globais, theme color, autor
- `ROUTE_SEO` — mapa `{ '/rota': { title, description } }` para as 21 rotas
- `buildMetadata(route)` — helper que gera `Metadata` completo com Open Graph + Twitter + canonical

### Como adicionar SEO a uma nova rota

1. Adicione a entrada em `src/lib/seo.ts`:
   ```typescript
   export const ROUTE_SEO = {
     // ...
     '/nova-rota': {
       title: 'Título Humano — Workshop Linux',
       description: 'Descrição concisa e rica em keywords (até 160 caracteres).',
     },
   };
   ```

2. Crie `app/nova-rota/layout.tsx` (Server Component):
   ```tsx
   import { buildMetadata } from '@/lib/seo';

   export const metadata = buildMetadata('/nova-rota');

   export default function Layout({ children }: { children: React.ReactNode }) {
     return children;
   }
   ```

3. A rota aparece automaticamente em `/sitemap.xml`.

### Por que esse padrão Client + Server?

Todas as páginas são Client Components (`'use client';`) para ter interatividade. Mas `metadata` só pode ser exportada de Server Components. A solução: cada rota tem um `layout.tsx` server-side que apenas repassa `children`. Isso dá o melhor dos dois mundos — estado reativo + metadata SEO.

### Recursos SEO gerados automaticamente

| Recurso | Arquivo | Como funciona |
|---|---|---|
| `/sitemap.xml` | `app/sitemap.ts` | Itera sobre `ROUTE_SEO` e emite `<url>` |
| `/robots.txt` | `app/robots.ts` | Permite tudo + aponta para o sitemap |
| `/opengraph-image` | `app/opengraph-image.tsx` | 1200x630 dinâmica via `next/og` (edge runtime) |
| `/icon` | `app/icon.tsx` | favicon 32x32 dinâmico via `next/og` |
| `/apple-icon` | `app/apple-icon.tsx` | apple-touch-icon 180x180 via `next/og` |
| `/manifest.webmanifest` | `app/manifest.ts` | Web App Manifest (PWA Lite) |
| JSON-LD `LearningResource` | `app/layout.tsx` (inline) | Schema.org injetado no `<head>` do root |

### URL base

Define via `NEXT_PUBLIC_SITE_URL` no `.env` (default: `https://workshop-linux.local`). Essa variável é lida por `SITE_CONFIG.url` e usada em canonical, OG, sitemap e robots.

---

## 10. Acessibilidade — WCAG 2.1 AA (Sprint C)

O projeto tem conformidade **WCAG 2.1 AA** implementada e validada estaticamente pelo `eslint-plugin-jsx-a11y`.

### Modais (`DeepDiveModal`, `GlobalSearch`)

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`
- Focus trap via `useFocusTrap()` em `src/lib/useFocusTrap.ts`:
  - Tab/Shift+Tab circulam entre elementos focáveis
  - ESC fecha
  - Foco retorna ao elemento que abriu o modal (WCAG 3.2.1)
- `GlobalSearch` segue o padrão WAI-ARIA **combobox + listbox**:
  - `aria-activedescendant`, `aria-expanded`, `aria-controls`
  - Setas navegam resultados, Enter seleciona, ESC fecha

### Animações

- `useReducedMotion()` da `motion/react` aplicado nos modais
- Bloco `@media (prefers-reduced-motion: reduce)` global em `globals.css` zera:
  - `animation-duration`, `animation-iteration-count`
  - `transition-duration`
  - `scroll-behavior`
- Atende WCAG 2.3.3 (Animation from Interactions)

### Foco visível

```css
/* globals.css */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Atende WCAG 2.4.7 (Focus Visible). Usa `:focus-visible` (não `:focus`) para não poluir interações de mouse.

### Lint estático

`eslint.config.mjs` (flat config) ativa `eslint-plugin-jsx-a11y` com regras estritas:

- `aria-props`, `aria-proptypes`, `aria-unsupported-elements`
- `role-has-required-aria-props`, `role-supports-aria-props`
- `tabindex-no-positive`
- `label-has-associated-control`
- `no-autofocus`, `no-redundant-roles`
- `click-events-have-key-events`, `no-noninteractive-element-interactions`

**Comando:** `npm run lint:eslint` — zero warnings é o alvo. Qualquer regressão de a11y é pega no CI antes do merge.

---

## 11. PWA Lite & Boundaries (Sprint D)

### PWA Lite — sem service worker

O app é **instalável** ("Adicionar à tela inicial") via Web App Manifest gerado em `app/manifest.ts`, mas **não funciona offline**. Decisão deliberada: service worker adiciona complexidade desproporcional ao escopo educacional.

```typescript
// app/manifest.ts (trecho)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Workshop Linux — Do Zero ao Firewall Profissional',
    short_name: 'Workshop Linux',
    description: '...',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#e05a2b',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
```

- `display: 'standalone'` — abre como app sem chrome do browser
- Ícones servidos pelas rotas dinâmicas `/icon` e `/apple-icon` (`next/og` edge runtime — sem PNGs binários no repo)
- `theme_color: '#e05a2b'` (laranja accent) · `background_color: '#0d1117'` (dark)

### Boundaries do App Router

| Arquivo | Propósito | Notas |
|---|---|---|
| `app/error.tsx` | Captura runtime errors, exibe UI amigável + botão "Tentar novamente" via `reset()` | **Obrigatoriamente `'use client'`** |
| `app/not-found.tsx` | 404 page com `robots: noindex` | Server Component (bundle mínimo para bots) |
| `app/loading.tsx` | Suspense fallback global com spinner + `role="status"` + `aria-busy` | Server Component |

---

## 12. Segurança — Headers e CSP Nonce (Sprint D + E)

### Headers estáticos em `next.config.ts`

| Header | Valor | Função |
|--------|-------|--------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Força HTTPS por 2 anos (HSTS preload-ready) |
| `X-Frame-Options` | `DENY` | Bloqueia iframe (defesa adicional ao `frame-ancestors`) |
| `X-Content-Type-Options` | `nosniff` | Impede MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vaza apenas origem em navegação cross-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Desativa APIs sensíveis e FLoC |
| `X-DNS-Prefetch-Control` | `on` | Acelera navegação via prefetch DNS |

Também: `poweredByHeader: false` (não vaza versão do Next.js) e `compress: true` (gzip/brotli).

### CSP per-request com nonce (Sprint E — `proxy.ts`)

O `Content-Security-Policy` **não é estático**. Ele é gerado por requisição em **`proxy.ts`** (Next.js 16 renomeou `middleware.ts` → `proxy.ts`):

1. `proxy.ts` gera um nonce criptográfico (16 bytes base64) por requisição
2. Propaga via request header `x-nonce`
3. `app/layout.tsx` lê com `await headers()` e aplica `nonce={nonce}` nos dois `<script>` inline (anti-FOUC + JSON-LD)
4. A resposta recebe CSP com `'nonce-XXX' 'strict-dynamic'` em `script-src` — **sem `'unsafe-inline'`**

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

> `style-src 'unsafe-inline'` **permanece** — Tailwind v4 e motion/react injetam `<style>` dinâmicos. Resolver isso exigiria ou hash de cada estilo (impraticável) ou nonce em styles (Next.js ainda não propaga nonce para styles).

### Trade-off aceito

Ler `headers()` no root layout torna **todas as rotas dinâmicas** (`ƒ` em vez de `○`). Para um site educacional leve sem necessidade de cache CDN agressivo, o ganho de segurança (nota **A+** no securityheaders.com) compensa.

**Rotas estáticas após Sprint E:** apenas `/sitemap.xml`, `/robots.txt` e `/manifest.webmanifest` (não passam pelo proxy via matcher).

### Regras de ouro na aplicação

| Área | Prática |
|---|---|
| Variáveis | `NEXT_PUBLIC_` apenas para o que o browser precisa ler |
| Secrets | Nunca no código — `.env` no `.gitignore` |
| Inputs | Sanitização de XSS antes de qualquer `localStorage.setItem` |
| Dependências | `npm audit` mensal |

---

## 13. Deploy & Infraestrutura

### Opção 1 — Deploy Dinâmico (Node.js + PM2) — Padrão atual

```bash
npm install
npm run build
pm2 start npm --name "workshop-linux" -- run start
```

**Nginx como proxy reverso:**
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

### Opção 2 — Vercel (mais simples)

Conectar o repositório GitHub na Vercel. O Next.js é detectado automaticamente, zero configuração.

> ⚠️ **Static Export não é mais viável** após o Sprint E. O root layout lê `headers()` para o nonce CSP, o que torna todas as rotas dinâmicas. `output: 'export'` falharia.

### Checklist de deploy

- [ ] `npm install` sem erros
- [ ] `npm run lint` — zero erros TypeScript
- [ ] `npm run lint:eslint` — zero warnings de acessibilidade
- [ ] `npm run build` — **28/28 páginas** (21 próprias + sitemap + robots + opengraph-image + icon + apple-icon + manifest + `_not-found`)
- [ ] Verificar constantes críticas (`CONTENT_PAGES_COUNT = 16`, `totalTopics = 24`, `checklistItemsCount = 26`)
- [ ] `.env.production` com `NEXT_PUBLIC_SITE_URL=https://seu-dominio.tld`
- [ ] PM2 ou Docker configurado para restart automático
- [ ] SSL/HTTPS ativo no Nginx (Certbot recomendado) — HSTS já é emitido pelo `next.config.ts`
- [ ] Porta 3000 não exposta diretamente (apenas via Nginx)
- [ ] Validar CSP em produção via [securityheaders.com](https://securityheaders.com) — meta: nota A+

---

## 14. Manutenção Preventiva

### Cronograma de auditoria

#### Semanal
- [ ] Verificar se novas variáveis `NEXT_PUBLIC_` adicionadas são realmente necessárias no cliente
- [ ] Validar logs do Nginx em busca de brute-force ou scans automatizados
- [ ] Confirmar que `.env` de produção não foi exposto ou alterado

#### Mensal
- [ ] `npm audit` — corrigir vulnerabilidades críticas e altas
- [ ] Revisar permissões de escrita nos diretórios do servidor
- [ ] Validar sanitização de XSS em novos inputs adicionados

#### Trimestral
- [ ] Revisar regras de `iptables` do servidor de produção
- [ ] Renovar certificados SSL (se não forem auto-renováveis)
- [ ] Testar restore de backups de configuração (disaster recovery)

---

## 15. Workflow Git do Projeto

### Regra de ouro: nunca commitar direto na `main`

```bash
# 1. Criar branch para o trabalho
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-do-bug

# 2. Fazer as alterações e commitar
git add arquivo1.tsx arquivo2.css
git commit -m "fix(tema): descricao curta em uma linha"

# 3. Subir para o GitHub
git push origin feat/nome-da-feature

# 4. Merge limpo na main (squash = 1 commit por feature)
git checkout main
git merge --squash feat/nome-da-feature
git commit -m "feat(modulo): descricao final do que foi feito"
git push origin main

# 5. Limpeza de branches
git branch -D feat/nome-da-feature
git push origin --delete feat/nome-da-feature
```

### Prefixos semânticos de commit

| Prefixo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade ou módulo |
| `fix` | Correção de bug |
| `docs` | Alteração em documentação |
| `style` | CSS, formatação, sem mudança de lógica |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Dependências, configuração, build |

### ⚠️ Atenção: PowerShell e aspas multilinha

```powershell
# ❌ ERRO — Enter dentro de aspas abre modo multilinha. Commit fica preso.
git commit -m "mensagem
continuação"   ← nunca faça isso

# ✅ CORRETO — sempre em uma única linha
git commit -m "fix(tema): corrige dark mode html.light e badge night-owl"
```

Se ficar preso no modo multilinha (`>>`), pressione `Ctrl+C` para cancelar e tente novamente em uma linha.

---

## 16. Roadmap Técnico

```
Fase 1 ✅ Concluída — Fundação
  ├── Migração Vite → Next.js App Router
  ├── Sistema de Badges & Busca Global (⌘K)
  ├── 21 rotas com conteúdo técnico completo
  ├── Topologia interativa clicável
  └── Dark Mode corrigido (4 bugs resolvidos)

Sprint A ✅ Robustez
  ├── try/catch em todos os acessos a localStorage
  ├── next/font (Space Grotesk + JetBrains Mono) — self-hosted, zero CLS, LGPD-safe
  └── Web Share API funcional com fallback

Sprint B ✅ SEO
  ├── src/lib/seo.ts — fonte única (SITE_CONFIG, ROUTE_SEO, buildMetadata)
  ├── Metadata por rota via layout.tsx Server Component
  ├── sitemap.ts + robots.ts dinâmicos
  ├── opengraph-image + icon + apple-icon via next/og (edge runtime)
  └── JSON-LD LearningResource no root layout

Sprint C ✅ Acessibilidade WCAG 2.1 AA
  ├── Modais: role="dialog" + aria-modal + focus trap (useFocusTrap)
  ├── GlobalSearch: padrão WAI-ARIA combobox + listbox
  ├── prefers-reduced-motion global + useReducedMotion nos modais
  ├── :focus-visible com outline accent
  └── ESLint jsx-a11y como gate estático

Sprint D ✅ PWA Lite + Headers de Segurança
  ├── manifest.ts — PWA Lite (instalável, sem service worker)
  ├── Icons dinâmicos via next/og edge runtime
  ├── HSTS, X-Frame-Options, Permissions-Policy via next.config.ts
  └── Boundaries: error.tsx, not-found.tsx, loading.tsx

Sprint E ✅ CSP nonce per-request (Next.js 16)
  ├── middleware.ts → proxy.ts (renomeação Next.js 16)
  ├── Nonce criptográfico propagado via x-nonce header
  ├── script-src 'self' 'nonce-XXX' 'strict-dynamic' — sem 'unsafe-inline'
  └── Trade-off: todas as rotas viram dynamic (aceito — nota A+ securityheaders.com)

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON se necessário.

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---

## 17. Glossário Técnico

**App Router** — Sistema de roteamento do Next.js baseado em pastas. Cada pasta com `page.tsx` vira uma rota pública automaticamente.

**Client Component** — Componente que roda no browser. Exige `'use client';` no topo. Necessário para hooks (`useState`, `useEffect`) e eventos DOM.

**Server Component** — Componente que roda apenas no servidor. Mais rápido e seguro, mas sem interatividade direta. Padrão no App Router quando não há `'use client'`.

**BadgeContext** — Provedor de estado global que rastreia progresso do usuário (badges, páginas visitadas, checkpoints concluídos).

**FOUC** (Flash of Unstyled Content) — Piscada visual quando o estilo é aplicado depois da renderização inicial. No Dark Mode, manifesta como flash branco antes do tema escuro carregar.

**Tailwind CSS v4** — Framework CSS utilitário. Nesta versão, os tokens ficam em `@theme {}` no CSS (não em `tailwind.config`). Classes utilitárias diretamente no JSX.

**ACL** (Access Control List) — Lista de regras que define quem pode acessar o quê. Usada no Squid (web) e iptables (rede).

**conntrack** — Módulo do kernel Linux que rastreia o estado de conexões ativas. Base do Stateful Firewall — permite regras `ESTABLISHED,RELATED`.

**DNAT** — Destination NAT. Muda o IP de destino de um pacote antes do roteamento. Usado em port forwarding para expor servidores internos.

**SNAT / Masquerade** — Source NAT. Muda o IP de origem de um pacote na saída. Permite que a rede interna navegue com o IP público do Firewall.

**Netfilter Hooks** — 5 pontos do kernel onde o iptables intercepta pacotes: `PREROUTING → INPUT → FORWARD → OUTPUT → POSTROUTING`.

**PSK** (Pre-Shared Key) — Senha compartilhada entre os dois lados de uma VPN IPSec. Deve ser idêntica nos dois Firewalls.

**IKE** (Internet Key Exchange) — Protocolo que negocia e estabelece as chaves criptográficas da VPN IPSec em duas fases.

**SSL Bump** — Técnica avançada do Squid que intercepta e decripta tráfego HTTPS para inspeção de conteúdo. Exige instalar um certificado do Proxy em todas as máquinas da rede.

**CSP nonce** — Valor criptográfico aleatório gerado por requisição, aplicado como atributo `nonce=` em scripts inline e declarado no header CSP. Permite scripts inline confiáveis sem precisar de `'unsafe-inline'` (que derrotaria o CSP).

**`'strict-dynamic'`** — Diretiva CSP moderna que permite scripts confiáveis (com nonce) carregarem dinamicamente outros scripts, sem precisar manter uma allowlist de domínios. Substitui `script-src 'self' https://cdn...` por uma cadeia de confiança baseada em nonce.

**`proxy.ts`** — Arquivo renomeado do antigo `middleware.ts` no Next.js 16. Roda na edge antes do render, ideal para headers dinâmicos como CSP nonce.

**HSTS** (HTTP Strict Transport Security) — Header que instrui o browser a só acessar o site via HTTPS por um período definido (aqui: 2 anos). Com `preload`, pode ser inscrito na lista do Chromium para proteção no primeiro acesso.

**FOUC** (Flash of Unstyled Content) — Piscada visual quando o estilo é aplicado depois da renderização inicial. No Dark Mode, manifesta como flash branco antes do tema escuro carregar. Resolvido por script síncrono no `<head>` que aplica a classe antes do primeiro paint.

**WCAG 2.1 AA** — Web Content Accessibility Guidelines. Nível AA é o padrão de conformidade exigido pela maioria das legislações (LBI no Brasil, ADA nos EUA, EN 301 549 na UE).

**next/og** — API do Next.js que gera imagens dinamicamente (OG, ícones) usando JSX no edge runtime. Substitui PNGs binários no repositório.

---

## 18. Apresentação Executiva — Slide Deck

*Use este conteúdo para apresentações rápidas. Copie para PowerPoint, Google Slides ou qualquer visualizador Markdown.*

---

**Slide 1 — Visão Geral**
- **Projeto:** Workshop Linux — Do Zero ao Firewall Profissional
- **Stack:** Next.js 16, Tailwind CSS v4, TypeScript 5.8, React 19
- **Missão:** Democratizar infraestrutura Linux com experiência gamificada e imersiva
- **Escopo:** 21 rotas, 9 módulos técnicos, 17 badges, laboratório Linux real

---

**Slide 2 — Arquitetura**
- **Frontend:** Client + Server Components híbridos (estado reativo + metadata SEO)
- **Persistência:** `localStorage` como fonte única (Backend descartado — escopo educacional)
- **Build:** Turbopack · 28/28 páginas · Sprint E torna tudo dynamic (trade-off CSP)
- **Infraestrutura:** Nginx como Proxy Reverso + PM2 para alta disponibilidade

---

**Slide 3 — Segurança (Sprint D + E)**
- **Headers:** HSTS (2y preload), X-Frame-Options DENY, Permissions-Policy restritiva
- **CSP:** Nonce per-request via `proxy.ts` — `'strict-dynamic'` sem `'unsafe-inline'`
- **A11y:** WCAG 2.1 AA com ESLint `jsx-a11y` como gate estático
- **Meta:** Nota A+ no securityheaders.com

---

**Slide 4 — SEO & Performance (Sprint B)**
- **Fonte única:** `src/lib/seo.ts` com `ROUTE_SEO` e `buildMetadata()`
- **Geração automática:** sitemap, robots, OG image, favicon, apple-icon, manifest — todos via `next/og` edge
- **Fontes:** `next/font` self-hospedado (zero CLS, LGPD-safe)
- **JSON-LD:** `LearningResource` no root layout

---

**Slide 5 — Sprints Concluídos**
- **Sprint A ✅** Robustez (localStorage try/catch, next/font, Web Share)
- **Sprint B ✅** SEO (seo.ts, sitemap, OG, JSON-LD)
- **Sprint C ✅** A11y WCAG 2.1 AA (focus trap, aria-*, prefers-reduced-motion)
- **Sprint D ✅** PWA Lite + Headers de segurança
- **Sprint E ✅** CSP nonce per-request via `proxy.ts` (Next.js 16)

---

**Slide 6 — Mensagens-Chave**
- **Seguro por design:** CSP nonce + HSTS + ESLint a11y como gate
- **Escopo honesto:** Sem backend, sem SW — localStorage e PWA Lite bastam
- **Educacional primeiro:** Toda decisão técnica prioriza clareza de aprendizado

---

*Este documento é um organismo vivo. Atualize-o sempre que uma decisão técnica relevante for tomada.  
O terminal não morde, ele ensina. Bem-vindo à equipe.* 🛡️
