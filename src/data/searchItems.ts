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
  Radio,
  Smartphone,
  Package,
  Download,
  Monitor,
  HardDrive,
  Wrench,
  FolderOpen,
  Users
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
  { id: 't-roadmap-evolucao', title: 'Roadmap Completo — v1.0 ao v5.0', description: '5 trilhas completas: Firewall (v1.0), Fundamentos (v2.0), Servidores (v3.0), Infra Moderna (v4.0) e Cloud/Platform Engineering (v5.0).', category: 'Tópico', href: '/evolucao#roadmap-evolucao', icon: TrendingUp },

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
  { id: 't-wireguard',  title: 'WireGuard VPN',         description: 'VPN moderna com criptografia ChaCha20/Poly1305, wg0.conf, wg-quick e wg show — mais rápida que OpenVPN e IPSec', category: 'Tópico', href: '/wireguard', icon: Lock },
  { id: 'g-wireguard',  title: 'WireGuard — Chave Pública/Privada de Peer', description: 'WireGuard usa criptografia de curva elíptica (Curve25519). Cada peer tem um par de chaves; a troca de public keys define quem pode se conectar', category: 'Glossário', href: '/wireguard', icon: Lock },
  { id: 't-fail2ban',   title: 'Fail2ban — Proteção contra Força Bruta',    description: 'Jails, filtros regex, maxretry, bantime, iptables REJECT automático e whitelist — bloqueio dinâmico de IPs maliciosos', category: 'Tópico', href: '/fail2ban', icon: Shield },
  { id: 'g-fail2ban',   title: 'Jail (Fail2ban)',                            description: 'Unidade de configuração do Fail2ban: define qual log monitorar, regex (failregex), número de falhas (maxretry) e tempo de bloqueio (bantime)', category: 'Glossário', href: '/fail2ban', icon: Shield },
  { id: 't-hardening', title: 'Hardening Linux',     description: 'SSH seguro, sysctl de defesa e AppArmor — 3 camadas de proteção do servidor', category: 'Tópico', href: '/hardening',    icon: Shield },
  { id: 't-compose',  title: 'Docker Compose',      description: 'Stacks multi-container com redes declarativas, volumes persistentes e secrets', category: 'Tópico', href: '/docker-compose', icon: Server },
  { id: 'g-compose-yml', title: 'docker-compose.yml', description: 'Arquivo declarativo YAML que define services, networks e volumes de uma stack', category: 'Glossário', href: '/docker-compose', icon: FileText },
  { id: 't-ssh-2fa',  title: 'SSH com 2FA (TOTP)',  description: 'Autenticação de dois fatores no SSH com Google Authenticator e libpam', category: 'Tópico', href: '/ssh-2fa', icon: Lock },
  { id: 'g-totp',    title: 'TOTP',               description: 'Time-based One-Time Password — RFC 6238, código de 6 dígitos válido por 30s', category: 'Glossário', href: '/ssh-2fa', icon: Smartphone },
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
    description: '15 módulos do zero: FHS, comandos, editores, processos, permissões, discos, boot, rsyslog, SSH proxy e mais.',
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

  // Sprint F4 — Instalação de Programas (/pacotes)
  { id: 't-pacotes',  category: 'Tópico',    title: 'Instalação de Programas',     description: 'apt, dpkg, snap, pip — gerenciar software no Linux',               href: '/pacotes', icon: Package },
  { id: 'g-apt',      category: 'Glossário', title: 'APT — Advanced Package Tool', description: 'Gerenciador de pacotes do Debian/Ubuntu. apt update + install + purge', href: '/pacotes', icon: Download },

  // Sprint F5 — Processo de Boot (/boot)
  { id: 't-boot',  category: 'Tópico',    title: 'Processo de Boot do Linux',        description: 'BIOS/UEFI, GRUB2, kernel, initrd, systemd targets e journalctl -b', href: '/boot', icon: Monitor },
  { id: 'g-grub',  category: 'Glossário', title: 'GRUB2 — Grand Unified Bootloader', description: 'Bootloader padrão Linux. Configurar em /etc/default/grub + update-grub', href: '/boot', icon: HardDrive },

  // Sprint F6 — Comandos Avançados (/comandos-avancados)
  { id: 't-cmd-avancados', category: 'Tópico',    title: 'Comandos Avançados',    description: 'sed, dd, nc, ln, gzip/tar — ferramentas de SysAdmin que todo profissional usa',   href: '/comandos-avancados', icon: Wrench },
  { id: 'g-sed',           category: 'Glossário', title: 'sed — Stream Editor',   description: 'Edita arquivos em stream. sed -i substitui in-place sem abrir editor',            href: '/comandos-avancados', icon: Terminal },

  // Sprint F7 — Logs Centralizados com Rsyslog (/rsyslog)
  { id: 't-rsyslog',   category: 'Tópico',    title: 'Logs Centralizados com Rsyslog', description: 'rsyslog, facilities, priorities, servidor central e logrotate em produção',        href: '/rsyslog', icon: Radio },
  { id: 'g-rsyslog',   category: 'Glossário', title: 'rsyslog — Reliable Syslog',      description: 'Daemon de logs que encaminha mensagens locais e remotas. Substitui o syslogd clássico', href: '/rsyslog', icon: Server },

  // Sprint I.7 — Servidor DHCP (/dhcp)
  { id: 't-dhcp',      category: 'Tópico',    title: 'Servidor DHCP',                  description: 'isc-dhcp-server, subnet, range, reservas por MAC e leases — distribua IPs na LAN', href: '/dhcp', icon: Server },
  { id: 'g-dhcp',      category: 'Glossário', title: 'DHCP — Dynamic Host Configuration Protocol', description: 'Protocolo DORA (Discover/Offer/Request/Ack) que distribui IPs automaticamente na rede', href: '/dhcp', icon: Network },

  // Sprint I.8 — Samba File Sharing (/samba)
  { id: 't-samba',     category: 'Tópico',    title: 'Samba — File Sharing Linux↔Windows', description: 'smb.conf, smbpasswd, shares públicos/privados, mount.cifs e Windows Explorer', href: '/samba', icon: FolderOpen },
  { id: 'g-smb',       category: 'Glossário', title: 'SMB/CIFS — Server Message Block',    description: 'Protocolo de compartilhamento de arquivos da Microsoft. Samba implementa SMB no Linux', href: '/samba', icon: Network },

  // Sprint I.9 — Apache Web Server (/apache)
  { id: 't-apache',    category: 'Tópico',    title: 'Apache Web Server',                  description: 'apache2, VirtualHost, a2ensite/a2dissite, SSL com Certbot e proxy reverso',       href: '/apache', icon: Server },
  { id: 'g-apache',    category: 'Glossário', title: 'Apache vs Nginx',                    description: 'Apache usa threads por conexão; Nginx usa eventos assíncronos. Escolha depende do caso', href: '/apache', icon: Globe },

  // Sprint I.10 — OpenVPN (/openvpn)
  { id: 't-openvpn',   category: 'Tópico',    title: 'OpenVPN — VPN com PKI própria',      description: 'Easy-RSA, certificados CA/servidor/cliente, server.conf, client.ovpn e iptables',  href: '/openvpn', icon: Lock },
  { id: 'g-easyrsa',   category: 'Glossário', title: 'Easy-RSA — PKI simplificada',        description: 'Wrapper do OpenSSL para criar CA, assinar certificados e gerenciar CRL no OpenVPN', href: '/openvpn', icon: Shield },

  // Sprint I.11 — Traefik Proxy Reverso (/traefik)
  { id: 't-traefik',   category: 'Tópico',    title: 'Traefik — Proxy Reverso Cloud-Native', description: 'Labels Docker, HTTPS automático ACME, middlewares (redirect, basicauth, rate-limit) e dashboard', href: '/traefik', icon: GitMerge },
  { id: 'g-acme',      category: 'Glossário', title: 'ACME — Certificados Let\'s Encrypt automáticos', description: 'Protocolo que o Traefik usa para solicitar e renovar certificados TLS sem intervenção manual', href: '/traefik', icon: Zap },

  // Sprint I.12 — LDAP / OpenLDAP (/ldap)
  { id: 't-ldap',      category: 'Tópico',    title: 'LDAP / OpenLDAP — Diretório Centralizado', description: 'slapd, DIT, OUs, ldapadd/ldapsearch, posixAccount e PAM — autenticação única para toda a infra', href: '/ldap', icon: Users },
  { id: 'g-ldap',      category: 'Glossário', title: 'DN / Distinguished Name',                  description: 'Caminho único de uma entrada no diretório LDAP. Ex: uid=joao,ou=usuarios,dc=empresa,dc=com',   href: '/ldap', icon: Network },

  // Sprint I.13 — Pi-hole (/pihole)
  { id: 't-pihole',    category: 'Tópico',    title: 'Pi-hole — DNS Sinkhole para toda a rede',  description: 'Blocklists, gravity update, whitelist/blacklist, iptables DNS redirect e Unbound resolver local', href: '/pihole', icon: Shield },
  { id: 'g-pihole',    category: 'Glossário', title: 'DNS Sinkhole',                             description: 'Técnica que responde 0.0.0.0 para domínios de anúncios/malware, bloqueando antes de carregar',   href: '/pihole', icon: Globe },

  // Sprint I.14 — Ansible (/ansible)
  { id: 't-ansible',     category: 'Tópico',    title: 'Ansible para SysAdmins — IaC agentless',  description: 'Playbooks YAML, roles, Ansible Vault e Galaxy — automatize dezenas de servidores via SSH sem agente', href: '/ansible', icon: Terminal },
  { id: 'g-ansible',     category: 'Glossário', title: 'Idempotência (Ansible)',                   description: 'Executar o mesmo playbook múltiplas vezes produz o mesmo resultado — Ansible verifica estado antes de agir', href: '/ansible', icon: Activity },

  // Sprint I.15 — Prometheus + Grafana (/monitoring)
  { id: 't-monitoring',  category: 'Tópico',    title: 'Prometheus + Grafana — Observabilidade',   description: 'Métricas com node_exporter, PromQL, dashboards Grafana (ID 1860) e alertas com Alertmanager', href: '/monitoring', icon: Activity },
  { id: 'g-promql',      category: 'Glossário', title: 'PromQL — Prometheus Query Language',        description: 'Linguagem de consulta de séries temporais: rate(), increase(), sum by(), histograms e label matchers', href: '/monitoring', icon: TrendingUp },

  // Sprint I.16 — Kubernetes / K3s (/kubernetes)
  { id: 't-kubernetes',  category: 'Tópico',    title: 'Kubernetes / K3s — Orquestração de Containers', description: 'K3s single-node, kubectl, Deployments, Services, NetworkPolicy, Ingress Traefik e Helm', href: '/kubernetes', icon: Network },
  { id: 'g-k8s-pod',     category: 'Glossário', title: 'Pod (Kubernetes)',                           description: 'Menor unidade deployável do Kubernetes — 1+ containers compartilhando rede e storage. Efêmero por natureza.', href: '/kubernetes', icon: Shield },

  // Sprint I.17 — Terraform IaC (/terraform)
  { id: 't-terraform',      category: 'Tópico',    title: 'Terraform IaC — Infraestrutura Declarativa', description: 'HCL declarativo: providers Docker/AWS, init→plan→apply→destroy, state, módulos e workspaces para múltiplos ambientes', href: '/terraform', icon: Server },
  { id: 'g-terraform-state', category: 'Glossário', title: 'Terraform State (terraform.tfstate)',         description: 'Arquivo JSON que mapeia recursos HCL ↔ infraestrutura real. Armazenar remotamente (S3/GitLab) é obrigatório em equipes', href: '/terraform', icon: HardDrive },

  // Sprint I.18 — Suricata IDS/IPS (/suricata)
  { id: 't-suricata',       category: 'Tópico',    title: 'Suricata IDS/IPS — Detecção e Prevenção de Intrusões', description: 'IDS passivo (af-packet) e IPS inline (NFQUEUE): regras customizadas, Emerging Threats, EVE JSON e integração com nftables', href: '/suricata', icon: Shield },
  { id: 'g-eve-json',       category: 'Glossário', title: 'EVE JSON (Suricata)',                                    description: 'Formato de log estruturado do Suricata — cada alerta, fluxo, DNS e HTTP é uma linha JSON pronta para Loki/Grafana/SIEM', href: '/suricata', icon: FileText },

  // Sprint I.19 — eBPF & XDP (/ebpf)
  { id: 't-ebpf',           category: 'Tópico',    title: 'eBPF & XDP — Programação no Kernel Linux',             description: 'BCC tools (execsnoop, tcpconnect, biolatency), bpftrace scripting, filtros XDP de alta performance e Cilium CNI para Kubernetes', href: '/ebpf', icon: Zap },
  { id: 'g-bpftrace',       category: 'Glossário', title: 'bpftrace — Linguagem de Scripting para eBPF',           description: 'DSL de alto nível que compila para bytecode eBPF — kprobes, tracepoints e USDTs com sintaxe parecida com awk/DTrace', href: '/ebpf', icon: FileText },

  // Sprint I.20 — Service Mesh com Istio (/service-mesh)
  { id: 't-service-mesh',   category: 'Tópico',    title: 'Service Mesh com Istio — mTLS e Traffic Management',   description: 'Istio injeta sidecar Envoy em cada pod: mTLS automático, VirtualService para canary, DestinationRule com circuit breaker e Kiali para observabilidade', href: '/service-mesh', icon: Network },
  { id: 'g-virtual-service', category: 'Glossário', title: 'VirtualService (Istio)',                               description: 'CRD do Istio que define regras de roteamento: peso por subset (canary), match por header (A/B test), retry, timeout e injeção de falhas', href: '/service-mesh', icon: FileText },

  // Sprint I.21 — SRE & SLOs (/sre)
  { id: 't-sre',            category: 'Tópico',    title: 'SRE & SLOs — Confiabilidade como Engenharia',           description: 'SLIs/SLOs com Prometheus, error budget calculado, alertas de burn rate, runbooks acionáveis e postmortem blameless', href: '/sre', icon: Activity },
  { id: 'g-error-budget',   category: 'Glossário', title: 'Error Budget (SRE)',                                    description: 'Quantidade de falha permitida dentro da janela do SLO. Budget sobrando = acelerar deploys. Budget esgotado = congelar e focar em confiabilidade', href: '/sre', icon: FileText },

  // Sprint I.22 — CI/CD com GitHub Actions (/cicd)
  { id: 't-cicd',           category: 'Tópico',    title: 'CI/CD com GitHub Actions — Pipeline Completo',          description: 'Workflow com lint/test/build em paralelo, Docker push no ghcr.io, environments com aprovação manual, matrix strategy e self-hosted runners', href: '/cicd', icon: Zap },
  { id: 'g-github-actions', category: 'Glossário', title: 'GitHub Actions — Workflow, Job, Step e Runner',         description: 'Arquivo YAML em .github/workflows/ com jobs paralelos, steps sequenciais, actions do Marketplace e runners GitHub-hosted ou self-hosted', href: '/cicd', icon: FileText },

  // Sprint I.23 — OPNsense / pfSense (/opnsense)
  { id: 't-opnsense',       category: 'Tópico',    title: 'OPNsense — Firewall Enterprise com Web UI',             description: 'Regras de firewall via GUI, Port Forward (DNAT), Aliases, VPN WireGuard/OpenVPN com wizard, IDS/IPS Suricata plugin e Alta Disponibilidade com CARP', href: '/opnsense', icon: Shield },
  { id: 'g-carp',           category: 'Glossário', title: 'CARP — Common Address Redundancy Protocol',             description: 'Protocolo de IP virtual compartilhado entre firewalls para Alta Disponibilidade. O Master anuncia o VIP; se cair, o Backup assume em segundos sem alterar configs nos clientes', href: '/opnsense', icon: FileText },

  // Sprint I.24 — Nextcloud (/nextcloud)
  { id: 't-nextcloud',      category: 'Tópico',    title: 'Nextcloud — Nuvem Pessoal Self-hosted',                 description: 'Docker Compose com MariaDB+Redis, Traefik SSL automático, integração LDAP, apps CalDAV/CardDAV/Talk, object storage MinIO e backup 3-2-1', href: '/nextcloud', icon: Globe },
  { id: 'g-caldav',         category: 'Glossário', title: 'CalDAV / CardDAV — Protocolos de Sincronização',        description: 'CalDAV sincroniza calendários entre clientes (Google Calendar, Apple, Thunderbird). CardDAV sincroniza contatos. Ambos baseados em WebDAV — HTTP com extensões para dados estruturados', href: '/nextcloud', icon: FileText },

  // Sprint I.25 — eBPF Avançado + Cilium (/ebpf-avancado)
  { id: 't-ebpf-avancado',  category: 'Tópico',    title: 'eBPF Avançado + Cilium — CNI e Runtime Security',       description: 'Cilium substituindo kube-proxy (eBPF LB), Hubble para observabilidade de fluxos L7, CiliumNetworkPolicy HTTP path e DNS, Tetragon TracingPolicy bloqueando execuções suspeitas', href: '/ebpf-avancado', icon: Zap },
  { id: 'g-cilium-hubble',  category: 'Glossário', title: 'Cilium + Hubble — CNI eBPF e Observabilidade',          description: 'Cilium é um CNI que usa eBPF para networking e segurança em Kubernetes — substitui kube-proxy e flannel. Hubble é sua camada de observabilidade: captura fluxos L3/L4/L7 em tempo real sem modificar a aplicação', href: '/ebpf-avancado', icon: FileText },

  // Sprint SSH-PROXY — SSH como Proxy SOCKS (/ssh-proxy)
  { id: 't-ssh-proxy',      category: 'Tópico',    title: 'SSH como Proxy SOCKS — Tunneling e Port Forwarding',    description: 'ssh -D SOCKS5 proxy, -L port forwarding local, -R remoto, -J Jump Host, autossh persistente, ~/.ssh/config para produção', href: '/ssh-proxy', icon: Zap },
  { id: 'g-ssh-tunnel',     category: 'Glossário', title: 'SSH Tunnel — Port Forwarding Local, Remoto e Dinâmico', description: 'SSH tunnel encapsula tráfego TCP dentro de uma sessão SSH cifrada. -L redireciona porta local para host remoto, -R cria listener no servidor, -D cria proxy SOCKS5 dinâmico para qualquer destino', href: '/ssh-proxy', icon: FileText },

  // Sprint CHEAT-SHEET-v3 — DevOps workflows section
  { id: 't-cheat-devops',   category: 'Tópico',    title: 'DevOps Workflows — Docker, Ansible, kubectl, Terraform', description: 'Cheat sheet com workflows completos: docker compose up/down/scale, ansible-playbook --check, kubectl apply/rollout, terraform plan/apply/destroy', href: '/cheat-sheet#devops', icon: Server },

  // Sprint AVANCADOS-INDEX — índice da trilha avançada (/avancados)
  { id: 't-avancados',      category: 'Tópico',    title: 'Trilha Avançada — 19 Módulos v3.0→v5.0',                description: 'Índice da trilha avançada: DHCP, Samba, Apache, OpenVPN, Traefik, LDAP, Pi-hole, Ansible, Prometheus, Kubernetes, Terraform, Suricata, eBPF, Service Mesh, SRE, CI/CD, Nextcloud', href: '/avancados', icon: Server },
  { id: 'g-advanced-trail', category: 'Tópico',    title: 'Servidores e Serviços (v3.0) — Progresso da Trilha',    description: 'Acompanhe o progresso em todos os 19 módulos avançados com indicadores de conclusão por checkpoint — DHCP a eBPF Avançado', href: '/avancados', icon: Globe },

  // Sprint SEARCH-GLOSSARY — termos avançados do glossário
  { id: 'g-mtls',           category: 'Glossário', title: 'mTLS — Mutual TLS',                                     description: 'Autenticação bidirecional onde cliente E servidor trocam certificados. Istio aplica mTLS automaticamente entre serviços via sidecar Envoy — sem alterar o código da aplicação', href: '/service-mesh', icon: Lock },
  { id: 'g-gitops',         category: 'Glossário', title: 'GitOps — Git como fonte de verdade da infra',           description: 'Toda mudança de infraestrutura passa por Pull Request. Um operador (ArgoCD, Flux) sincroniza o cluster com o estado declarado no repositório — auditável e reversível', href: '/cicd', icon: GitMerge },
  { id: 'g-circuit-breaker',category: 'Glossário', title: 'Circuit Breaker — Resiliência em Microserviços',        description: 'Padrão que "abre o circuito" após N falhas consecutivas, evitando sobrecarga em cascata. No Istio: outlierDetection com consecutiveErrors e ejectionTime', href: '/service-mesh', icon: Zap },
  { id: 'g-ids-ips',        category: 'Glossário', title: 'IDS vs IPS — Detecção vs Prevenção de Intrusões',       description: 'IDS monitora passivamente e alerta. IPS age inline e bloqueia o tráfego malicioso. Suricata opera em modo IDS (af-packet) ou IPS (NFQUEUE + nftables queue)', href: '/suricata', icon: Shield },

  // Sprint SEARCH-EXPAND — segundo item para módulos com cobertura única
  { id: 'g-nmap-recon',     category: 'Tópico',    title: 'nmap — Reconhecimento Ofensivo e Defesa',               description: 'nmap -sV detecta versões de serviço; -O fingerprinting de OS; -sS SYN scan silencioso. Defesa: regras DROP no FORWARD + Fail2ban contra port scans', href: '/ataques-avancados', icon: Sword },
  { id: 'g-egress-filter',  category: 'Tópico',    title: 'Egress Filtering — Bloquear Reverse Shells na DMZ',     description: 'Limitar tráfego de SAÍDA da DMZ: apenas HTTP/HTTPS para internet, NADA para LAN. Impede reverse shells e exfiltração de dados de servidores comprometidos', href: '/pivoteamento', icon: Shield },
  { id: 'g-apparmor',       category: 'Glossário', title: 'AppArmor — Controle Obrigatório de Acesso (MAC)',        description: 'LSM do kernel que confina processos a perfis de acesso. aa-enforce nginx restringe o Nginx às operações mínimas necessárias — violações são bloqueadas e logadas', href: '/hardening', icon: Lock },
  { id: 'g-docker-user',    category: 'Tópico',    title: 'DOCKER-USER chain — Customizar Firewall de Containers',  description: 'Docker cria regras automaticamente na chain DOCKER (não editar!). A chain DOCKER-USER é o lugar correto para adicionar restrições: bloquear acesso externo a portas mapeadas', href: '/docker', icon: Shield },
  { id: 'g-fundamentos-trail', category: 'Tópico', title: 'Trilha Fundamentos — Por onde começar no Linux',         description: 'Sequência recomendada para iniciantes: FHS → Comandos → Editores → Processos → Permissões → Discos → Logs → Backup → Shell Script → Cron → Pacotes → Boot → Avançados → Rsyslog → SSH Proxy', href: '/fundamentos', icon: Book },
  { id: 'g-fhs-dirs',       category: 'Tópico',    title: 'FHS — Diretórios Essenciais do Linux',                  description: '/etc = configurações; /var = dados variáveis (logs); /usr = binários; /home = usuários; /tmp = temporários. Entender o mapa evita "onde está esse arquivo?"', href: '/fhs', icon: FolderOpen },
  { id: 'g-grep-pipe',      category: 'Tópico',    title: 'grep e pipes — Filtrar e combinar saída de comandos',    description: 'grep "erro" /var/log/syslog | tail -20. Pipelines: ps aux | grep nginx | awk {print $2}. Redirecionar: command > file, command >> file, command 2>&1', href: '/comandos', icon: Terminal },
  { id: 'g-vim-basics',     category: 'Tópico',    title: 'VIM — Editar arquivos em servidores sem interface',      description: 'i = inserir, Esc = normal mode, :wq = salvar e sair, :q! = sair sem salvar, dd = deletar linha, /texto = buscar. Indispensável em servidores sem desktop', href: '/editores', icon: FileText },
  { id: 'g-systemctl',      category: 'Tópico',    title: 'systemctl — Gerenciar Serviços no Linux',               description: 'systemctl start/stop/restart/status/enable/disable. enable = inicia no boot. journalctl -u serviço -f = logs em tempo real. Equivalente ao services.msc do Windows', href: '/processos', icon: Activity },
  { id: 'g-chmod-octal',    category: 'Tópico',    title: 'chmod octal — Permissões de Arquivos no Linux',          description: 'chmod 755 = rwxr-xr-x; chmod 644 = rw-r--r--; chmod 600 = rw-------. 4=leitura, 2=escrita, 1=execução. chown usuario:grupo arquivo para mudar proprietário', href: '/permissoes', icon: Shield },
  { id: 'g-lsblk-mount',    category: 'Tópico',    title: 'lsblk / mount — Listar e Montar Discos no Linux',        description: 'lsblk = árvore de discos e partições; fdisk -l = detalhes de particionamento; mount /dev/sdb1 /mnt; df -h = espaço em disco. /etc/fstab para montagem permanente', href: '/discos', icon: HardDrive },
  { id: 'g-journalctl',     category: 'Comando',   title: 'journalctl — Ler Logs do Sistema (systemd)',             description: 'journalctl -u nginx -f = logs em tempo real; journalctl -b = boot atual; journalctl --since "1 hour ago"; journalctl -p err = só erros. Sem arquivo, os logs ficam no journal binário', href: '/logs-basicos', icon: Eye },
  { id: 'g-rsync',          category: 'Tópico',    title: 'rsync — Sincronização Incremental de Backups',           description: 'rsync -avz --delete origem/ destino/ sincroniza apenas arquivos alterados. --exclude=".tmp" filtra arquivos. rsync -e ssh para backup remoto seguro. Muito mais eficiente que cp para backups', href: '/backup', icon: Download },
  { id: 'g-bash-script',    category: 'Tópico',    title: 'Shell Script — Estruturas de Controle Bash',             description: 'if [ condição ]; then ... fi. for var in lista; do ... done. while true; do ... done. function nome() { ... }. $1,$2 = argumentos. $(comando) = substituição de comando', href: '/shell-script', icon: Terminal },
  { id: 'g-crontab',        category: 'Tópico',    title: 'crontab — Sintaxe e Exemplos de Agendamento',            description: '* * * * * = minuto hora dia mês dia-semana. 0 2 * * * = todo dia às 2h. */5 * * * * = a cada 5min. @reboot = no boot. crontab -e para editar, crontab -l para listar', href: '/cron', icon: Activity },
];
