# Apresentacao Executiva — Slide Deck

*Use este conteudo para apresentacoes rapidas. Copie para PowerPoint, Google Slides ou qualquer visualizador Markdown.*

---

**Slide 1 — Visao Geral**
- **Projeto:** Workshop Linux — Do Zero ao Firewall Profissional
- **Stack:** Next.js 16.2.6, Tailwind CSS v4, TypeScript 5.8 (strict), React 19
- **Missao:** Democratizar infraestrutura Linux com experiencia gamificada e imersiva
- **Escopo:** 104 tópicos, 95 rotas, 77 badges, 217 checkpoints de validação · 330 questões de quiz

---

**Slide 2 — Arquitetura**
- **Frontend:** Client + Server Components hibridos (estado reativo + metadata SEO)
- **Persistencia:** `localStorage` como fonte unica (Backend descartado — escopo educacional)
- **Build:** Turbopack · 95 rotas · proxy.ts torna tudo dynamic (trade-off CSP)
- **Infraestrutura:** Nginx como Proxy Reverso + PM2 para alta disponibilidade

---

**Slide 3 — Seguranca (Sprint D + E)**
- **Headers:** HSTS (2y preload), X-Frame-Options DENY, Permissions-Policy restritiva
- **CSP:** Nonce per-request via `proxy.ts` — `'strict-dynamic'` sem `'unsafe-inline'`
- **A11y:** WCAG 2.1 AA com ESLint `jsx-a11y` como gate estatico
- **Meta:** Nota A+ no securityheaders.com

---

**Slide 4 — SEO & Performance (Sprint B)**
- **Fonte unica:** `src/lib/seo.ts` com `ROUTE_SEO` (90 rotas) e `buildMetadata()`
- **Geracao automatica:** sitemap, robots, OG image, favicon, apple-icon, manifest — todos via `next/og` edge
- **Fontes:** `next/font` self-hospedado (zero CLS, LGPD-safe)
- **JSON-LD:** `LearningResource` no root layout

---

**Slide 5 — Trilhas de Conteudo (5 versoes · 78 módulos)**
- **v1.0 ✅** Zero ao Firewall — 25 módulos (iptables, NAT, DNS, VPN, Docker, Hardening...)
- **v2.0 ✅** Fundamentos Linux — 17 módulos (FHS, Shell Script, Boot, Rsyslog, Usuários, Troubleshooting...)
- **v3.0 ✅** Servidores e Serviços — 9 módulos (DHCP, Samba, Apache, OpenVPN, Traefik, LDAP, Pi-hole, NFS, HAProxy)
- **v4.0 ✅** Infraestrutura Moderna — 9 módulos (Ansible, Prometheus+Grafana, Kubernetes, Terraform, Suricata, eBPF, Service Mesh, SRE, Vault)
- **v5.0 ✅** Cloud & Platform Engineering — 18 módulos (CI/CD, OPNsense, Nextcloud, eBPF Avançado, CrowdSec, Tailscale, Proxmox Backup Server, GPG, LVM/RAID, Banco de Dados, Mail Server, Redes L2/L3, Alta Disponibilidade, Cloud Pública AWS, Git, Carreira, **Segurança Avançada** [SELinux/LUKS/auditd], Resposta a Incidentes)
- **Suporte/Navegação:** `/comece-aqui` (guia de entrada) · `/jornada` (linha do tempo unificada) · `/ferramentas` (5 utilitários portáteis)

---

**Slide 6 — Gamificacao**
- **77 badges** desbloqueáveis (70 comuns + 7 milestones com modal + confetti)
- **217 checkpoints** técnicos de validação (ALL_CHECKLIST_IDS)
- **Linux Ninja** 🥷 → completar 75% dos checkpoints (162/217)
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
- **Sprint I.14–I.25 ✅** Ansible · Prometheus+Grafana · Kubernetes · Terraform · Suricata · eBPF · Service Mesh · SRE · CI/CD · OPNsense · Nextcloud · eBPF Avançado (v4.0 + v5.0 COMPLETOS)
- **Sprint JORNADA ✅** Rota `/jornada` — une as 3 trilhas numa linha do tempo única (78 módulos)
- **Sprint CÓDICE ✅** `/resposta-incidentes` — DFIR seguindo o NIST SP 800-61 (capstone)
- **Sprint FORTALEZA ✅** CrowdSec · Tailscale · Proxmox Backup Server (endurecimento do host)
- **Sprint GPG ✅** `/gpg` — OpenPGP/GPG: chaves ECC, cifrar/assinar, commits Git assinados
- **Sprint PILARES ✅** LVM/RAID · Banco de Dados · Servidor de E-mail (pilares de SysAdmin)
- **Sprint REDES-L23 ✅** Redes Camada 2/3 · Alta Disponibilidade (VLANs, bonding, VRRP, Pacemaker)
- **Sprint CARREIRA ✅** Cloud Pública (AWS) · Git · Carreira (Fase 3 do Diagnóstico Curricular)
- **Sprint APROF ✅** Aprofundamento de 7 módulos: shell-script, apache, samba, ldap, kubernetes, ansible, terraform
- **Sprint TRILHA-GUIADA ✅** Handoff fim-de-trilha no `ModuleNav` (TRAIL_HANDOFF) + nova rota `/comece-aqui` + sync `/evolucao`
- **Sprint UX-FIX ✅** BadgeContext merge + hidratação `mounted` no toggle + correção de contagem em `/avancados`
- **Sprint HEADER-FOOTER ✅** Header reorganizado (8 itens + dropdown "Estudo") · footer com hubs clicáveis · Coluna 4 "🚀 Trilha Avançada"
- **Sprint SEGURANCA-PRO ✅** `/seguranca-avancada` — SELinux (MAC com labels), LUKS (criptografia de disco), auditd (audit do kernel) · badge 🛡️ `seguranca-pro-master`
- **Sprint COMANDOS-GLOSSARIO ✅** `/comandos` enriquecido (awk/sed/xargs/aliases/history) + glossário em 136 termos (+22 essenciais do shell)
- **Hub `/ferramentas` ✅** 5 utilitários portáteis: CIDR · Regex · iptables · PS1 · Base64

---

**Slide 8 — Engenharia & Qualidade**
- **CI ✅** GitHub Actions — lint + testes + build + E2E em todo push/PR para a `main`
- **TypeScript estrito ✅** `tsconfig` migrado para `strict: true`
- **Dependências ✅** Next 16.2.6 + override postcss → `npm audit` 0 vulnerabilidades
- **Cobertura:** 19 suítes vitest · 258 testes · 25 specs Playwright (0 flaky)

---

**Slide 9 — Mensagens-Chave**
- **Seguro por design:** CSP nonce + HSTS + ESLint a11y como gate + CI verde
- **Escopo honesto:** Sem backend, sem SW — localStorage e PWA Lite bastam
- **Educacional primeiro:** Toda decisao tecnica prioriza clareza de aprendizado
- **Progressao real:** v1.0→v2.0→v3.0→v4.0→v5.0 formam um SysAdmin completo

---
[<- Voltar ao indice](README.md)
