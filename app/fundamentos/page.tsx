'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, Terminal, BookOpen, Award } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const MODULES = [
  { path: '/fhs',          num: '01', title: 'Estrutura do Sistema (FHS)',  icon: '🗂️',  checkpoint: 'fhs-explorado',          desc: '/etc, /var, /usr, /home — o mapa do Linux' },
  { path: '/comandos',     num: '02', title: 'Comandos Essenciais',         icon: '💻',  checkpoint: 'comandos-praticados',     desc: 'ls, cd, grep, find, pipe e muito mais' },
  { path: '/editores',     num: '03', title: 'Editores de Texto',           icon: '📝',  checkpoint: 'editores-usados',         desc: 'nano para edições, VIM para produção' },
  { path: '/processos',    num: '04', title: 'Gerenciamento de Processos',  icon: '⚙️',  checkpoint: 'processos-controlados',   desc: 'ps, top, kill, systemctl — controle total' },
  { path: '/permissoes',   num: '05', title: 'Permissões e Usuários',       icon: '🔑',  checkpoint: 'permissoes-configuradas', desc: 'chmod, chown, useradd, sudo' },
  { path: '/discos',       num: '06', title: 'Discos e Partições',          icon: '💾',  checkpoint: 'discos-mapeados',         desc: 'fdisk, lsblk, mount, df, du, dd' },
  { path: '/logs-basicos', num: '07', title: 'Logs e Monitoramento',        icon: '📋',  checkpoint: 'logs-lidos',              desc: 'journalctl, /var/log/, tail -f' },
  { path: '/backup',       num: '08', title: 'Backup e Restauração',        icon: '🗄️',  checkpoint: 'backup-criado',           desc: 'rsync, tar, scp — proteja seus dados' },
  { path: '/shell-script', num: '09', title: 'Shell Script',                icon: '📜',  checkpoint: 'script-escrito',          desc: 'Variáveis, if, for, funções em bash' },
  { path: '/cron',         num: '10', title: 'Agendamento de Tarefas',      icon: '🕐',  checkpoint: 'tarefa-agendada',         desc: 'crontab, systemd timers, at' },
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
            Trilha v2.0 · 10 Módulos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🐧 Fundamentos Linux
          </h1>
          <p className="text-text-2 text-lg max-w-2xl leading-relaxed mb-6">
            Nunca abriu um terminal? Começa aqui. Esta trilha ensina Linux do zero —
            do sistema de arquivos até scripts de automação — antes de configurar qualquer firewall.
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
            <CheckCircle2 size={14} /> Trilha concluída! Badge 🐧 Fundamentos Master desbloqueado.
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
