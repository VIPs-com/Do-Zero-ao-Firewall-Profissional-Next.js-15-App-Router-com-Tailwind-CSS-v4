# Sistema de Gamificacao — Badges & Progresso

## Arquivo central: `src/context/BadgeContext.tsx`

Gerencia quatro dimensões de progresso:
- **Badges** — 26 conquistas desbloqueáveis (5 são milestones com modal de celebração)
- **Páginas visitadas** — para badges de exploração e course-master
- **Checkpoints** — 60 validações técnicas concluídas (ALL_CHECKLIST_IDS)
- **Quiz score** — 0–100, persiste em localStorage

---

## Tabela de badges (26 total)

| Ícone | Título | ID | Como desbloquear |
|---|---|---|---|
| 🥉 | Iniciante | `quiz-beginner` | Completar o quiz pela 1ª vez (score > 0) |
| 🥇 | Expert | `quiz-expert` | Score ≥ 80% no quiz |
| **🏆** | **Mestre** | **`quiz-master`** | **Score 100% no quiz** ★ milestone |
| 🗺️ | Explorador | `explorer` | Visitar 5+ páginas |
| 🤿 | Mergulhador | `deep-diver` | Visitar todas as 20 páginas de conteúdo |
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
| **🥷** | **Linux Ninja** | **`linux-ninja`** | **≥ 45 checkpoints (75% dos 60)** ★ milestone |
| 💀 | Pivoting Master | `pivoting-master` | pivoting-risk |
| 🛡️ | Defensor da Topologia | `defensor-topologia` | Clicar em 3+ riscos da topologia |
| ⏳ | Viajante do Tempo | `time-traveler` | Importar progresso via JSON |
| 🔐 | WireGuard Master | `wireguard-master` | wg-keys + wg-server + wg-tunnel |
| 🚫 | Fail2ban Master | `fail2ban-master` | f2b-install + f2b-sshd + f2b-ban-test |
| 🖥️ | Proxmox Pioneer | `proxmox-pioneer` | proxmox-iso + proxmox-bridges + proxmox-vms + proxmox-snapshot |
| 🏅 | Agente de Resgate | `resgate-gold` | Visitar /laboratorio + /proxmox |
| **🔬** | **SIGMA Master** | **`sigma-master`** | **11 checkpoints avançados (Fase 2)** ★ milestone |
| 🧭 | Explorador de Mundos | `explorador-mundos` | terminal-basico + sudo-entendido + sysadmin-mindset + rosetta-stone-explored |
| **🎯** | **Mestre do Curso** | **`course-master`** | **Visitar todos os 21 módulos do COURSE_ORDER** ★ milestone |

> ★ **Milestone badges** disparam o `MilestoneCelebration` modal em vez do toast de 4s.
> `course-master` e `quiz-master` disparam também confetti (canvas-confetti, lazy-loaded).

---

## Notificações por tier

| Tier | Badges | Feedback |
|------|--------|----------|
| **Comum** | 21 badges | Toast slide-in 4s (canto inferior direito, z-50) |
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

// Passo 3 — No componente ou useEffect que dispara o unlock
const { unlockBadge } = useBadges();
unlockBadge('meu-badge');

// Passo 4 (opcional) — se for milestone, adicionar ao Set
const MILESTONE_BADGES = new Set<BadgeId>([
  ..., 'meu-badge'
]);
```

---

## Checkpoints de validação (60 IDs — ALL_CHECKLIST_IDS)

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
]
// Total: 60 checkpoints
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
[← Voltar ao indice](README.md)
