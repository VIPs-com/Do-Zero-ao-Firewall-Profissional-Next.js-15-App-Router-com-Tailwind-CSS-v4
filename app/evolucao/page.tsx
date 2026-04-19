'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Zap, Shield, Globe, Terminal, Cpu, Layout, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleNav } from '@/components/ui/ModuleNav';

export default function EvolutionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-evolucao">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Evolução Natural</span>
      </div>

      <div className="bg-gradient-to-br from-bg-2 to-accent-bg/20 border border-border rounded-2xl p-12 mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block bg-accent text-white font-mono text-[10px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Pós-Workshop · O Futuro é Agora
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">🚀 A Evolução Natural</h1>
          <p className="text-text-2 text-lg max-w-2xl leading-relaxed">
            Você dominou o <strong>iptables</strong>, entendeu o <strong>NAT</strong> e configurou serviços críticos do zero. 
            Agora, conheça as tecnologias modernas que o mercado corporativo exige hoje.
          </p>
        </div>
        <Rocket className="absolute -bottom-10 -right-10 text-accent/5 w-64 h-64 rotate-12" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {[
          { t: 'nftables', d: 'O sucessor moderno do iptables. Sintaxe unificada e performance superior.', i: <Zap className="text-accent" />, tags: ['#kernel', '#performance'] },
          { t: 'WireGuard', d: 'A VPN do século 21. Criptografia de ponta e velocidade impressionante.', i: <Shield className="text-info" />, tags: ['#vpn', '#secure'] },
          { t: 'Ansible', d: 'Infraestrutura como Código. Gerencie centenas de servidores via YAML.', i: <Terminal className="text-layer-3" />, tags: ['#IaC', '#automation'] },
          { t: 'OPNsense', d: 'Firewall de borda com interface web, IDS/IPS e multi-WAN.', i: <Layout className="text-warn" />, tags: ['#enterprise', '#web-ui'] },
          { t: 'Pi-hole', d: 'Bloqueia anúncios e rastreadores em toda a rede via DNS.', i: <Globe className="text-err" />, tags: ['#dns', '#privacy'] },
          { t: 'eBPF', d: 'Programação segura no kernel. Observabilidade e rede para Kubernetes.', i: <Cpu className="text-layer-6" />, tags: ['#cloud-native', '#kernel'] }
        ].map(tech => (
          <div key={tech.t} className="p-8 rounded-xl bg-bg-2 border border-border hover:border-accent/30 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-bg-3 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {tech.i}
            </div>
            <h3 className="text-lg font-bold mb-3">{tech.t}</h3>
            <p className="text-sm text-text-2 leading-relaxed mb-6">{tech.d}</p>
            <div className="flex gap-2">
              {tech.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono font-bold text-text-3">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Server className="text-accent" />
          Roadmap de Carreira
        </h2>
        <div className="relative pl-12 space-y-12 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-accent-2 before:to-ok">
          {[
            { t: 'Fundamentos', d: 'Domínio de Linux, iptables, DNS, Proxy e modelo OSI. (Você está aqui ✅)', s: ['Linux', 'iptables', 'DNS'] },
            { t: 'Automação e IaC', d: 'Aprender Ansible, Terraform e Git. Versionar a infraestrutura como código.', s: ['Ansible', 'Terraform', 'Git'] },
            { t: 'Contêineres', d: 'Dominar Docker e Kubernetes. Entender redes virtuais em pods.', s: ['Docker', 'Kubernetes', 'Helm'] },
            { t: 'SRE / Platform', d: 'Projetar plataformas resilientes com observabilidade e alta disponibilidade.', s: ['Prometheus', 'Grafana', 'SLO'] }
          ].map((step, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[48px] top-0 w-12 h-12 rounded-full bg-bg border-4 border-bg-2 flex items-center justify-center z-10 font-bold text-accent shadow-lg">
                {i + 1}
              </div>
              <div className="p-6 rounded-xl bg-bg-2 border border-border">
                <h4 className="font-bold text-lg mb-2">{step.t}</h4>
                <p className="text-sm text-text-2 mb-4 leading-relaxed">{step.d}</p>
                <div className="flex flex-wrap gap-2">
                  {step.s.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-accent-bg border border-accent-bd text-accent-2 text-[10px] font-bold uppercase tracking-wider">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/evolucao" />
    </div>
  );
}
