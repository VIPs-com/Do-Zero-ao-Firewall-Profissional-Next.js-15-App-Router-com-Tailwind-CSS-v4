import type { Metadata } from 'next';

/*
 * CONFIGURAÇÃO CENTRAL DE SEO
 * ============================================================================
 * Fonte única de verdade para metadados, Open Graph e Twitter Cards.
 *
 * Para adicionar SEO a uma nova rota:
 *   1. Adicione uma entrada em ROUTE_SEO com título e descrição
 *   2. Crie app/<rota>/layout.tsx importando buildMetadata(ROUTE_SEO['<rota>'])
 *
 * As páginas internas permanecem 'use client' — apenas o layout.tsx da rota
 * é Server Component, o que permite exportar metadata.
 * ============================================================================
 */

export const SITE_CONFIG = {
  name: 'Workshop Linux',
  title: 'Workshop Linux — Do Zero ao Firewall Profissional',
  description:
    'Plataforma educacional gratuita em português sobre segurança de redes Linux: iptables, nftables, NAT, DNS BIND9, SSL/TLS, VPN IPSec, Squid Proxy e Port Knocking. Laboratório real com WAN, DMZ e LAN.',
  /*
   * URL canônica — troque por workshop-linux.example.com quando deployar.
   * Também pode ser sobrescrita via variável de ambiente NEXT_PUBLIC_SITE_URL.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://workshop-linux.local',
  locale: 'pt_BR',
  author: 'Workshop Linux',
  keywords: [
    'linux',
    'firewall',
    'iptables',
    'nftables',
    'segurança de redes',
    'network security',
    'DNS BIND9',
    'SSL/TLS',
    'VPN IPSec',
    'Squid Proxy',
    'Port Knocking',
    'NAT',
    'DMZ',
    'curso gratuito',
    'workshop',
    'Ubuntu',
    'Debian',
  ],
  themeColor: '#e05a2b',
  ogImage: '/opengraph-image',
} as const;

export interface RouteSEO {
  title: string;
  description: string;
  keywords?: readonly string[];
}

/*
 * SEO por rota.
 * Títulos curtos (o template "| Workshop Linux" é aplicado automaticamente).
 * Descrições entre 120-160 caracteres para maximizar display em SERPs.
 */
export const ROUTE_SEO = {
  '/': {
    title: 'Do Zero ao Firewall Profissional',
    description:
      'Aprenda segurança de redes Linux na prática: 24 tópicos, laboratório WAN/DMZ/LAN, quiz gamificado e certificado de conclusão. 100% gratuito, em português.',
  },
  '/dashboard': {
    title: 'Dashboard de Progresso',
    description:
      'Acompanhe seu progresso no Workshop Linux: badges desbloqueados, checklist de lab, pontuação do quiz e estatísticas de exploração.',
  },
  '/topicos': {
    title: 'Índice de Tópicos',
    description:
      '24 tópicos práticos sobre firewall Linux, DNS, SSL, VPN, Proxy e Port Knocking. Organize seu estudo por camada OSI.',
  },
  '/quiz': {
    title: 'Quiz de Certificação',
    description:
      '24 questões sobre iptables, NAT, DNS, SSL, Squid, VPN IPSec e port knocking. Teste seus conhecimentos e conquiste badges.',
  },
  '/certificado': {
    title: 'Certificado de Conclusão',
    description:
      'Gere seu certificado de conclusão do Workshop Linux após completar o quiz (80%+) e o checklist (90%+) do laboratório.',
  },
  '/instalacao': {
    title: 'Instalação e Fundação do Laboratório',
    description:
      'Monte o laboratório Linux com três zonas (WAN, DMZ, LAN), configure IP forwarding do kernel e prepare o roteamento entre interfaces.',
  },
  '/wan-nat': {
    title: 'WAN & NAT — Acesso à Internet',
    description:
      'As 5 funções simultâneas do firewall (Roteador+Filtro+Tradutor+Proxy+Guardião), SNAT, MASQUERADE e o mapeamento IDA/VOLTA automático do conntrack.',
  },
  '/dns': {
    title: 'DNS com BIND9 — Servidor Autoritativo',
    description:
      'Configure um servidor DNS BIND9 completo: zonas direta e reversa, registros SOA/NS/A/PTR, recursividade controlada e integração com firewall.',
  },
  '/web-server': {
    title: 'Servidor Web & PKI',
    description:
      'Publique um servidor web, gere certificados SSL com OpenSSL, entenda cadeia de certificação (PKI) e prepare o backend para o reverse proxy.',
  },
  '/nginx-ssl': {
    title: 'Nginx Reverse Proxy com SSL/TLS',
    description:
      'Configure Nginx como reverse proxy com terminação SSL/TLS, redirect HTTP→HTTPS, HSTS e headers de segurança para produção.',
  },
  '/lan-proxy': {
    title: 'Squid Proxy para LAN',
    description:
      'Fluxo completo de navegação t=0ms→t=52ms. Por que HTTPS só permite bloquear por dstdomain — o Squid vê a URL completa só no HTTP.',
  },
  '/dnat': {
    title: 'DNAT & Port Forwarding',
    description:
      'PREROUTING pelo kernel: 5 hooks Netfilter, troca cirúrgica do IP, conntrack IDA/VOLTA e tcpdump duplo antes e depois do DNAT.',
  },
  '/port-knocking': {
    title: 'Port Knocking — SSH Invisível',
    description:
      'SSH invisível para port scans. Script ~/entrar.sh, janela de 10s e por que 847 bots tentam SSH enquanto Port Knocking registra 0.',
  },
  '/vpn-ipsec': {
    title: 'VPN IPSec com StrongSwan',
    description:
      'Monte um túnel VPN site-to-site com IPSec e StrongSwan (IKEv2, PSK, NAT-T). Conecte LANs remotas através da WAN com criptografia forte.',
  },
  '/ataques-avancados': {
    title: 'Ataques Avançados & Reconhecimento',
    description:
      'Conheça vetores de ataque avançados contra firewalls: fragmentação de pacotes, timing attacks, DNS rebinding e técnicas de bypass.',
  },
  '/pivoteamento': {
    title: 'Pivoteamento & Riscos da DMZ',
    description:
      'Entenda como atacantes pivotam da DMZ para a LAN e aprenda a mitigar esses riscos com segmentação e regras FORWARD restritivas.',
  },
  '/audit-logs': {
    title: 'Audit Logs & Monitoramento',
    description:
      'Auditoria forense de Port Knocking com tail -f awk, scripts audit-knock e knock-monitor. Correlação de batidas com logins SSH.',
  },
  '/nftables': {
    title: 'nftables — Substituto Moderno do iptables',
    description:
      'Migre do iptables para nftables: sintaxe unificada, sets, maps, dicionários e melhor performance. O futuro do firewall no Linux.',
  },
  '/evolucao': {
    title: 'Evolução do Projeto',
    description:
      'Linha do tempo da evolução do Workshop Linux: sprints concluídos, roadmap futuro e decisões técnicas do projeto.',
  },
  '/glossario': {
    title: 'Glossário Técnico',
    description:
      'Glossário com termos essenciais de segurança de redes: ACL, conntrack, PKI, DMZ, NAT, IKE, Netfilter, VLAN e PSK.',
  },
  '/cheat-sheet': {
    title: 'Cheat Sheet — Comandos Essenciais',
    description:
      'Referência rápida dos comandos mais usados no workshop: iptables, nftables, tcpdump, dig, nmap, ss, ipsec, nginx, squid e sysctl.',
  },
  '/wireguard': {
    title: 'WireGuard — VPN Moderna com Curve25519',
    description:
      'Configure uma VPN WireGuard do zero: geração de chaves, wg0.conf servidor e cliente, integração com iptables e roteamento entre peers.',
  },
  '/fail2ban': {
    title: 'Fail2ban — Proteção contra Brute Force',
    description:
      'Proteja SSH, Nginx e outros serviços com Fail2ban: jails, filtros regex, ações de ban, integração com iptables e monitoramento de logs.',
  },
  '/docker': {
    title: 'Docker Networking — Redes, iptables e Segurança',
    description:
      'Entenda como o Docker manipula o iptables automaticamente: bridge networks, port mapping como DNAT, chain DOCKER-USER e isolamento de containers.',
    keywords: ['Docker', 'Docker networking', 'bridge network', 'iptables Docker', 'containers Linux'],
  },
  '/hardening': {
    title: 'Hardening Linux — SSH, sysctl e AppArmor',
    description:
      'Fortifique seu servidor Linux: desative autenticação por senha no SSH, aplique sysctl de segurança (SYN cookies, ASLR) e configure AppArmor com perfis de confinamento.',
    keywords: ['hardening', 'SSH', 'sysctl', 'AppArmor', 'segurança Linux'],
  },
  '/docker-compose': {
    title: 'Docker Compose — Stacks Multi-Container com Redes e Volumes',
    description:
      'Orquestre stacks completas com Docker Compose: docker-compose.yml, redes declarativas frontend/backend/internal, volumes persistentes, secrets e .env files.',
    keywords: ['Docker Compose', 'docker-compose.yml', 'stack multi-container', 'redes Docker', 'volumes Docker', 'orchestration'],
  },
  '/ssh-2fa': {
    title: 'SSH com 2FA — TOTP com Google Authenticator',
    description:
      'Adicione autenticação de dois fatores ao SSH com TOTP: instale libpam-google-authenticator, configure /etc/pam.d/sshd e sshd_config, gere QR code e teste com segurança.',
    keywords: ['SSH 2FA', 'TOTP', 'Google Authenticator', 'libpam', 'autenticação dois fatores', 'SSH segurança'],
  },
  '/offline': {
    title: 'Sem conexão',
    description: 'Você está offline. Verifique sua conexão de rede.',
  },
  '/laboratorio': {
    title: 'Ambientes de Laboratório — VirtualBox, KVM e Proxmox',
    description:
      'Compare VirtualBox, KVM e Proxmox para montar seu laboratório Linux. Guia completo com instalação do KVM/libvirt, criação de VMs e tabela de equivalência.',
    keywords: ['VirtualBox', 'KVM', 'libvirt', 'Proxmox', 'virtualização', 'laboratório Linux'],
  },
  '/proxmox': {
    title: 'Proxmox VE — Laboratório de Produção',
    description:
      'Monte um laboratório profissional com Proxmox VE: instalação, bridges de rede (vmbr0/vmbr1/vmbr2), criação das 4 VMs, snapshots e backup com vzdump.',
    keywords: ['Proxmox', 'Proxmox VE', 'virtualização', 'vmbr', 'snapshot', 'vzdump', 'laboratório'],
  },
  // ── Trilha Fundamentos Linux (v2.0) ─────────────────────────────────────────
  '/fundamentos': {
    title: 'Fundamentos Linux — Trilha para Iniciantes',
    description:
      'Comece do zero no Linux: 10 módulos que ensinam FHS, comandos, editores, processos, permissões, discos, logs, backup, shell script e cron.',
    keywords: ['Linux iniciante', 'fundamentos Linux', 'aprender Linux', 'terminal Linux', 'Ubuntu básico'],
  },
  '/fhs': {
    title: 'Estrutura do Sistema Linux (FHS)',
    description:
      'Módulo 01 da trilha Fundamentos: entenda /etc, /var, /usr, /home, /tmp e o mapa do sistema Linux. Comparação com pastas do Windows.',
    keywords: ['FHS', 'estrutura de diretórios Linux', '/etc', '/var', '/usr', 'hierarquia Linux'],
  },
  '/comandos': {
    title: 'Comandos Essenciais Linux',
    description:
      'Módulo 02: ls, cd, cp, mv, rm, grep, find, cat, less e o operador pipe. Domine o terminal Linux do zero.',
    keywords: ['comandos Linux', 'terminal Linux', 'ls', 'grep', 'find', 'pipe', 'bash básico'],
  },
  '/editores': {
    title: 'Editores de Texto — nano e VIM',
    description:
      'Módulo 03: use nano para edições rápidas e VIM para produção. Modos, atalhos essenciais e como sair do vim.',
    keywords: ['nano', 'VIM', 'editor de texto Linux', 'vim iniciante', 'nano tutorial'],
  },
  '/processos': {
    title: 'Gerenciamento de Processos no Linux',
    description:
      'Módulo 04: ps, top, htop, kill, systemctl e jobs. Controle processos em execução como no Gerenciador de Tarefas do Windows.',
    keywords: ['ps', 'top', 'htop', 'kill', 'systemctl', 'processos Linux', 'gerenciamento Linux'],
  },
  '/permissoes': {
    title: 'Permissões e Usuários no Linux',
    description:
      'Módulo 05: chmod, chown, useradd, groups e sudo. Entenda rwxr-xr-x e como gerenciar usuários no Linux.',
    keywords: ['chmod', 'chown', 'useradd', 'sudo', 'permissões Linux', 'usuários Linux'],
  },
  '/discos': {
    title: 'Discos e Partições no Linux',
    description:
      'Módulo 06: fdisk, lsblk, mount, df, du e dd. Gerencie discos, partições e sistemas de arquivo no Linux.',
    keywords: ['fdisk', 'lsblk', 'mount', 'df', 'du', 'dd', 'partições Linux', 'discos Linux'],
  },
  '/logs-basicos': {
    title: 'Logs e Monitoramento Básico no Linux',
    description:
      'Módulo 07: journalctl, /var/log/, tail -f e grep. Leia e analise logs do sistema como um SysAdmin.',
    keywords: ['journalctl', 'logs Linux', '/var/log/', 'tail -f', 'rsyslog', 'monitoramento Linux'],
  },
  '/backup': {
    title: 'Backup e Restauração no Linux',
    description:
      'Módulo 08: rsync, tar e scp. Proteja seus dados com backups locais, remotos e agendados no Linux.',
    keywords: ['rsync', 'tar', 'scp', 'backup Linux', 'restauração Linux', 'cópia de segurança'],
  },
  '/shell-script': {
    title: 'Shell Script — Automatize o Linux',
    description:
      'Módulo 09: variáveis, if, for, funções e $() em bash. Escreva scripts de automação para administração de sistemas.',
    keywords: ['shell script', 'bash script', 'automação Linux', 'scripting bash', 'variáveis bash'],
  },
  '/cron': {
    title: 'Agendamento de Tarefas — cron e systemd timers',
    description:
      'Módulo 10: crontab -e, @reboot, systemd timers e at. Agende tarefas periódicas e automatize manutenção do servidor.',
    keywords: ['cron', 'crontab', 'systemd timers', 'agendamento Linux', 'tarefas periódicas'],
  },
} as const satisfies Record<string, RouteSEO>;

export type RoutePath = keyof typeof ROUTE_SEO;

/**
 * Constrói um objeto Metadata completo para uma rota, incluindo
 * Open Graph, Twitter Cards e canonical URL.
 */
export function buildMetadata(route: RoutePath): Metadata {
  const seo = ROUTE_SEO[route] as RouteSEO;
  const canonical = route === '/' ? SITE_CONFIG.url : `${SITE_CONFIG.url}${route}`;
  const fullTitle =
    route === '/' ? SITE_CONFIG.title : `${seo.title} | ${SITE_CONFIG.name}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: [...SITE_CONFIG.keywords, ...(seo.keywords ?? [])],
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: canonical,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description: seo.description,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: [SITE_CONFIG.ogImage],
    },
  };
}
