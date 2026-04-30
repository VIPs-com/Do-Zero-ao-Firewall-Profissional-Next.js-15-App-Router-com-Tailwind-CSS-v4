'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import { Shield, Terminal, BookOpen, Zap, Award, Lock, Globe, Server, ChevronRight, Layers, Layout, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * Sprint F — code splitting.
 * TopologyInteractive é o maior componente do projeto (36 KB + motion/react pesado).
 * Carregar via next/dynamic tira do bundle inicial da home; o skeleton preserva
 * o espaço visual para evitar Cumulative Layout Shift.
 */
const TopologyInteractive = dynamic(
  () => import('@/components/ui/TopologyInteractive').then((m) => ({ default: m.TopologyInteractive })),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Carregando diagrama de topologia"
        className="relative bg-bg-2 border border-border rounded-xl overflow-hidden shadow-lg min-h-[420px] lg:min-h-[720px] flex items-center justify-center"
      >
        <div className="flex items-center gap-3 text-text-3 text-xs font-mono uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          carregando topologia…
        </div>
      </div>
    ),
  },
);

const FEATURES = [
  {
    icon: <Shield className="text-accent" />,
    title: 'Firewall Stateful',
    desc: 'Aprenda iptables com regras NEW, ESTABLISHED, RELATED. Entenda conntrack e SNAT/DNAT.'
  },
  {
    icon: <Globe className="text-info" />,
    title: 'Modelo OSI na Prática',
    desc: 'Cada serviço do laboratório representa uma camada. Diagnóstico camada por camada.'
  },
  {
    icon: <Lock className="text-layer-6" />,
    title: 'SSL/TLS (Camada 6)',
    desc: 'OpenSSL passo a passo, certificados autoassinados, cipher suites e HSTS.'
  },
  {
    icon: <Terminal className="text-layer-3" />,
    title: '100% Linux',
    desc: 'Ubuntu Server, comandos reais, configurações em produção. Nada de simulações.'
  },
  {
    icon: <Zap className="text-warn" />,
    title: 'Port Knocking',
    desc: 'Proteja serviços com sequências secretas. SSH invisível para scanners.'
  },
  {
    icon: <Award className="text-ok" />,
    title: 'Certificado + Badges',
    desc: 'Ao final, gere seu certificado personalizado e desbloqueie conquistas.'
  }
];

const STATS = [
  { icon: <Layers size={20} className="text-accent" />, value: '84', label: 'Tópicos práticos' },
  { icon: <BookOpen size={20} className="text-info" />, value: '48', label: 'Módulos de conteúdo' },
  { icon: <Award size={20} className="text-ok" />, value: '55', label: 'Badges desbloqueáveis' },
  { icon: <Star size={20} className="text-warn" />, value: '7', label: 'Camadas OSI na prática' },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-bg border border-accent-bd text-accent-2 text-[10px] font-bold uppercase tracking-wider mb-6">
            <Zap size={12} />
            Workshop Linux
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Do Zero ao <br />
            <span className="text-accent">Firewall Profissional</span>
          </h1>
          <p className="text-lg text-text-2 leading-relaxed mb-10 max-w-lg">
            Aprenda a construir um firewall Linux completo, dominando iptables, NAT, DNS, HTTPS,
            Proxy, VPN IPSec, WireGuard e Fail2ban. <strong>84 tópicos práticos</strong> com diagnóstico por camadas OSI.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/instalacao" className="btn-primary px-8 py-3 text-base">
              🚀 Montar laboratório
            </Link>
            <Link href="/topicos" className="btn-outline px-8 py-3 text-base">
              Ver tópicos
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-bg-2 border border-border rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-bg-3">
              <div className="w-2.5 h-2.5 rounded-full bg-err" />
              <div className="w-2.5 h-2.5 rounded-full bg-warn" />
              <div className="w-2.5 h-2.5 rounded-full bg-ok" />
              <div className="ml-auto text-[10px] font-mono text-text-3">firewall — bash</div>
            </div>
            <div className="p-6 font-mono text-xs md:text-sm leading-relaxed space-y-2">
              <div className="flex gap-2">
                <span className="text-accent-2">$</span>
                <span className="text-text">iptables -L FORWARD -n -v</span>
              </div>
              <div className="text-text-3">Chain FORWARD (policy DROP)</div>
              <div className="text-ok">1  ACCEPT  state ESTABLISHED,RELATED</div>
              <div className="text-ok">2  ACCEPT  tcp dpt:443 dst:WEB-SERVER</div>
              <div className="text-ok">3  ACCEPT  udp dpt:53  dst:DNS-SERVER</div>
              <div className="h-4" />
              <div className="flex gap-2">
                <span className="text-accent-2">$</span>
                <span className="text-text">sysctl net.ipv4.ip_forward</span>
              </div>
              <div className="text-ok">net.ipv4.ip_forward = 1</div>
              <div className="h-4" />
              <div className="flex gap-2">
                <span className="text-accent-2">$</span>
                <span className="text-text">tail -f /var/log/syslog | grep KNOCK</span>
              </div>
              <div className="text-warn">KNOCK: SRC=ADMIN-IP DPT=KNOCK-PORT</div>
              <div className="text-text-3"># IP anotado — SSH aberto por 30s</div>
              <div className="flex gap-2 mt-1">
                <span className="text-accent-2">$</span>
                <span className="inline-block w-2 h-4 bg-accent-2 animate-pulse" aria-hidden="true" />
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-info/10 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Novo no Linux? CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <motion.div
          initial={undefined}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.3)]"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl" aria-hidden="true">🐧</span>
            <div>
              <p className="font-bold text-sm text-[#6366f1]">Novo no Linux?</p>
              <p className="text-xs text-text-2">Comece pela Trilha Fundamentos — 15 módulos do zero antes do firewall.</p>
            </div>
          </div>
          <Link
            href="/fundamentos"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#4f46e5] transition-colors"
          >
            Começar aqui
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-bg-2 border border-border text-center"
            >
              {s.icon}
              <span className="text-3xl font-bold tabular-nums">{s.value}</span>
              <span className="text-[11px] text-text-2 uppercase tracking-wider">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OSI Strip */}
      <div className="bg-bg-2 border-y border-border py-8 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4 min-w-max">
          {[
            { l: 7, n: 'Aplicação', s: 'DNS · HTTP · Proxy', c: 'text-layer-7' },
            { l: 6, n: 'Apresentação', s: 'SSL / TLS', c: 'text-layer-6' },
            { l: 4, n: 'Transporte', s: 'TCP · UDP · Portas', c: 'text-layer-4' },
            { l: 3, n: 'Rede', s: 'IP · NAT · VPN', c: 'text-layer-3' },
            { l: 2, n: 'Enlace', s: 'VMs · Switches', c: 'text-layer-2' }
          ].map((layer, i) => (
            <React.Fragment key={layer.l}>
              <div className="flex flex-col items-center text-center px-6 py-3 rounded-lg bg-bg-3 border border-border min-w-[140px]">
                <span className={cn("text-xs font-bold font-mono mb-1", layer.c)}>{layer.l} — {layer.n}</span>
                <span className="text-[10px] text-text-3 uppercase tracking-wider">{layer.s}</span>
              </div>
              {i < 4 && <ChevronRight className="text-text-3 opacity-30" size={16} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Diferenciais do Workshop</h2>
          <p className="text-text-2 max-w-2xl mx-auto">
            Uma metodologia focada em cenários reais, onde você constrói a infraestrutura do zero
            e entende o porquê de cada comando.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-xl bg-bg-2 border border-border hover:border-accent/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-bg-3 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-text-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Topology Section */}
      <section id="topologia" className="max-w-7xl mx-auto px-4 py-20 bg-accent-bg/20 rounded-3xl border border-accent-bd/30">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div>
            <div className="section-label">Arquitetura</div>
            <h2 className="section-title">Topologia da Rede</h2>
            <p className="text-text-2 mb-8 leading-relaxed">
              Três zonas de segurança com níveis de confiança distintos, separadas e controladas pelo Firewall central.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-lg bg-bg-2 border border-border">
                <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent shrink-0">🌐</div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Zona WAN</h4>
                  <p className="text-xs text-text-3">Rede externa não confiável. Acesso via DNAT e Port Knocking.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-bg-2 border border-border">
                <div className="w-10 h-10 rounded bg-info/10 flex items-center justify-center text-info shrink-0">🖥️</div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Zona DMZ</h4>
                  <p className="text-xs text-text-3">Servidores públicos. DNS BIND9 e Nginx com SSL/TLS.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-bg-2 border border-border">
                <div className="w-10 h-10 rounded bg-layer-5/10 flex items-center justify-center text-layer-5 shrink-0">💻</div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Zona LAN</h4>
                  <p className="text-xs text-text-3">Rede dos usuários. Navegação filtrada via Squid Proxy.</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Link href="/instalacao" className="btn-primary w-full justify-center">
                Começar agora
              </Link>
            </div>
          </div>
          <TopologyInteractive />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para dominar o Firewall?</h2>
        <p className="text-text-2 mb-10 text-lg">
          Inicie sua jornada agora e transforme-se em um especialista em infraestrutura Linux.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/topicos" className="btn-primary px-10 py-4 text-lg">
            Explorar tópicos
          </Link>
          <Link href="/instalacao" className="btn-outline px-10 py-4 text-lg">
            Montar laboratório
          </Link>
        </div>
      </section>
    </div>
  );
}
