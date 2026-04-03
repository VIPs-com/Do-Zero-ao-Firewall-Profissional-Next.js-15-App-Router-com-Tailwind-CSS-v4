import { 
  Book, 
  Shield, 
  Globe, 
  Terminal, 
  Lock, 
  Zap, 
  Home, 
  Layout, 
  Settings, 
  HelpCircle, 
  FileText, 
  Award,
  Network,
  Activity,
  Cpu
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
  // Pages
  { id: 'p-home', title: 'Início', description: 'Página inicial com topologia interativa', category: 'Página', href: '/', icon: Home },
  { id: 'p-dashboard', title: 'Dashboard', description: 'Seu progresso e conquistas', category: 'Página', href: '/dashboard', icon: Layout },
  { id: 'p-topics', title: 'Tópicos', description: 'Lista completa de todos os tópicos', category: 'Página', href: '/topicos', icon: Book },
  { id: 'p-cheat-sheet', title: 'Cheat Sheet', description: 'Guia rápido de comandos iptables e linux', category: 'Página', href: '/cheat-sheet', icon: FileText },
  { id: 'p-glossary', title: 'Glossário', description: 'Dicionário de termos técnicos', category: 'Página', href: '/glossario', icon: Book },
  { id: 'p-quiz', title: 'Quiz', description: 'Teste seus conhecimentos', category: 'Página', href: '/quiz', icon: Award },
  { id: 'p-cert', title: 'Certificado', description: 'Gere seu certificado de conclusão', category: 'Página', href: '/certificado', icon: Award },

  // Topics (Selected important ones)
  { id: 't-proxy', title: 'Proxy Squid', description: 'Configuração de proxy e controle de acesso', category: 'Tópico', href: '/lan-proxy#cliente-lan', icon: Globe },
  { id: 't-nat', title: 'NAT & SNAT', description: 'Tradução de endereços de rede e saída para internet', category: 'Tópico', href: '/wan-nat#snat', icon: Network },
  { id: 't-dns', title: 'DNS BIND9', description: 'Servidor de nomes, zonas direta e reversa', category: 'Tópico', href: '/dns', icon: Terminal },
  { id: 't-ssl', title: 'SSL/TLS & Nginx', description: 'Criptografia e certificados no servidor web', category: 'Tópico', href: '/web-server', icon: Lock },
  { id: 't-dnat', title: 'DNAT & Port Forwarding', description: 'Redirecionamento de portas para servidores internos', category: 'Tópico', href: '/dnat', icon: Shield },
  { id: 't-knock', title: 'Port Knocking', description: 'Segurança por obscuridade e batida secreta', category: 'Tópico', href: '/port-knocking', icon: Zap },
  { id: 't-vpn', title: 'VPN IPSec', description: 'Túneis seguros entre redes com StrongSwan', category: 'Tópico', href: '/vpn-ipsec', icon: Lock },
  { id: 't-pivot', title: 'Pivoteamento', description: 'Riscos de invasão lateral na rede', category: 'Tópico', href: '/pivoteamento', icon: Activity },

  // Glossary Terms (Selected)
  { id: 'g-acl', title: 'ACL', description: 'Access Control List — lista de regras de acesso', category: 'Glossário', href: '/glossario', icon: Shield },
  { id: 'g-conntrack', title: 'conntrack', description: 'Módulo de rastreamento de conexões do kernel', category: 'Glossário', href: '/glossario', icon: Activity },
  { id: 'g-iptables', title: 'iptables', description: 'Ferramenta de firewall padrão do Linux', category: 'Glossário', href: '/cheat-sheet', icon: Shield },
  { id: 'g-pki', title: 'PKI', description: 'Public Key Infrastructure — gestão de certificados', category: 'Glossário', href: '/glossario', icon: Lock },
  
  // Commands
  { id: 'c-iptables-l', title: 'iptables -L', description: 'Listar todas as regras de firewall', category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-tcpdump', title: 'tcpdump', description: 'Capturar e analisar tráfego de rede', category: 'Comando', href: '/cheat-sheet', icon: Terminal },
  { id: 'c-dig', title: 'dig', description: 'Consultar registros DNS', category: 'Comando', href: '/cheat-sheet', icon: Terminal },
];
