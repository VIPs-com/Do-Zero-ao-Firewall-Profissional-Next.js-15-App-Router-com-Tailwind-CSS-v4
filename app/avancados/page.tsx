'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, Server, Award } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { ADVANCED_ORDER } from '@/data/courseOrder';

/* Sprint AVANCADOS-INDEX — índice da trilha avançada (v3.0→v5.0, 19 módulos).
   Espelha a estrutura de /fundamentos. */

type Section = {
  version: string;
  label: string;
  color: string;
  modules: Array<{
    path: string;
    num: string;
    title: string;
    icon: string;
    checkpoint: string;
    desc: string;
  }>;
};

const SECTIONS: Section[] = [
  {
    version: 'v3.0',
    label: 'Servidores e Serviços',
    color: 'text-info',
    modules: [
      { path: '/dhcp',     num: 'S01', title: 'Servidor DHCP',         icon: '🌐', checkpoint: 'dhcp-instalado',      desc: 'isc-dhcp-server, DORA, subnet, reservas por MAC' },
      { path: '/samba',    num: 'S02', title: 'Samba — File Sharing',   icon: '🗂️', checkpoint: 'samba-instalado',     desc: 'smb.conf, shares, smbpasswd, acesso Windows' },
      { path: '/apache',   num: 'S03', title: 'Servidor Apache',        icon: '🌍', checkpoint: 'apache-instalado',    desc: 'VirtualHosts, mod_ssl, HTTPS, proxy reverso' },
      { path: '/openvpn',  num: 'S04', title: 'OpenVPN',               icon: '🔒', checkpoint: 'openvpn-instalado',   desc: 'PKI com Easy-RSA, server.conf, client.ovpn inline' },
      { path: '/traefik',  num: 'S05', title: 'Traefik Proxy Reverso',  icon: '🔀', checkpoint: 'traefik-instalado',   desc: 'Docker labels, HTTPS automático via ACME, middlewares' },
      { path: '/ldap',     num: 'S06', title: 'LDAP / OpenLDAP',        icon: '👥', checkpoint: 'ldap-instalado',      desc: 'DIT, OUs, posixAccount, PAM — autenticação única' },
      { path: '/pihole',   num: 'S07', title: 'Pi-hole',                icon: '🕳️', checkpoint: 'pihole-instalado',    desc: 'DNS sinkhole, blocklists gravity, Unbound local' },
    ],
  },
  {
    version: 'v4.0',
    label: 'Infraestrutura Moderna',
    color: 'text-accent',
    modules: [
      { path: '/ansible',       num: 'I01', title: 'Ansible para SysAdmins',    icon: '⚙️', checkpoint: 'ansible-instalado',       desc: 'Inventário, playbooks, roles, Ansible Galaxy e Vault' },
      { path: '/monitoring',    num: 'I02', title: 'Prometheus + Grafana',       icon: '📊', checkpoint: 'monitoring-instalado',     desc: 'node_exporter, PromQL, dashboards, Alertmanager' },
      { path: '/kubernetes',    num: 'I03', title: 'Kubernetes / K3s',           icon: '☸️', checkpoint: 'k8s-instalado',           desc: 'Pod, Deployment, Service, Ingress Traefik, Helm' },
      { path: '/terraform',     num: 'I04', title: 'Terraform IaC',              icon: '🏗️', checkpoint: 'terraform-instalado',     desc: 'HCL declarativo, providers Docker/AWS, state remoto' },
      { path: '/suricata',      num: 'I05', title: 'Suricata IDS/IPS',           icon: '🛡️', checkpoint: 'suricata-instalado',      desc: 'IDS passivo (af-packet) e IPS inline (NFQUEUE), EVE JSON' },
      { path: '/ebpf',          num: 'I06', title: 'eBPF & XDP',                 icon: '⚡', checkpoint: 'ebpf-instalado',          desc: 'BCC tools, bpftrace, filtros XDP, Cilium CNI, Falco' },
      { path: '/service-mesh',  num: 'I07', title: 'Service Mesh (Istio)',        icon: '🕸️', checkpoint: 'service-mesh-instalado',  desc: 'sidecar Envoy, mTLS automático, VirtualService, Kiali' },
      { path: '/sre',           num: 'I08', title: 'SRE & SLOs',                 icon: '🎯', checkpoint: 'sre-slo-definido',        desc: 'SLIs/SLOs, error budget, burn rate, postmortem blameless' },
    ],
  },
  {
    version: 'v5.0',
    label: 'Cloud & Platform Engineering',
    color: 'text-ok',
    modules: [
      { path: '/cicd',          num: 'C01', title: 'CI/CD com GitHub Actions',    icon: '🚀', checkpoint: 'cicd-pipeline',           desc: 'lint/test/build, Docker push ghcr.io, environments' },
      { path: '/opnsense',      num: 'C02', title: 'OPNsense',                    icon: '🔥', checkpoint: 'opnsense-instalado',      desc: 'Firewall enterprise com Web UI, regras, VPN, CARP HA' },
      { path: '/nextcloud',     num: 'C03', title: 'Nextcloud Self-Hosted',       icon: '☁️', checkpoint: 'nextcloud-instalado',     desc: 'Docker Compose, MariaDB+Redis+Traefik, apps, backup 3-2-1' },
      { path: '/ebpf-avancado', num: 'C04', title: 'eBPF Avançado + Cilium',      icon: '🧬', checkpoint: 'cilium-instalado',        desc: 'Cilium CNI, Hubble L7, CiliumNetworkPolicy, Tetragon' },
    ],
  },
];

const ALL_MODULES = SECTIONS.flatMap(s => s.modules);
const ALL_CHECKPOINTS = ALL_MODULES.map(m => m.checkpoint);

export default function AvancadosPage() {
  const { trackPageVisit, checklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/avancados');
  }, [trackPageVisit]);

  const completed = ALL_CHECKPOINTS.filter(id => checklist[id]).length;
  const allDone = completed === ALL_MODULES.length;

  const nextModule = ALL_MODULES.find(m => !checklist[m.checkpoint]);
  const lastCompleted = [...ALL_MODULES].reverse().find(m => checklist[m.checkpoint]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Trilha Avançada</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-2 to-[rgba(14,165,233,0.07)] border border-[rgba(14,165,233,0.25)] rounded-2xl p-10 mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.3)] text-info text-[10px] font-bold uppercase tracking-wider mb-4">
            <Server size={11} />
            Trilha v3.0 → v5.0 · 19 Módulos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🚀 Trilha Avançada
          </h1>
          <p className="text-text-2 text-lg max-w-2xl leading-relaxed mb-6">
            Já domina o Firewall Linux? Esta trilha expande suas habilidades —
            de servidores práticos (DHCP, Samba, Apache) até Kubernetes, Terraform e Service Mesh.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={nextModule?.path ?? lastCompleted?.path ?? '/dhcp'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-info text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {completed === 0 ? '🚀 Começar agora' : allDone ? '✅ Revisar trilha' : '▶ Continuar de onde parei'}
              <ArrowRight size={14} />
            </Link>
            <Link href="/topicos" className="btn-outline px-6 py-3">
              Ver todos os tópicos →
            </Link>
          </div>
        </div>
        <Server className="absolute -bottom-8 -right-8 text-info/5 w-52 h-52" />
      </div>

      {/* Progress Bar */}
      <div className="mb-10 p-6 rounded-xl bg-bg-2 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-info" />
            <span className="font-bold text-sm">Progresso da Trilha</span>
          </div>
          <span className="font-mono font-bold text-sm text-info">{completed}/{ALL_MODULES.length}</span>
        </div>
        <div className="h-3 bg-bg-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-info rounded-full transition-[width] duration-700"
            style={{ width: `${(completed / ALL_MODULES.length) * 100}%` }}
          />
        </div>
        {allDone && (
          <p className="mt-3 text-sm text-ok font-semibold flex items-center gap-2">
            <CheckCircle2 size={14} /> Trilha concluída! Badge 🌐 Advanced Master desbloqueado. Você é um SysAdmin profissional.
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {SECTIONS.map((section, si) => {
          const sectionDone = section.modules.filter(m => checklist[m.checkpoint]).length;
          return (
            <div key={section.version}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`font-mono font-bold text-xs px-2 py-1 rounded bg-bg-3 border border-border ${section.color}`}>
                  {section.version}
                </div>
                <h2 className="font-bold text-lg">{section.label}</h2>
                <span className="text-xs font-mono text-text-3 ml-auto">
                  {sectionDone}/{section.modules.length}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {section.modules.map((mod, i) => {
                  const done = !!checklist[mod.checkpoint];
                  return (
                    <motion.div
                      key={mod.path}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: (si * 0.05) + i * 0.04 }}
                    >
                      <Link
                        href={mod.path}
                        className={`flex items-start gap-4 p-5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                          done
                            ? 'bg-ok/5 border-ok/30 hover:border-ok/60'
                            : 'bg-bg-2 border-border hover:border-info/40'
                        }`}
                      >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-bg-3 flex items-center justify-center text-lg">
                          {mod.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold text-text-3">
                              Módulo {mod.num}
                            </span>
                            {done
                              ? <CheckCircle2 size={12} className="text-ok" />
                              : <Circle size={12} className="text-text-3 opacity-40" />
                            }
                          </div>
                          <h3 className="font-bold text-sm mb-1 leading-snug">{mod.title}</h3>
                          <p className="text-xs text-text-3 leading-relaxed">{mod.desc}</p>
                        </div>
                        <ArrowRight size={14} className="shrink-0 text-text-3 mt-1" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pré-requisitos */}
      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-bg-2 border border-border">
          <p className="text-sm font-bold mb-2">🔥 Pré-requisito: Trilha Firewall</p>
          <p className="text-xs text-text-3 mb-3">
            Antes dos módulos avançados, domine iptables, NAT, DNS e VPN.
          </p>
          <Link href="/instalacao" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
            Ir para o Firewall <ArrowRight size={12} />
          </Link>
        </div>
        <div className="p-5 rounded-xl bg-bg-2 border border-border">
          <p className="text-sm font-bold mb-2">🐧 Novo no Linux?</p>
          <p className="text-xs text-text-3 mb-3">
            Comece pela Trilha Fundamentos — 15 módulos do zero ao SysAdmin.
          </p>
          <Link href="/fundamentos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366f1] hover:underline">
            Ir para Fundamentos <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Nota de ambiente */}
      <div className="mt-6 p-4 rounded-xl bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.2)] text-xs text-text-3 flex items-start gap-2">
        <Server size={13} className="shrink-0 mt-0.5 text-info" />
        <span>
          Os módulos desta trilha assumem <strong className="text-text-2">Ubuntu Server 22.04+</strong> ou equivalente.
          Alguns (Kubernetes, eBPF, Service Mesh) requerem ≥4 GB RAM e funcionam melhor em VMs KVM ou Proxmox.
          Cada módulo tem exercícios guiados e checkpoint de conclusão.
        </span>
      </div>
    </div>
  );
}
