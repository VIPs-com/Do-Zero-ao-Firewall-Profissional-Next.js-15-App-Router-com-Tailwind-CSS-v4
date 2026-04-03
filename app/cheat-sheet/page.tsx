'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Terminal, Copy, Check, Search, Filter, BookOpen, Shield, Zap, Globe, Lock, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox } from '@/components/ui/Boxes';

interface Command {
  id: string;
  cmd: string;
  desc: string;
  layer: string;
  layerClass: string;
  category: string;
}

const COMMANDS: Command[] = [
  // Camada 3 - Rede
  { id: 'ip-addr', cmd: 'ip addr show', desc: 'Verifica IPs e estado das interfaces de rede.', layer: 'Camada 3', layerClass: 'l3', category: 'Rede' },
  { id: 'ip-route', cmd: 'ip route show', desc: 'Exibe a tabela de roteamento do kernel.', layer: 'Camada 3', layerClass: 'l3', category: 'Rede' },
  { id: 'ping', cmd: 'ping -c 4 8.8.8.8', desc: 'Testa conectividade básica via ICMP.', layer: 'Camada 3', layerClass: 'l3', category: 'Rede' },
  { id: 'sysctl-forward', cmd: 'sysctl net.ipv4.ip_forward', desc: 'Verifica se o roteamento de pacotes está ativo.', layer: 'Camada 3', layerClass: 'l3', category: 'Firewall' },
  
  // Camada 4 - Transporte
  { id: 'iptables-list', cmd: 'iptables -L -n -v', desc: 'Lista todas as regras de filtro com contadores.', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },
  { id: 'iptables-nat', cmd: 'iptables -t nat -L -n -v', desc: 'Lista as regras de NAT (PREROUTING/POSTROUTING).', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },
  { id: 'ss-tulpn', cmd: 'ss -tulpn', desc: 'Lista portas abertas e processos ouvindo.', layer: 'Camada 4', layerClass: 'l4', category: 'Diagnóstico' },
  { id: 'nmap-scan', cmd: 'nmap -sS -p 1-1000 192.168.56.120', desc: 'Scan de portas TCP (Syn Scan).', layer: 'Camada 4', layerClass: 'l4', category: 'Segurança' },
  
  // Camada 7 - Aplicação
  { id: 'dig-dns', cmd: 'dig @192.168.56.100 www.workshop.local', desc: 'Consulta DNS específica para um servidor.', layer: 'Camada 7', layerClass: 'l7', category: 'DNS' },
  { id: 'curl-proxy', cmd: 'curl -x http://192.168.57.250:3128 http://google.com', desc: 'Testa navegação via Proxy Squid.', layer: 'Camada 7', layerClass: 'l7', category: 'Proxy' },
  { id: 'nginx-test', cmd: 'nginx -t', desc: 'Valida a sintaxe dos arquivos de configuração do Nginx.', layer: 'Camada 7', layerClass: 'l7', category: 'Web' },
  { id: 'tail-squid', cmd: 'tail -f /var/log/squid/access.log', desc: 'Monitora logs de acesso do Proxy em tempo real.', layer: 'Camada 7', layerClass: 'l7', category: 'Logs' },
  
  // Segurança & VPN
  { id: 'strongswan-status', cmd: 'swanctl --list-sas', desc: 'Lista as Security Associations (SAs) da VPN IPSec.', layer: 'Camada 3', layerClass: 'l3', category: 'VPN' },
  { id: 'knock-test', cmd: 'knock 192.168.20.200 7000 8000 9000', desc: 'Envia sequência de batidas para o Port Knocking.', layer: 'Camada 4', layerClass: 'l4', category: 'Segurança' },
  { id: 'openssl-cert', cmd: 'openssl x509 -in cert.pem -text -noout', desc: 'Lê o conteúdo de um certificado SSL.', layer: 'Camada 6', layerClass: 'l6', category: 'SSL/TLS' },
];

export default function CheatSheetPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('cheat-sheet');
  }, [trackPageVisit]);

  const filteredCommands = COMMANDS.filter(cmd => {
    const matchesSearch = cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cmd.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || cmd.layerClass === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Cheat Sheet</span>
      </div>

      <div className="section-label">Referência Rápida</div>
      <h1 className="section-title">Comandos Essenciais</h1>
      <p className="section-sub">
        Uma coleção dos comandos mais utilizados durante o workshop, organizados por camada OSI e categoria.
      </p>

      {/* Search and Filters */}
      <div className="space-y-6 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
          <input
            type="text"
            placeholder="Buscar comando ou descrição... (ex: iptables, dns, proxy)"
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

      <div className="grid gap-6">
        {filteredCommands.length > 0 ? (
          filteredCommands.map(cmd => (
            <div key={cmd.id} className="bg-bg-2 border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-all group">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", 
                      cmd.layerClass === 'l7' ? "bg-layer-7/10 border-layer-7/20 text-layer-7" :
                      cmd.layerClass === 'l6' ? "bg-layer-6/10 border-layer-6/20 text-layer-6" :
                      cmd.layerClass === 'l4' ? "bg-layer-4/10 border-layer-4/20 text-layer-4" :
                      "bg-layer-3/10 border-layer-3/20 text-layer-3"
                    )}>
                      {cmd.layer}
                    </span>
                    <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest">{cmd.category}</span>
                  </div>
                  <h3 className="font-bold text-text mb-1 flex items-center gap-2">
                    <Terminal size={14} className="text-accent" />
                    <code className="text-accent-2">{cmd.cmd}</code>
                  </h3>
                  <p className="text-sm text-text-2">{cmd.desc}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(cmd.cmd)}
                  className="flex items-center gap-2 px-4 py-2 bg-bg-3 hover:bg-accent hover:text-white border border-border rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  <Copy size={14} />
                  Copiar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-bg-2 border border-dashed border-border rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold mb-2">Nenhum comando encontrado</h3>
            <p className="text-text-3">Tente buscar por outros termos ou limpar os filtros.</p>
          </div>
        )}
      </div>

      <HighlightBox className="mt-12" title="Dica de Produtividade">
        <p className="text-sm text-text-2">
          Você pode usar o atalho <code>Ctrl + K</code> em qualquer página para abrir a busca global e encontrar comandos rapidamente.
        </p>
      </HighlightBox>
    </div>
  );
}
