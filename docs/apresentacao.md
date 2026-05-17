# Apresentacao Executiva — Slide Deck

*Use este conteudo para apresentacoes rapidas. Copie para PowerPoint, Google Slides ou qualquer visualizador Markdown.*

---

**Slide 1 — Visao Geral**
- **Projeto:** Workshop Linux — Do Zero ao Firewall Profissional
- **Stack:** Next.js 16, Tailwind CSS v4, TypeScript 5.8, React 19
- **Missao:** Democratizar infraestrutura Linux com experiencia gamificada e imersiva
- **Escopo:** 90 tópicos, 79 rotas, 63 badges, 175 checkpoints de validação

---

**Slide 2 — Arquitetura**
- **Frontend:** Client + Server Components hibridos (estado reativo + metadata SEO)
- **Persistencia:** `localStorage` como fonte unica (Backend descartado — escopo educacional)
- **Build:** Turbopack · 79 rotas · proxy.ts torna tudo dynamic (trade-off CSP)
- **Infraestrutura:** Nginx como Proxy Reverso + PM2 para alta disponibilidade

---

**Slide 3 — Seguranca (Sprint D + E)**
- **Headers:** HSTS (2y preload), X-Frame-Options DENY, Permissions-Policy restritiva
- **CSP:** Nonce per-request via `proxy.ts` — `'strict-dynamic'` sem `'unsafe-inline'`
- **A11y:** WCAG 2.1 AA com ESLint `jsx-a11y` como gate estatico
- **Meta:** Nota A+ no securityheaders.com

---

**Slide 4 — SEO & Performance (Sprint B)**
- **Fonte unica:** `src/lib/seo.ts` com `ROUTE_SEO` (74 rotas) e `buildMetadata()`
- **Geracao automatica:** sitemap, robots, OG image, favicon, apple-icon, manifest — todos via `next/og` edge
- **Fontes:** `next/font` self-hospedado (zero CLS, LGPD-safe)
- **JSON-LD:** `LearningResource` no root layout

---

**Slide 5 — Trilhas de Conteudo (4 versoes)**
- **v1.0 ✅** Zero ao Firewall — 25 módulos (iptables, NAT, DNS, VPN, Docker, Hardening...)
- **v2.0 ✅** Fundamentos Linux — 17 módulos (FHS, Shell Script, Boot, Rsyslog, Usuários, Troubleshooting...)
- **v3.0 ✅** Servidores e Serviços — 9 módulos (DHCP, Samba, Apache, OpenVPN, Traefik, LDAP, Pi-hole, NFS, HAProxy)
- **v4.0 ✅** Infraestrutura Moderna — 9 módulos (Ansible, Prometheus+Grafana, Kubernetes, Terraform, Suricata, eBPF, Service Mesh, SRE, Vault)
- **v5.0 ✅** Cloud & Platform Engineering — 4 módulos (CI/CD, OPNsense, Nextcloud, eBPF Avançado)

---

**Slide 6 — Gamificacao**
- **63 badges** desbloqueáveis (56 comuns + 7 milestones com modal + confetti)
- **175 checkpoints** técnicos de validação (ALL_CHECKLIST_IDS)
- **Linux Ninja** 🥷 → completar 75% dos checkpoints (131/175)
- **Mestre do Curso** 🎯 → visitar todos os 25 módulos da trilha principal
- **MilestoneCelebration** modal + canvas-confetti (lazy-loaded, 3KB gzip)

---

**Slide 7 — Sprints de Infraestrutura Concluidos**
- **Sprint A–G ✅** Robustez · SEO · A11y WCAG 2.1 AA · PWA Lite · CSP nonce
- **Sprint I.1–I.2 ✅** WireGuard · Fail2ban
- **Sprint I.3–I.6 ✅** Hardening · Docker · SSH 2FA · Docker Compose
- **Sprint F1-F3 ✅** Trilha Fundamentos Linux v2.0 (10 módulos base)
- **Sprint F4-F7 ✅** pacotes · boot · comandos-avancados · rsyslog (v2.0 COMPLETO)
- **Sprint I.7–I.11 ✅** DHCP · Samba · Apache · OpenVPN · Traefik
- **Sprint I.12–I.13 ✅** LDAP · Pi-hole (v3.0 COMPLETO)
- **Sprint I.14–I.17 ✅** Ansible · Prometheus+Grafana · Kubernetes/K3s · Terraform (v4.0 parcial)

---

**Slide 8 — Mensagens-Chave**
- **Seguro por design:** CSP nonce + HSTS + ESLint a11y como gate
- **Escopo honesto:** Sem backend, sem SW — localStorage e PWA Lite bastam
- **Educacional primeiro:** Toda decisao tecnica prioriza clareza de aprendizado
- **Progressao real:** v1.0→v2.0→v3.0→v4.0 formam um SysAdmin completo

---
[<- Voltar ao indice](README.md)
