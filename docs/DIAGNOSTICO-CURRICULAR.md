# 🔬 Diagnóstico Curricular — Workshop Linux

> Avaliação do projeto (**78 módulos**) contra o currículo de um **profissional Linux /
> Redes / Segurança empregável**. Referência: LPIC‑1/2, CompTIA Linux+ / Network+ /
> Security+ e a prática real de SysAdmin, DevOps e SRE.
>
> **Estado atual:** 77 badges · 217 checkpoints · 104 tópicos · 330 questões · 90 rotas.
> **Roadmap de evolução (Fases 0 → 3): ✅ CONCLUÍDO.**

---

## 1. Resumo executivo

O Workshop Linux deixou de ser um site de firewall e tornou‑se uma **plataforma
educacional completa em português**, com três trilhas progressivas (Fundamentos →
Firewall → Avançados) e um capstone de resposta a incidentes.

Com a execução das Fases 0 a 3 do roadmap, as **lacunas críticas foram fechadas** e os
módulos sólidos foram aprofundados. O curso passou de "manual interativo de Redes &
Segurança" para **formação profissional Linux completa**.

**Veredito:** forma um profissional **Linux / Infraestrutura / Segurança** do zero ao
nível pleno — cobrindo fundamentos, firewall, redes camada 2/3, servidores, banco de
dados, e‑mail, armazenamento, alta disponibilidade, infraestrutura moderna, cloud e a
ponte para o emprego.

---

## 2. 📊 Mapeamento completo: Grade Profissional → Workshop

Legenda: 🟢 Excelente · 🟩 Forte · 🟡 Parcial · 🔴 Ausente

| Área curricular | Cobertura | Onde está no Workshop |
|---|---|---|
| Fundamentos Linux (FHS, shell, permissões, processos, boot) | 🟢 Excelente | Trilha v2.0 — 17 módulos · `/shell-script` com Bash estrito, `trap`, `getopts`, `bats` |
| Pacotes & gerência de software | 🟢 Excelente | `/pacotes` — apt/dpkg, repositórios/PPA, snap, pip |
| Firewall & filtragem (iptables/nftables/NAT) | 🟢 Excelente | `/wan-nat`, `/dnat`, `/nftables`, `/port-knocking` |
| Redes — DNS, proxy, troubleshooting | 🟢 Excelente | `/dns`, `/lan-proxy`, `/troubleshooting` |
| Redes camada 2/3 (VLAN, bonding, IPv6, roteamento) | 🟢 Excelente | `/redes-l2-l3` — 802.1Q, bonding/LACP, bridges, IPv6, OSPF/BGP |
| VPN (IPSec, WireGuard, OpenVPN, mesh) | 🟢 Excelente | `/vpn-ipsec`, `/wireguard`, `/openvpn`, `/tailscale` |
| Servidores (web, arquivo, diretório) | 🟢 Excelente | `/apache` (MPM+hardening), `/samba` (VFS+SMB3), `/ldap` (TLS+ppolicy), `/nfs`, `/dhcp` |
| Servidor de e‑mail (Postfix/Dovecot) | 🟢 Excelente | `/mail-server` — Postfix MTA, Dovecot IMAP/POP3, SPF/DKIM/DMARC |
| Banco de dados (administração) | 🟢 Excelente | `/banco-de-dados` — PostgreSQL/MariaDB: usuários, backup, replicação, tuning |
| Armazenamento avançado (LVM, RAID, ZFS) | 🟢 Excelente | `/lvm-raid` — PV/VG/LV, snapshots, RAID mdadm, ZFS · `/discos` |
| Alta disponibilidade (clustering, VRRP) | 🟢 Excelente | `/alta-disponibilidade` — keepalived/VRRP, Pacemaker/Corosync, quorum, fencing |
| Containers & orquestração | 🟢 Excelente | `/docker`, `/docker-compose`, `/kubernetes` (+ diagnóstico em produção), `/ebpf-avancado` |
| IaC & automação | 🟢 Excelente | `/ansible` (+ troubleshooting), `/terraform` (+ drift/state), `/cicd` |
| Observabilidade & SRE | 🟢 Excelente | `/monitoring`, `/sre`, `/rsyslog` (HorizonteBox → Loki) |
| Segurança defensiva & ofensiva | 🟢 Excelente | `/hardening`, `/fail2ban`, `/suricata`, `/crowdsec`, `/ataques-avancados`, `/pivoteamento` |
| Resposta a incidentes (DFIR) | 🟢 Excelente | `/resposta-incidentes` — capstone NIST SP 800‑61 |
| Criptografia aplicada | 🟢 Excelente | `/gpg`, `/nginx-ssl`, `/ssh-2fa` |
| Backup & recuperação | 🟢 Excelente | `/backup`, `/proxmox-backup-server` |
| Virtualização | 🟢 Excelente | `/laboratorio`, `/proxmox` |
| Cloud pública (AWS) | 🟢 Excelente | `/cloud-publica` — IAM, VPC/SG, EC2, S3, free tier |
| Versionamento (Git como competência) | 🟢 Excelente | `/git` — commits, branches, merge/rebase, conflitos, fluxo de PR |
| Carreira (portfólio, simulado, entrevista) | 🟢 Excelente | `/carreira` — certificações, simulado cronometrado, portfólio, entrevista |

**22 áreas curriculares · 22 no nível 🟢 Excelente.**

---

## 3. ✅ Pontos fortes

- **Cobertura completa e profunda** — das 22 áreas de um currículo profissional Linux,
  todas atingem o nível Excelente, com módulos dedicados e conteúdo de produção.
- **Progressão honesta:** Fundamentos → Firewall → Servidores → Infra → Cloud → Carreira
  → Capstone DFIR.
- **Gamificação madura:** 217 checkpoints, 77 badges, SRS (`/treino`), 330 questões,
  certificado verificável.
- **Recursos pedagógicos de elite:** `WindowsComparisonBox`, `HorizonteBox`
  (clássico ↔ estado da arte), `/jornada` unificada, `/cheat-sheet`, `/ferramentas`.
- **Engenharia sólida:** TypeScript estrito, CI GitHub Actions, `check-constants.ts`,
  testes Vitest + Playwright, CSP nonce, 0 vulnerabilidades.
- **Alinhamento a certificações e carreira:** `/certificacoes` mapeia LPIC‑1/2 e
  CompTIA Linux+; `/carreira` prepara para simulado, portfólio e entrevista.

## 4. 🟡 Pontos a evoluir (refinamento opcional)

- Conteúdo é **leitura guiada + checklist + quiz**: ensina o "o quê", o "porquê" e o
  "como" muito bem — mas o "fazer" ainda depende de o aluno montar o próprio ambiente
  de VMs. Um laboratório executável embarcado seria o próximo salto.
- **Observabilidade** pode ganhar um módulo dedicado de stack Loki/ELK (hoje tratado em
  profundidade via `/monitoring`, `/rsyslog` e o HorizonteBox).
- Polimentos de plataforma: deep‑diver por `Set` de paths obrigatórios; baseline
  axe/Lighthouse em rotas‑chave.

---

## 5. 🎯 Resposta direta: "Com isso conseguimos formar bons profissionais?"

**Sim.** Com as Fases 0 → 3 concluídas, o Workshop forma um profissional **Linux /
Infraestrutura / DevOps / Segurança** completo — do primeiro comando no terminal à
cloud pública, passando pelos pilares de SysAdmin (banco de dados, e‑mail, LVM/RAID,
alta disponibilidade), pela infraestrutura moderna (containers, IaC, observabilidade) e
pela preparação ativa para o mercado (certificações, portfólio, entrevista).

A ressalva honesta que permanece: **o curso ensina e valida, mas não substitui a
prática no teclado** — o aluno precisa montar e operar o laboratório real. Essa é uma
escolha pedagógica deliberada, não uma lacuna de conteúdo.

---

## 6. 🏗️ Roadmap de evolução — Fases 0 → 3 · ✅ CONCLUÍDO

| Fase | Sprint | Entrega | Status |
|---|---|---|---|
| **0 — Aprofundamento** | APROF | `/shell-script` (Bash estrito, trap, getopts, bats); v3.0 `/apache`/`/samba`/`/ldap` (tuning + hardening); v4.0 `/kubernetes`/`/ansible`/`/terraform` (troubleshooting de produção) | ✅ |
| **1 — Pilares de SysAdmin** | PILARES | `/lvm-raid` (💽 storage‑master), `/banco-de-dados` (🗄️ dba‑master), `/mail-server` (📧 mail‑master) | ✅ |
| **2 — Redes & Alta Disponibilidade** | REDES‑L23 | `/redes-l2-l3` (🌐 redes‑master), `/alta-disponibilidade` (♻️ ha‑master) | ✅ |
| **3 — Carreira & Cloud** | CARREIRA | `/cloud-publica` (☁️ cloud‑master), `/git` (🔀 git‑master), `/carreira` (🎖️ carreira‑master) | ✅ |

**Resultado:** 9 módulos novos + 7 módulos aprofundados · 69 → 78 módulos · 68 → 77
badges · 190 → 217 checkpoints · 95 → 104 tópicos · 294 → 330 questões · 80 → 90 rotas.
**Fase 4 (extra — Sprint SEGURANCA-PRO)** trouxe `/seguranca-avancada` (SELinux, LUKS, auditd).

### Polimento contínuo (opcional, baixo esforço)
- deep‑diver por `Set` de paths obrigatórios — honestidade pedagógica.
- Baseline axe/Lighthouse em `/`, `/topicos`, `/quiz`, `/cheat-sheet`, `/dashboard`.
- Módulo dedicado de observabilidade com stack Loki/ELK.

---

## 7. 🗺️ Jornada do aluno

**Trilha completa (rota `/jornada`):** Fundamentos *(17 módulos — inclui scripting
avançado)* → Firewall *(25 módulos)* → Avançados *(35 módulos — servidores, banco de
dados, e‑mail, armazenamento, redes L2/L3, alta disponibilidade, infraestrutura
moderna, cloud, Git, carreira)* → Capstone DFIR → Certificado.

Do `pwd` ao cluster de alta disponibilidade na AWS, com preparação de carreira e
simulado de certificação — uma linha do tempo única de 78 módulos.

---
[← Voltar ao indice](README.md)
