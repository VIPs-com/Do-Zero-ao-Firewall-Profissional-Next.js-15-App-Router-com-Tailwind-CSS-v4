// src/components/ui/ModuleNav.tsx
// Navegação sequencial Anterior / Próximo módulo — inserida no rodapé de cada página de conteúdo.
// Prop `order` opcional: quando omitida usa COURSE_ORDER (trilha Firewall — padrão).
// Para a trilha Fundamentos, passar order={FUNDAMENTOS_ORDER}.
// Para módulos avançados (v3.0→v5.0), passar order={ADVANCED_ORDER} — prev/next derivados do índice.
// CTA central "🎯 Quiz deste módulo" derivado de PATH_TO_QUIZ_BADGE.
'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COURSE_ORDER, CourseModule, SimpleModule } from '@/data/courseOrder';

/**
 * Mapeamento rota → badge do quiz (campo `badge` em quizQuestions.ts).
 * Ausência de chave = sem botão de quiz para aquela rota.
 */
const PATH_TO_QUIZ_BADGE: Record<string, string> = {
  // Trilha Firewall (v1.0)
  '/instalacao':        '🌐 Camada 3',
  '/dns':               '📖 DNS',
  '/nginx-ssl':         '🔒 SSL',
  '/lan-proxy':         '🚪 Squid',
  '/dnat':              '🎯 DNAT',
  '/port-knocking':     '🔑 Port Knocking',
  '/vpn-ipsec':         '🔒 VPN & IPSec',
  '/wireguard':         '🔐 WireGuard',
  '/nftables':          '🔥 nftables',
  '/fail2ban':          '🚫 Fail2ban',
  '/hardening':         '🔐 Hardening',
  '/ssh-2fa':           '📱 SSH 2FA',
  '/docker':            '🐳 Docker',
  '/docker-compose':    '🐙 Compose',
  '/audit-logs':        '📋 Logs',
  '/pivoteamento':      '🎭 Pivoteamento',
  '/laboratorio':       '🧪 Laboratório',
  '/proxmox':           '🖥️ Proxmox',
  '/ataques-avancados': '🛡️ Firewall',
  // Trilha Fundamentos (v2.0)
  '/fhs':               '🗂️ FHS',
  '/comandos':          '💻 Comandos',
  '/editores':          '📝 Editores',
  '/processos':         '⚙️ Processos',
  '/permissoes':        '🔑 Permissões',
  '/usuarios':          '👤 Usuários',
  '/discos':            '💾 Discos',
  '/logs-basicos':      '📋 Logs',
  '/backup':            '💾 Backup',
  '/shell-script':      '🖥️ Shell Script',
  '/cron':              '⏰ Cron',
  '/pacotes':           '📦 Pacotes',
  '/boot':              '🖥️ Boot',
  '/comandos-avancados':'🔧 Cmd Avançados',
  '/rsyslog':           '📡 Rsyslog',
  '/ssh-proxy':         '🚇 SSH Tunneling',
  '/troubleshooting':   '🔎 Troubleshooting',
  // Trilha Avançados v3.0
  '/dhcp':              '🌐 DHCP',
  '/samba':             '🗂️ Samba',
  '/apache':            '🌍 Apache',
  '/openvpn':           '🔒 OpenVPN',
  '/traefik':           '🔀 Traefik',
  '/ldap':              '👥 LDAP',
  '/pihole':            '🕳️ Pi-hole',
  '/nfs':               '🗂️ NFS',
  '/haproxy':           '⚖️ HAProxy',
  // Trilha Avançados v4.0
  '/ansible':           '⚙️ Ansible',
  '/monitoring':        '📊 Monitoring',
  '/kubernetes':        '☸️ Kubernetes',
  '/terraform':         '🏗️ Terraform',
  '/suricata':          '🛡️ Suricata',
  '/ebpf':              '⚡ eBPF',
  '/service-mesh':      '🕸️ Service Mesh',
  '/sre':               '🎯 SRE',
  '/vault':             '🔐 Vault',
  // Trilha Avançados v5.0
  '/cicd':              '🚀 CI/CD',
  '/opnsense':          '🔥 OPNsense',
  '/nextcloud':         '☁️ Nextcloud',
  '/ebpf-avancado':     '🧬 eBPF Avançado',
  '/resposta-incidentes': '🚨 Resposta a Incidentes',
  '/crowdsec':            '🛰️ CrowdSec',
  '/tailscale':           '🔗 Tailscale',
  '/proxmox-backup-server': '💾 PBS',
  '/gpg':                 '🔑 GPG',
  '/lvm-raid':            '💽 Storage',
  '/banco-de-dados':      '🗄️ Banco de Dados',
  '/mail-server':         '📧 Mail',
  '/redes-l2-l3':         '🌐 Redes L2/L3',
  '/alta-disponibilidade': '♻️ Alta Disponibilidade',
  '/cloud-publica':       '☁️ Cloud',
  '/git':                 '🔀 Git',
  '/carreira':            '🎖️ Carreira',
};

type AnyModule = CourseModule | SimpleModule;

interface ModuleNavProps {
  currentPath: string;
  /** Sequência de módulos a usar. Default: COURSE_ORDER (trilha Firewall).
   *  Aceita CourseModule[] (prev/next explícitos) ou SimpleModule[] (prev/next por índice). */
  order?: AnyModule[];
}

export function ModuleNav({ currentPath, order }: ModuleNavProps) {
  const sequence = order ?? COURSE_ORDER;
  const idx = sequence.findIndex(m => m.path === currentPath);
  if (idx === -1) return null;

  const current = sequence[idx];

  // CourseModule tem prev/next explícitos; SimpleModule deriva do índice
  let prevModule: AnyModule | null = null;
  let nextModule: AnyModule | null = null;

  if ('prev' in current) {
    // CourseModule
    prevModule = current.prev ? (sequence.find(m => m.path === (current as CourseModule).prev) ?? null) : null;
    nextModule = current.next ? (sequence.find(m => m.path === (current as CourseModule).next) ?? null) : null;
  } else {
    // SimpleModule — derivar do índice
    prevModule = idx > 0 ? sequence[idx - 1] : null;
    nextModule = idx < sequence.length - 1 ? sequence[idx + 1] : null;
  }

  const quizBadge = PATH_TO_QUIZ_BADGE[currentPath] ?? null;

  return (
    <div className="mt-12 pt-8 border-t border-border space-y-4">
      {/* CTA de quiz centralizado — visível apenas em páginas com questões mapeadas */}
      {quizBadge && (
        <div className="flex justify-center">
          <Link
            href={`/quiz?modulo=${encodeURIComponent(quizBadge)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-accent/40 text-accent hover:bg-accent/10 transition-colors"
            aria-label={`Quiz do módulo ${quizBadge}`}
          >
            🎯 Quiz deste módulo
          </Link>
        </div>
      )}

      {/* Navegação Anterior / Próximo */}
      <div className="flex justify-between items-center">
        {prevModule ? (
          <Link
            href={prevModule.path}
            className="btn-outline inline-flex items-center gap-2 text-sm"
            aria-label={`Módulo anterior: ${prevModule.title}`}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{prevModule.title}</span>
            <span className="sm:hidden">Anterior</span>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={nextModule.path}
            className="btn-primary inline-flex items-center gap-2 text-sm"
            aria-label={`Próximo módulo: ${nextModule.title}`}
          >
            <span className="hidden sm:inline">{nextModule.title}</span>
            <span className="sm:hidden">Próximo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
