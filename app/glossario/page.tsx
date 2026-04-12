'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, Book, Hash, Shield, Globe, Lock, Terminal, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Term {
  term: string;
  definition: string;
  category: string;
  icon: React.ReactNode;
}

const GLOSSARY: Term[] = [
  // Firewall
  { term: "ACL", definition: "Access Control List — lista de regras que define quem pode acessar o quê. No Squid, define quais sites são permitidos ou bloqueados.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "conntrack", definition: "Módulo do kernel que mantém o estado das conexões ativas. Essencial para o funcionamento do NAT e da regra ESTABLISHED.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "ESTABLISHED", definition: "Estado de conexão TCP onde o handshake já foi completado e dados estão fluindo. Regra do iptables que permite respostas.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "FORWARD", definition: "Chain do iptables que processa pacotes que atravessam o firewall (não são destinados ao próprio firewall).", category: "Firewall", icon: <Shield size={14} /> },
  { term: "iptables", definition: "Firewall do kernel Linux. Gerencia regras de filtragem, NAT e redirecionamento de pacotes.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "Port Knocking", definition: "Técnica de segurança onde a porta SSH só abre após o envio de um pacote secreto em outra porta.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "recent", definition: "Módulo do iptables que mantém listas de IPs com timestamps. Usado pelo Port Knocking.", category: "Firewall", icon: <Shield size={14} /> },
  
  // WAN & NAT
  { term: "DNAT", definition: "Destination NAT — traduz o IP de destino do pacote. Usado para redirecionar conexões da internet para servidores internos.", category: "Redes", icon: <Globe size={14} /> },
  { term: "MASQUERADE", definition: "Variante do SNAT que descobre automaticamente o IP da interface de saída. Útil quando o IP público é dinâmico (DHCP).", category: "Redes", icon: <Globe size={14} /> },
  { term: "NAT", definition: "Network Address Translation — traduz endereços IP entre redes públicas e privadas.", category: "Redes", icon: <Globe size={14} /> },
  { term: "POSTROUTING", definition: "Chain do iptables onde o SNAT é aplicado — depois da decisão de roteamento, antes do pacote sair.", category: "Redes", icon: <Globe size={14} /> },
  { term: "PREROUTING", definition: "Chain do iptables onde o DNAT é aplicado — antes da decisão de roteamento.", category: "Redes", icon: <Globe size={14} /> },
  { term: "SNAT", definition: "Source NAT — traduz o IP de origem do pacote. Usado para que redes internas acessem a internet.", category: "Redes", icon: <Globe size={14} /> },
  
  // DNS
  { term: "BIND9", definition: "O servidor DNS mais usado no Linux. Responsável por resolver nomes de domínio em endereços IP.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "CNAME", definition: "Registro DNS que cria um apelido para outro nome. Ex: web → www (web aponta para o mesmo IP de www).", category: "DNS", icon: <Terminal size={14} /> },
  { term: "DNS", definition: "Domain Name System — sistema que traduz nomes de domínio (ex: google.com) em endereços IP.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "PTR", definition: "Registro DNS reverso — mapeia um IP para um nome de domínio. Usado por servidores de e-mail para verificar remetentes.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "TTL", definition: "Time To Live — tempo que uma resposta DNS fica em cache antes de expirar.", category: "DNS", icon: <Terminal size={14} /> },
  
  // SSL/TLS
  { term: "Nginx", definition: "Servidor web de alta performance, usado para servir páginas HTTP/HTTPS e como proxy reverso.", category: "Segurança", icon: <Lock size={14} /> },
  { term: "OpenSSL", definition: "Biblioteca de criptografia usada para gerar certificados SSL/TLS e chaves.", category: "Segurança", icon: <Lock size={14} /> },
  { term: "PKI", definition: "Public Key Infrastructure — infraestrutura de chave pública que gerencia certificados digitais.", category: "Segurança", icon: <Lock size={14} /> },
  { term: "SSL/TLS", definition: "Protocolos de criptografia que garantem segurança na comunicação HTTP (HTTPS). Camada 6 do modelo OSI.", category: "Segurança", icon: <Lock size={14} /> },
  
  // Squid
  { term: "dstdomain", definition: "ACL do Squid que verifica apenas o domínio de destino. Mais rápido e funciona com HTTPS.", category: "Proxy", icon: <Search size={14} /> },
  { term: "Squid", definition: "Proxy de cache que filtra conteúdo na Camada 7 (URLs). Pode bloquear sites por domínio ou palavra.", category: "Proxy", icon: <Search size={14} /> },
  { term: "url_regex", definition: "ACL do Squid que analisa a URL completa com expressões regulares. Mais lento e não funciona bem com HTTPS.", category: "Proxy", icon: <Search size={14} /> },
  
  // VPN & IPSec
  { term: "AH", definition: "Authentication Header — protocolo IPSec que autentica e garante integridade, mas não criptografa. Menos usado que ESP.", category: "VPN", icon: <Zap size={14} /> },
  { term: "ESP", definition: "Encapsulating Security Payload — protocolo IPSec que criptografa e autentica os dados. É o mais usado em VPNs.", category: "VPN", icon: <Zap size={14} /> },
  { term: "IKE", definition: "Internet Key Exchange — protocolo que estabelece e gerencia as chaves de criptografia para VPNs IPSec. Opera em duas fases.", category: "VPN", icon: <Zap size={14} /> },
  { term: "IKEv2", definition: "Versão moderna do IKE, mais rápida e segura. Suporta MOBIKE (roaming entre redes) e é padrão em dispositivos móveis.", category: "VPN", icon: <Zap size={14} /> },
  { term: "IPSec", definition: "Internet Protocol Security — conjunto de protocolos que autentica e criptografa pacotes IP, base das VPNs corporativas.", category: "VPN", icon: <Zap size={14} /> },
  { term: "MOBIKE", definition: "Mobility and Multihoming — extensão do IKEv2 que permite que uma VPN continue ativa mesmo quando o dispositivo muda de rede.", category: "VPN", icon: <Zap size={14} /> },
  { term: "NAT-T", definition: "NAT Traversal — técnica que encapsula tráfego IPSec em UDP (porta 4500) para funcionar através de roteadores NAT.", category: "VPN", icon: <Zap size={14} /> },
  { term: "PSK", definition: "Pre-Shared Key — chave secreta compartilhada entre os pares de uma VPN. Mais simples, mas menos segura que certificados.", category: "VPN", icon: <Zap size={14} /> },
  { term: "StrongSwan", definition: "Implementação open-source de IPSec para Linux. Suporta IKEv1, IKEv2, certificados X.509.", category: "VPN", icon: <Zap size={14} /> },
  
  // Evolução
  { term: "eBPF", definition: "Extended Berkeley Packet Filter — tecnologia que permite executar código seguro no kernel Linux. Usada em firewalls modernos.", category: "Evolução", icon: <Activity size={14} /> },
  { term: "nftables", definition: "Sucessor do iptables, unifica as tabelas em uma sintaxe única e oferece melhor performance.", category: "Evolução", icon: <Activity size={14} /> },
  { term: "OPNsense", definition: "Firewall de borda baseado em FreeBSD, com interface web, suporte a VPN e IDS/IPS.", category: "Evolução", icon: <Activity size={14} /> },
  { term: "Pi-hole", definition: "Servidor DNS que bloqueia anúncios e rastreadores em toda a rede. Funciona como um filtro de DNS.", category: "Evolução", icon: <Activity size={14} /> }
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(GLOSSARY.map(t => t.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY.filter(t => {
      const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-glossario">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Glossário</span>
      </div>

      <div className="section-label">Dicionário Técnico</div>
      <h1 className="section-title">📖 Glossário Hacker</h1>
      <p className="section-sub">
        A sopa de letrinhas do Linux traduzida para o português claro. 
        Busque por siglas, comandos ou conceitos.
      </p>

      <div className="space-y-8 mb-12">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
          <input
            type="text"
            placeholder="Buscar termo... (ex: NAT, SSL, IKEv2)"
            className="w-full bg-bg-2 border border-border rounded-lg py-3.5 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                activeCategory === cat 
                  ? "bg-accent border-accent text-white" 
                  : "bg-bg-2 border-border text-text-3 hover:border-accent hover:text-accent"
              )}
            >
              {cat === 'all' ? '📚 Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((t, i) => (
          <motion.div 
            key={t.term}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-xl bg-bg-2 border border-border hover:border-accent/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold text-accent-2">{t.term}</h3>
              <div className="px-2 py-1 rounded bg-bg-3 border border-border text-[9px] font-bold uppercase tracking-widest text-text-3 flex items-center gap-1.5">
                {t.icon}
                {t.category}
              </div>
            </div>
            <p className="text-sm text-text-2 leading-relaxed group-hover:text-text transition-colors">
              {t.definition}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-20 bg-bg-2 border border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold mb-2">Nenhum termo encontrado</h3>
          <p className="text-text-3">Tente buscar por outra palavra ou limpe os filtros.</p>
        </div>
      )}
    </div>
  );
}
