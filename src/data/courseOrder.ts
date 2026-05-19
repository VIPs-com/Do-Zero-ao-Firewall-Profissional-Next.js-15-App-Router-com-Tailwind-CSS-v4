// src/data/courseOrder.ts
// Sequência linear dos 25 módulos do curso — usada pelo ModuleNav para navegação Anterior/Próximo.
// Nota: /web-server NÃO entra aqui — é página de referência, não módulo do curso.
//
// TRILHA FUNDAMENTOS (v2.0): 15 módulos para iniciantes em Linux.
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
  { path: '/docker',            title: 'Docker Networking',          prev: '/ssh-2fa',           next: '/docker-compose' },
  { path: '/docker-compose',    title: 'Docker Compose',             prev: '/docker',            next: '/audit-logs' },
  { path: '/audit-logs',        title: 'Audit & Logs',               prev: '/docker-compose',    next: '/ataques-avancados' },
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

// ── Módulos Avançados (v3.0 → v5.0) — Servidores, Infraestrutura e Cloud ──────
// 35 módulos — usados no índice /avancados e na navegação ModuleNav (prev/next
// derivados do índice). Badge: advanced-master.
export interface SimpleModule {
  path: string;
  title: string;
}

export const ADVANCED_ORDER: SimpleModule[] = [
  // v3.0 — Servidores e Serviços (9 módulos; ssh-proxy está no FUNDAMENTOS_ORDER como F15)
  { path: '/dhcp',          title: 'Servidor DHCP' },
  { path: '/samba',         title: 'Samba — File Sharing' },
  { path: '/apache',        title: 'Servidor Apache' },
  { path: '/openvpn',       title: 'OpenVPN' },
  { path: '/traefik',       title: 'Traefik Proxy Reverso' },
  { path: '/ldap',          title: 'LDAP / OpenLDAP' },
  { path: '/pihole',        title: 'Pi-hole' },
  { path: '/nfs',           title: 'NFS — Network File System' },
  { path: '/haproxy',       title: 'HAProxy — Load Balancer' },
  // v4.0 — Infraestrutura Moderna (8 módulos)
  { path: '/ansible',       title: 'Ansible para SysAdmins' },
  { path: '/monitoring',    title: 'Prometheus + Grafana' },
  { path: '/kubernetes',    title: 'Kubernetes / K3s' },
  { path: '/terraform',     title: 'Terraform IaC' },
  { path: '/suricata',      title: 'Suricata IDS/IPS' },
  { path: '/ebpf',          title: 'eBPF & XDP' },
  { path: '/service-mesh',  title: 'Service Mesh (Istio)' },
  { path: '/sre',           title: 'SRE & SLOs' },
  { path: '/vault',         title: 'HashiCorp Vault' },
  // v5.0 — Cloud & Platform Engineering (4 módulos)
  { path: '/cicd',          title: 'CI/CD com GitHub Actions' },
  { path: '/opnsense',      title: 'OPNsense' },
  { path: '/nextcloud',     title: 'Nextcloud' },
  { path: '/ebpf-avancado', title: 'eBPF Avançado + Cilium' },
  // Sprint FORTALEZA — hardening de host Proxmox (CrowdSec, Tailscale, PBS)
  { path: '/crowdsec',              title: 'CrowdSec — IPS Colaborativo' },
  { path: '/tailscale',             title: 'Tailscale — VPN Mesh Zero-Port' },
  { path: '/proxmox-backup-server', title: 'Proxmox Backup Server' },
  // Sprint GPG — OpenPGP / GPG
  { path: '/gpg',                   title: 'OpenPGP / GPG' },
  // Sprint PILARES — LVM/RAID, Banco de Dados, Servidor de E-mail
  { path: '/lvm-raid',              title: 'LVM, RAID & Armazenamento' },
  { path: '/banco-de-dados',        title: 'Banco de Dados' },
  { path: '/mail-server',           title: 'Servidor de E-mail' },
  // Sprint REDES-L23 — Redes Camada 2 & 3 e Alta Disponibilidade
  { path: '/redes-l2-l3',           title: 'Redes Camada 2 & 3' },
  { path: '/alta-disponibilidade',  title: 'Alta Disponibilidade' },
  // Sprint CLOUD/GIT/CARREIRA — Fase 3 do Diagnóstico Curricular
  { path: '/cloud-publica',         title: 'Cloud Pública (AWS)' },
  { path: '/git',                   title: 'Git — Controle de Versão' },
  { path: '/carreira',              title: 'Carreira' },
  // Capstone — Resposta a Incidentes (Sprint CÓDICE)
  { path: '/resposta-incidentes', title: 'Resposta a Incidentes (DFIR)' },
];

// ── Trilha Fundamentos Linux (v2.0) — iniciantes ──────────────────────────────
// 15 módulos
// Sequência paralela ao COURSE_ORDER. Passada como prop order={FUNDAMENTOS_ORDER}
// ao ModuleNav nas páginas da trilha.
export const FUNDAMENTOS_ORDER: CourseModule[] = [
  { path: '/fhs',          title: 'Estrutura do Sistema (FHS)',   prev: null,          next: '/comandos' },
  { path: '/comandos',     title: 'Comandos Essenciais',          prev: '/fhs',        next: '/editores' },
  { path: '/editores',     title: 'Editores de Texto',            prev: '/comandos',   next: '/processos' },
  { path: '/processos',    title: 'Gerenciamento de Processos',   prev: '/editores',   next: '/permissoes' },
  { path: '/permissoes',   title: 'Permissões e Usuários',        prev: '/processos',  next: '/usuarios' },
  { path: '/usuarios',     title: 'Gerenciamento de Usuários',    prev: '/permissoes', next: '/discos' },
  { path: '/discos',       title: 'Discos e Partições',           prev: '/usuarios',   next: '/logs-basicos' },
  { path: '/logs-basicos', title: 'Logs e Monitoramento',         prev: '/discos',     next: '/backup' },
  { path: '/backup',       title: 'Backup e Restauração',         prev: '/logs-basicos', next: '/shell-script' },
  { path: '/shell-script', title: 'Shell Script',                 prev: '/backup',     next: '/cron' },
  { path: '/cron',         title: 'Agendamento de Tarefas',       prev: '/shell-script', next: '/pacotes' },
  { path: '/pacotes',      title: 'Instalação de Programas',      prev: '/cron',         next: '/boot' },
  { path: '/boot',               title: 'Processo de Boot',    prev: '/pacotes',           next: '/comandos-avancados' },
  { path: '/comandos-avancados', title: 'Comandos Avançados',  prev: '/boot',              next: '/rsyslog' },
  { path: '/rsyslog',            title: 'Logs Centralizados (Rsyslog)', prev: '/comandos-avancados', next: '/ssh-proxy' },
  { path: '/ssh-proxy',          title: 'SSH como Proxy SOCKS',         prev: '/rsyslog',            next: '/troubleshooting' },
  { path: '/troubleshooting',   title: 'Troubleshooting de Rede',      prev: '/ssh-proxy',          next: null },
];

// ── Handoff de fim-de-trilha (Sprint TRILHA-GUIADA) ───────────────────────────
// Quando o aluno chega ao ÚLTIMO módulo de uma trilha (next === null), o ModuleNav
// exibe um card guiando-o para a próxima etapa — orientação suave, sem bloqueio.
export interface TrailHandoff {
  /** Mensagem de conclusão exibida no card. */
  label: string;
  /** Rota de destino — primeiro módulo / índice da próxima trilha. */
  href: string;
  /** Nome da próxima etapa exibido no botão. */
  nextLabel: string;
}

export const TRAIL_HANDOFF: Record<string, TrailHandoff> = {
  '/troubleshooting':     { label: 'Trilha Fundamentos concluída',  href: '/instalacao', nextLabel: 'Trilha Firewall' },
  '/certificado':         { label: 'Trilha Firewall concluída',     href: '/avancados',  nextLabel: 'Trilha Avançada' },
  '/resposta-incidentes': { label: 'Trilha Avançada concluída',     href: '/jornada',    nextLabel: 'sua Jornada completa' },
};
