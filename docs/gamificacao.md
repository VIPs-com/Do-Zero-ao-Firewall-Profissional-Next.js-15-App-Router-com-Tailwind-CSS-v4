# Sistema de Gamificacao — Badges & Progresso

## Arquivo central: `src/context/BadgeContext.tsx`

Gerencia quatro dimensões de progresso:
- **Badges** — 46 conquistas desbloqueáveis (5 são milestones com modal de celebração)
- **Páginas visitadas** — para badges de exploração e course-master
- **Checkpoints** — 127 validações técnicas concluídas (ALL_CHECKLIST_IDS)
- **Quiz score** — 0–100, persiste em localStorage

---

## Tabela de badges (46 total)

| Ícone | Título | ID | Como desbloquear |
|---|---|---|---|
| 🥉 | Iniciante | `quiz-beginner` | Completar o quiz pela 1ª vez (score > 0) |
| 🥇 | Expert | `quiz-expert` | Score ≥ 80% no quiz |
| **🏆** | **Mestre** | **`quiz-master`** | **Score 100% no quiz** ★ milestone |
| 🗺️ | Explorador | `explorer` | Visitar 5+ páginas |
| 🤿 | Mergulhador | `deep-diver` | Visitar todas as 39 páginas de conteúdo |
| 🦉 | Coruja Noturna | `night-owl` | Ativar o dark mode |
| 🔍 | Investigador | `searcher` | Usar a busca global (⌘K / Ctrl+K) |
| 🖧 | Topólogo | `topology-pro` | Clicar em 5+ elementos da topologia interativa |
| 🛡️ | Firewall Master | `firewall-master` | snat-config + established-config |
| 📖 | DNS Master | `dns-master` | dns-interno + dns-reverso |
| 🔒 | SSL Master | `ssl-master` | web-server ou nginx-ssl |
| 🔒 | VPN Architect | `vpn-master` | vpn-up + vpn-ping |
| 🚪 | Proxy Master | `proxy-master` | proxy-funciona + proxy-bloqueio |
| 🔑 | Knocking Master | `knocking-master` | port-knocking |
| **🎓** | **Graduado** | **`certificado`** | **Gerar o certificado de conclusão** ★ milestone |
| **🥷** | **Linux Ninja** | **`linux-ninja`** | **≥ 95 checkpoints (75% dos 127)** ★ milestone |
| 💀 | Pivoting Master | `pivoting-master` | pivoting-risk |
| 🛡️ | Defensor da Topologia | `defensor-topologia` | Clicar em 3+ riscos da topologia |
| ⏳ | Viajante do Tempo | `time-traveler` | Importar progresso via JSON |
| 🔐 | WireGuard Master | `wireguard-master` | wg-keys + wg-server + wg-tunnel |
| 🚫 | Fail2ban Master | `fail2ban-master` | f2b-install + f2b-sshd + f2b-ban-test |
| 🖥️ | Proxmox Pioneer | `proxmox-pioneer` | proxmox-iso + proxmox-bridges + proxmox-vms + proxmox-snapshot |
| 🏅 | Agente de Resgate | `resgate-gold` | Visitar /laboratorio + /proxmox |
| **🔬** | **SIGMA Master** | **`sigma-master`** | **11 checkpoints avançados (Fase 2)** ★ milestone |
| 🧭 | Explorador de Mundos | `explorador-mundos` | terminal-basico + sudo-entendido + sysadmin-mindset + rosetta-stone-explored |
| **🎯** | **Mestre do Curso** | **`course-master`** | **Visitar todos os 25 módulos do COURSE_ORDER** ★ milestone |
| 🔐 | Hardening Master | `hardening-master` | ssh-hardened + sysctl-secured + apparmor-enabled |
| 🐳 | Docker Master | `docker-master` | docker-installed + docker-bridge + docker-iptables |
| 🐧 | Fundamentos Master | `fundamentos-master` | 10 checkpoints da Trilha Fundamentos Linux |
| 📱 | SSH 2FA Master | `ssh-2fa-master` | totp-instalado + pam-configurado + ssh-2fa-testado |
| 🐙 | Compose Master | `compose-master` | compose-instalado + compose-stack + compose-networks |
| 📦 | Package Master | `pacotes-master` | apt-atualizado + pacote-instalado + repo-adicionado |
| 🖥️ | Boot Master | `boot-master` | bios-uefi-entendido + grub-configurado + systemd-targets-explorados |
| 🔧 | Cmd Avançados Master | `cmd-avancados-master` | sed-dominado + links-criados + compactacao-praticada |
| 📡 | Rsyslog Master | `rsyslog-master` | rsyslog-configurado + log-remoto-enviado + logrotate-configurado |
| 🌐 | DHCP Master | `dhcp-master` | dhcp-instalado + dhcp-subnet + dhcp-reserva |
| 🗂️ | Samba Master | `samba-master` | samba-instalado + samba-share + samba-windows |
| 🌍 | Apache Master | `apache-master` | apache-instalado + apache-vhost + apache-ssl |
| 🔒 | OpenVPN Master | `openvpn-master` | openvpn-instalado + openvpn-pki + openvpn-cliente |
| 🔀 | Traefik Master | `traefik-master` | traefik-instalado + traefik-https + traefik-middleware |
| 👥 | LDAP Master | `ldap-master` | ldap-instalado + ldap-usuarios + ldap-autenticacao |
| 🕳️ | Pi-hole Master | `pihole-master` | pihole-instalado + pihole-dhcp + pihole-bloqueando |
| ⚙️ | Ansible Master | `ansible-master` | ansible-instalado + ansible-playbook + ansible-roles |
| 📊 | Monitoring Master | `monitoring-master` | monitoring-instalado + monitoring-dashboard + monitoring-alertas |
| ☸️ | Kubernetes Master | `k8s-master` | k8s-instalado + k8s-deploy + k8s-network |
| 🏗️ | Terraform Master | `terraform-master` | terraform-instalado + terraform-plan + terraform-modulos |

> ★ **Milestone badges** disparam o `MilestoneCelebration` modal em vez do toast de 4s.
> `course-master` e `quiz-master` disparam também confetti (canvas-confetti, lazy-loaded).

---

## Notificações por tier

| Tier | Badges | Feedback |
|------|--------|----------|
| **Comum** | 41 badges | Toast slide-in 4s (canto inferior direito, z-50) |
| **Milestone** | 5 badges | Modal centralizado full-screen (z-200) + confetti para os 2 maiores |

```typescript
// src/context/BadgeContext.tsx
const MILESTONE_BADGES = new Set<BadgeId>([
  'course-master', 'quiz-master', 'linux-ninja', 'sigma-master', 'certificado',
]);
// → unlockBadge() detecta milestone → setMilestoneBadge(id)
// → BadgeProvider renderiza <MilestoneCelebration> via Suspense (lazy)
```

---

## Como adicionar um novo badge

```typescript
// Passo 1 — src/context/BadgeContext.tsx: adicionar ao tipo
export type BadgeId = ... | 'meu-badge';

// Passo 2 — Adicionar a definição no BADGE_DEFS
'meu-badge': {
  icon: '🆕',
  title: 'Nome do Badge',
  desc: 'Condição clara de desbloqueio'
},

// Passo 3 — No useEffect do checklist, adicionar trigger
if (checklist['chk-a'] && checklist['chk-b'] && checklist['chk-c']) unlockBadge('meu-badge');

// Passo 4 (opcional) — se for milestone, adicionar ao Set
const MILESTONE_BADGES = new Set<BadgeId>([
  ..., 'meu-badge'
]);
```

---

## Checkpoints de validação (127 IDs — ALL_CHECKLIST_IDS)

```typescript
// src/context/BadgeContext.tsx
[
  // Core (26)
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona',
  'proxy-bloqueio', 'web-server', 'dnat-funciona', 'port-knocking',
  'snat-config', 'established-config', 'forward-config', 'audit-log',
  'dns-recursivo', 'dns-reverso', 'dns-firewall', 'dnat-web',
  'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping', 'vpn-psk', 'pivoting-risk',
  // Sprint I.1 — WireGuard (3)
  'wg-keys', 'wg-server', 'wg-tunnel',
  // Sprint I.2 — Fail2ban (3)
  'f2b-install', 'f2b-sshd', 'f2b-ban-test',
  // Sprint R — Persistência (3)
  'firewall-persistence', 'firewall-service', 'firewall-log',
  // Sprint SIGMA — Laboratório (3)
  'lab-comparison-read', 'lab-kvm-installed', 'lab-kvm-vm',
  // Sprint SIGMA — Proxmox (4)
  'proxmox-iso', 'proxmox-bridges', 'proxmox-vms', 'proxmox-snapshot',
  // Sprint SIGMA — Certbot (3)
  'certbot-installed', 'certbot-certificate', 'certbot-renewal',
  // Sprint SIGMA Fase 2 — Port Knocking (2)
  'knock-admin-flow', 'knock-visibility',
  // Sprint SIGMA Fase 2 — Audit Logs (3)
  'audit-knock-script', 'knock-monitor-script', 'audit-log-rotation',
  // Sprint SIGMA Fase 2 — WAN/NAT (2)
  'nat-5-functions', 'nat-conntrack-magic',
  // Sprint SIGMA Fase 2 — DNAT (2)
  'prerouting-deep-dive', 'conntrack-dnat-mapping',
  // Sprint SIGMA Fase 2 — LAN/Proxy (2)
  'squid-flow-understood', 'squid-http-vs-https',
  // Sprint W — Módulo Zero (3)
  'terminal-basico', 'sudo-entendido', 'sysadmin-mindset',
  // Sprint W2 — RosettaStone (1)
  'rosetta-stone-explored',
  // Sprint I.3 — Hardening Linux (3)
  'ssh-hardened', 'sysctl-secured', 'apparmor-enabled',
  // Sprint I.4 — Docker Networking (3)
  'docker-installed', 'docker-bridge', 'docker-iptables',
  // Sprint F1-F3 — Trilha Fundamentos Linux (10)
  'fhs-explorado', 'comandos-praticados', 'editores-usados',
  'processos-controlados', 'permissoes-configuradas', 'discos-mapeados',
  'logs-lidos', 'backup-criado', 'script-escrito', 'tarefa-agendada',
  // Sprint I.5 — SSH com 2FA (3)
  'totp-instalado', 'pam-configurado', 'ssh-2fa-testado',
  // Sprint I.6 — Docker Compose (3)
  'compose-instalado', 'compose-stack', 'compose-networks',
  // Sprint F4 — Instalação de Programas (3)
  'apt-atualizado', 'pacote-instalado', 'repo-adicionado',
  // Sprint F5 — Processo de Boot (3)
  'bios-uefi-entendido', 'grub-configurado', 'systemd-targets-explorados',
  // Sprint F6 — Comandos Avançados (3)
  'sed-dominado', 'links-criados', 'compactacao-praticada',
  // Sprint F7 — Logs Centralizados com Rsyslog (3)
  'rsyslog-configurado', 'log-remoto-enviado', 'logrotate-configurado',
  // Sprint I.7 — Servidor DHCP (3)
  'dhcp-instalado', 'dhcp-subnet', 'dhcp-reserva',
  // Sprint I.8 — Samba File Sharing (3)
  'samba-instalado', 'samba-share', 'samba-windows',
  // Sprint I.9 — Apache Web Server (3)
  'apache-instalado', 'apache-vhost', 'apache-ssl',
  // Sprint I.10 — OpenVPN (3)
  'openvpn-instalado', 'openvpn-pki', 'openvpn-cliente',
  // Sprint I.11 — Traefik Proxy Reverso (3)
  'traefik-instalado', 'traefik-https', 'traefik-middleware',
  // Sprint I.12 — LDAP / OpenLDAP (3)
  'ldap-instalado', 'ldap-usuarios', 'ldap-autenticacao',
  // Sprint I.13 — Pi-hole (3)
  'pihole-instalado', 'pihole-dhcp', 'pihole-bloqueando',
  // Sprint I.14 — Ansible (3)
  'ansible-instalado', 'ansible-playbook', 'ansible-roles',
  // Sprint I.15 — Prometheus + Grafana (3)
  'monitoring-instalado', 'monitoring-dashboard', 'monitoring-alertas',
  // Sprint I.16 — Kubernetes / K3s (3)
  'k8s-instalado', 'k8s-deploy', 'k8s-network',
  // Sprint I.17 — Terraform IaC (3)
  'terraform-instalado', 'terraform-plan', 'terraform-modulos',
]
// Total: 127 checkpoints
```

---

## Micro-animação ao marcar (Sprint ANIM)

Ao marcar qualquer checkpoint, o ícone `CheckCircle2` recebe um pop spring automático via CSS:

```css
/* app/globals.css */
@keyframes checklist-pop {
  0%   { transform: scale(0.3); opacity: 0; }
  55%  { transform: scale(1.22); opacity: 1; }
  80%  { transform: scale(0.92); }
  100% { transform: scale(1); }
}
button > svg.text-ok {
  animation: checklist-pop 0.28s ease-out;
}
```

**Funciona em todos os 15+ arquivos sem nenhuma mudança de JSX** — quando `checked` muda para `true`, React monta um novo elemento `<CheckCircle2 className="text-ok">`, e a CSS mount-animation dispara automaticamente.

---

## Linux Ninja — Threshold

```typescript
// 75% de 127 checkpoints = 95
if (Object.values(checklist).filter(v => v).length >= 95) unlockBadge('linux-ninja');
```

---
[← Voltar ao indice](README.md)
