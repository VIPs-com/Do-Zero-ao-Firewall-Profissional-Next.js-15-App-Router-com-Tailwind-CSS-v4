'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

interface Topic {
  id: string;
  num: string;
  title: string;
  layer: string;
  layerClass: string;
  href: string;
  group: string;
}

const TOPICS: Topic[] = [
  { id: '01', num: '01', title: 'Como o cliente da LAN acessa o Web Server e o DNS? Configuração do proxy Squid no navegador.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#cliente-lan', group: 'LAN, DNS & Proxy' },
  { id: '07', num: '07', title: 'Fluxo completo de navegação do cliente via proxy Squid — do navegador até a internet.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#fluxo-squid', group: 'LAN, DNS & Proxy' },
  { id: '08', num: '08', title: 'Squid: dstdomain vs url_regex. Ordem correta das regras http_access e boas práticas.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#dstdomain', group: 'LAN, DNS & Proxy' },
  
  { id: '02', num: '02', title: 'Como o tráfego da internet chega ao firewall? WAN, IP público e o papel do NAT.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wan-nat#wan-nat', group: 'WAN, NAT & ESTABLISHED' },
  { id: '09', num: '09', title: 'SNAT: como o IP privado do cliente vira IP público do Firewall. SNAT vs MASQUERADE.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wan-nat#snat', group: 'WAN, NAT & ESTABLISHED' },
  { id: '10', num: '10', title: 'Como a resposta da internet volta para o cliente interno via ESTABLISHED e conntrack.', layer: 'Camada 5 · Sessão', layerClass: 'l5', href: '/wan-nat#established', group: 'WAN, NAT & ESTABLISHED' },
  
  { id: '03', num: '03', title: 'Todas as funções do Firewall: iptables, NAT, SNAT, DNAT, ip_forward, Port Knocking e Squid.', layer: 'Camadas 3 e 4 · Rede e Transporte', layerClass: 'l4', href: '/#firewall', group: 'Funções do Firewall' },
  
  { id: '04', num: '04', title: 'Como o BIND9 funciona? Registros A, CNAME e PTR. Por que o DNS é a primeira coisa que quebra?', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/dns', group: 'DNS com BIND9' },
  
  { id: '05', num: '05', title: 'Como o Nginx com SSL funciona? PKI, certificado autoassinado, cadeia de confiança.', layer: 'Camada 6 · Apresentação', layerClass: 'l6', href: '/nginx-ssl', group: 'Nginx, SSL & PKI' },
  { id: '14', num: '14', title: 'Como o Nginx recebe a conexão via DNAT? Ele sabe que passou pelo firewall?', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/nginx-ssl#reverse-proxy', group: 'Nginx, SSL & PKI' },
  
  { id: '11', num: '11', title: 'O que acontece quando alguém da internet acessa o site pelo IP público? Fluxo do DNAT.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dnat', group: 'DNAT & PREROUTING' },
  { id: '12', num: '12', title: 'Por que o DNAT fica no PREROUTING? A importância da ordem no roteamento.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dnat#prerouting', group: 'DNAT & PREROUTING' },
  { id: '13', num: '13', title: 'Por que sem FORWARD o DNAT não funciona? As duas regras obrigatórias juntas.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/dnat#forward', group: 'DNAT & PREROUTING' },
  
  { id: '06', num: '06', title: 'Configurando Port Knocking para FTP: batida secreta + DNAT + FORWARD.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#ftp-knock', group: 'Port Knocking' },
  { id: '15', num: '15', title: 'Fluxo do SSH via Port Knocking: como o administrador abre a porta 22.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#fluxo-ssh', group: 'Port Knocking' },
  { id: '16', num: '16', title: 'O arquivo /proc/net/xt_recent: como ver e manipular a lista de IPs autorizados.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#proc-recent', group: 'Port Knocking' },
  { id: '17', num: '17', title: 'Janela de tempo vs conexão ativa: o que acontece se demorar para conectar?', layer: 'Camada 5 · Sessão', layerClass: 'l5', href: '/port-knocking#janela-tempo', group: 'Port Knocking' },
  { id: '18', num: '18', title: 'Por que o Port Knocking deixa o SSH invisível para scanners e bots?', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#invisivel', group: 'Port Knocking' },
  { id: '19', num: '19', title: 'Auditoria forense com syslog: monitorando batidas e correlacionando com logins.', layer: 'Forense · Logs', layerClass: 'l4', href: '/port-knocking#auditoria', group: 'Port Knocking' },
  { id: '24', num: '24', title: 'Análise Forense de Logs: identificando ataques e acessos legítimos no kernel.', layer: 'Forense · Logs', layerClass: 'l4', href: '/audit-logs', group: 'Segurança Avançada' },

  { id: '20', num: '20', title: 'O que é IPSec? Autenticação, criptografia, integridade e proteção anti-replay.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/vpn-ipsec#ipsec', group: 'VPN & IPSec' },
  { id: '28', num: '28', title: 'Configuração prática de VPN Site-to-Site com StrongSwan e iptables.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/vpn-ipsec#configuracao', group: 'VPN & IPSec' },
  
  { id: '21', num: '21', title: 'Pivoteamento DMZ → LAN: como um invasor usa o Web Server para atacar a rede interna.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/pivoteamento#cenario', group: 'Segurança Avançada' },
  { id: '22', num: '22', title: 'Mitigação de Pivoteamento: regras de FORWARD e isolamento de estado no iptables.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/pivoteamento#mitigacao', group: 'Segurança Avançada' },
  
  { id: '23', num: '23', title: 'Ataques Avançados: Fragmentação, Timing Attacks e DNS Rebinding na prática.', layer: 'Camadas 3-7 · Multi-layer', layerClass: 'l7', href: '/ataques-avancados', group: 'Segurança Avançada' },
];

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { visitedPages } = useBadges();

  const filteredTopics = useMemo(() => {
    return TOPICS.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           topic.group.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || topic.layerClass === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, Topic[]>();
    filteredTopics.forEach(topic => {
      if (!map.has(topic.group)) map.set(topic.group, []);
      map.get(topic.group)!.push(topic);
    });
    return Array.from(map.entries());
  }, [filteredTopics]);

  const completionPercentage = useMemo(() => {
    const totalPages = 20; 
    return Math.round((visitedPages.size / totalPages) * 100);
  }, [visitedPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Tópicos</span>
      </div>

      <div className="section-label">Guia Completo</div>
      <h1 className="section-title">Todos os Tópicos</h1>
      <p className="section-sub">
        {TOPICS.length} tópicos organizados por tema, cobrindo cada camada do Modelo OSI.
        Cada página traz explicações completas, diagramas de fluxo e blocos de código comentados.
      </p>

      {/* Progress Global */}
      <div className="bg-bg-2 border border-border rounded-xl p-6 mb-12 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-accent">📊</span> Seu Progresso no Workshop
          </h3>
          <span className="text-xs font-mono text-text-3 uppercase tracking-widest">Beta</span>
        </div>
        <div className="w-full h-3 bg-bg-3 rounded-full overflow-hidden mb-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(completionPercentage, 100)}%` }}
            className="h-full bg-gradient-to-r from-ok to-accent"
          />
        </div>
        <div className="flex justify-between text-sm text-text-2">
          <span>{Math.min(completionPercentage, 100)}% concluído</span>
          <span>{visitedPages.size} de 20 páginas visitadas</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
          <input
            type="text"
            placeholder="Buscar tópico, camada ou serviço... (ex: DNS, Camada 4, SNAT)"
            className="w-full bg-bg-2 border border-border rounded-lg py-3.5 pl-12 pr-4 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: '📚 Todos' },
            { id: 'l7', label: '📡 Camada 7' },
            { id: 'l6', label: '🔒 Camada 6' },
            { id: 'l5', label: '🔄 Camada 5' },
            { id: 'l4', label: '🔌 Camada 4' },
            { id: 'l3', label: '🌐 Camada 3' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                activeFilter === filter.id 
                  ? "bg-accent border-accent text-white" 
                  : "bg-bg-2 border-border text-text-2 hover:border-accent hover:text-accent"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map(([groupName, topics]) => (
          <div key={groupName} className="bg-bg-2 border border-border rounded-xl overflow-hidden flex flex-col hover:border-accent/30 transition-colors">
            <div className="px-5 py-4 border-b border-border bg-bg-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent text-lg">
                {groupName.includes('LAN') ? '💻' : groupName.includes('WAN') ? '🌐' : groupName.includes('DNS') ? '📖' : '🛡️'}
              </div>
              <h3 className="font-bold text-sm">{groupName}</h3>
            </div>
            <div className="flex-1 py-2">
              {topics.map(topic => (
                <Link 
                  key={topic.id} 
                  href={topic.href}
                  className="group flex gap-4 px-5 py-4 hover:bg-bg-3 border-l-2 border-transparent hover:border-accent transition-all"
                >
                  <span className="font-mono text-[10px] text-text-3 bg-bg-3 px-2 py-1 rounded-full h-fit group-hover:bg-accent group-hover:text-white transition-colors">
                    {topic.num}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-text-2 group-hover:text-text transition-colors leading-relaxed">
                      {topic.title}
                    </p>
                    <span className={cn("layer-badge mt-3", topic.layerClass)}>
                      {topic.layer}
                    </span>
                  </div>
                  <ChevronRight className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity self-center" size={16} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-20 bg-bg-2 border border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold mb-2">Nenhum tópico encontrado</h3>
          <p className="text-text-3">Tente buscar por outros termos ou limpar os filtros.</p>
        </div>
      )}
    </div>
  );
}
