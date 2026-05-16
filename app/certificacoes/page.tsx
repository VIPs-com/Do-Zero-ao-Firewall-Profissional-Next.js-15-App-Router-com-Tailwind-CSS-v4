'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox } from '@/components/ui/Boxes';
import { useBadges } from '@/context/BadgeContext';

/**
 * Hub /certificacoes — mapeia o "núcleo comum" das provas LPIC-1 (101/102)
 * e CompTIA Linux+ (XK0-005) para os módulos do Workshop. O aluno navega do
 * tópico de prova direto para o conteúdo que o ensina.
 */

interface CertRow {
  topic: string;
  commands: string;
  modules: Array<{ label: string; href: string }>;
}

interface CertDomain {
  domain: string;
  icon: string;
  rows: CertRow[];
}

const CERT_MAP: CertDomain[] = [
  {
    domain: 'Arquitetura, Boot e Init',
    icon: '🖥️',
    rows: [
      {
        topic: 'Processo de boot',
        commands: 'BIOS/UEFI · GRUB2 · kernel · initrd',
        modules: [{ label: 'Boot', href: '/boot' }],
      },
      {
        topic: 'systemd e gestão de serviços',
        commands: 'systemctl · journalctl · targets',
        modules: [
          { label: 'Boot', href: '/boot' },
          { label: 'Processos', href: '/processos' },
        ],
      },
    ],
  },
  {
    domain: 'Linha de Comando GNU/Unix',
    icon: '⌨️',
    rows: [
      {
        topic: 'Navegação e arquivos',
        commands: 'ls · cd · cp · mv · find · ln',
        modules: [
          { label: 'Comandos', href: '/comandos' },
          { label: 'FHS', href: '/fhs' },
        ],
      },
      {
        topic: 'Pipes e redirecionamentos',
        commands: '| · > · >> · 2> · tee',
        modules: [{ label: 'Comandos', href: '/comandos#redirecionamentos' }],
      },
      {
        topic: 'Variáveis de ambiente',
        commands: 'export · env · set · unset · $PATH',
        modules: [{ label: 'Comandos', href: '/comandos#variaveis-ambiente' }],
      },
      {
        topic: 'Filtros e processamento de texto',
        commands: 'grep · sed · cut · sort · wc',
        modules: [
          { label: 'Comandos', href: '/comandos' },
          { label: 'Cmd Avançados', href: '/comandos-avancados' },
        ],
      },
      {
        topic: 'Editores de texto',
        commands: 'nano · vim (modos, :wq, dd, /busca)',
        modules: [{ label: 'Editores', href: '/editores' }],
      },
      {
        topic: 'Shell scripting',
        commands: 'if · for · while · case · test/[ ]',
        modules: [{ label: 'Shell Script', href: '/shell-script' }],
      },
    ],
  },
  {
    domain: 'Usuários, Grupos e Permissões',
    icon: '🔑',
    rows: [
      {
        topic: 'Ciclo de vida de contas',
        commands: 'useradd · usermod · groupadd · passwd · sudo',
        modules: [{ label: 'Usuários', href: '/usuarios' }],
      },
      {
        topic: 'Permissões do sistema de arquivos',
        commands: 'chmod · chown · umask · SUID/SGID/Sticky',
        modules: [{ label: 'Permissões', href: '/permissoes' }],
      },
    ],
  },
  {
    domain: 'Sistema de Arquivos (FHS) e Armazenamento',
    icon: '🗂️',
    rows: [
      {
        topic: 'Hierarquia de diretórios',
        commands: '/etc · /var · /usr · /proc · /opt · /tmp',
        modules: [{ label: 'FHS', href: '/fhs' }],
      },
      {
        topic: 'Discos, partições e montagem',
        commands: 'fdisk · parted · mkfs · mount · /etc/fstab · LVM',
        modules: [{ label: 'Discos', href: '/discos' }],
      },
    ],
  },
  {
    domain: 'Pacotes, Processos e Redes',
    icon: '📦',
    rows: [
      {
        topic: 'Gestão de pacotes',
        commands: 'apt · dpkg · apt-cache · snap',
        modules: [{ label: 'Pacotes', href: '/pacotes' }],
      },
      {
        topic: 'Processos e recursos',
        commands: 'ps · top · kill · nice · jobs',
        modules: [{ label: 'Processos', href: '/processos' }],
      },
      {
        topic: 'Redes — configuração e diagnóstico',
        commands: 'ip · ss · ping · traceroute · dig · /etc/resolv.conf',
        modules: [
          { label: 'Troubleshooting', href: '/troubleshooting' },
          { label: 'DNS', href: '/dns' },
        ],
      },
    ],
  },
  {
    domain: 'Logs e Segurança',
    icon: '🛡️',
    rows: [
      {
        topic: 'Logs do sistema',
        commands: 'journalctl · /var/log · tail -f',
        modules: [{ label: 'Logs Básicos', href: '/logs-basicos' }],
      },
      {
        topic: 'Logs centralizados e rotação',
        commands: 'rsyslog · logrotate (rotate, compress, postrotate)',
        modules: [{ label: 'Rsyslog', href: '/rsyslog' }],
      },
      {
        topic: 'SSH, chaves e ssh-agent',
        commands: 'ssh-keygen · ssh-agent · ssh-add · ~/.ssh/config',
        modules: [
          { label: 'Hardening', href: '/hardening' },
          { label: 'SSH Proxy', href: '/ssh-proxy' },
        ],
      },
      {
        topic: 'Hardening e firewall',
        commands: 'sysctl · AppArmor · iptables · nftables · ufw',
        modules: [
          { label: 'Hardening', href: '/hardening' },
          { label: 'nftables', href: '/nftables' },
        ],
      },
    ],
  },
];

const DIAG_COMMANDS = `# strace — rastreia as syscalls (o que o programa pede ao kernel)
strace ls                          # toda syscall executada pelo 'ls'
strace -e trace=open,read cat f    # filtra apenas open e read
strace -p 1234                     # anexa a um processo JÁ rodando (PID)
strace -c comando                  # resumo: tempo gasto por syscall

# ltrace — rastreia chamadas a bibliotecas dinâmicas (libc, etc.)
ltrace comando

# lsof — lista arquivos abertos (sockets e pipes também são "arquivos")
lsof -p 1234                       # tudo que o PID 1234 tem aberto
lsof -i :80                        # quem está ocupando a porta 80
lsof /var/log/syslog               # qual processo segura este arquivo`;

export default function CertificacoesPage() {
  const { trackPageVisit } = useBadges();
  useEffect(() => { trackPageVisit('/certificacoes'); }, [trackPageVisit]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Certificações</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-2 to-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.25)] rounded-2xl p-8 md:p-10 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.3)] text-[#6366f1] text-[10px] font-bold uppercase tracking-wider mb-4">
          <ShieldCheck size={11} />
          Trilha de Certificação
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">🎓 Rumo à Certificação Linux</h1>
        <p className="text-text-2 leading-relaxed max-w-2xl">
          Este hub mapeia o <strong>núcleo comum</strong> das provas{' '}
          <strong className="text-text">LPIC-1</strong> (exames 101 e 102) e{' '}
          <strong className="text-text">CompTIA Linux+</strong> (XK0-005) para os módulos do
          Workshop. É o &ldquo;feijão com arroz&rdquo; tático: dominar estes tópicos garante a
          sobrevivência no terminal e a aprovação em ambas as provas. Clique em qualquer módulo
          para estudar o conteúdo correspondente.
        </p>
      </div>

      {/* Mapa de domínios */}
      <div className="space-y-8">
        {CERT_MAP.map((domain) => (
          <section key={domain.domain}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span aria-hidden="true">{domain.icon}</span>
              {domain.domain}
            </h2>
            <div className="space-y-3">
              {domain.rows.map((row) => (
                <div
                  key={row.topic}
                  className="bg-bg-2 border border-border rounded-xl p-4 sm:flex sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-text">{row.topic}</p>
                    <p className="text-xs text-text-3 font-mono mt-0.5">{row.commands}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 shrink-0">
                    {row.modules.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.06)] text-[#6366f1] text-xs font-bold hover:bg-[rgba(99,102,241,0.14)] transition-colors"
                      >
                        {m.label}
                        <ArrowRight size={12} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Card extra — diagnóstico de processos (cai na LPIC-1) */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Terminal size={18} className="text-accent" aria-hidden="true" />
          Diagnóstico de Processos — strace, ltrace e lsof
        </h2>
        <p className="text-text-2 text-sm mb-4">
          Quando um processo trava ou se comporta de forma estranha, estas três ferramentas
          mostram o que ele está realmente fazendo. Caem na LPIC-1 e são o &ldquo;raio-X&rdquo;
          de qualquer SysAdmin.
        </p>
        <CodeBlock code={DIAG_COMMANDS} lang="bash" title="strace · ltrace · lsof" />
        <InfoBox className="mt-4" title="Foco na Prova">
          <code>strace</code> opera no nível do <strong>kernel</strong> (syscalls);{' '}
          <code>ltrace</code>, no nível das <strong>bibliotecas</strong>. <code>lsof</code>{' '}
          (&ldquo;list open files&rdquo;) responde &ldquo;quem está usando esta porta/arquivo?&rdquo;
          — atalho diário para diagnosticar &ldquo;address already in use&rdquo; e disco que não
          desmonta.
        </InfoBox>
      </section>

      {/* CTA */}
      <section className="mt-12 grid sm:grid-cols-2 gap-4">
        <Link
          href="/quiz?trail=fundamentos"
          className="p-6 rounded-xl bg-[rgba(99,102,241,0.07)] border border-[rgba(99,102,241,0.25)] flex flex-col gap-2 hover:bg-[rgba(99,102,241,0.12)] transition-colors"
        >
          <p className="font-bold text-sm text-[#6366f1]">🎯 Simulado da Fundação</p>
          <p className="text-xs text-text-2 leading-relaxed">
            Teste o núcleo comum com o quiz da trilha Fundamentos — questões no estilo
            LPIC-1 / CompTIA Linux+.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-[#6366f1]">
            Fazer o simulado <ArrowRight size={12} aria-hidden="true" />
          </span>
        </Link>
        <Link
          href="/certificado"
          className="p-6 rounded-xl bg-bg-2 border border-border flex flex-col gap-2 hover:border-accent/50 transition-colors"
        >
          <p className="font-bold text-sm">🎓 Certificado do Workshop</p>
          <p className="text-xs text-text-2 leading-relaxed">
            Concluiu o laboratório e o quiz? Gere o certificado de conclusão e baixe em PNG.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-accent">
            Ver certificado <ArrowRight size={12} aria-hidden="true" />
          </span>
        </Link>
      </section>

      {/* Nota */}
      <p className="mt-8 text-xs text-text-3 leading-relaxed">
        ⚠️ O Workshop não é um curso oficial LPI ou CompTIA — é um laboratório prático que
        cobre o núcleo técnico dessas provas. Para a certificação oficial, consulte os
        objetivos em <span className="text-text-2">lpi.org</span> e{' '}
        <span className="text-text-2">comptia.org</span>.
      </p>
    </div>
  );
}
