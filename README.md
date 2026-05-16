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

**Sprints concluídos:** A · B · C · D · E · G · F · M · T₀/T₁ · J · I.1 · I.2 · Polish · T₂ · R · P · L · SIGMA · SIGMA Fase 2 · SIGMA Fase 3 · W · W2 · Polish (ModuleNav) · Audit Fix · V+Topics+UX · T₃ · Badge V2 · UI-H · PV · CE · CERT · ANIM · CE-E2E · EVOL · I.3 (Hardening) · I.4 (Docker) · F1-F3 (Fundamentos v2.0 — 15 módulos) · Polish-F · I.5 (SSH 2FA) · I.6 (Docker Compose) · Polish-I+Quiz++ · F4-F7 (Pacotes/Boot/CmdAvançados/Rsyslog — v2.0 COMPLETO) · I.7-I.13 (DHCP/Samba/Apache/OpenVPN/Traefik/LDAP/Pi-hole — v3.0 COMPLETO) · I.14-I.17 (Ansible/Monitoring/K8s/Terraform) · I.18-I.25 (Suricata/eBPF/ServiceMesh/SRE/CICD/OPNsense/Nextcloud/eBPF-Avançado — v4.0+v5.0 COMPLETOS) · SSH-PROXY · Quiz-Completo · Quiz-Fundamentos · Advanced-Trail (ADVANCED_ORDER — 19 módulos, badge 🌐) · PROGRESS-DROPDOWN (3 abas) · QUIZ-TRAIL · TOPICOS-TRAIL · AVANCADOS-INDEX · GLOSSARIO-ADVANCED (85 termos) · QUIZ-UX (shuffle + tamanho de sessão) · SEARCH-EXPAND · CONTENT-ATAQUES/PIVOTING/LABORATORIO · WINDOWS-POLISH · FUNDAMENTOS-WINDOWS · ERROS-COMUNS (100% cobertura) · DEEP-DIVES-V2/V3/V4 (16 deep dives) · GLOSSARIO-V2/V3 (115 termos) · CHEAT-V2/V3 (97 comandos) · QUIZ-200/QUIZ-SCENARIOS (254 perguntas) · SEARCH-COMPLETE (220 itens) · UX-TABS (13 páginas) · UX-PAGES (topicos + cheat-sheet) · UX-TABS-2 (5 páginas) · UX-TABS-3 (19 páginas — 100% cobertura de abas) · Advanced-E2E · QUIZ-v2 · CHEAT-v4 · TOPICOS-INTENT (toggle 📚/🔥) · SRS (motor SM-2 + /treino) · UX-TABS-4 (100% abas) · SRS-E2E · SRS-STREAK (badge 🔥) · NFS (/nfs v3.0) · QUIZ-MODULO · QUIZ-CTA · PRINT-CHEAT · SPARSE-TABS-FIX · PERF (−70% re-renders) · EVOL-INTERNAL · QUIZ-SPLIT · CONSOLIDACAO · E2E-TOPICOS · HOOK (useTabFilter) · SEARCH-ROUTES · FOUNDATION (F16 /usuarios + F17 /troubleshooting · trilha Fundamentos 17 módulos · badge 🏁 ground-zero) · E2E-FOUNDATION · E2E-FULL (smoke 71 rotas) · QUIZ-GROUND-ZERO (hub de quiz Fundamentos) · LAYOUT-SYNC · **E2E-HARDENING** (157 testes vitest · 15 specs E2E · 75/75 build · 62 badges · 172 checkpoints · 89 tópicos · 265 questões).

---

## ⚡ Início Rápido

```bash
npm install        # instalar dependências
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit — typecheck
npm run lint:eslint # ESLint + jsx-a11y
npm test           # vitest — 6 suítes · 57 testes
npm run build      # 71/71 páginas (49 próprias + assets SEO/PWA)
```

> Para guia completo de onboarding: [QUICKSTART.md](QUICKSTART.md)

---

## 📂 Estrutura de Pastas (resumo)

```
app/                    ← App Router — 47 rotas públicas
  layout.tsx            ← Root layout + anti-FOUC + JSON-LD + nonce CSP
  globals.css           ← Tokens de tema dark/light (@theme)
  providers.tsx         ← <BadgeProvider> global
  [49 rotas de conteúdo] ← v1.0 (25 módulos) + v2.0 Fundamentos (15) + v3.0 Servidores (10) + v4.0 Infra (8) + v5.0 Cloud (4) + suporte
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

### v2.0 — Fundamentos Linux (15 módulos ✅)

FHS · Comandos · Editores · Processos · Permissões · Discos · Logs · Backup · Shell Script · Cron · Pacotes · Boot · Comandos Avançados · Rsyslog · **SSH Proxy**

### v3.0 — Servidores e Serviços (10 módulos ✅)

DHCP · Samba · Apache · OpenVPN · Traefik · LDAP · Pi-hole · Docker · Docker Compose · SSH Proxy

### v4.0 — Infraestrutura Moderna (8 módulos ✅)

Ansible · Prometheus+Grafana · Kubernetes/K3s · Terraform · Suricata IDS/IPS · eBPF & XDP · Service Mesh (Istio) · SRE & SLOs

### v5.0 — Cloud & Platform Engineering (4 módulos ✅)

CI/CD GitHub Actions · OPNsense · Nextcloud · eBPF Avançado + Cilium

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
