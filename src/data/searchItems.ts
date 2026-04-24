import { 
  Book, 
  Shield, 
  Globe, 
  Terminal, 
  Lock, 
  Zap, 
  Home, 
  Layout, 
  FileText, 
  Award,
  Network,
  Activity,
  TrendingUp,
  Eye,
  Sword,
  Server,
  GitMerge,
  Radio
} from 'lucide-react';
import React from 'react';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'Tópico' | 'Glossário' | 'Página' | 'Comando';
  href: string;
  icon: React.ElementType;
}

export const SEARCH_ITEMS: SearchItem[] = [

  // ─── Páginas ────────────────────────────────────────────────────────────────
  { id: 'p-home',       title: 'Início',        description: 'Página inicial com topologia interativa da rede', category: 'Página', href: '/',            icon: Home },
  { id: 'p-dashboard',  title: 'Dashboard',        description: 'Seu progresso, badges e checkpoints concluídos',  category: 'Página', href: '/dashboard',          icon: Layout },
  { id: 'p-modulos',    title: 'Módulos do Curso', description: 'Mapa visual dos 21 módulos com progresso visitado/pendente', category: 'Página', href: '/dashboard#modulos', icon: Layout },
  { id: 'p-topics',     title: 'Tópicos',       description: 'Índice completo de todos os módulos do workshop', category: 'Página', href: '/topicos',      icon: Book },
  { id: 'p-cheat',      title: 'Cheat Sheet',   description: 'Referência rápida de comandos iptables e Linux',  category: 'Página', href: '/cheat-sheet', icon: FileText },
  { id: 'p-glossary',   title: 'Glossário',     description: 'Dicionário de termos técnicos de redes e segurança', category: 'Página', href: '/glossario', icon: Book },
  { id: 'p-quiz',       title: 'Quiz',          description: 'Teste seus conhecimentos e desbloqueie badges',   category: 'Página', href: '/quiz',         icon: Award },
  { id: 'p-cert',       title: 'Certificado',   description: 'Gere seu certificado de conclusão do workshop',   category: 'Página', href: '/certificado', icon: Award },
  { id: 'p-evolucao',   title: 'Evolução',      description: 'Roadmap tecnológico e linha do tempo do projeto', category: 'Página', href: '/evolucao',    icon: TrendingUp },
  { id: 't-roadmap-evolucao', title: 'Roadmap do Workshop v2.0/v3.0/v4.0', description: 'Fases futuras: Hardening, Docker, Kubernetes, eBPF, Observabilidade.', category: 'Tópico', href: '/evolucao#roadmap-evolucao', icon: TrendingUp },

  // ─── Tópicos (módulos técnicos) ─────────────────────────────────────────────
  { id: 't-install',  title: 'Instalação & Fundação', description: 'Configuração inicial do lab, IP forward e roteamento', category: 'Tópico', href: '/instalacao',       icon: Server },
  { id: 't-nat',      title: 'NAT & SNAT',            description: 'Masquerade, POSTROUTING e saída para internet',        category: 'Tópico', href: '/wan-nat',          icon: Network },
  { id: 't-dns',      title: 'DNS BIND9',             description: 'Servidor de nomes, zonas direta e reversa',           category: 'Tópico', href: '/dns',              icon: Terminal },
  { id: 't-websvr',   title: 'Web Server & PKI',      description: 'Nginx, OpenSSL, certificados e cadeia de confiança',  category: 'Tópico', href: '/web-server',       icon: Lock },
  { id: 't-nginx',    title: 'Nginx Reverse Proxy',   description: 'SSL termination, proxy_pass e headers de segurança',  category: 'Tópico', href: '/nginx-ssl',        icon: GitMerge },
  { id: 't-proxy',    title: 'Squid Proxy',           description: 'Controle de acesso, ACLs e filtragem de conteúdo',    category: 'Tópico', href: '/lan-proxy',        icon: Globe },
  { id: 't-dnat',     title: 'DNAT & Port Forwarding',description: 'Redirecionamento de portas para servidores internos', category: 'Tópico', href: '/dnat',             icon: Shield },
  { id: 't-knock',    title: 'Port Knocking',         description: 'Segurança por obscuridade — SSH invisível para scanners', category: 'Tópico', href: '/port-knocking', icon: Zap },
  { id: 't-vpn',      title: 'VPN IPSec',             description: 'Túneis site-to-site com StrongSwan e IKEv2',          category: 'Tópico', href: '/vpn-ipsec',        icon: Lock },
  { id: 't-attacks',  title: 'Ataques Avançados',     description: 'Reconhecimento ofensivo e vetores de ataque',         category: 'Tópico', href: '/ataques-avancados',icon: Sword },
  { id: 't-pivot',    title: 'Pivoteamento',          description: 'Riscos de lateral movement na DMZ',                  category: 'Tópico', href: '/pivoteamento',     icon: Activity },
  { id: 't-audit',    title: 'Audit Logs',            description: 'Monitoramento de tráfego, syslog e auditd',           category: 'Tópico', href: '/audit-logs',       icon: Eye },
  { id: 't-nftables', title: 'nftables',              description: 'Substituto moderno do iptables — sintaxe e equivalência', category: 'Tópico', href: '/nftables',     icon: Shield },
  { id: 't-hardening', title: 'Hardening Linux',     description: 'SSH seguro, sysctl de defesa e AppArmor — 3 camadas de proteção do servidor', category: 'Tópico', href: '/hardening',    icon: Shield },
  { id: 't-docker',   title: 'Docker Networking',   description: 'Redes bridge, port mapping = DNAT automático, chain DOCKER-USER e segurança de containers', category: 'Tópico', href: '/docker', icon: Server },

  // ─── Glossário ───────────────────────────────────────────────────────────────
  { id: 'g-acl',       title: 'ACL',        description: 'Access Control List — lista de regras de acesso', category: 'Glossário', href: '/glossario', icon: Shield },
  { id: 'g-conntrack', title: 'conntrack',  description: 'Módulo do kernel que rastreia estado das conexões', category: 'Glossário', href: '/glossario', icon: Activity },
  { id: 'g-iptables',  title: 'iptables',   description: 'Ferramenta de firewall padrão do Linux (legado)', category: 'Glossário', href: '/cheat-sheet', icon: Shield },
  { id: 'g-nftables',  title: 'nftables',   description: 'Substituto moderno do iptables desde o kernel 3.13', category: 'Glossário', href: '/nftables', icon: Shield },
  { id: 'g-pki',       title: 'PKI',        description: 'Public Key Infrastructure — gestão de certificados', category: 'Glossário', href: '/glossario', icon: Lock },
  { id: 'g-dmz',       title: 'DMZ',        description: 'Zona Desmilitarizada — rede intermediária entre WAN e LAN', category: 'Glossário', href: '/glossario', icon: Network },
  { id: 'g-nat',       title: 'NAT',        description: 'Network Address Translation — tradução de endereços IP', category: 'Glossário', href: '/wan-nat', icon: Network },
  { id: 'g-ike',       title: 'IKE',        description: 'Internet Key Exchange — protocolo de negociação do IPSec', category: 'Glossário', href: '/vpn-ipsec', icon: Lock },
  { id: 'g-netfilter', title: 'Netfilter',  description: 'Framework do kernel Linux que processa pacotes de rede', category: 'Glossário', href: '/glossario', icon: Shield },
  { id: 'g-vlan',      title: 'VLAN',       description: 'Virtual LAN — segmentação lógica de redes físicas', category: 'Glossário', href: '/glossario', icon: Network },
  { id: 'g-psk',       title: 'PSK',        description: 'Pre-Shared Key — chave pré-compartilhada para autenticação VPN', category: 'Glossário', href: '/vpn-ipsec', icon: Lock },

  // ─── Comandos ────────────────────────────────────────────────────────────────
  { id: 'c-ipt-list',    title: 'iptables -L',           description: 'Listar todas as regras de firewall ativas',         category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-ipt-nat',     title: 'iptables -t nat -L',    description: 'Listar regras da tabela NAT (SNAT/DNAT)',           category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-ipt-save',    title: 'iptables-save',         description: 'Exportar regras de firewall para arquivo',          category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-tcpdump',     title: 'tcpdump',               description: 'Capturar e analisar tráfego de rede em tempo real', category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-dig',         title: 'dig',                   description: 'Consultar registros DNS de um servidor específico', category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-nmap',        title: 'nmap',                  description: 'Scanner de portas e serviços na rede',              category: 'Comando', href: '/cheat-sheet', icon: Radio },
  { id: 'c-ss',          title: 'ss -tlnp',              description: 'Listar portas TCP abertas e processos associados',  category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-ipsec',       title: 'ipsec statusall',       description: 'Verificar status e SAs da VPN IPSec',              category: 'Comando', href: '/vpn-ipsec',   icon: Terminal },
  { id: 'c-named',       title: 'named-checkconf',       description: 'Validar sintaxe da configuração do BIND9',         category: 'Comando', href: '/dns',          icon: Terminal },
  { id: 'c-nginx-t',     title: 'nginx -t',              description: 'Verificar sintaxe da configuração do Nginx',       category: 'Comando', href: '/nginx-ssl',   icon: Terminal },
  { id: 'c-squid-k',     title: 'squid -k reconfigure',  description: 'Recarregar configuração do Squid sem reiniciar',   category: 'Comando', href: '/lan-proxy',   icon: Terminal },
  { id: 'c-sysctl',      title: 'sysctl ip_forward',     description: 'Verificar e ativar roteamento de pacotes no kernel', category: 'Comando', href: '/instalacao', icon: Terminal },
  { id: 'c-journalctl',  title: 'journalctl -u nginx',   description: 'Ver logs de um serviço systemd em tempo real',     category: 'Comando', href: '/audit-logs',  icon: Terminal },
  { id: 'c-nft-list',    title: 'nft list ruleset',      description: 'Listar todas as regras nftables ativas',           category: 'Comando', href: '/nftables',    icon: Terminal },

  // Sprint R — Comandos do material original
  { id: 'c-ipt-restore', title: 'iptables-restore',      description: 'Restaurar regras iptables a partir de arquivo',    category: 'Comando', href: '/wan-nat',      icon: Terminal },
  { id: 'c-systemctl-fw', title: 'systemctl enable firewall', description: 'Habilitar serviço de firewall para iniciar no boot', category: 'Comando', href: '/wan-nat', icon: Terminal },
  { id: 'c-wg-show',     title: 'wg show',               description: 'Mostrar interfaces WireGuard ativas e peers',      category: 'Comando', href: '/wireguard',   icon: Terminal },
  { id: 'c-f2b-status',  title: 'fail2ban-client status', description: 'Ver IPs banidos e estatísticas das jails',         category: 'Comando', href: '/fail2ban',    icon: Terminal },
  { id: 'c-conntrack',   title: 'conntrack -L',           description: 'Listar conexões rastreadas pelo kernel',           category: 'Comando', href: '/wan-nat',     icon: Terminal },
  { id: 'c-openssl-gen', title: 'openssl genrsa',         description: 'Gerar chave privada RSA para certificado SSL',     category: 'Comando', href: '/web-server',  icon: Terminal },
  { id: 'c-tcpdump-pcap', title: 'tcpdump -w captura.pcap', description: 'Capturar tráfego de rede em formato PCAP',       category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  // Sprint SIGMA — Ambientes de Lab + Certbot
  { id: 'p-laboratorio',  title: 'Ambientes de Laboratório', description: 'VirtualBox vs KVM vs Proxmox — qual usar para cada cenário', category: 'Tópico', href: '/laboratorio', icon: Server },
  { id: 'p-proxmox',      title: 'Proxmox VE',               description: 'Lab profissional: bridges, VMs, snapshots e cluster HA',    category: 'Tópico', href: '/proxmox',     icon: Server },
  { id: 'p-kvm',          title: 'KVM / libvirt',            description: 'Hypervisor nativo do Linux — virt-install e virsh',          category: 'Tópico', href: '/laboratorio', icon: Server },
  { id: 'c-certbot',      title: 'certbot --nginx',          description: 'Obter certificado Let\'s Encrypt com plugin Nginx',          category: 'Comando',        href: '/nginx-ssl',   icon: Terminal },
  { id: 'c-certbot-renew', title: 'certbot renew --dry-run', description: 'Testar renovação automática de certificado Let\'s Encrypt',  category: 'Comando',        href: '/nginx-ssl',   icon: Terminal },
  { id: 'c-qm',           title: 'qm snapshot / rollback',  description: 'Criar e reverter snapshots de VMs no Proxmox',               category: 'Comando',        href: '/proxmox',     icon: Terminal },

  // Sprint SIGMA Fase 2 — seções avançadas (5 novas seções + 1 script)
  { id: 't-knock-admin',   title: 'Administrador em Ação — ~/entrar.sh + Port Knocking',
    description: 'Fluxo curl → knock → SSH em 10s. Script ~/entrar.sh automatizado. 847 bots vs 0.',
    category: 'Tópico', href: '/port-knocking#admin-em-acao', icon: Zap },

  { id: 't-forense-knock', title: 'Auditoria Forense: tail -f awk + scripts audit-knock e knock-monitor',
    description: '3 níveis: tempo real, análise histórica, correlação batidas+logins.',
    category: 'Tópico', href: '/audit-logs#forense-knock', icon: Activity },

  { id: 't-nat-anatomy',   title: 'Anatomia do NAT — 5 Funções Simultâneas do Firewall',
    description: 'Roteador + Filtro + Tradutor + Proxy + Guardião. conntrack IDA/VOLTA automático.',
    category: 'Tópico', href: '/wan-nat#anatomia-nat', icon: Network },

  { id: 't-prerouting-k',  title: 'PREROUTING — 5 Hooks Netfilter e Troca Cirúrgica de IP',
    description: 'Por que DNAT deve ser antes do ROUTING. tcpdump antes e depois da troca.',
    category: 'Tópico', href: '/dnat#prerouting-kernel', icon: Shield },

  { id: 't-squid-flow',    title: 'Fluxo Completo via Squid — Timeline t=0ms→t=52ms',
    description: 'HTTP vê URL completa; HTTPS vê só domínio. 4 cenários de ACL.',
    category: 'Tópico', href: '/lan-proxy#fluxo-navegacao', icon: Globe },

  { id: 'c-knock-monitor', title: 'knock-monitor — alertas coloridos Port Knocking em tempo real',
    description: 'LEGÍTIMO / SUSPEITO / SSH SEM KNOCK / LOGIN SSH. Roda em background com nohup.',
    category: 'Comando', href: '/audit-logs#forense-knock', icon: Eye },

  // Sprint W — Windows-to-Linux
  { id: 't-terminal-zero', title: 'Terminal do Zero — Linux para quem vem do Windows',
    description: 'pwd, ls, cd, sudo. Ctrl+Shift+C para copiar. Tab para autocompletar.',
    category: 'Tópico', href: '/instalacao#terminal-do-zero', icon: Terminal },

  { id: 't-sysadmin-mindset', title: 'Mindset SysAdmin — Windows vs Linux',
    description: 'systemctl vs Serviços, journalctl vs Event Viewer, iptables vs Firewall.',
    category: 'Tópico', href: '/instalacao#sysadmin-mindset', icon: Shield },

  { id: 't-win-linux-table', title: 'Tabela Windows → Linux — Equivalências de Comandos',
    description: 'dir=ls, ipconfig=ip addr, services.msc=systemctl, Event Viewer=journalctl.',
    category: 'Tópico', href: '/cheat-sheet#windows-linux', icon: FileText },

  // Sprint W2 — RosettaStone + resgate-gold
  { id: 't-rosetta-stone', title: 'Rosetta Stone — Tabela interativa Windows → Linux',
    description: 'Busque 25 comandos por nome, categoria (Rede, Serviços, Admin) ou descrição.',
    category: 'Tópico', href: '/instalacao#rosetta-stone', icon: Terminal },

  { id: 'c-resgate-gold', title: 'resgate-gold.sh — Script de recuperação do firewall',
    description: 'Botão de Pânico: limpa iptables, garante SSH, ativa ip_forward. Download direto.',
    category: 'Comando', href: '/cheat-sheet#scripts', icon: Shield },

  // Sprint F1-F3 — Trilha Fundamentos Linux (v2.0)
  { id: 'p-fundamentos',   title: 'Fundamentos Linux — Trilha para Iniciantes',
    description: '10 módulos do zero: FHS, comandos, editores, processos, permissões, discos e mais.',
    category: 'Página', href: '/fundamentos', icon: Terminal },
  { id: 't-fhs',           title: 'Estrutura do Sistema (FHS)',
    description: '/etc, /var, /usr, /home, /tmp — o mapa do Linux. Equivalências com C:\\Windows.',
    category: 'Tópico', href: '/fhs', icon: Book },
  { id: 't-comandos',      title: 'Comandos Essenciais Linux',
    description: 'ls, cd, cp, mv, rm, grep, find, cat, less, pipe — dominando o terminal.',
    category: 'Tópico', href: '/comandos', icon: Terminal },
  { id: 't-editores',      title: 'Editores de Texto — nano e VIM',
    description: 'nano para iniciantes, VIM para produção: modos, atalhos e como sair do vim.',
    category: 'Tópico', href: '/editores', icon: FileText },
  { id: 't-processos',     title: 'Gerenciamento de Processos',
    description: 'ps, top, htop, kill, systemctl — equivalente ao Gerenciador de Tarefas do Windows.',
    category: 'Tópico', href: '/processos', icon: Activity },
  { id: 't-permissoes',    title: 'Permissões e Usuários Linux',
    description: 'chmod, chown, useradd, groups, sudo — controle de acesso no Linux.',
    category: 'Tópico', href: '/permissoes', icon: Shield },
  { id: 't-discos',        title: 'Discos e Partições',
    description: 'fdisk, lsblk, mount, df, du, dd — gerenciamento de armazenamento no Linux.',
    category: 'Tópico', href: '/discos', icon: Server },
  { id: 't-logs-basicos',  title: 'Logs e Monitoramento Básico',
    description: 'journalctl, /var/log/, tail -f, grep — leitura e análise de logs do sistema.',
    category: 'Tópico', href: '/logs-basicos', icon: Eye },
  { id: 't-backup',        title: 'Backup e Restauração',
    description: 'rsync, tar, scp — proteja seus dados com backups locais e remotos.',
    category: 'Tópico', href: '/backup', icon: Book },
  { id: 't-shell-script',  title: 'Shell Script — Automatize o Linux',
    description: 'Variáveis, if, for, funções, $() — scripts bash para administração de sistemas.',
    category: 'Tópico', href: '/shell-script', icon: Terminal },
  { id: 't-cron',          title: 'Agendamento de Tarefas — cron e systemd timers',
    description: 'crontab -e, @reboot, systemd timers, at — automatize tarefas periódicas.',
    category: 'Tópico', href: '/cron', icon: Activity },
];
