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
  category: 'Tópico' | 'Glossário' | 'Página' | 'Comando' | 'Incidente';
  href: string;
  icon: React.ElementType;
  /** Termos extras de matching (sintomas, frases coloquiais). Usado por incidentes. */
  keywords?: string[];
}

export const SEARCH_ITEMS: SearchItem[] = [

  // ─── Páginas ────────────────────────────────────────────────────────────────
  { id: 'p-home',       title: 'Início',        description: 'Página inicial com topologia interativa da rede', category: 'Página', href: '/',            icon: Home },
  { id: 'p-dashboard',  title: 'Dashboard',        description: 'Seu progresso, badges e checkpoints concluídos',  category: 'Página', href: '/dashboard',          icon: Layout },
  { id: 'p-jornada',    title: 'Jornada Unificada', description: 'Trilha completa em linha do tempo única — 64 módulos do zero ao avançado com seu próximo passo destacado', category: 'Página', href: '/jornada', icon: Layout },
  { id: 'p-modulos',    title: 'Módulos do Curso', description: 'Mapa visual dos 21 módulos com progresso visitado/pendente', category: 'Página', href: '/dashboard#modulos', icon: Layout },
  { id: 'p-topics',     title: 'Tópicos',       description: 'Índice completo de todos os módulos do workshop', category: 'Página', href: '/topicos',      icon: Book },
  { id: 'p-cheat',      title: 'Cheat Sheet',   description: 'Referência rápida de comandos iptables e Linux',  category: 'Página', href: '/cheat-sheet', icon: FileText },
  { id: 'p-glossary',   title: 'Glossário',     description: 'Dicionário de termos técnicos de redes e segurança', category: 'Página', href: '/glossario', icon: Book },
  { id: 'p-quiz',       title: 'Quiz',          description: 'Teste seus conhecimentos e desbloqueie badges',   category: 'Página', href: '/quiz',         icon: Award },
  { id: 'p-cert',       title: 'Certificado',   description: 'Gere seu certificado de conclusão do workshop',   category: 'Página', href: '/certificado', icon: Award },
  { id: 'p-evolucao',   title: 'Evolução',      description: 'Roadmap tecnológico e linha do tempo do projeto', category: 'Página', href: '/evolucao',    icon: TrendingUp },
  { id: 'p-ferramentas', title: 'Ferramentas',  description: 'Calculadora CIDR, Regex, iptables, simulador de PS1 e Base64', category: 'Página', href: '/ferramentas', icon: Network },
  { id: 'g-ferramentas-base64', title: 'Codificador/Decodificador Base64', description: 'Codifica e decodifica Base64 com suporte a UTF-8 — inspeciona Secrets do Kubernetes e do Docker', category: 'Glossário', href: '/ferramentas', icon: Network },
  { id: 'g-ferramentas-regex', title: 'Validador de Regex', description: 'Testa um padrão regex ao vivo contra um texto — flags i/m/s, destaca os matches. Útil para failregex do Fail2ban', category: 'Glossário', href: '/ferramentas', icon: Network },
  { id: 'g-ferramentas-iptables', title: 'Gerador de Regras iptables', description: 'Monta o comando iptables a partir de tabela, chain, protocolo, porta, origem e ação', category: 'Glossário', href: '/ferramentas', icon: Network },
  { id: 'g-ferramentas-ps1', title: 'Simulador de Prompt PS1', description: 'Monta o prompt do Bash com preview ao vivo — escapes \\u \\h \\w \\$ e cores ANSI para o ~/.bashrc', category: 'Glossário', href: '/ferramentas', icon: Network },
  { id: 'p-certificacoes', title: 'Trilha de Certificação', description: 'Mapa LPIC-1 e CompTIA Linux+ — tópico de prova ligado ao módulo do Workshop', category: 'Página', href: '/certificacoes', icon: Award },
  { id: 'g-cert-lpic', title: 'LPIC-1 (101/102)', description: 'Certificação Linux Professional Institute — boot/init, linha de comando, FHS, pacotes, redes e segurança mapeados aos módulos', category: 'Glossário', href: '/certificacoes', icon: Award },
  { id: 'g-cert-comptia', title: 'CompTIA Linux+ (XK0-005)', description: 'Certificação vendor-neutral — núcleo comum com a LPIC-1: usuários, permissões, processos, armazenamento e logs', category: 'Glossário', href: '/certificacoes', icon: Award },
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

  { id: 'g-nano-guide', category: 'Tópico', title: 'nano — Editor recomendado para iniciantes',
    description: 'Ctrl+O grava, Ctrl+X sai, Ctrl+K recorta, Ctrl+W busca — atalhos sempre visíveis no rodapé. Comece pelo nano antes do VIM.',
    href: '/cheat-sheet#scripts', icon: FileText },

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

  // Sprint NFS — Network File System (/nfs)
  { id: 'nfs-conceito',  title: 'NFS — Network File System', description: 'Compartilhamento de arquivos Linux nativo de alta performance — NFSv4 usa apenas porta 2049/TCP', category: 'Tópico', href: '/nfs', icon: HardDrive },
  { id: 'nfs-exports',   title: 'NFS /etc/exports',           description: 'Sintaxe de exports, opções rw/ro/sync/no_subtree_check/root_squash/all_squash e exportfs -ra', category: 'Tópico', href: '/nfs', icon: HardDrive },
  { id: 'nfs-cliente',   title: 'NFS mount e /etc/fstab',     description: 'Mount NFSv4 com -t nfs4, opções _netdev/nofail/soft, persistência no fstab e ID mapping', category: 'Tópico', href: '/nfs', icon: HardDrive },
  { id: 'haproxy-conceito', title: 'HAProxy — Load Balancer', description: 'Balanceador de carga L4 (TCP) e L7 (HTTP) — frontend, backend, alta disponibilidade e escalabilidade', category: 'Tópico', href: '/haproxy', icon: Network },
  { id: 'haproxy-balance',  title: 'HAProxy — algoritmos e health checks', description: 'balance roundrobin/leastconn/source, option httpchk, server check, failover automático e weight', category: 'Tópico', href: '/haproxy', icon: Network },
  { id: 'haproxy-stats',    title: 'HAProxy — stats e stick-tables', description: 'Página de estatísticas em /stats, terminação SSL com bind ssl crt e rate limit com stick-table', category: 'Tópico', href: '/haproxy', icon: Network },
  // Sprint CÓDICE — Resposta a Incidentes (DFIR)
  { id: 'p-resposta-incidentes', title: 'Resposta a Incidentes (DFIR)', description: 'O que fazer quando o servidor foi comprometido — o ciclo NIST SP 800-61 na prática', category: 'Página', href: '/resposta-incidentes', icon: Shield },
  { id: 'g-ir-ciclo',  category: 'Glossário', title: 'Ciclo NIST de Resposta a Incidentes', description: 'Detecção → Contenção → Preservação → Timeline → Análise → Erradicação → Recuperação → Pós-incidente. Não improvise: siga o fluxo do NIST SP 800-61', href: '/resposta-incidentes', icon: Shield },
  { id: 'g-ir-evidencias', category: 'Glossário', title: 'Preservação de evidências voláteis', description: 'Não reinicie: o reboot apaga RAM, processos e conexões. Colete dados voláteis com ir_collect.sh e tire snapshot antes de qualquer análise forense', href: '/resposta-incidentes', icon: Shield },
  // Sprint FORTALEZA — CrowdSec, Tailscale, Proxmox Backup Server
  { id: 'p-crowdsec', title: 'CrowdSec — IPS Colaborativo', description: 'IPS open-source com cenários comportamentais e blocklist da comunidade — o passo além do Fail2ban', category: 'Página', href: '/crowdsec', icon: Shield },
  { id: 'g-crowdsec-cenarios', category: 'Glossário', title: 'Cenário comportamental (CrowdSec)', description: 'Detecta padrões no tempo (varredura de usuários, crawl agressivo) em vez de uma regex estática por linha de log', href: '/crowdsec', icon: Shield },
  { id: 'g-crowdsec-bouncer', category: 'Glossário', title: 'Bouncer (CrowdSec)', description: 'Componente que consulta a LAPI e aplica as decisões — o firewall-bouncer-nftables bloqueia os IPs banidos', href: '/crowdsec', icon: Shield },
  { id: 'p-tailscale', title: 'Tailscale — VPN Mesh', description: 'VPN mesh sobre WireGuard sem abrir porta nenhuma — NAT traversal, login SSO, ACLs e subnet router', category: 'Página', href: '/tailscale', icon: Network },
  { id: 'g-tailscale-tailnet', category: 'Glossário', title: 'Tailnet e acesso zero-port', description: 'A rede privada Tailscale: cada nó recebe IP 100.x e se enxerga sem expor portas no firewall de borda', href: '/tailscale', icon: Network },
  { id: 'g-tailscale-subnet', category: 'Glossário', title: 'Subnet router e exit node', description: 'Um nó expõe a LAN inteira (--advertise-routes) ou serve de saída de internet (exit node) para a tailnet', href: '/tailscale', icon: Network },
  { id: 'g-tor-hidden-service', category: 'Glossário', title: 'Tor Hidden Service (.onion)', description: 'Publicar um serviço de forma anônima e resistente a censura — endereço .onion, sem revelar IP nem abrir porta. HiddenServiceDir no torrc', href: '/tailscale', icon: Network },
  { id: 'p-pbs', title: 'Proxmox Backup Server', description: 'Backup incremental e deduplicado de VMs/CTs — datastore, jobs, verify e restore granular', category: 'Página', href: '/proxmox-backup-server', icon: Server },
  { id: 'g-pbs-dedup', category: 'Glossário', title: 'Deduplicação (PBS)', description: 'Blocos idênticos guardados uma só vez — 10 backups diários ocupam pouco mais que um backup completo', href: '/proxmox-backup-server', icon: Server },
  { id: 'g-pbs-prune-gc', category: 'Glossário', title: 'Prune vs Garbage Collection (PBS)', description: 'Prune marca snapshots fora da retenção; o GC é o que libera de fato o espaço dos blocos órfãos', href: '/proxmox-backup-server', icon: Server },
  // Sprint GPG — OpenPGP / GPG
  { id: 'p-gpg', title: 'OpenPGP / GPG', description: 'Criptografia de chave pública na prática — gerar chaves, cifrar, assinar, verificar e assinar commits Git', category: 'Página', href: '/gpg', icon: Shield },
  { id: 'g-gpg-subchaves', category: 'Glossário', title: 'Chave mestra [C] e subchaves [S][E][A]', description: 'A mestra é a identidade (Certify); subchaves ECC fazem o uso diário — Sign, Encrypt, Authenticate. Vazou uma? Revoga só ela', href: '/gpg', icon: Shield },
  { id: 'g-gpg-git-sign', category: 'Glossário', title: 'Commit Git assinado com GPG', description: 'git config user.signingkey + commit.gpgsign — prova de autoria do commit, vira o selo Verified no GitHub', href: '/gpg', icon: Shield },

  // Sprint PILARES — LVM/RAID, Banco de Dados, Servidor de E-mail
  { id: 'p-lvm-raid', title: 'LVM, RAID & Armazenamento', description: 'Volumes lógicos, redimensionamento a quente, RAID por software com mdadm, snapshots e ZFS', category: 'Página', href: '/lvm-raid', icon: HardDrive },
  { id: 'g-lvm-pv-vg-lv', category: 'Glossário', title: 'PV, VG e LV (LVM)', description: 'Physical Volume é o disco; Volume Group junta vários PVs; Logical Volume é a partição flexível que cresce a quente', href: '/lvm-raid', icon: HardDrive },
  { id: 'g-raid-mdadm', category: 'Comando', title: 'mdadm — RAID por software', description: 'mdadm --create /dev/md0 cria o array; RAID 1 espelha, RAID 5 distribui paridade — redundância sem controladora dedicada', href: '/lvm-raid', icon: HardDrive },
  { id: 'p-banco-de-dados', title: 'Banco de Dados', description: 'Administração de PostgreSQL e MariaDB — usuários, permissões, backup/restore e replicação', category: 'Página', href: '/banco-de-dados', icon: Server },
  { id: 'g-db-backup', category: 'Comando', title: 'pg_dump e mysqldump', description: 'Backup lógico do banco em SQL — pg_dump para PostgreSQL, mysqldump para MariaDB/MySQL; restaura com psql ou mysql', href: '/banco-de-dados', icon: Server },
  { id: 'g-db-replicacao', category: 'Glossário', title: 'Replicação primária-réplica', description: 'A réplica copia o WAL/binlog da primária em tempo real — leitura distribuída e failover de alta disponibilidade', href: '/banco-de-dados', icon: Server },
  { id: 'p-mail-server', title: 'Servidor de E-mail', description: 'Postfix MTA/SMTP + Dovecot IMAP/POP3 com autenticação SASL, TLS e anti-spam', category: 'Página', href: '/mail-server', icon: Server },
  { id: 'g-mail-postfix-dovecot', category: 'Glossário', title: 'Postfix vs Dovecot', description: 'Postfix é o MTA — envia e recebe via SMTP; Dovecot entrega ao cliente via IMAP/POP3. Juntos formam o servidor completo', href: '/mail-server', icon: Server },
  { id: 'g-mail-spamassassin', category: 'Glossário', title: 'Anti-spam com SpamAssassin', description: 'Pontua cada mensagem por regras heurísticas e listas — acima do limiar, o e-mail é marcado ou descartado como spam', href: '/mail-server', icon: Server },

  // Sprint VAULT — HashiCorp Vault (/vault)
  { id: 'vault-conceito',   title: 'HashiCorp Vault — Gestão de Segredos',         description: 'Cofre centralizado: KV v2, Unseal com Shamir Secret Sharing, audit log completo e políticas HCL',         category: 'Tópico', href: '/vault', icon: Lock },
  { id: 'vault-approle',    title: 'Vault AppRole — Autenticação para Máquinas',   description: 'role-id + secret-id geram token com TTL — o método correto para apps e pipelines CI/CD',                  category: 'Tópico', href: '/vault', icon: Shield },
  { id: 'vault-dinamico',   title: 'Vault Database Engine — Credenciais Dinâmicas', description: 'Vault cria usuário PostgreSQL sob demanda com TTL — credencial expira e é deletada automaticamente',      category: 'Tópico', href: '/vault', icon: Lock },

  // Sprint I.9 — Apache Web Server (/apache)
  { id: 't-apache',    category: 'Tópico',    title: 'Apache Web Server',                  description: 'apache2, VirtualHost, a2ensite/a2dissite, SSL com Certbot e proxy reverso',       href: '/apache', icon: Server },
  { id: 'g-apache',    category: 'Glossário', title: 'Apache vs Nginx',                    description: 'Apache usa threads por conexão; Nginx usa eventos assíncronos. Escolha depende do caso', href: '/apache', icon: Globe },

  // Sprint I.10 — OpenVPN (/openvpn)
  { id: 't-openvpn',   category: 'Tópico',    title: 'OpenVPN — VPN com PKI própria',      description: 'Easy-RSA, certificados CA/servidor/cliente, server.conf, client.ovpn e iptables',  href: '/openvpn', icon: Lock },
  { id: 'g-easyrsa-pki', category: 'Glossário', title: 'Easy-RSA — PKI simplificada',        description: 'Wrapper do OpenSSL para criar CA, assinar certificados e gerenciar CRL no OpenVPN', href: '/openvpn', icon: Shield },

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

  // Sprint SEARCH-V2 — terceiro item para módulos avançados com cobertura dupla
  { id: 'g-dora',           category: 'Glossário', title: 'DORA — Handshake do Protocolo DHCP',                     description: 'Discover → Offer → Request → Ack: o cliente faz broadcast, o servidor oferece um IP, o cliente confirma, o servidor registra no leases. Porta 67 UDP servidor, 68 UDP cliente', href: '/dhcp', icon: Network },
  { id: 'g-smb-share',      category: 'Tópico',    title: 'Samba — Compartilhamento de Arquivos Linux↔Windows',     description: 'smb.conf define shares com path, valid users, create mask. smbpasswd cria usuários separados do Linux. Acesso: \\\\IP\\pasta no Explorer, ou smbclient/mount.cifs no Linux', href: '/samba', icon: FolderOpen },
  { id: 'g-apache-vhost',   category: 'Tópico',    title: 'VirtualHost Apache — Múltiplos Sites em 1 Servidor',     description: 'a2ensite/a2dissite ativa/desativa VirtualHosts. ServerName decide qual VHost responde. a2enmod ssl + certbot --apache automatiza HTTPS. Estrutura: sites-available/ → sites-enabled/', href: '/apache', icon: Globe },
  { id: 'g-easyrsa',        category: 'Glossário', title: 'Easy-RSA — PKI Própria para OpenVPN',                    description: 'easy-rsa init-pki cria CA local. build-server-full gera cert+chave do servidor. gen-dh gera parâmetros Diffie-Hellman. O arquivo client.ovpn embute CA+cert+chave em base64 — compartilhe com segurança', href: '/openvpn', icon: Lock },
  { id: 'g-traefik-labels', category: 'Glossário', title: 'Traefik Labels — Roteamento Automático por Container',   description: 'traefik.enable=true ativa o container. traefik.http.routers.app.rule=Host(`app.local`) define o host. traefik.http.routers.app.tls.certresolver=letsencrypt ativa HTTPS automático via ACME', href: '/traefik', icon: Server },
  { id: 'g-ldap-ldif',      category: 'Glossário', title: 'LDIF — Formato de Importação e Exportação do LDAP',      description: 'LDAP Data Interchange Format: arquivo texto com dn:, objectClass:, uid:, userPassword: etc. ldapadd -x -D "cn=admin,dc=..." -W -f usuarios.ldif importa objetos em lote. Indispensável para IaC', href: '/ldap', icon: FileText },
  { id: 'g-dns-sinkhole',   category: 'Glossário', title: 'DNS Sinkhole — Bloqueio de Domínios na Camada DNS',      description: 'Pi-hole responde NXDOMAIN ou 0.0.0.0 para domínios de anúncios/malware antes de fazer a resolução real. Blocklists com 100k+ domínios. Unbound como upstream recursivo para máxima privacidade', href: '/pihole', icon: Shield },
  { id: 'g-ansible-vault',  category: 'Glossário', title: 'Ansible Vault — Criptografia de Segredos em Playbooks',  description: 'ansible-vault create secrets.yml criptografa com AES-256. ansible-vault edit abre no $EDITOR. --ask-vault-pass pede senha na execução. --vault-password-file lê de arquivo — ideal para CI/CD', href: '/ansible', icon: Lock },
  { id: 'g-alertmanager',   category: 'Glossário', title: 'Alertmanager — Roteamento e Deduplicação de Alertas',    description: 'Agrupa alertas por job+severity, deduplica durante group_wait, envia para receivers (email, Slack, PagerDuty). inhibit_rules suprimem alertas menores quando um crítico está ativo', href: '/monitoring', icon: Activity },
  { id: 'g-helm',           category: 'Glossário', title: 'Helm — Gerenciador de Pacotes Kubernetes',               description: 'helm install release-name chart instala com defaults. helm upgrade --set imagem.tag=v2.0 faz rolling update. helm rollback desfaz. values.yaml customiza sem alterar o chart — reutilizável entre ambientes', href: '/kubernetes', icon: Package },
  { id: 'g-tf-modules',     category: 'Glossário', title: 'Módulos Terraform — IaC Reutilizável e Versionada',      description: 'module "nome" { source = "./modulos/vpc"; variavel = valor } encapsula recursos. source pode ser Registry, Git ou caminho local. Outputs expõem atributos para outros módulos — composição de infraestrutura', href: '/terraform', icon: Server },
  { id: 'g-xdp',            category: 'Glossário', title: 'XDP — eXpress Data Path no Driver de Rede',              description: 'eBPF executado no nível do driver NIC, antes do kernel processar o pacote. XDP_DROP descarta em ~nanosegundos — mitigação de DDoS a linha de velocidade. Modos: generic (qualquer NIC) ou native (driver suporta)', href: '/ebpf', icon: Zap },
  { id: 'g-tetragon',       category: 'Glossário', title: 'Tetragon — Runtime Security com eBPF e Sigkill',         description: 'TracingPolicy captura execuções de processos, acesso a arquivos sensíveis (/etc/shadow) e conexões de rede em tempo real. Pode enviar SIGKILL imediatamente — sem auditoria retroativa, ação proativa', href: '/ebpf-avancado', icon: Shield },
  { id: 'g-burn-rate-alert',category: 'Glossário', title: 'Alertas de Burn Rate — Detecção Antecipada de SLO',       description: 'Burn rate 14.4× = consome o budget de 30 dias em 2 horas → page imediato. 6× = consome em 5 dias → ticket urgente. Combinar janelas curtas (1h) + longas (6h) reduz falsos positivos', href: '/sre', icon: Activity },
  { id: 'g-pf-opnsense',    category: 'Glossário', title: 'pf — Filtro de Pacotes do OPNsense (avaliação ingress)', description: 'Regras pf são avaliadas pela interface de ENTRADA. Alias agrupa IPs/redes/portas para reutilização. Floating Rules valem em todas as interfaces. States permitem tráfego de resposta automaticamente', href: '/opnsense', icon: Shield },
  { id: 'g-webdav',         category: 'Glossário', title: 'WebDAV — Acesso a Arquivos via HTTP (Nextcloud)',         description: 'Web Distributed Authoring and Versioning: extensão do HTTP com métodos PROPFIND, MKCOL, COPY, MOVE. Nextcloud expõe /remote.php/dav/ — clientes macOS/Windows/Linux montam como drive nativo via caldav/carddav', href: '/nextcloud', icon: Globe },
  { id: 'g-autossh',        category: 'Glossário', title: 'autossh — Túneis SSH Persistentes e Auto-Reconectáveis', description: 'autossh reinicia automaticamente conexões SSH que caem. Padrão: AUTOSSH_POLL=60 verifica heartbeat. Executar como serviço systemd com Restart=always garante o túnel no boot e após falhas de rede', href: '/ssh-proxy', icon: Activity },

  // Sprint SEARCH-DIVES — itens para os 4 novos deep dives + nftables
  { id: 'g-ansible-idem',    category: 'Tópico',    title: 'Ansible Idempotência — ok vs changed e por que importa',   description: 'Idempotência: rodar 2× produz o mesmo resultado que 1×. ok = estado já correto, changed = Ansible aplicou a mudança. Handlers acumulam notificações e executam UMA VEZ no final do play — evita reiniciar nginx 3× para 3 tasks', href: '/ansible', icon: GitMerge },
  { id: 'g-sre-burn',        category: 'Tópico',    title: 'SRE Error Budget — A Matemática dos Noves e Burn Rate',    description: '99.9% SLO = 43.2 min de budget mensal. Burn rate 1× consome em 30 dias; burn rate 14.4× esgota em 2 horas → page imediato. Budget negativo = freeze de deploys, foco em confiabilidade', href: '/sre', icon: Activity },
  { id: 'g-ebpf-maps',       category: 'Glossário', title: 'eBPF Maps — Memória Compartilhada entre Kernel e Userspace', description: '5 tipos: HASH (O(1) amortizado), ARRAY (índice direto), LRU_HASH (eviction automático), PERF_EVENT_ARRAY (eventos por CPU), RINGBUF (buffer global moderno). cilium bpf lb list usa maps para O(1) vs O(N) iptables', href: '/ebpf', icon: Zap },
  { id: 'g-cicd-secure',     category: 'Tópico',    title: 'GitHub Actions Pipeline Seguro — Secrets, Permissions, Concurrency', description: 'Secrets no escopo correto (Repo/Environment/Org). permissions: mínimas (contents: read). concurrency: evita race conditions de deploy. environment: production exige aprovação humana. Artifacts passam builds entre jobs sem rebuild', href: '/cicd', icon: Shield },
  { id: 'g-nft-vs-ipt',      category: 'Glossário', title: 'nftables vs iptables — Sets Nativos e Reload Atômico',     description: 'nft list ruleset — uma única ferramenta para IPv4+IPv6+ARP+bridges. Sets nativos: bloqueio de 1000 IPs em O(1) em vez de 1000 regras. nft -f arquivo aplica tudo ou nada (atômico). iptables-translate migra regras gradualmente', href: '/nftables', icon: Shield },

  // Sprint SEARCH-COMPLETE — 3º item para todos os módulos com cobertura dupla
  // Suporte
  { id: 'g-dashboard-badges',   category: 'Tópico',    title: 'Dashboard — Badges, Checkpoints e Progresso Geral',        description: '34 badges desbloqueáveis por ações reais: visitar módulos, completar checkpoints, acertar quiz, usar a busca. Cada badge tem critério específico — veja quais faltam no painel de progresso', href: '/dashboard', icon: Award },
  { id: 'g-evolucao-v4',        category: 'Tópico',    title: 'v4.0 Infraestrutura Moderna — Ansible, K8s, Terraform, eBPF', description: 'Trilha v4.0: Ansible (IaC agentless), Prometheus+Grafana (observabilidade), Kubernetes/K3s (orquestração), Terraform (infra declarativa), Suricata (IDS/IPS) e eBPF+XDP (kernel networking)', href: '/evolucao', icon: TrendingUp },
  { id: 'g-topicos-filters',    category: 'Tópico',    title: 'Tópicos — Filtros por Trilha e Camada OSI',                description: 'Filtre os 85 tópicos por trilha (Firewall/Fundamentos/Avançados) e por camada OSI (Física/Enlace/.../Aplicação). Combinação AND: Avançados + Camada 7 = apenas módulos de aplicação da trilha avançada', href: '/topicos', icon: Book },

  // v1.0 Firewall — módulos com 2 itens
  { id: 'g-dns-reversa',        category: 'Tópico',    title: 'Zona DNS Reversa — PTR Records e dig -x',                  description: 'Zona reversa mapeia IP → hostname: zona 1.168.192.in-addr.arpa. PTR record: 10 PTR srv.empresa.local. Teste com dig -x 192.168.1.10. Essencial para mail servers e auditoria de logs', href: '/dns', icon: Terminal },
  { id: 'g-pki-chain',          category: 'Tópico',    title: 'Cadeia de Certificados PKI — CA Raiz, Intermediária e Leaf', description: 'CA Raiz assina CA Intermediária assina Leaf (servidor). Navegador valida a cadeia até a CA Raiz confiável. openssl verify -CAfile ca.crt certificado.crt testa a cadeia completa', href: '/web-server', icon: Lock },
  { id: 'g-dnat-prerouting',    category: 'Tópico',    title: 'DNAT — Por que PREROUTING e não FORWARD?',                description: 'DNAT altera o IP destino ANTES do routing decision. Se fosse depois (FORWARD), o kernel já teria decidido descartar o pacote por não ser o destino. tcpdump eth0 confirma a troca cirúrgica do IP', href: '/dnat', icon: Shield },
  { id: 'g-port-knock-spa',     category: 'Tópico',    title: 'SPA — Single Packet Authorization e fwknop',              description: 'Evolução do port knocking: 1 pacote UDP criptografado com AES-256 + HMAC abre a porta em vez de uma sequência. fwknop é a implementação mais usada. Auditar com xt_recent e /proc/net/xt_recent', href: '/port-knocking', icon: Zap },
  { id: 'g-syn-flood',          category: 'Tópico',    title: 'SYN Flood e connlimit — Proteção contra DDoS',             description: 'SYN flood enche a tabela de conexões half-open. Defesa: iptables --syn -m connlimit --connlimit-above 20 REJECT. sysctl net.ipv4.tcp_syncookies=1 habilita SYN cookies como fallback de kernel', href: '/ataques-avancados', icon: Sword },
  { id: 'g-forward-drop',       category: 'Tópico',    title: 'FORWARD DROP — Isolar DMZ de ataques laterais',            description: 'Política padrão DROP na chain FORWARD + regras explícitas de allow impede lateral movement. Servidor web comprometido na DMZ não alcança banco de dados na LAN. egress filtering barra reverse shells', href: '/pivoteamento', icon: Shield },
  { id: 'g-sysctl-hardening',   category: 'Tópico',    title: 'sysctl — Parâmetros de Segurança do Kernel',              description: 'net.ipv4.tcp_syncookies=1 (SYN flood), kernel.randomize_va_space=2 (ASLR), net.ipv4.conf.all.rp_filter=1 (anti-spoofing). /etc/sysctl.d/ persiste no boot. sysctl -p recarrega sem reiniciar', href: '/hardening', icon: Shield },
  { id: 'g-compose-internal',   category: 'Tópico',    title: 'Docker Compose — Rede internal: true para isolamento',     description: 'internal: true isola uma rede Compose do acesso externo — containers sem IP de saída. Ideal para banco de dados: postgres acessa apenas via rede backend, nunca direto da internet. docker network inspect confirma o isolamento', href: '/docker-compose', icon: Server },
  { id: 'g-pam-totp',           category: 'Tópico',    title: 'PAM + TOTP — /etc/pam.d/sshd e sshd_config',              description: 'auth required pam_google_authenticator.so em /etc/pam.d/sshd. sshd_config: KbdInteractiveAuthentication yes. Teste em sessão SSH SEPARADA antes de fechar a atual — evita lock-out. Fail2ban protege contra força bruta de TOTP', href: '/ssh-2fa', icon: Smartphone },
  { id: 'g-docker-networks',    category: 'Tópico',    title: 'Docker Networks — bridge, host, none e redes customizadas', description: 'bridge (padrão, NAT via docker0), host (sem isolamento, máxima performance), none (sem rede). Custom bridge habilita DNS interno por nome de container — não precisa de IP fixo. --network=host evita NAT para serviços de alta performance', href: '/docker', icon: Network },
  { id: 'g-vm-snapshots',       category: 'Tópico',    title: 'Snapshots de VM — Checkpoint antes de Destruir',           description: 'Criar snapshot antes de testes destrutivos: virsh snapshot-create-as vm1 antes-do-teste. Se quebrar: virsh snapshot-revert vm1 antes-do-teste. KVM e Proxmox suportam snapshots qcow2 com diff incremental', href: '/laboratorio', icon: Monitor },
  { id: 'g-proxmox-bridges',    category: 'Tópico',    title: 'Proxmox Bridges — vmbr0 (WAN), vmbr1 (DMZ), vmbr2 (LAN)', description: 'vmbr0 em cima da NIC física (internet). vmbr1 e vmbr2 são bridges internas sem NIC física — tráfego apenas entre VMs. Cada VM tem interface em cada bridge. Replica topologia WAN/DMZ/LAN do lab em VMs', href: '/proxmox', icon: Server },

  // v2.0 Fundamentos — módulos com 2 itens
  { id: 'g-fundamentos-order',  category: 'Tópico',    title: 'Sequência Fundamentos — F01 a F15 em ordem',              description: 'FHS→Comandos→Editores→Processos→Permissões→Discos→Logs→Backup→Shell Script→Cron→Pacotes→Boot→Cmd Avançados→Rsyslog→SSH Proxy. Cada módulo tem Anterior/Próximo para navegar sem sair da trilha', href: '/fundamentos', icon: Book },
  { id: 'g-proc-sys',           category: 'Tópico',    title: '/proc e /sys — Sistemas de Arquivos Virtuais do Kernel',   description: '/proc/cpuinfo = CPU, /proc/meminfo = RAM, /proc/net/ = sockets/routes, /proc/sys/ = parâmetros ajustáveis em tempo real (sysctl lê daqui). /sys/ expõe dispositivos e subsistemas do kernel', href: '/fhs', icon: FolderOpen },
  { id: 'g-find-cmd',           category: 'Comando',   title: 'find — Localizar Arquivos por Critério',                   description: 'find /etc -name "*.conf" localiza arquivos. find / -perm -4000 encontra SUID. find /var/log -mtime +7 -delete limpa logs antigos. -exec {} \\; executa comando em cada resultado. Complemento ao grep', href: '/comandos', icon: Terminal },
  { id: 'g-vim-modes',          category: 'Tópico',    title: 'VIM — Normal/Insert/Visual/Command e atalhos essenciais',  description: 'Normal: navegar (hjkl, w, b, gg, G). Insert (i/a/o): digitar. Visual (v/V): selecionar. Command (:): :wq :q! :set nu :s/old/new/g. yy copia linha, p cola, u desfaz, Ctrl+r refaz. vimtutor ensina em 30min', href: '/editores', icon: FileText },
  { id: 'g-linux-signals',      category: 'Tópico',    title: 'Sinais Linux — SIGTERM (15), SIGKILL (9), SIGHUP (1)',     description: 'SIGTERM (15): encerramento gracioso — processo pode limpar. SIGKILL (9): encerramento forçado — kernel mata. SIGHUP (1): recarregar config sem reiniciar (nginx -s reload). kill -l lista todos os 64 sinais', href: '/processos', icon: Activity },
  { id: 'g-suid-sticky',        category: 'Tópico',    title: 'SUID, SGID e Sticky Bit — Permissões Especiais Linux',     description: 'SUID (4xxx): executa com permissão do dono (passwd usa root SUID). SGID (2xxx): herda grupo do diretório. Sticky (1xxx): só dono pode deletar (/tmp é sticky). find / -perm -4000 audita SUIDzados', href: '/permissoes', icon: Shield },
  { id: 'g-lvm',                category: 'Tópico',    title: 'LVM — Volumes Lógicos e Redimensionamento Online',         description: 'Physical Volume (pvcreate /dev/sdb) → Volume Group (vgcreate vg0) → Logical Volume (lvcreate -L 10G -n dados vg0). lvextend + resize2fs redimensiona SEM desmontar. Snapshot LVM para backup consistente', href: '/discos', icon: HardDrive },
  { id: 'g-varlog-structure',   category: 'Tópico',    title: '/var/log — Estrutura e Arquivos de Log mais Importantes',  description: '/var/log/syslog = sistema geral, /var/log/auth.log = autenticação e sudo, /var/log/kern.log = kernel, /var/log/nginx/ = acesso e erros web. tail -f /var/log/auth.log | grep "Failed password" monitora brute force em tempo real', href: '/logs-basicos', icon: Eye },
  { id: 'g-backup-321',         category: 'Tópico',    title: 'Regra 3-2-1 — 3 Cópias, 2 Mídias, 1 Remoto',             description: '3 cópias dos dados. 2 em mídias diferentes (HD interno + NAS). 1 fora do local (cloud ou servidor remoto). rsync -e ssh sincroniza para servidor remoto. Teste de restauração é obrigatório — backup não testado não é backup', href: '/backup', icon: Download },
  { id: 'g-set-e-trap',         category: 'Tópico',    title: 'Shell Script — set -e, set -u, trap ERR e boas práticas',  description: 'set -e: aborta script ao primeiro erro. set -u: trata variáveis não definidas como erro. set -o pipefail: captura erro em pipelines. trap "echo Erro na linha $LINENO" ERR: mostra onde falhou. #!/usr/bin/env bash é mais portável que #!/bin/bash', href: '/shell-script', icon: Terminal },
  { id: 'g-systemd-timer',      category: 'Tópico',    title: 'systemd Timers — Alternativa moderna ao cron',             description: 'Crie arquivo .timer com OnCalendar=daily e .service correspondente. systemctl enable --now backup.timer ativa. journalctl -u backup.service mostra log de execução. Suporte a AccuracySec, RandomizedDelaySec e monitoramento nativo via systemctl list-timers', href: '/cron', icon: Activity },
  { id: 'g-dpkg-inspect',       category: 'Tópico',    title: 'dpkg — Instalar, Inspecionar e Remover Pacotes .deb',      description: 'dpkg -i pacote.deb instala. dpkg -l | grep nginx lista pacotes instalados. dpkg -L nginx lista arquivos do pacote. dpkg -S /usr/sbin/nginx encontra qual pacote instalou um arquivo. dpkg --purge remove inclusive configs', href: '/pacotes', icon: Package },
  { id: 'g-journalctl-boot',    category: 'Comando',   title: 'journalctl -b — Logs do Boot Atual e Boots Anteriores',    description: 'journalctl -b mostra logs do boot atual. journalctl -b -1 = boot anterior. journalctl --list-boots = todos os boots registrados. journalctl -b -p err = apenas erros do boot atual. Combinar com systemd-analyze blame para diagnóstico de lentidão no boot', href: '/boot', icon: Monitor },
  { id: 'g-dd-iso',             category: 'Tópico',    title: 'dd — Cópia de Disco, ISO em USB e Backup de Partição',     description: 'dd if=ubuntu.iso of=/dev/sdc bs=4M status=progress grava ISO em USB. dd if=/dev/sda of=backup.img bs=4M cria imagem byte-a-byte do disco. WarnBox: if= e of= trocados = disk destroyer. Verificar destino 3× antes de executar', href: '/comandos-avancados', icon: HardDrive },
  { id: 'g-rsyslog-facility',   category: 'Tópico',    title: 'rsyslog Facilities e Priorities — Classificação de Logs',  description: 'Facilities: kern (kernel), auth (autenticação), daemon (serviços), mail (SMTP), user (apps de usuário). Priorities: emerg>alert>crit>err>warning>notice>info>debug. *.err /var/log/erros.log captura tudo de err para cima em qualquer facility', href: '/rsyslog', icon: Radio },
  { id: 'g-avancados-progress', category: 'Tópico',    title: 'Trilha Avançada — Progresso em 19 Módulos e 3 Versões',    description: 'v3.0 Servidores (DHCP/Samba/Apache/OpenVPN/Traefik/LDAP/Pi-hole/SSH Proxy), v4.0 Infraestrutura (Ansible/Prometheus/K8s/Terraform/Suricata/eBPF/Service Mesh/SRE/CI/CD), v5.0 Cloud (OPNsense/Nextcloud/eBPF Avançado). Acompanhe no Dashboard', href: '/avancados', icon: Server },
  { id: 'g-topicos-osi',        category: 'Tópico',    title: 'Tópicos por Camada OSI — Do Físico ao Aplicativo',        description: 'Camada 1-2: interfaces e VLANs. Camada 3: roteamento e IP. Camada 4: TCP/UDP e portas. Camada 5-7: sessões, criptografia e protocolos de aplicação. Cada módulo é colorido pela camada OSI que aborda', href: '/topicos', icon: Network },
  { id: 'g-quiz-trails',        category: 'Tópico',    title: 'Quiz — Selecione a Trilha: Firewall, Fundamentos ou Avançados', description: '200 perguntas divididas por trilha: Firewall (iptables, VPN, NAT), Fundamentos (FHS, comandos, processos) e Avançados (K8s, Ansible, eBPF). Sessão Rápida (20 perguntas) ou Completa. Questões embaralhadas a cada sessão', href: '/quiz', icon: Award },
  { id: 'g-quiz-badges',        category: 'Tópico',    title: 'Quiz Master e Quiz Expert — Badges por Pontuação',          description: 'quiz-expert: acertar 70%+. quiz-master: 100% de acerto. Questões com feedback visual verde/vermelho por opção. Explicação detalhada após cada resposta. Permite revisar conceitos diretamente nos módulos', href: '/quiz', icon: Award },
  { id: 'g-cert-share',         category: 'Tópico',    title: 'Certificado — Compartilhar via Web Share API e Imprimir',   description: 'Web Share API: botão "Compartilhar" abre o menu nativo do smartphone. Fallback: copiar link para área de transferência. Impressão: @media print oculta toda a UI e exibe só o certificado em A4 — ideal para PDF', href: '/certificado', icon: Award },
  { id: 'g-cert-complete',      category: 'Tópico',    title: 'Certificado de Conclusão — 10 Competências Técnicas',       description: 'O certificado lista 10 competências: Firewall Linux, VPN, DNS, SSL/TLS, Proxy, DNAT, Hardening, Docker, IDS/IPS e Automação. Gerado automaticamente com nome e data. Exige o badge course-master (visitar todos os módulos)', href: '/certificado', icon: Award },

  // ─── Treino SRS ─────────────────────────────────────────────────────────────
  { id: 'p-treino',             category: 'Página',    title: 'Treinamento Tático — Revisão Espaçada SM-2',               description: 'Motor SM-2 Lite: revise questões erradas nos intervalos certos. Score 1-5 sem punição psicológica, intervalos adaptativos (1→6→N dias) e streak de 7 dias consecutivos', href: '/treino', icon: Activity },
  { id: 'g-treino-sm2',        category: 'Tópico',    title: 'Algoritmo SM-2 — Repetição Espaçada e easeFactor',         description: 'SM-2 calcula o próximo intervalo com base no score: score < 3 reseta (intervalo = 1 dia), score ≥ 3 avança (1→6→N dias). easeFactor mínimo 1.3 garante que itens difíceis sempre sejam revisados. Persistido em workshop-srs-v1', href: '/treino', icon: Zap },
  { id: 'g-treino-streak',     category: 'Tópico',    title: 'Badge srs-streak-7 — 7 Dias Consecutivos de Treino',       description: 'Complete sessões de Treinamento Tático em 7 dias consecutivos para desbloquear o badge 🔥 srs-streak-7. Streak registrado em workshop-srs-streak. Uma sessão por dia basta — qualquer score conta', href: '/treino', icon: Award },

  // ─── Offline ────────────────────────────────────────────────────────────────
  { id: 'p-offline',           category: 'Página',    title: 'Modo Offline — Terminal de Emergência',                    description: 'Página de fallback com comandos essenciais disponíveis sem conexão à internet. Interface estilo terminal com tokens de tema dark/light', href: '/offline', icon: Terminal },
  { id: 'g-offline-commands',  category: 'Tópico',    title: 'Comandos de Emergência — Diagnóstico de Rede sem Internet', description: 'ip addr, ip route, ping, traceroute, ss -tlnp, iptables -L -n -v, nmap, dig, curl, journalctl — referência rápida para quando a conexão cai e você ainda precisa diagnosticar o firewall', href: '/offline', icon: Wrench },
  { id: 'g-offline-recovery',  category: 'Glossário',  title: 'Recuperação de Conectividade', description: 'Sequência de diagnóstico quando a rede cai: verificar interface, rota default, DNS e regras de firewall antes de pedir suporte', href: '/offline', icon: Wrench },

  // ─── Módulo F16 — Usuários e Grupos ─────────────────────────────────────────
  { id: 'p-usuarios',         category: 'Página',  title: 'Gerenciamento de Usuários e Grupos no Linux',              description: 'F16 da Trilha Fundamentos: adduser, usermod, groupadd, sudo e visudo. Ciclo de vida completo da identidade Linux com boas práticas de segurança', href: '/usuarios', icon: Users },
  { id: 'g-adduser-vs-useradd', category: 'Tópico', title: 'adduser vs useradd — Qual usar no Ubuntu/Debian?',          description: 'adduser é script amigável: cria home, copia /etc/skel e pede senha. useradd é binário de baixo nível. usermod -aG grupo usuario adiciona ao grupo (sem -a, perde todos os grupos). id e groups verificam pertencimento', href: '/usuarios', icon: Users },
  { id: 'g-sudo-visudo',      category: 'Tópico',  title: 'sudo e visudo — Privilégios Seguros sem su',               description: 'visudo valida sintaxe antes de salvar — nunca edite /etc/sudoers com vim diretamente. sudo -l lista permissões. NOPASSWD para deploy automatizado. Diferença entre su (muda shell) e sudo (executa comando único com privilégio)', href: '/usuarios', icon: Shield },

  // ─── Módulo F17 — Troubleshooting de Rede ───────────────────────────────────
  { id: 'p-troubleshooting',  category: 'Página',  title: 'Troubleshooting de Rede — Metodologia OSI Passo a Passo',  description: 'F17 da Trilha Fundamentos: ping, ip addr, ip route, ss -tulpn, dig, curl -v e journalctl. Diagnóstico de "o site não abre" em 5 minutos com metodologia sistemática', href: '/troubleshooting', icon: Wrench },
  { id: 'g-ss-tulpn',         category: 'Comando', title: 'ss -tulpn — Portas Abertas e Processos que Escutam',        description: 'ss -tulpn: TCP+UDP, Listening, portas e PIDs. Substitui netstat. ss -tlnp | grep :80 verifica se Nginx está escutando. ss -s mostra estatísticas. Mais rápido que netstat pois lê diretamente do kernel', href: '/troubleshooting', icon: Terminal },
  { id: 'g-osi-troubleshoot', category: 'Tópico',  title: 'Metodologia OSI de Baixo para Cima — Da Física ao App',    description: 'L1: ip link (interface up?). L2: arp -n (MAC resolvido?). L3: ping, ip route (rota?). L4: ss -tulpn (porta aberta?). L7: curl -v, dig (resposta correta?). Diagnóstico sistemático resolve 90% dos "site não abre"', href: '/troubleshooting', icon: Network },
];
