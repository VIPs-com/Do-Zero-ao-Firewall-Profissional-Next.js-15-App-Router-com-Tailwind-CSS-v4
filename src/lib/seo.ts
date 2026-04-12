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
      'Configure SNAT e MASQUERADE no iptables para dar acesso à internet para a LAN. Entenda POSTROUTING, conntrack e estado ESTABLISHED.',
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
      'Implante Squid como proxy da LAN com ACLs, filtragem por dstdomain, logs de acesso e controle de conteúdo para usuários internos.',
  },
  '/dnat': {
    title: 'DNAT & Port Forwarding',
    description:
      'Publique serviços da DMZ para a WAN com DNAT no iptables. Entenda PREROUTING, a ordem correta de regras e integração com FORWARD.',
  },
  '/port-knocking': {
    title: 'Port Knocking — SSH Invisível',
    description:
      'Torne o SSH invisível para port scans com port knocking usando iptables recent module. Sequência secreta, timeout e stealth mode.',
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
      'Configure logging de firewall, journald, syslog e auditd. Monitore tráfego suspeito e mantenha trilha de auditoria para forense.',
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
