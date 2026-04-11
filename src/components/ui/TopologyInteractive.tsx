'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Terminal, Shield, Globe, Server, Laptop, Lock, AlertTriangle, ShieldAlert, ArrowRight, BookOpen, Zap, Award } from 'lucide-react';
import { useBadges, BADGE_DEFS, BadgeId } from '@/context/BadgeContext';
import { DeepDiveModal } from '@/components/DeepDiveModal';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { cn } from '@/lib/utils';
import { ProgressBar } from './ProgressBar';
import { BadgeDisplay } from './BadgeDisplay';

interface NodeInfo {
  id: string;
  title: string;
  icon: React.ReactNode;
  zone: string;
  layer: string;
  ip?: string;
  services?: string[];
  cmd: string;
  info: string[];
}

interface RiskInfo {
  id: string;
  title: string;
  desc: string;
  mitigation: string;
  x: number;
  y: number;
}

const RISKS: RiskInfo[] = [
  { 
    id: 'pivoting-risk', 
    title: 'Risco de Pivoteamento', 
    desc: 'Se o Web Server for invadido, o atacante tentará pular para a LAN.', 
    mitigation: 'Bloquear FORWARD da DMZ para a LAN no iptables.',
    x: 415, y: 480 
  },
  { 
    id: 'knocking-timing', 
    title: 'Timing Attack', 
    desc: 'Um atacante pode tentar adivinhar a sequência de batidas monitorando o tempo de resposta.', 
    mitigation: 'Usar janelas de tempo curtas e logs de auditoria.',
    x: 580, y: 190 
  },
  { 
    id: 'dns-rebinding', 
    title: 'DNS Rebinding', 
    desc: 'Enganar o navegador para acessar serviços internos via DNS malicioso.', 
    mitigation: 'Configurar o Squid para validar o Host header e usar DNS local confiável.',
    x: 135, y: 330 
  }
];

const NODES: Record<string, NodeInfo> = {
  internet: {
    id: 'internet',
    title: 'Internet (WAN)',
    icon: <Globe size={20} />,
    zone: 'WAN',
    layer: 'Camadas 1–3',
    ip: 'IP-PÚBLICO-VARIAVEL',
    services: ['BGP', 'HTTP/S', 'DNS'],
    cmd: 'ip route show',
    info: [
      'Rede externa não confiável.',
      'Todo tráfego vindo da internet é tratado como suspeito.',
      'O Firewall é a barreira entre a internet e as redes internas.',
      'O IP público do Firewall é o único endereço visível para o mundo.'
    ]
  },
  firewall: {
    id: 'firewall',
    title: 'Firewall · Gateway',
    icon: <Shield size={20} />,
    zone: 'Firewall',
    layer: 'Camadas 3–4',
    ip: '192.168.57.250 (LAN) / 192.168.20.200 (WAN)',
    services: ['iptables', 'Squid Proxy', 'StrongSwan VPN', 'knockd'],
    cmd: 'iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT; iptables -A FORWARD -p tcp -d 192.168.56.120 --dport 443 -m state --state NEW -j ACCEPT; iptables -A FORWARD -p udp -d 192.168.56.100 --dport 53 -m state --state NEW -j ACCEPT',
    info: [
      'Coração da infraestrutura.',
      'iptables: filtra pacotes (Camadas 3 e 4)',
      'Regra DMZ: Permite ESTABLISHED,RELATED e NEW para portas 443 e 53.',
      'SNAT: troca IP privado pelo público (192.168.57.0/24 -> WAN)',
      'DNAT: redireciona portas da internet para a DMZ',
      'Squid Proxy: filtra URLs na Camada 7',
      'Port Knocking: esconde a porta SSH',
      'VPN IPSec: túneis criptografados'
    ]
  },
  dns: {
    id: 'dns',
    title: 'DNS Server',
    icon: <Terminal size={20} />,
    zone: 'DMZ',
    layer: 'Camada 7',
    ip: '192.168.56.100',
    services: ['BIND9'],
    cmd: 'dig @192.168.56.100 www.workshop.local',
    info: [
      'O DNS é a agenda telefônica da rede.',
      'Registros: A (nome→IP), CNAME (apelido), PTR (IP→nome)',
      'Por que é a primeira coisa que quebra? Porque todo serviço usa nomes.'
    ]
  },
  web: {
    id: 'web',
    title: 'Web Server',
    icon: <Lock size={20} />,
    zone: 'DMZ',
    layer: 'Camadas 6–7',
    ip: '192.168.56.120',
    services: ['Nginx', 'OpenSSL'],
    cmd: 'curl -k https://192.168.56.120',
    info: [
      'Nginx + SSL — Camadas 6 e 7',
      'Camada 7 (HTTP): Nginx processa requisições.',
      'Camada 6 (SSL/TLS): criptografa os dados.',
      'Certificado autoassinado no lab.'
    ]
  },
  ftp: {
    id: 'ftp',
    title: 'FTP Server',
    icon: <Server size={20} />,
    zone: 'DMZ',
    layer: 'Camada 4',
    ip: '192.168.56.110',
    services: ['vsftpd'],
    cmd: 'nmap -p 21 192.168.56.110',
    info: [
      'Servidor de arquivos protegido por Port Knocking.',
      'Antes de conectar na porta 21, precisa enviar batida secreta em outra porta.',
      'Sem a batida: porta 21 invisível.'
    ]
  },
  client: {
    id: 'client',
    title: 'Cliente LAN',
    icon: <Laptop size={20} />,
    zone: 'LAN',
    layer: 'Camadas 3–7',
    ip: '192.168.57.50',
    services: ['Web Browser', 'SSH Client'],
    cmd: 'curl -x http://192.168.57.250:3128 http://google.com',
    info: [
      'Estação do usuário final.',
      'Caminho: Navegador → Squid (3128) → SNAT → Internet',
      'DNS: 192.168.56.100',
      'Gateway: 192.168.57.250'
    ]
  }
};

export const TopologyInteractive: React.FC = memo(() => {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskInfo | null>(null);
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);
  const [hoveredRisk, setHoveredRisk] = useState<RiskInfo | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ node: NodeInfo; x: number; y: number } | null>(null);
  const { trackTopologyClick, trackRiskClick, unlockedBadges } = useBadges();

  const handleNodeClick = (node: NodeInfo) => {
    setSelectedNode(node);
    trackTopologyClick();
  };

  return (
    <div className="relative bg-bg-2 border border-border rounded-xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-[10px] font-mono text-text-3 uppercase tracking-widest">topologia-de-rede.svg</div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-3">
          <Info size={12} />
          <span className="hidden sm:inline">Clique nos componentes</span>
          <span className="sm:hidden">Toque nos itens</span>
        </div>
      </div>

      {/* Desktop SVG View */}
      <div className="hidden lg:block p-4 md:p-8 overflow-x-auto relative">
        <svg
          viewBox="0 0 760 900"
          className="min-w-[600px] w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="topology-title"
          aria-describedby="topology-desc"
        >
          <title id="topology-title">Topologia de rede do laboratório Workshop Linux</title>
          <desc id="topology-desc">
            Diagrama interativo mostrando a Internet (WAN) conectada a um Firewall gateway,
            que isola a Zona DMZ (contendo DNS Server, Web Server e FTP Server) da Zona LAN
            (contendo o Cliente). Três pontos de risco estão destacados com triângulos de alerta:
            Pivoteamento entre DMZ e LAN, Timing Attack no Port Knocking e DNS Rebinding no proxy.
            Todos os nós e alertas são botões navegáveis por teclado (Tab para mover, Enter ou Espaço para ativar).
          </desc>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#484f58" />
            </marker>
          </defs>

          {/* Decorative lines */}
          <g aria-hidden="true">
            <line x1="380" y1="90" x2="380" y2="140" stroke="#484f58" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <rect x="30" y="300" width="380" height="360" rx="18" className="fill-warn/5 stroke-warn/30" strokeWidth="2" strokeDasharray="10 5"/>
            <text x="220" y="335" textAnchor="middle" className="fill-text text-sm font-bold">Zona DMZ</text>
            <rect x="430" y="300" width="300" height="360" rx="18" className="fill-layer-5/5 stroke-layer-5/30" strokeWidth="2" strokeDasharray="10 5"/>
            <text x="580" y="335" textAnchor="middle" className="fill-text text-sm font-bold">Zona LAN</text>
            <path d="M290 240 L230 300" className="stroke-layer-3" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M470 240 L540 300" className="stroke-layer-5" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
          </g>

          {/* WAN Section */}
          <g 
            className="cursor-pointer group focus-visible:outline-none" 
            onMouseEnter={() => setHoveredNode({ node: NODES.internet, x: 380, y: 55 })}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(NODES.internet)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(NODES.internet);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre Internet (WAN)"
          >
            <rect x="240" y="20" width="280" height="70" rx="35" className="fill-bg-2 stroke-accent group-hover:fill-accent-bg group-focus-visible:stroke-[3px] transition-all" strokeWidth="2"/>
            <text x="380" y="50" textAnchor="middle" className="fill-text text-sm font-bold">Internet (WAN)</text>
            <text x="380" y="68" textAnchor="middle" className="fill-text-2 text-[10px]">Rede externa · não confiável</text>
          </g>

          {/* Firewall Section */}
          <g 
            className="cursor-pointer group focus-visible:outline-none" 
            onMouseEnter={() => setHoveredNode({ node: NODES.firewall, x: 380, y: 190 })}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(NODES.firewall)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(NODES.firewall);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre Firewall Gateway"
          >
            <rect x="160" y="140" width="440" height="100" rx="16" className="fill-accent-bg stroke-accent group-hover:fill-accent/20 group-focus-visible:stroke-[3px] transition-all" strokeWidth="2"/>
            <text x="380" y="175" textAnchor="middle" className="fill-text text-base font-bold">Firewall · Gateway da rede</text>
            <text x="380" y="195" textAnchor="middle" className="fill-text-2 text-[11px]">iptables · SNAT · DNAT · Squid · VPN</text>
            <text x="380" y="215" textAnchor="middle" className="fill-accent-2 text-[10px] font-mono">Camadas 3 e 4</text>
          </g>

          {/* DNS Server */}
          <g 
            className="cursor-pointer group focus-visible:outline-none" 
            onMouseEnter={() => setHoveredNode({ node: NODES.dns, x: 135, y: 425 })}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(NODES.dns)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(NODES.dns);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre DNS Server"
          >
            <rect x="50" y="360" width="170" height="130" rx="12" className="fill-bg-2 stroke-layer-3 group-hover:fill-layer-3/10 group-focus-visible:stroke-[3px] transition-all" strokeWidth="1.5"/>
            <text x="135" y="395" textAnchor="middle" className="fill-layer-3 text-sm font-bold">DNS Server</text>
            <text x="135" y="415" textAnchor="middle" className="fill-text-2 text-[10px]">IP: DNS-SERVER</text>
            <text x="135" y="435" textAnchor="middle" className="fill-text-3 text-[9px]">BIND9 · Porta 53</text>
          </g>

          {/* Web Server */}
          <g 
            className="cursor-pointer group focus-visible:outline-none" 
            onMouseEnter={() => setHoveredNode({ node: NODES.web, x: 315, y: 425 })}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(NODES.web)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(NODES.web);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre Web Server"
          >
            <rect x="240" y="360" width="150" height="130" rx="12" className="fill-bg-2 stroke-layer-3 group-hover:fill-layer-3/10 group-focus-visible:stroke-[3px] transition-all" strokeWidth="1.5"/>
            <text x="315" y="395" textAnchor="middle" className="fill-layer-3 text-sm font-bold">Web Server</text>
            <text x="315" y="415" textAnchor="middle" className="fill-text-2 text-[10px]">IP: WEB-SERVER</text>
            <text x="315" y="435" textAnchor="middle" className="fill-text-3 text-[9px]">Nginx + SSL/TLS</text>
          </g>

          {/* FTP Server */}
          <g 
            className="cursor-pointer group focus-visible:outline-none" 
            onMouseEnter={() => setHoveredNode({ node: NODES.ftp, x: 220, y: 540 })}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(NODES.ftp)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(NODES.ftp);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre FTP Server"
          >
            <rect x="50" y="510" width="340" height="60" rx="10" className="fill-bg-2 stroke-warn/50 group-hover:fill-warn/10 group-focus-visible:stroke-[3px] transition-all" strokeWidth="1.5" strokeDasharray="6 4"/>
            <text x="220" y="545" textAnchor="middle" className="fill-warn text-sm font-bold">FTP Server — Desafio Final</text>
          </g>

          {/* Client LAN */}
          <g 
            className="cursor-pointer group focus-visible:outline-none" 
            onMouseEnter={() => setHoveredNode({ node: NODES.client, x: 580, y: 455 })}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(NODES.client)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeClick(NODES.client);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Informações sobre Cliente LAN"
          >
            <rect x="450" y="360" width="260" height="190" rx="12" className="fill-bg-2 stroke-layer-5 group-hover:fill-layer-5/10 group-focus-visible:stroke-[3px] transition-all" strokeWidth="1.5"/>
            <text x="580" y="395" textAnchor="middle" className="fill-layer-5 text-sm font-bold">Cliente LAN</text>
            <text x="580" y="425" textAnchor="middle" className="fill-text-2 text-[10px]">IP: USUARIO-PC</text>
            <text x="580" y="445" textAnchor="middle" className="fill-text-3 text-[9px]">Proxy: FIREWALL:3128</text>
          </g>

          {/* Risks */}
          {RISKS.map(risk => (
            <g 
              key={risk.id} 
              className="cursor-pointer group focus-visible:outline-none" 
              onMouseEnter={() => setHoveredRisk(risk)}
              onMouseLeave={() => setHoveredRisk(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRisk(risk);
                setSelectedNode(null);
                setHoveredRisk(null);
                trackRiskClick(risk.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRisk(risk);
                  setSelectedNode(null);
                  trackRiskClick(risk.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Alerta de Risco: ${risk.title}`}
            >
              {/* Pulsing Glow */}
              <motion.path
                d={`M ${risk.x} ${risk.y - 18} L ${risk.x - 18} ${risk.y + 12} L ${risk.x + 18} ${risk.y + 12} Z`}
                className="fill-err/20"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Danger Triangle */}
              <motion.g
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: `${risk.x}px ${risk.y}px` }}
              >
                <polygon 
                  points={`${risk.x},${risk.y - 14} ${risk.x - 14},${risk.y + 10} ${risk.x + 14},${risk.y + 10}`}
                  className="fill-err stroke-white group-hover:scale-110 group-focus-visible:scale-110 transition-transform" 
                  strokeWidth="2" 
                />
                <text x={risk.x} y={risk.y + 7} textAnchor="middle" className="fill-white text-[12px] font-black">!</text>
              </motion.g>
            </g>
          ))}
        </svg>

        {/* Tooltip for hovered node */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-40 pointer-events-none bg-bg-3 border border-accent/30 rounded-lg shadow-xl p-3 min-w-[150px]"
              style={{
                left: `${(hoveredNode.x / 760) * 100}%`,
                top: `${(hoveredNode.y / 900) * 100}%`,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest mb-1">
                <Info size={12} />
                Detalhes do Componente
              </div>
              <h5 className="text-xs font-bold text-text mb-1">{hoveredNode.node.title}</h5>
              
              <div className="space-y-2 mb-2">
                <div className="flex gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg-2 border border-border text-text-3">
                    {hoveredNode.node.zone}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-info/10 border border-info/20 text-info">
                    {hoveredNode.node.layer}
                  </span>
                </div>

                {hoveredNode.node.ip && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-accent-2">
                    <Globe size={10} className="shrink-0" />
                    <span className="truncate">{hoveredNode.node.ip}</span>
                  </div>
                )}

                {hoveredNode.node.services && hoveredNode.node.services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hoveredNode.node.services.map((service, idx) => (
                      <span key={idx} className="text-[8px] bg-accent/5 border border-accent/20 text-accent-2 px-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-2 text-[9px] font-mono text-accent-2 animate-pulse">Clique para expandir</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip for hovered risk */}
        <AnimatePresence>
          {hoveredRisk && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-40 pointer-events-none bg-bg-3 border border-err/30 rounded-lg shadow-xl p-3 max-w-[200px]"
              style={{
                left: `${(hoveredRisk.x / 760) * 100}%`,
                top: `${(hoveredRisk.y / 900) * 100}%`,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <div className="flex items-center gap-2 text-err font-bold text-[10px] uppercase tracking-widest mb-1">
                <AlertTriangle size={12} />
                Risco Detectado
              </div>
              <h5 className="text-xs font-bold text-text mb-1">{hoveredRisk.title}</h5>
              <p className="text-[10px] text-text-2 leading-tight">{hoveredRisk.desc}</p>
              <div className="mt-2 text-[9px] font-mono text-accent animate-pulse">Clique para detalhes</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile List View */}
      <div className="lg:hidden p-4 space-y-8">
        {/* Progress & Badges Section */}
        <section className="space-y-4 p-4 rounded-xl bg-bg-3 border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-text-2 uppercase tracking-widest flex items-center gap-2">
              <Award size={14} className="text-accent" />
              Seu Progresso
            </h3>
            <span className="text-[10px] font-mono text-accent font-bold">
              {Math.round((unlockedBadges.size / Object.keys(BADGE_DEFS).length) * 100)}%
            </span>
          </div>
          
          <ProgressBar 
            progress={(unlockedBadges.size / Object.keys(BADGE_DEFS).length) * 100} 
            variant="success"
          />

          <div className="grid grid-cols-2 gap-2 mt-4">
            {Array.from(unlockedBadges).slice(0, 4).map((id) => (
              <BadgeDisplay 
                key={id} 
                badge={BADGE_DEFS[id as BadgeId]} 
                unlocked={true} 
                className="p-2"
              />
            ))}
            {unlockedBadges.size === 0 && (
              <div className="col-span-2 text-center py-4 text-[10px] text-text-3 italic">
                Nenhum badge desbloqueado ainda. Explore o lab!
              </div>
            )}
          </div>
          
          <Link href="/dashboard" className="flex items-center justify-center gap-2 text-[10px] font-bold text-accent hover:underline mt-2">
            Ver todas as conquistas
            <ArrowRight size={12} />
          </Link>
        </section>

        {/* Risks Section Mobile */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-err uppercase tracking-widest flex items-center gap-2 px-1">
            <AlertTriangle size={14} />
            Riscos de Segurança
          </h3>
          <div className="grid gap-3">
            {RISKS.map(risk => (
              <button
                key={risk.id}
                onClick={() => {
                  setSelectedRisk(risk);
                  trackRiskClick(risk.id);
                }}
                className="flex items-center gap-4 p-4 rounded-xl bg-err/5 border border-err/20 text-left active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-err/10 flex items-center justify-center text-err shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-text truncate">{risk.title}</h4>
                  <p className="text-[10px] text-text-3 truncate">{risk.desc}</p>
                </div>
                <ArrowRight size={16} className="text-err/40" />
              </button>
            ))}
          </div>
        </section>

        {/* Nodes Section Mobile */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-text-3 uppercase tracking-widest flex items-center gap-2 px-1">
            <Server size={14} />
            Componentes da Rede
          </h3>
          <div className="grid gap-3">
            {Object.values(NODES).map(node => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="flex items-center gap-4 p-4 rounded-xl bg-bg-3 border border-border text-left active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  {node.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-text">{node.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-[8px] font-bold uppercase px-1 rounded bg-bg-2 border border-border text-text-3">{node.zone}</span>
                    <span className="text-[8px] font-bold uppercase px-1 rounded bg-info/10 border border-info/20 text-info">{node.layer}</span>
                    {node.ip && (
                      <span className="text-[8px] font-mono px-1 rounded bg-accent/5 border border-accent/20 text-accent-2">{node.ip}</span>
                    )}
                  </div>
                  {node.services && node.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {node.services.map((s, i) => (
                        <span key={i} className="text-[7px] text-text-3 opacity-70">
                          {i > 0 && "• "}{s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight size={16} className="text-text-3/40" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedRisk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRisk(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-bg-2 border border-err/30 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-err/10 bg-err/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-err/10 flex items-center justify-center text-err">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-err">ALERTA DE RISCO</h3>
                    <div className="text-[10px] font-mono text-err/60 uppercase tracking-widest">Segurança Avançada</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRisk(null)}
                  className="p-2 rounded-md hover:bg-err/10 text-err transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-err font-bold text-xs uppercase tracking-widest mb-2">
                      <AlertTriangle size={14} />
                      Vulnerabilidade
                    </div>
                    <h4 className="text-lg font-bold mb-2">{selectedRisk.title}</h4>
                    <p className="text-sm text-text-2 leading-relaxed">{selectedRisk.desc}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-ok/5 border border-ok/20">
                    <div className="flex items-center gap-2 text-ok font-bold text-xs uppercase tracking-widest mb-2">
                      <Shield size={14} />
                      Mitigação Recomendada
                    </div>
                    <p className="text-xs text-text-2 leading-relaxed font-medium">{selectedRisk.mitigation}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {selectedRisk.id === 'pivoting-risk' ? (
                    <Link 
                      href="/pivoteamento#cenario" 
                      onClick={() => setSelectedRisk(null)}
                      className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
                    >
                      Saiba mais sobre Pivoteamento
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link 
                      href={`/ataques-avancados#${selectedRisk.id === 'knocking-timing' ? 'timing' : 'dns-rebinding'}`} 
                      onClick={() => setSelectedRisk(null)}
                      className="btn-outline w-full py-3 text-sm flex items-center justify-center gap-2 border-accent/30 text-accent-2"
                    >
                      Ver Ataques Avançados
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-bg-2 border border-border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-bg-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    {selectedNode.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-text">{selectedNode.title}</h3>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg-2 border border-border text-text-3">{selectedNode.zone}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-info/10 border border-info/20 text-info">{selectedNode.layer}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-bg-3 rounded-md transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedNode.info.map((text, i) => (
                    <div key={i} className="flex gap-3 text-sm text-text-2 leading-relaxed">
                      <span className="text-accent shrink-0 mt-1">▸</span>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>

                {/* Deep Dive Links */}
                {selectedNode.id === 'firewall' && (
                  <div className="mt-6 flex flex-col gap-2">
                    <button 
                      onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'knocking-vs-stateful') || null)}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={16} className="text-accent" />
                        <span className="text-xs font-bold text-text group-hover:text-accent">Mergulho Profundo: Port Knocking vs Stateful</span>
                      </div>
                      <ArrowRight size={14} className="text-text-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'kernel-hooks') || null)}
                      className="flex items-center justify-between p-3 rounded-lg bg-info/5 border border-info/20 hover:bg-info/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Shield size={16} className="text-info" />
                        <span className="text-xs font-bold text-text group-hover:text-info">Mergulho Profundo: Hooks do Kernel</span>
                      </div>
                      <ArrowRight size={14} className="text-text-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'squid-https-filtering') || null)}
                      className="flex items-center justify-between p-3 rounded-lg bg-warn/5 border border-warn/20 hover:bg-warn/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-warn" />
                        <span className="text-xs font-bold text-text group-hover:text-warn">Mergulho Profundo: Squid e o Desafio do HTTPS</span>
                      </div>
                      <ArrowRight size={14} className="text-text-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'ipsec-ike-phases') || null)}
                      className="flex items-center justify-between p-3 rounded-lg bg-ok/5 border border-ok/20 hover:bg-ok/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Lock size={16} className="text-ok" />
                        <span className="text-xs font-bold text-text group-hover:text-ok">Mergulho Profundo: As Fases do IKE (IPSec)</span>
                      </div>
                      <ArrowRight size={14} className="text-text-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                {selectedNode.id === 'dns' && (
                  <div className="mt-6">
                    <button 
                      onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'dns-failure-points') || null)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-ok/5 border border-ok/20 hover:bg-ok/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-ok" />
                        <span className="text-xs font-bold text-text group-hover:text-ok">Mergulho Profundo: Por que o DNS quebra?</span>
                      </div>
                      <ArrowRight size={14} className="text-text-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">Comando de Diagnóstico</div>
                  <div className="flex items-center justify-between gap-4 bg-bg-3 border border-border rounded-md p-3">
                    <code className="text-xs text-accent-2 font-mono truncate">{selectedNode.cmd}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(selectedNode.cmd)}
                      className="shrink-0 p-1.5 hover:bg-bg-2 rounded transition-colors text-text-3"
                    >
                      <Terminal size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeepDiveModal 
        dive={activeDeepDive} 
        onClose={() => setActiveDeepDive(null)} 
      />
    </div>
  );
});

TopologyInteractive.displayName = 'TopologyInteractive';
