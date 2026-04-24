// src/data/courseOrder.ts
// Sequência linear dos 23 módulos do curso — usada pelo ModuleNav para navegação Anterior/Próximo.
// Nota: /web-server NÃO entra aqui — é página de referência, não módulo do curso.
//
// TRILHA FUNDAMENTOS (v2.0): 10 módulos para iniciantes em Linux.
// Trilha separada — não integrada ao COURSE_ORDER principal.

export interface CourseModule {
  path: string;
  title: string;
  prev: string | null;
  next: string | null;
}

export const COURSE_ORDER: CourseModule[] = [
  { path: '/instalacao',        title: 'Instalação & IP',            prev: null,                 next: '/wan-nat' },
  { path: '/wan-nat',           title: 'WAN & NAT',                  prev: '/instalacao',        next: '/dns' },
  { path: '/dns',               title: 'DNS',                        prev: '/wan-nat',           next: '/nginx-ssl' },
  { path: '/nginx-ssl',         title: 'Nginx & SSL/TLS',            prev: '/dns',               next: '/lan-proxy' },
  { path: '/lan-proxy',         title: 'LAN & Proxy Squid',          prev: '/nginx-ssl',         next: '/dnat' },
  { path: '/dnat',              title: 'Port Forwarding DNAT',       prev: '/lan-proxy',         next: '/port-knocking' },
  { path: '/port-knocking',     title: 'Port Knocking',              prev: '/dnat',              next: '/vpn-ipsec' },
  { path: '/vpn-ipsec',         title: 'VPN IPSec',                  prev: '/port-knocking',     next: '/wireguard' },
  { path: '/wireguard',         title: 'WireGuard',                  prev: '/vpn-ipsec',         next: '/nftables' },
  { path: '/nftables',          title: 'nftables',                   prev: '/wireguard',         next: '/fail2ban' },
  { path: '/fail2ban',          title: 'Fail2ban',                   prev: '/nftables',          next: '/hardening' },
  { path: '/hardening',         title: 'Hardening Linux',            prev: '/fail2ban',          next: '/ssh-2fa' },
  { path: '/ssh-2fa',           title: 'SSH com 2FA (TOTP)',         prev: '/hardening',         next: '/docker' },
  { path: '/docker',            title: 'Docker Networking',          prev: '/ssh-2fa',           next: '/audit-logs' },
  { path: '/audit-logs',        title: 'Audit & Logs',               prev: '/docker',            next: '/ataques-avancados' },
  { path: '/ataques-avancados', title: 'Ataques Avançados',          prev: '/audit-logs',        next: '/pivoteamento' },
  { path: '/pivoteamento',      title: 'Pivoteamento',               prev: '/ataques-avancados', next: '/laboratorio' },
  { path: '/laboratorio',       title: 'Laboratório',                prev: '/pivoteamento',      next: '/proxmox' },
  { path: '/proxmox',           title: 'Proxmox VE',                 prev: '/laboratorio',       next: '/evolucao' },
  { path: '/evolucao',          title: 'Evolução & Próximos Passos', prev: '/proxmox',           next: '/cheat-sheet' },
  { path: '/cheat-sheet',       title: 'Cheat Sheet',                prev: '/evolucao',          next: '/glossario' },
  { path: '/glossario',         title: 'Glossário',                  prev: '/cheat-sheet',       next: '/quiz' },
  { path: '/quiz',              title: 'Quiz',                       prev: '/glossario',         next: '/certificado' },
  { path: '/certificado',       title: 'Certificado',                prev: '/quiz',              next: null },
];

// ── Trilha Fundamentos Linux (v2.0) — iniciantes ──────────────────────────────
// Sequência paralela ao COURSE_ORDER. Passada como prop order={FUNDAMENTOS_ORDER}
// ao ModuleNav nas páginas da trilha.
export const FUNDAMENTOS_ORDER: CourseModule[] = [
  { path: '/fhs',          title: 'Estrutura do Sistema (FHS)',   prev: null,          next: '/comandos' },
  { path: '/comandos',     title: 'Comandos Essenciais',          prev: '/fhs',        next: '/editores' },
  { path: '/editores',     title: 'Editores de Texto',            prev: '/comandos',   next: '/processos' },
  { path: '/processos',    title: 'Gerenciamento de Processos',   prev: '/editores',   next: '/permissoes' },
  { path: '/permissoes',   title: 'Permissões e Usuários',        prev: '/processos',  next: '/discos' },
  { path: '/discos',       title: 'Discos e Partições',           prev: '/permissoes', next: '/logs-basicos' },
  { path: '/logs-basicos', title: 'Logs e Monitoramento',         prev: '/discos',     next: '/backup' },
  { path: '/backup',       title: 'Backup e Restauração',         prev: '/logs-basicos', next: '/shell-script' },
  { path: '/shell-script', title: 'Shell Script',                 prev: '/backup',     next: '/cron' },
  { path: '/cron',         title: 'Agendamento de Tarefas',       prev: '/shell-script', next: null },
];
