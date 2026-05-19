# 🔬 Diagnóstico Curricular — Workshop Linux

> Avaliação do projeto (**69 módulos**) contra o currículo de um **profissional Linux /
> Redes / Segurança empregável**. Referência: LPIC‑1/2, CompTIA Linux+ / Network+ /
> Security+ e a prática real de SysAdmin, DevOps e SRE.
>
> **Estado avaliado:** 68 badges · 190 checkpoints · 95 tópicos · 294 questões · 80 rotas.

---

## 1. Resumo executivo

O Workshop Linux deixou de ser um site de firewall e tornou‑se uma **plataforma
educacional completa em português**, com três trilhas progressivas (Fundamentos →
Firewall → Avançados) e um capstone de resposta a incidentes.

**Veredito:** forma muito bem um **Analista de Infraestrutura / Segurança de Redes
Linux** (júnior a pleno). É um **manual interativo gamificado de altíssima qualidade** —
e o roadmap deste documento o eleva a **formação profissional completa**, fechando os
pilares de SysAdmin generalista e a ponte para o emprego.

---

## 2. 📊 Mapeamento completo: Grade Profissional → Workshop

Legenda: 🟢 Excelente · 🟩 Forte · 🟡 Parcial · 🔴 Ausente · 🎯 alvo do roadmap

| Área curricular | Hoje | Alvo | Onde está / o que falta |
|---|---|---|---|
| Fundamentos Linux (FHS, shell, permissões, processos, boot) | 🟩 | 🟢 | Trilha v2.0 — 17 módulos · falta scripting avançado |
| Pacotes & gerência de software | 🟩 | 🟢 | `/pacotes` · aprofundar repositórios/pinning |
| Firewall & filtragem (iptables/nftables/NAT) | 🟢 | 🟢 | `/wan-nat`, `/dnat`, `/nftables`, `/port-knocking` |
| Redes — DNS, proxy, troubleshooting | 🟩 | 🟢 | `/dns`, `/lan-proxy`, `/troubleshooting` |
| Redes camada 2/3 (VLAN, bonding, IPv6, roteamento) | 🟡 | 🟢 | CIDR no `/ferramentas` · **falta módulo dedicado** |
| VPN (IPSec, WireGuard, OpenVPN, mesh) | 🟢 | 🟢 | `/vpn-ipsec`, `/wireguard`, `/openvpn`, `/tailscale` |
| Servidores (web, arquivo, diretório) | 🟩 | 🟢 | `/apache`, `/samba`, `/nfs`, `/ldap`, `/dhcp` |
| Servidor de e‑mail (Postfix/Dovecot) | 🔴 | 🟢 | **ausente** — só regras de firewall para e‑mail |
| Banco de dados (administração) | 🔴 | 🟢 | PostgreSQL/MariaDB só dentro de `/docker-compose` |
| Armazenamento avançado (LVM, RAID, ZFS) | 🟡 | 🟢 | `/discos` cobre fdisk/fstab · **falta LVM/RAID** |
| Alta disponibilidade (clustering, VRRP) | 🟡 | 🟢 | `/haproxy` + CARP no `/opnsense` · falta Pacemaker |
| Containers & orquestração | 🟩 | 🟢 | `/docker`, `/docker-compose`, `/kubernetes`, `/ebpf-avancado` |
| IaC & automação | 🟩 | 🟢 | `/ansible`, `/terraform`, `/cicd` |
| Observabilidade & SRE | 🟩 | 🟢 | `/monitoring`, `/sre`, `/rsyslog` · falta stack Loki/ELK |
| Segurança defensiva & ofensiva | 🟢 | 🟢 | `/hardening`, `/fail2ban`, `/suricata`, `/crowdsec`, `/ataques-avancados`, `/pivoteamento` |
| Resposta a incidentes (DFIR) | 🟩 | 🟢 | `/resposta-incidentes` (capstone NIST) |
| Criptografia aplicada | 🟩 | 🟢 | `/gpg`, `/nginx-ssl`, `/ssh-2fa` |
| Backup & recuperação | 🟩 | 🟢 | `/backup`, `/proxmox-backup-server` |
| Virtualização | 🟩 | 🟢 | `/laboratorio`, `/proxmox` |
| Cloud pública (AWS/Azure/GCP hands‑on) | 🔴 | 🟢 | provider AWS de exemplo no `/terraform` |
| Versionamento (Git como competência) | 🟡 | 🟢 | usado em `/cicd` e `/gpg` · não ensinado |
| Carreira (portfólio, simulado, entrevista) | 🟡 | 🟢 | `/certificado` + `/certificacoes` · falta prep ativa |

---

## 3. ✅ Pontos fortes (excelente)

- **Profundidade rara** em firewall, redes e segurança — do `iptables` ao eBPF, DFIR e
  CrowdSec. Poucos cursos chegam nesse nível.
- **Progressão honesta:** Fundamentos → Firewall → Servidores → Infra → Cloud → Capstone.
- **Gamificação madura:** 190 checkpoints, 68 badges, SRS (`/treino`), 294 questões,
  certificado verificável.
- **Recursos pedagógicos de elite:** `WindowsComparisonBox`, `HorizonteBox`
  (clássico ↔ estado da arte), `/jornada` unificada, `/cheat-sheet`, `/ferramentas`.
- **Engenharia sólida:** TypeScript estrito, CI, `check-constants.ts`, testes Vitest +
  Playwright, CSP nonce, 0 vulnerabilidades.
- **Alinhamento a certificações:** `/certificacoes` mapeia LPIC‑1 e CompTIA Linux+.

## 4. 🟡 Pontos fracos (precisa melhorar)

- Conteúdo é **leitura guiada + checklist**: ensina o "o quê" e o "porquê" muito bem,
  mas o "fazer" depende de o aluno montar o próprio ambiente de VMs.
- Armazenamento avançado, redes L2/L3 e shell scripting avançado estão superficiais.
- Sem trilha de cloud pública prática.

## 5. 🔴 Lacunas críticas (não planejadas até aqui)

| Lacuna | Impacto na empregabilidade |
|---|---|
| **Servidor de e‑mail** (Postfix/Dovecot, SPF/DKIM/DMARC) | Tema clássico de SysAdmin e de prova LPIC‑2 |
| **Administração de banco de dados** | Quase toda vaga de infra exige operar PostgreSQL/MySQL |
| **LVM & RAID dedicados** | Gerência de disco em produção — esperado em entrevista |
| **Alta disponibilidade real** (Pacemaker/Corosync, keepalived) | Serviços críticos exigem clustering/quorum |
| **Cloud pública prática** | O mercado é majoritariamente cloud |
| **Preparação de carreira** | Falta portfólio, simulado cronometrado e prep de entrevista |

---

## 6. 📈 Avaliação geral: o que o aluno encontra

O aluno encontra uma **formação teórica de excelência em Redes & Segurança Linux**, com
trilha clara, prática validável por checkpoint e reforço por quiz/SRS. Sai sabendo
**projetar, configurar e defender** uma infraestrutura Linux real.

O que ele ainda **não** encontra: os pilares de SysAdmin generalista (BD, e‑mail,
LVM/RAID, HA), um laboratório executável dentro da plataforma e a ponte direta para o
primeiro emprego.

## 7. 🎯 Resposta direta: "Com isso conseguimos formar bons profissionais?"

**Sim — para a especialidade de Redes & Segurança Linux, hoje.** Para um **SysAdmin
full / DevOps júnior completo**, ainda **não** — faltam os pilares da Fase 1 e a prep de
carreira da Fase 3.

Executando o roadmap abaixo (Fases 0 → 3), o Workshop passa a formar um profissional
**completo e empregável**, com as 21 áreas curriculares no nível 🟢 Excelente.

---

## 8. 🏗️ Roadmap de evolução — Fases 0 → 3

### Fase 0 — Aprofundamento (Forte → Excelente)
Eleva os módulos já sólidos ao topo: deep dives novos, exercícios avançados e mais quiz.

### Fase 1 — Pilares de SysAdmin que faltam (prioridade máxima)
Fecha as lacunas que travam a empregabilidade como SysAdmin generalista.

### Fase 2 — Profundidade de redes & alta disponibilidade
Completa redes L2/L3 e clustering de serviços críticos.

### Fase 3 — Carreira & cloud
Conecta o conhecimento ao mercado: cloud pública, Git e preparação de carreira.

---

## 9. ✅ Plano detalhado — Sprints que estão por vir

> Cada novo módulo segue o padrão CÓDICE/GPG: `page.tsx` + `layout.tsx`, `useTabFilter`
> 3 abas, `FluxoCard`, `WindowsComparisonBox`, 3 checkpoints → 1 badge, ModuleNav,
> entrada na cadeia de constantes, +quiz, +searchItems, `check-constants` verde, CI.

### Fase 0 — Aprofundamento

| Sprint | Escopo |
|---|---|
| **APROF‑FUND** | Trilha Fundamentos: scripting avançado em `/shell-script` (traps, getopts, `bats`), 2 deep dives novos, +exercícios |
| **APROF‑SERVERS** | v3.0: seções de tuning e segurança por módulo (Apache MPM, Samba VFS, LDAP TLS hardening) |
| **APROF‑INFRA** | v4.0: cenários reais de troubleshooting (K8s CrashLoop, Terraform drift, Ansible idempotência), stack Loki real evoluindo o HorizonteBox de `/rsyslog` |

### Fase 1 — Pilares de SysAdmin

| Sprint | Módulo novo | Badge · checkpoints |
|---|---|---|
| **LVM‑RAID** | `/lvm-raid` — PV/VG/LV, snapshots, resize, mdadm RAID 0/1/5, intro ZFS | 💽 `storage-master` · `lvm-configurado`, `raid-montado`, `snapshot-criado` |
| **DATABASE** | `/banco-de-dados` — PostgreSQL/MariaDB: usuários/grants, `pg_dump`/restore, replicação, tuning básico | 🗄️ `dba-master` · `db-instalado`, `db-backup`, `db-replicacao` |
| **MAIL** | `/mail-server` — Postfix + Dovecot, SPF/DKIM/DMARC, TLS, integração Fail2ban | 📧 `mail-master` · `mail-postfix`, `mail-dovecot`, `mail-antispam` |

### Fase 2 — Redes & HA

| Sprint | Módulo novo | Badge · checkpoints |
|---|---|---|
| **REDES‑L23** | `/redes-l2-l3` — VLANs (802.1Q), bonding, IPv6, roteamento estático + noções OSPF/BGP | 🌐 `redes-master` · `vlan-configurada`, `bonding-ativo`, `ipv6-roteado` |
| **HA** | `/alta-disponibilidade` — keepalived/VRRP, Pacemaker/Corosync, quorum, fencing | ♻️ `ha-master` · `vrrp-configurado`, `cluster-quorum`, `failover-testado` |

### Fase 3 — Carreira & Cloud

| Sprint | Módulo / entrega | Badge · checkpoints |
|---|---|---|
| **CLOUD** | `/cloud-publica` — laboratório AWS: IAM, VPC, EC2, S3 (liga ao `/terraform`) | ☁️ `cloud-master` · `cloud-iam`, `cloud-vpc`, `cloud-deploy` |
| **GIT** | `/git` — versionamento como competência: branch/merge/rebase, conflitos, fluxo de PR | 🔀 `git-master` · `git-branch`, `git-merge`, `git-fluxo` |
| **CARREIRA** | Prep ativa em `/certificacoes` + `/quiz`: simulado cronometrado por certificação, guia de portfólio, roteiro de entrevista | 🎖️ `carreira-master` · `simulado-completo`, `portfolio-montado`, `entrevista-praticada` |

### Polimento contínuo (baixo esforço, alto retorno)
- **deep‑diver por `Set` de paths obrigatórios** — honestidade pedagógica (auditoria).
- **Baseline axe/Lighthouse** em `/`, `/topicos`, `/quiz`, `/cheat-sheet`, `/dashboard`.
- Rodar `check-constants.ts` no CI em todo PR.

**Projeção ao fim das 4 fases:** ~9 módulos novos → ~78 módulos · ~77 badges ·
~217 checkpoints · 21/21 áreas curriculares no nível 🟢 Excelente.

---

## 10. 🗺️ Jornada do aluno: hoje vs. ideal

**Hoje:** Fundamentos → Firewall → Servidores → Infra → Cloud → Capstone DFIR →
Certificado. Sólida, mas sem prep de carreira e com lacunas de SysAdmin generalista.

**Ideal:** Fundamentos *(+ scripting avançado)* → Firewall → Servidores *(+ BD, e‑mail,
LVM/RAID)* → **Redes L2/L3 & HA** → Infra/Cloud *(+ cloud pública prática)* → Capstone
DFIR → **Portfólio + Simulado + Entrevista** → Certificado.

---

## 11. ✅ Próximos passos (sequência recomendada)

1. **Fase 0** primeiro — aprofundar o que já é Forte (menor risco, valida o padrão).
2. **Fase 1** — começar pelo **Sprint LVM‑RAID** (menor e autocontido), depois DATABASE e MAIL.
3. **Fase 2** — REDES‑L23 e HA.
4. **Fase 3** — CLOUD, GIT e CARREIRA.
5. Aplicar os **3 polimentos** em paralelo, sem bloquear as fases.

---
[← Voltar ao indice](README.md)
