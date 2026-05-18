'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import {
  JOURNEY,
  JOURNEY_TOTAL_MINUTES,
  getNextJourneyModule,
  getJourneyProgress,
  type JourneyTrail,
  type Difficulty,
} from '@/data/journey';

/* Sprint JORNADA — linha do tempo única "do zero ao avançado".
   Une as 3 trilhas (Fundamentos → Firewall → Avançados) em 64 módulos. */

const PHASE: Record<JourneyTrail, { label: string; icon: string; desc: string }> = {
  fundamentos: { label: 'Fundamentos Linux', icon: '🐧', desc: 'A base — terminal, arquivos, processos e permissões.' },
  firewall:    { label: 'Firewall Profissional', icon: '🔥', desc: 'iptables, NAT, DNS, VPN e o laboratório de rede completo.' },
  avancados:   { label: 'Avançados — Servidores, Infra e Cloud', icon: '🚀', desc: 'Serviços, Kubernetes, observabilidade e platform engineering.' },
};

const DIFFICULTY: Record<Difficulty, { label: string; dot: string; cls: string }> = {
  iniciante:     { label: 'Iniciante',     dot: '🟢', cls: 'text-ok' },
  intermediario: { label: 'Intermediário', dot: '🟡', cls: 'text-warn' },
  avancado:      { label: 'Avançado',      dot: '🔴', cls: 'text-err' },
};

export default function JornadaPage() {
  const { visitedPages, checklist, trackPageVisit } = useBadges();

  useEffect(() => { trackPageVisit('/jornada'); }, [trackPageVisit]);

  const visited = useMemo(() => Array.from(visitedPages), [visitedPages]);
  const progress = useMemo(() => getJourneyProgress(visited, checklist), [visited, checklist]);
  const next = useMemo(() => getNextJourneyModule(visited, checklist), [visited, checklist]);
  const visitedSet = useMemo(() => new Set(visited), [visited]);

  const isDone = (path: string) => visitedSet.has(path) || visitedSet.has(path.slice(1));
  const totalHours = Math.round(JOURNEY_TOTAL_MINUTES / 60);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Jornada</span>
      </div>

      <div className="section-label">Do Zero ao Avançado</div>
      <h1 className="section-title">🧭 Jornada Unificada</h1>
      <p className="section-sub">
        As 3 trilhas do workshop numa linha do tempo só — {JOURNEY.length} módulos de
        Fundamentos a Cloud. Siga a ordem, ou pule para onde quiser: seu próximo passo
        fica sempre destacado.
      </p>

      {/* Progresso geral */}
      <div className="mt-8 bg-bg-2 border border-border rounded-2xl p-6">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-text-3">Seu progresso</p>
            <p className="text-2xl font-black text-text">
              {progress.completed}<span className="text-text-3">/{progress.total}</span>
              <span className="text-sm font-bold text-text-3 ml-2">módulos</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-accent">{progress.percent}%</p>
            <p className="text-[10px] text-text-3 flex items-center gap-1 justify-end">
              <Clock size={11} aria-hidden="true" /> ~{totalHours}h no total
            </p>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-bg-3 overflow-hidden" role="progressbar"
          aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}
          aria-label="Progresso da jornada">
          <div className="h-full bg-accent transition-[width] duration-700"
            style={{ width: `${progress.percent}%` }} />
        </div>
        {next && (
          <Link
            href={next.path}
            data-testid="jornada-next"
            className="mt-4 flex items-center justify-between gap-3 p-3 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-colors"
          >
            <span className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Continue aqui</span>
              <span className="block text-sm font-bold text-text truncate">{next.title}</span>
            </span>
            <ArrowRight size={18} className="text-accent shrink-0" aria-hidden="true" />
          </Link>
        )}
        {!next && (
          <p className="mt-4 p-3 rounded-xl border border-ok/40 bg-ok/10 text-sm font-bold text-ok text-center">
            🎉 Jornada completa — você percorreu os {JOURNEY.length} módulos!
          </p>
        )}
      </div>

      {/* Linha do tempo */}
      <div className="mt-10 space-y-1">
        {JOURNEY.map((m, i) => {
          const newPhase = i === 0 || JOURNEY[i - 1].trail !== m.trail;
          const done = isDone(m.path);
          const isNext = next?.path === m.path;
          const diff = DIFFICULTY[m.difficulty];
          const phaseModules = JOURNEY.filter((x) => x.trail === m.trail);
          const phaseDone = phaseModules.filter((x) => isDone(x.path)).length;
          return (
            <React.Fragment key={m.path}>
              {newPhase && (
                <div className="pt-8 pb-3 first:pt-0">
                  <h2 className="text-lg font-black text-text flex items-center gap-2">
                    <span aria-hidden="true">{PHASE[m.trail].icon}</span>
                    {PHASE[m.trail].label}
                    <span className="text-xs font-bold text-text-3 ml-auto">
                      {phaseDone}/{phaseModules.length}
                    </span>
                  </h2>
                  <p className="text-xs text-text-3 mt-0.5">{PHASE[m.trail].desc}</p>
                </div>
              )}
              <Link
                href={m.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors',
                  isNext
                    ? 'border-accent bg-accent/10'
                    : done
                      ? 'border-border bg-bg-2/60 hover:border-accent/40'
                      : 'border-border bg-bg-2 hover:border-accent/40',
                )}
              >
                {done
                  ? <CheckCircle2 size={18} className="text-ok shrink-0" aria-hidden="true" />
                  : <Circle size={18} className="text-text-3 shrink-0" aria-hidden="true" />}
                <span className="flex-1 min-w-0">
                  <span className={cn('block text-sm font-bold truncate', done ? 'text-text-2' : 'text-text')}>
                    {m.title}
                  </span>
                  <span className="flex items-center gap-3 text-[10px] text-text-3 mt-0.5">
                    <span className={diff.cls}>{diff.dot} {diff.label}</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} aria-hidden="true" /> {m.estMin} min</span>
                  </span>
                </span>
                {isNext && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent shrink-0">
                    <MapPin size={12} aria-hidden="true" /> Aqui
                  </span>
                )}
              </Link>
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-10 p-4 rounded-xl bg-info/5 border border-info/20 text-xs text-text-3 leading-relaxed">
        <strong className="text-text-2">Como ler:</strong> um módulo é marcado com
        ✓ quando você abre a página dele. A dificuldade (🟢 Iniciante · 🟡 Intermediário ·
        🔴 Avançado) e o tempo estimado ajudam a planejar cada sessão de estudo.
      </div>
    </div>
  );
}
