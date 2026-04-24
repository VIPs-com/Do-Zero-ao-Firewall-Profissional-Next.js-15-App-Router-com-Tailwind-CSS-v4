'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rocket, Zap, Shield, Globe, Terminal, Cpu, Layout, Server, Bell, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { ModuleNav } from '@/components/ui/ModuleNav';

// ── Fases do Roadmap ─────────────────────────────────────────────────────────

const PHASE_V2 = {
  version: 'v2.0',
  name: 'Fundamentos Expandidos',
  color: 'border-accent/40 bg-accent/5',
  badgeColor: 'bg-accent/15 text-accent border-accent/30',
  status: 'Em desenvolvimento',
  modules: [
    { name: 'Hardening Linux',           slug: '/hardening',      available: true,  icon: '🔐', tags: ['SSH', 'sysctl', 'AppArmor'] },
    { name: 'Fundamentos Linux (FHS)',   slug: '/fhs',            available: true,  icon: '🐧', tags: ['/etc', '/var', 'mapa do sistema'] },
    { name: 'Comandos Essenciais',       slug: '/comandos',       available: true,  icon: '💻', tags: ['ls', 'grep', 'pipe'] },
    { name: 'Editores: nano e VIM',      slug: '/editores',       available: true,  icon: '📝', tags: ['nano', 'vim', 'produção'] },
    { name: 'Certbot Avançado',          slug: '/nginx-ssl',      available: true,  icon: '🔒', tags: ['Let\'s Encrypt', 'auto-renew'] },
    { name: 'Processos e systemctl',     slug: '/processos',      available: true,  icon: '⚙️', tags: ['ps', 'top', 'kill'] },
    { name: 'Permissões e Usuários',     slug: '/permissoes',     available: true,  icon: '🔑', tags: ['chmod', 'useradd', 'sudo'] },
    { name: 'Discos e Partições',        slug: '/discos',         available: true,  icon: '💾', tags: ['fdisk', 'mount', 'df'] },
    { name: 'Logs e Monitoramento',      slug: '/logs-basicos',   available: true,  icon: '📋', tags: ['journalctl', 'tail -f'] },
    { name: 'Backup com rsync + tar',    slug: '/backup',         available: true,  icon: '🗄️', tags: ['rsync', 'tar', 'scp'] },
    { name: 'Shell Script Bash',         slug: '/shell-script',   available: true,  icon: '📜', tags: ['variáveis', 'loops', 'funções'] },
    { name: 'Agendamento cron',          slug: '/cron',           available: true,  icon: '🕐', tags: ['crontab', 'systemd timers'] },
    { name: 'WireGuard Mesh Network',    slug: null,              available: false, icon: '🔗', tags: ['multi-peer', 'site-to-site'] },
    { name: 'SSH com 2FA (TOTP)',        slug: '/ssh-2fa',        available: true,  icon: '📱', tags: ['Google Auth', 'libpam'] },
    { name: 'Suricata IDS Básico',       slug: null,              available: false, icon: '🔎', tags: ['IDS', 'regras'] },
  ],
};

const PHASE_V3 = {
  version: 'v3.0',
  name: 'Servidores em Produção',
  color: 'border-info/40 bg-info/5',
  badgeColor: 'bg-info/15 text-info border-info/30',
  status: 'Planejado',
  modules: [
    { name: 'Docker & Containerização', slug: '/docker', available: true,  icon: '🐳', tags: ['images', 'volumes'] },
    { name: 'Redes Docker',             slug: '/docker', available: true,  icon: '🌐', tags: ['bridge', 'iptables', 'DOCKER-USER'] },
    { name: 'Docker Compose',           slug: '/docker-compose', available: true,  icon: '📦', tags: ['multi-container', 'yaml'] },
    { name: 'Ansible para SysAdmins',   slug: null, available: false, icon: '⚙️', tags: ['IaC', 'playbooks'] },
    { name: 'PostgreSQL na DMZ',        slug: null, available: false, icon: '🗄️', tags: ['firewall', 'pg_hba'] },
    { name: 'CI/CD com GitHub Actions', slug: null, available: false, icon: '🚀', tags: ['pipeline', 'deploy'] },
    { name: 'Nginx Load Balancer',      slug: null, available: false, icon: '⚖️', tags: ['upstream', 'health check'] },
  ],
};

const PHASE_V4 = {
  version: 'v4.0',
  name: 'Infra Moderna',
  color: 'border-layer-6/40 bg-layer-6/5',
  badgeColor: 'bg-layer-6/15 text-layer-6 border-layer-6/30',
  status: 'Visão de Longo Prazo',
  modules: [
    { name: 'Kubernetes Networking',   slug: null, available: false, icon: '☸️', tags: ['CNI', 'NetworkPolicy'] },
    { name: 'eBPF & XDP',             slug: null, available: false, icon: '🔬', tags: ['kernel', 'observabilidade'] },
    { name: 'Suricata IDS/IPS Avançado', slug: null, available: false, icon: '🛡️', tags: ['regras', 'EVE JSON'] },
    { name: 'Prometheus + Grafana',   slug: null, available: false, icon: '📡', tags: ['métricas', 'dashboards'] },
    { name: 'Service Mesh (Istio)',   slug: null, available: false, icon: '🕸️', tags: ['mTLS', 'traffic policy'] },
    { name: 'SRE & SLOs',            slug: null, available: false, icon: '🎯', tags: ['error budget', 'alerting'] },
  ],
};

export default function EvolutionPage() {
  const [interested, setInterested] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    try {
      setInterested(localStorage.getItem('workshop-roadmap-interest') === 'true');
    } catch {
      // localStorage indisponível (SSR ou modo privado)
    }
  }, []);

  const handleInterest = () => {
    try {
      localStorage.setItem('workshop-roadmap-interest', 'true');
    } catch {
      // silencioso
    }
    setInterested(true);
    setJustRegistered(true);
    setTimeout(() => setJustRegistered(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-evolucao">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Evolução Natural</span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
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

      {/* ── Grid de Tecnologias ───────────────────────────────────────────────── */}
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

      {/* ── Roadmap Visual ────────────────────────────────────────────────────── */}
      <section id="roadmap-evolucao" className="mb-16 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold">🗺️ O Futuro do Workshop</h2>
            <p className="text-text-2 mt-2">
              Roadmap oficial em 3 fases — do hardening até infraestrutura cloud-native.
            </p>
          </div>
          <div className="sm:ml-auto shrink-0">
            <button
              onClick={handleInterest}
              disabled={interested}
              className={
                interested
                  ? 'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ok/15 border border-ok/40 text-ok font-semibold text-sm cursor-default'
                  : 'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-2 transition-colors'
              }
              aria-live="polite"
            >
              {interested ? (
                <>
                  <CheckCircle2 size={16} />
                  {justRegistered ? 'Inscrito! Você será notificado' : '✓ Inscrito'}
                </>
              ) : (
                <>
                  <Bell size={16} />
                  Me avise sobre v2.0
                </>
              )}
            </button>
          </div>
        </div>

        {/* v2.0 */}
        <RoadmapPhase phase={PHASE_V2} />

        {/* v3.0 */}
        <RoadmapPhase phase={PHASE_V3} />

        {/* v4.0 */}
        <RoadmapPhase phase={PHASE_V4} />
      </section>

      {/* ── Roadmap de Carreira ────────────────────────────────────────────────── */}
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

      <ModuleNav currentPath="/evolucao" />
    </div>
  );
}

// ── Componente auxiliar RoadmapPhase ────────────────────────────────────────

interface PhaseModule {
  name: string;
  slug: string | null;
  available: boolean;
  icon: string;
  tags: string[];
}

interface Phase {
  version: string;
  name: string;
  color: string;
  badgeColor: string;
  status: string;
  modules: PhaseModule[];
}

function RoadmapPhase({ phase }: { phase: Phase }) {
  const availableCount = phase.modules.filter(m => m.available).length;

  return (
    <div className={`mb-8 rounded-2xl border p-6 ${phase.color}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className={`font-mono font-bold text-sm px-3 py-1 rounded-lg border ${phase.badgeColor}`}>
            {phase.version}
          </span>
          <h3 className="text-xl font-bold">{phase.name}</h3>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs text-text-3">
          <Clock size={13} />
          {phase.status}
          {availableCount > 0 && (
            <span className="ml-2 text-ok font-semibold">
              · {availableCount}/{phase.modules.length} disponíveis
            </span>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {phase.modules.map(mod => (
          <div
            key={mod.name}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              mod.available
                ? 'bg-bg border-ok/30 hover:border-ok/60'
                : 'bg-bg/50 border-border opacity-60'
            }`}
          >
            <span className="text-lg shrink-0 mt-0.5">{mod.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {mod.available && mod.slug ? (
                  <Link href={mod.slug} className="font-semibold text-sm text-ok hover:underline flex items-center gap-1">
                    {mod.name}
                    <ArrowRight size={12} />
                  </Link>
                ) : (
                  <span className="font-semibold text-sm text-text-2">{mod.name}</span>
                )}
                {mod.available ? (
                  <span className="text-[10px] font-bold text-ok bg-ok/10 border border-ok/30 px-1.5 py-0.5 rounded">
                    DISPONÍVEL
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-text-3 bg-bg-3 border border-border px-1.5 py-0.5 rounded">
                    EM BREVE
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {mod.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-text-3 font-mono">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
