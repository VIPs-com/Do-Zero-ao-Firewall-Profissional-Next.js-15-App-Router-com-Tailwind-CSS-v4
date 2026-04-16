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
  { id: 'p-dashboard',  title: 'Dashboard',     description: 'Seu progresso, badges e checkpoints concluídos',  category: 'Página', href: '/dashboard',   icon: Layout },
  { id: 'p-topics',     title: 'Tópicos',       description: 'Índice completo de todos os módulos do workshop', category: 'Página', href: '/topicos',      icon: Book },
  { id: 'p-cheat',      title: 'Cheat Sheet',   description: 'Referência rápida de comandos iptables e Linux',  category: 'Página', href: '/cheat-sheet', icon: FileText },
  { id: 'p-glossary',   title: 'Glossário',     description: 'Dicionário de termos técnicos de redes e segurança', category: 'Página', href: '/glossario', icon: Book },
  { id: 'p-quiz',       title: 'Quiz',          description: 'Teste seus conhecimentos e desbloqueie badges',   category: 'Página', href: '/quiz',         icon: Award },
  { id: 'p-cert',       title: 'Certificado',   description: 'Gere seu certificado de conclusão do workshop',   category: 'Página', href: '/certificado', icon: Award },
  { id: 'p-evolucao',   title: 'Evolução',      description: 'Roadmap tecnológico e linha do tempo do projeto', category: 'Página', href: '/evolucao',    icon: TrendingUp },

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
];
