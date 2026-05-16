'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, Terminal, BookOpen, Award, Target, Flag } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_QUESTIONS } from '@/data/quiz/fundamentos';

const MODULES = [
  { path: '/fhs',                num: '01', title: 'Estrutura do Sistema (FHS)',    icon: '🗂️',  checkpoint: 'fhs-explorado',          quizBadge: '🗂️ FHS',             desc: '/etc, /var, /usr, /home — o mapa do Linux' },
  { path: '/comandos',           num: '02', title: 'Comandos Essenciais',           icon: '💻',  checkpoint: 'comandos-praticados',     quizBadge: '💻 Comandos',         desc: 'ls, cd, grep, find, pipe e muito mais' },
  { path: '/editores',           num: '03', title: 'Editores de Texto',             icon: '📝',  checkpoint: 'editores-usados',         quizBadge: '📝 Editores',         desc: 'nano para edições, VIM para produção' },
  { path: '/processos',          num: '04', title: 'Gerenciamento de Processos',    icon: '⚙️',  checkpoint: 'processos-controlados',   quizBadge: '⚙️ Processos',        desc: 'ps, top, kill, systemctl — controle total' },
  { path: '/permissoes',         num: '05', title: 'Permissões e Usuários',         icon: '🔑',  checkpoint: 'permissoes-configuradas', quizBadge: '🔑 Permissões',       desc: 'chmod, chown, useradd, sudo' },
  { path: '/usuarios',           num: '06', title: 'Gerenciamento de Usuários',     icon: '👤',  checkpoint: 'usuario-criado',          quizBadge: '👤 Usuários',         desc: 'adduser, usermod, grupos, sudo e visudo' },
  { path: '/discos',             num: '07', title: 'Discos e Partições',            icon: '💾',  checkpoint: 'discos-mapeados',         quizBadge: '💾 Discos',           desc: 'fdisk, lsblk, mount, df, du, dd' },
  { path: '/logs-basicos',       num: '08', title: 'Logs e Monitoramento',          icon: '📋',  checkpoint: 'logs-lidos',              quizBadge: '📋 Logs',             desc: 'journalctl, /var/log/, tail -f' },
  { path: '/backup',             num: '09', title: 'Backup e Restauração',          icon: '🗄️',  checkpoint: 'backup-criado',           quizBadge: '💾 Backup',           desc: 'rsync, tar, scp — proteja seus dados' },
  { path: '/shell-script',       num: '10', title: 'Shell Script',                  icon: '📜',  checkpoint: 'script-escrito',          quizBadge: '🖥️ Shell Script',     desc: 'Variáveis, if, for, funções em bash' },
  { path: '/cron',               num: '11', title: 'Agendamento de Tarefas',        icon: '🕐',  checkpoint: 'tarefa-agendada',         quizBadge: '⏰ Cron',             desc: 'crontab, systemd timers, at' },
  { path: '/pacotes',            num: '12', title: 'Instalação de Programas',       icon: '📦',  checkpoint: 'apt-atualizado',          quizBadge: '📦 Pacotes',          desc: 'apt, dpkg, snap, pip — gestão de software' },
  { path: '/boot',               num: '13', title: 'Processo de Boot',              icon: '🖥️',  checkpoint: 'bios-uefi-entendido',     quizBadge: '🖥️ Boot',             desc: 'BIOS/UEFI, GRUB2, kernel, initrd, systemd' },
  { path: '/comandos-avancados', num: '14', title: 'Comandos Avançados',            icon: '🔧',  checkpoint: 'sed-dominado',            quizBadge: '🔧 Cmd Avançados',    desc: 'sed, dd, nc, links simbólicos, compactação' },
  { path: '/rsyslog',            num: '15', title: 'Logs Centralizados (Rsyslog)',  icon: '📡',  checkpoint: 'rsyslog-configurado',     quizBadge: '📡 Rsyslog',          desc: 'rsyslog, servidor central, logrotate' },
  { path: '/ssh-proxy',          num: '16', title: 'SSH como Proxy SOCKS',          icon: '🚇',  checkpoint: 'ssh-dinamico',            quizBadge: '🚇 SSH Tunneling',    desc: 'SSH -D/-L/-R/-J, túneis persistentes com autossh' },
  { path: '/troubleshooting',    num: '17', title: 'Troubleshooting de Rede',       icon: '🔎',  checkpoint: 'trouble-conectividade',   quizBadge: '🔎 Troubleshooting',  desc: 'ping, ip, ss, dig, journalctl — método OSI' },
];

const CHECKLIST_IDS = MODULES.map(m => m.checkpoint);

export default function FundamentosPage() {
  const { trackPageVisit, checklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/fundamentos');
  }, [trackPageVisit]);

  const completed = CHECKLIST_IDS.filter(id => checklist[id]).length;
  const allDone = completed === MODULES.length;

  // Próximo módulo não concluído
  const nextModule = MODULES.find(m => !checklist[m.checkpoint]);
  // Último módulo concluído
  const lastCompleted = [...MODULES].reverse().find(m => checklist[m.checkpoint]);

  // QUIZ-GROUND-ZERO: contagem de questões por módulo (badge → nº de questões)
  const quizCounts = useMemo(() => {
    const m = new Map<string, number>();
    FUNDAMENTOS_QUESTIONS.forEach(q => m.set(q.badge, (m.get(q.badge) ?? 0) + 1));
    return m;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-accent-fundamentos">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Fundamentos Linux</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-bg-2 to-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.25)] rounded-2xl p-10 mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.3)] text-[#6366f1] text-[10px] font-bold uppercase tracking-wider mb-4">
            <Terminal size={11} />
            Trilha v2.0 · 17 Módulos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🐧 Fundamentos Linux
          </h1>
          <p className="text-text-2 text-lg max-w-2xl leading-relaxed mb-6">
            Nunca abriu um terminal? Começa aqui. Esta trilha ensina Linux do zero —
            do sistema de arquivos a SSH avançado — antes de configurar qualquer firewall.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={nextModule?.path ?? lastCompleted?.path ?? '/fhs'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#6366f1] text-white font-semibold hover:bg-[#4f46e5] transition-colors"
            >
              {completed === 0 ? '🚀 Começar agora' : allDone ? '✅ Revisar trilha' : '▶ Continuar de onde parei'}
              <ArrowRight size={14} />
            </Link>
            <Link href="/instalacao" className="btn-outline px-6 py-3">
              Ir para o Firewall →
            </Link>
          </div>
        </div>
        <BookOpen className="absolute -bottom-8 -right-8 text-[#6366f1]/5 w-52 h-52" />
      </div>

      {/* Progress Bar */}
      <div className="mb-10 p-6 rounded-xl bg-bg-2 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-[#6366f1]" />
            <span className="font-bold text-sm">Progresso da Trilha</span>
          </div>
          <span className="font-mono font-bold text-sm text-[#6366f1]">{completed}/{MODULES.length}</span>
        </div>
        <div className="h-3 bg-bg-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6366f1] rounded-full transition-[width] duration-700"
            style={{ width: `${(completed / MODULES.length) * 100}%` }}
          />
        </div>
        {allDone && (
          <p className="mt-3 text-sm text-ok font-semibold flex items-center gap-2">
            <CheckCircle2 size={14} /> Trilha 100% concluída! Badges 🐧 Fundamentos Master e 🏁 Ground Zero desbloqueados.
          </p>
        )}
      </div>

      {/* Módulos Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {MODULES.map((mod, i) => {
          const done = !!checklist[mod.checkpoint];
          return (
            <motion.div
              key={mod.path}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={mod.path}
                className={`flex items-start gap-4 p-5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  done
                    ? 'bg-ok/5 border-ok/30 hover:border-ok/60'
                    : 'bg-bg-2 border-border hover:border-[rgba(99,102,241,0.5)]'
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
                    {done && <CheckCircle2 size={12} className="text-ok" />}
                    {!done && <Circle size={12} className="text-text-3 opacity-40" />}
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

      {/* Hub de Quiz — Ground Zero (Sprint QUIZ-GROUND-ZERO) */}
      <section className="mt-14" aria-labelledby="hub-quiz-heading">
        <div className="flex items-center gap-2 mb-2">
          <Target size={18} className="text-[#6366f1]" />
          <h2 id="hub-quiz-heading" className="text-2xl font-bold">Hub de Quiz — Teste a Fundação</h2>
        </div>
        <p className="text-text-2 text-sm leading-relaxed mb-6 max-w-2xl">
          {FUNDAMENTOS_QUESTIONS.length} questões no estilo das certificações{' '}
          <strong className="text-text">LPIC-1</strong> e <strong className="text-text">CompTIA Linux+</strong>.
          Treine módulo por módulo ou encare o simulado completo da trilha.
        </p>

        {/* Simulado completo */}
        <Link
          href="/quiz?trail=fundamentos"
          className="flex items-center gap-4 p-5 rounded-xl border border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.06)] hover:bg-[rgba(99,102,241,0.12)] transition-colors"
        >
          <div className="shrink-0 w-12 h-12 rounded-lg bg-[#6366f1] text-white flex items-center justify-center text-xl">
            🎯
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm mb-0.5">Simulado Completo da Trilha</h3>
            <p className="text-xs text-text-3">
              Todas as {FUNDAMENTOS_QUESTIONS.length} questões dos 17 módulos · escolha o tamanho da sessão
            </p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-[#6366f1]" />
        </Link>

        {/* Ground Zero desbloqueado */}
        {allDone && (
          <div className="mt-3 flex items-center gap-3 p-4 rounded-xl border border-ok/30 bg-ok/5">
            <Flag size={18} className="text-ok shrink-0" />
            <p className="text-xs text-text-2 leading-relaxed">
              <strong className="text-ok">🏁 Ground Zero desbloqueado!</strong> Você completou os 17 módulos —
              valide o domínio no simulado e siga para a Trilha Firewall.
            </p>
          </div>
        )}

        {/* Quiz por módulo */}
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-text-3">
          Ou treine um módulo específico
        </div>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {MODULES.map(mod => {
            const count = quizCounts.get(mod.quizBadge) ?? 0;
            const done = !!checklist[mod.checkpoint];
            return (
              <Link
                key={mod.path}
                href={`/quiz?modulo=${encodeURIComponent(mod.quizBadge)}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-2 hover:border-[rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all"
              >
                <span className="shrink-0 text-base" aria-hidden="true">{mod.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs leading-snug truncate">{mod.title}</div>
                  <div className="text-[10px] text-text-3 font-mono">
                    {count} quest{count === 1 ? 'ão' : 'ões'}
                  </div>
                </div>
                {done && <CheckCircle2 size={12} className="shrink-0 text-ok" />}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Após a trilha */}
      <div className="mt-12 p-6 rounded-xl bg-bg-2 border border-border text-center">
        <p className="text-sm text-text-2 mb-4">
          Concluiu a Trilha Fundamentos? Você está pronto para montar um firewall Linux do zero.
        </p>
        <Link href="/instalacao" className="btn-primary px-8 py-3">
          🛡️ Começar a Trilha Firewall
        </Link>
      </div>

      {/* Info sobre a trilha */}
      <div className="mt-6 p-4 rounded-xl bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.2)] text-xs text-text-3 flex items-start gap-2">
        <Terminal size={13} className="shrink-0 mt-0.5 text-[#6366f1]" />
        <span>
          Esta trilha usa <strong className="text-text-2">Ubuntu Server 22.04 LTS</strong>.
          Todos os comandos funcionam também no Debian, Fedora e derivados.
          Cada módulo tem exemplos reais, exercícios guiados e um checkpoint de conclusão.
        </span>
      </div>
    </div>
  );
}
