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
| Runtime | React | ^19.0.0 |
| Build | Turbopack | (built-in) |

**Sprints concluídos:** A (robustez) · B (SEO) · C (a11y WCAG 2.1 AA) · D (PWA Lite + headers) · E (CSP nonce) · G (a11y Topology) · F (code splitting) · M (cyber tokens) · T₀/T₁ (vitest) · J (export/import) · I.1 (WireGuard) · I.2 (Fail2ban) · Polish (module-accent) · T₂ (E2E Playwright) · R (realismo — alinhamento material original) · P (Diamond Polish — FluxoCard, Erros Comuns, saídas esperadas) · **L (Legacy Gold — TroubleshootingCard OSI, zona DNS reversa, FTP DNAT, /proc/net/xt_recent, dhparam+TLS, MSS Clamping, Netplan, /offline terminal-style)**.

---

## ⚡ Início Rápido

```bash
npm install        # instalar dependências
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit — typecheck
npm run lint:eslint # ESLint + jsx-a11y
npm test           # vitest — 4 suítes
npm run build      # 30/30 páginas (23 próprias + assets SEO/PWA)
```

> Para guia completo de onboarding: [QUICKSTART.md](QUICKSTART.md)

---

## 📂 Estrutura de Pastas (resumo)

```
app/                    ← App Router — 23 rotas públicas
  layout.tsx            ← Root layout + anti-FOUC + JSON-LD + nonce CSP
  globals.css           ← Tokens de tema dark/light (@theme)
  providers.tsx         ← <BadgeProvider> global
  [11 módulos Linux]    ← /instalacao, /wan-nat, /dns, /nginx-ssl, ... /fail2ban
  [páginas especiais]   ← /topicos, /quiz, /dashboard, /certificado, ...
proxy.ts                ← CSP nonce per-request (Next.js 16)
next.config.ts          ← Headers de segurança (HSTS, X-Frame-Options…)
src/
  components/           ← ClientLayout, GlobalSearch, DeepDiveModal, ui/
  context/              ← BadgeContext (estado global + localStorage)
  data/                 ← searchItems, quizQuestions, deepDives
  lib/                  ← seo.ts, useFocusTrap.ts, utils.ts
```

> Estrutura completa: [docs/arquitetura.md](docs/arquitetura.md)

---

## 📚 Módulos do Laboratório

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
| 10 | WireGuard | `/wireguard` | Curve25519, wg-quick, peers |
| 11 | Fail2ban | `/fail2ban` | jails, filtros regex, iptables |

> Detalhes de cada módulo: [docs/modulos-linux.md](docs/modulos-linux.md)

---

## 📖 Documentação Completa

A documentação técnica está organizada por tópico em [`/docs/`](docs/README.md):

| Tópico | Arquivo |
|--------|---------|
| **Índice completo** | [docs/README.md](docs/README.md) |
| Arquitetura & Pastas | [docs/arquitetura.md](docs/arquitetura.md) |
| Sistema de Temas | [docs/temas.md](docs/temas.md) |
| Tarefas de Desenvolvimento | [docs/desenvolvimento.md](docs/desenvolvimento.md) |
| Git Workflow | [docs/git-workflow.md](docs/git-workflow.md) |
| Gamificação & Badges | [docs/gamificacao.md](docs/gamificacao.md) |
| Busca Global (⌘K) | [docs/busca-global.md](docs/busca-global.md) |
| SEO — Fonte Única | [docs/seo.md](docs/seo.md) |
| Acessibilidade WCAG 2.1 AA | [docs/acessibilidade.md](docs/acessibilidade.md) |
| PWA Lite & Boundaries | [docs/pwa-boundaries.md](docs/pwa-boundaries.md) |
| Segurança & CSP Nonce | [docs/seguranca.md](docs/seguranca.md) |
| Deploy & Infraestrutura | [docs/deploy.md](docs/deploy.md) |
| Manutenção Preventiva | [docs/manutencao.md](docs/manutencao.md) |
| Módulos Linux (11) | [docs/modulos-linux.md](docs/modulos-linux.md) |
| Roadmap Técnico | [docs/roadmap.md](docs/roadmap.md) |
| Glossário Técnico | [docs/glossario.md](docs/glossario.md) |
| Apresentação Executiva | [docs/apresentacao.md](docs/apresentacao.md) |

> Onboarding rápido: [QUICKSTART.md](QUICKSTART.md) · Instruções para Claude Code: [CLAUDE.md](CLAUDE.md)

---

<div align="center">

**Workshop Linux — Do Zero ao Firewall Profissional**

Documentação técnica de estudo pessoal · Modelo OSI aplicado na prática

*O terminal não morde, ele ensina.*

</div>
