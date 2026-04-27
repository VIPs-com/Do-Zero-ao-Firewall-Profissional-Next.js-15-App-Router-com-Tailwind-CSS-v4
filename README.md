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

**Sprints concluídos:** A (robustez) · B (SEO) · C (a11y WCAG 2.1 AA) · D (PWA Lite + headers) · E (CSP nonce) · G (a11y Topology) · F (code splitting) · M (cyber tokens) · T₀/T₁ (vitest) · J (export/import) · I.1 (WireGuard) · I.2 (Fail2ban) · Polish (module-accent) · T₂ (E2E Playwright) · R (realismo) · P (Diamond Polish) · L (Legacy Gold) · SIGMA (Elite Lab — /laboratorio, /proxmox, Certbot) · SIGMA Fase 2 · SIGMA Fase 3 (badge 🔬 sigma-master) · W (WindowsComparisonBox) · W2 (RosettaStone, 🧭 explorador-mundos) · Polish (ModuleNav) · Audit Fix · V+Topics+UX · T₃ (6 suítes · 51 testes) · Badge V2 (🎯 course-master) · UI-H (ProgressDropdown) · PV (Polish Visual) · **CE** (MilestoneCelebration modal + confetti) · **CERT** (Web Share API, @media print) · **ANIM** (checklist-pop spring) · **CE-E2E** (9 specs Playwright) · **EVOL** (roadmap visual v2.0/v3.0/v4.0) · **I.3** (Hardening — SSH Ed25519, sysctl, AppArmor) · **I.4** (Docker Networking) · **F1-F3** (Fundamentos Linux v2.0 — 10 módulos + badge 🐧) · **Polish-F** · **I.5** (SSH 2FA — TOTP) · **I.6** (Docker Compose) · **Polish-I + Quiz++** (50 perguntas) · **F4** (/pacotes) · **F5** (/boot) · **F6** (/comandos-avancados) · **F7** (/rsyslog — v2.0 COMPLETO 14 módulos) · **I.7** (/dhcp) · **I.8** (/samba) · **I.9** (/apache) · **I.10** (/openvpn) · **I.11** (/traefik) · **I.12** (/ldap) · **I.13** (/pihole — v3.0 COMPLETO) · **I.14** (/ansible) · **I.15** (/monitoring — Prometheus+Grafana) · **I.16** (/kubernetes — K3s) · **I.17** (/terraform — v4.0 parcial · 127 checkpoints · 46 badges · 74 tópicos).

---

## ⚡ Início Rápido

```bash
npm install        # instalar dependências
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit — typecheck
npm run lint:eslint # ESLint + jsx-a11y
npm test           # vitest — 6 suítes · 51 testes
npm run build      # 52/52 páginas (47 próprias + assets SEO/PWA)
```

> Para guia completo de onboarding: [QUICKSTART.md](QUICKSTART.md)

---

## 📂 Estrutura de Pastas (resumo)

```
app/                    ← App Router — 47 rotas públicas
  layout.tsx            ← Root layout + anti-FOUC + JSON-LD + nonce CSP
  globals.css           ← Tokens de tema dark/light (@theme)
  providers.tsx         ← <BadgeProvider> global
  [47 rotas de conteúdo] ← v1.0 (25 módulos) + v2.0 Fundamentos (14) + v3.0 Servidores (7) + suporte
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

## 📚 Trilhas de Conteúdo

### v1.0 — Zero ao Firewall (25 módulos ✅)

| # | Módulo | Rota | Tecnologia |
|---|---|---|---|
| 1 | Fundação & IP | `/instalacao` | `ip`, `sysctl`, VirtualBox |
| 2 | NAT & SNAT | `/wan-nat` | `iptables MASQUERADE` |
| 3 | DNS | `/dns` | BIND9, zonas, reverso |
| 4 | SSL/TLS | `/nginx-ssl` | Nginx, OpenSSL, Certbot |
| 5 | Proxy LAN | `/lan-proxy` | Squid, ACLs |
| 6 | Port Forwarding | `/dnat` | `iptables DNAT PREROUTING` |
| 7 | Port Knocking | `/port-knocking` | `iptables recent`, knockd |
| 8 | VPN IPSec | `/vpn-ipsec` | StrongSwan, IKEv2, ESP |
| 9 | WireGuard | `/wireguard` | Curve25519, wg-quick |
| 10 | nftables | `/nftables` | Sucessor do iptables |
| 11 | Fail2ban | `/fail2ban` | jails, filtros regex |
| 12 | Hardening | `/hardening` | SSH Ed25519, sysctl, AppArmor |
| 13 | SSH 2FA | `/ssh-2fa` | TOTP, libpam-google-authenticator |
| 14 | Docker | `/docker` | bridge/DOCKER-USER/iptables |
| 15 | Docker Compose | `/docker-compose` | stacks, redes internas, secrets |
| + | Ataques, Pivoting, Lab, Proxmox, Audit… | diversas | — |

### v2.0 — Fundamentos Linux (14 módulos ✅)

FHS · Comandos · Editores · Processos · Permissões · Discos · Logs · Backup · Shell Script · Cron · **Pacotes** · **Boot** · **Comandos Avançados** · **Rsyslog**

### v3.0 — Servidores e Serviços (9 módulos ✅)

DHCP · Samba · Apache · OpenVPN · Traefik · LDAP · Pi-hole · Docker · Docker Compose

### v4.0 — Infraestrutura Moderna (4/8 módulos ✅)

Ansible · Prometheus+Grafana · Kubernetes/K3s · Terraform

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
| Módulos Linux (4 trilhas) | [docs/modulos-linux.md](docs/modulos-linux.md) |
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
