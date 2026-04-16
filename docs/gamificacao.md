# Sistema de Gamificacao — Badges & Progresso

## Arquivo central: `src/context/BadgeContext.tsx`

Gerencia três dimensões de progresso:
- **Badges** — conquistas desbloqueáveis (21 total)
- **Páginas visitadas** — para badges de exploração
- **Checkpoints** — validações técnicas concluídas (35 total)

## Tabela de badges

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
| 🛡️ | Defensor da Topologia | `defensor-topologia` | Clicar em todos os riscos da topologia |
| ⏳ | Time Traveler | `time-traveler` | Importar progresso via JSON (Sprint J) |
| 🔐 | WireGuard Master | `wireguard-master` | Completar checklist do WireGuard |
| 🚫 | Fail2ban Master | `fail2ban-master` | Completar checklist do Fail2ban |

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

// Passo 3 — No componente que dispara o unlock
const { unlockBadge } = useBadges();
unlockBadge('meu-badge');
```

## Exemplo completo de componente com badge

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

## Checkpoints de validação (35 IDs)

```typescript
// src/context/BadgeContext.tsx — ALL_CHECKLIST_IDS
[
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona',
  'proxy-bloqueio', 'web-server', 'dnat-funciona', 'port-knocking',
  'snat-config', 'established-config', 'forward-config', 'audit-log',
  'dns-recursivo', 'dns-reverso', 'dns-firewall', 'dnat-web',
  'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping',
  'vpn-psk', 'pivoting-risk',
  // Sprint I.1 — WireGuard
  'wg-keys', 'wg-server', 'wg-tunnel',
  // Sprint I.2 — Fail2ban
  'f2b-install', 'f2b-sshd', 'f2b-ban-test',
  // Sprint R — Alinhamento com material original (Aula 2)
  'firewall-persistence', 'firewall-service', 'firewall-log',
]
```

---
[← Voltar ao indice](README.md)
