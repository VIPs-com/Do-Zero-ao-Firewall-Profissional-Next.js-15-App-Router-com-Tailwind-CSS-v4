'use client';

/*
 * ProgressDropdown — dropdown "Seu Progresso" do header.
 *
 * Sprint PROGRESS-DROPDOWN: 3 abas — Firewall (25), Fundamentos (15), Avançados (19).
 * Botão exibe total visitado / total (59 módulos somados das 3 trilhas).
 * Cada aba tem barra de progresso individual + lista de módulos.
 *
 * A11y: role=dialog, aria-modal=false, focus trap quando aberto, ESC fecha,
 * clique fora fecha, hover/focus-visible respeitando tokens de tema.
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ListChecks, Check } from 'lucide-react';
import { COURSE_ORDER, FUNDAMENTOS_ORDER, ADVANCED_ORDER } from '@/data/courseOrder';
import { useBadges } from '@/context/BadgeContext';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { cn } from '@/lib/utils';

type Tab = 'firewall' | 'fundamentos' | 'avancados';

interface TrackItem {
  path: string;
  title: string;
  visited: boolean;
  idx: number;
}

function buildTrack(
  order: Array<{ path: string; title: string }>,
  visitedPages: Set<string>,
): { items: TrackItem[]; completed: number } {
  const items = order.map((m, idx) => {
    const slug = m.path.slice(1);
    const visited = visitedPages.has(m.path) || visitedPages.has(slug);
    return { path: m.path, title: m.title, visited, idx };
  });
  return { items, completed: items.filter(m => m.visited).length };
}

export const ProgressDropdown: React.FC = () => {
  const { visitedPages } = useBadges();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('firewall');
  const prefersReducedMotion = useReducedMotion();

  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, () => setIsOpen(false));
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const tracks = useMemo(() => {
    const firewall     = buildTrack(COURSE_ORDER,      visitedPages);
    const fundamentos  = buildTrack(FUNDAMENTOS_ORDER, visitedPages);
    const avancados    = buildTrack(ADVANCED_ORDER,    visitedPages);
    const totalAll     = firewall.items.length + fundamentos.items.length + avancados.items.length;
    const completedAll = firewall.completed + fundamentos.completed + avancados.completed;
    return { firewall, fundamentos, avancados, totalAll, completedAll };
  }, [visitedPages]);

  /* Clique fora fecha. ESC é tratado pelo useFocusTrap. */
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial:    { opacity: 0, y: -8, scale: 0.98 },
        animate:    { opacity: 1, y: 0, scale: 1 },
        exit:       { opacity: 0, y: -8, scale: 0.98 },
        transition: { duration: 0.16, ease: 'easeOut' as const },
      };

  const activeTrack = tracks[activeTab];
  const currentIdx  = activeTrack.items.findIndex(m => !m.visited);
  const total       = activeTrack.items.length;
  const percent     = Math.round((activeTrack.completed / total) * 100);

  const TAB_LABELS: Record<Tab, string> = {
    firewall:    `Firewall ${tracks.firewall.completed}/${COURSE_ORDER.length}`,
    fundamentos: `Fundamentos ${tracks.fundamentos.completed}/${FUNDAMENTOS_ORDER.length}`,
    avancados:   `Avançados ${tracks.avancados.completed}/${ADVANCED_ORDER.length}`,
  };

  const TAB_COLORS: Record<Tab, string> = {
    firewall:    'bg-accent',
    fundamentos: 'bg-[#6366f1]',
    avancados:   'bg-info',
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        aria-controls="progress-panel"
        aria-haspopup="menu"
        aria-label={`Seu progresso: ${tracks.completedAll} de ${tracks.totalAll} módulos visitados`}
        className="p-2 rounded-md bg-bg-3 border border-border text-text-2 hover:border-accent hover:text-text transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center gap-2"
        title="Seu progresso no workshop"
      >
        <ListChecks size={18} aria-hidden="true" />
        <span className="hidden sm:inline text-xs font-mono tabular-nums">
          {tracks.completedAll}/{tracks.totalAll}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="progress-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="progress-title"
            className={cn(
              'absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-bg-2 border border-border rounded-lg shadow-xl z-50',
              'max-sm:fixed max-sm:inset-x-4 max-sm:top-20 max-sm:w-auto',
            )}
            {...panelMotion}
          >
            {/* Header */}
            <div className="p-4 pb-3 border-b border-border">
              <h2 id="progress-title" className="text-sm font-bold text-text mb-3">
                Seu Progresso
              </h2>

              {/* Tabs */}
              <div className="flex gap-1 text-[11px] font-medium flex-wrap" role="tablist">
                {(Object.keys(TAB_LABELS) as Tab[]).map(tab => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-colors whitespace-nowrap',
                      activeTab === tab
                        ? 'bg-bg-3 text-text font-bold border border-border'
                        : 'text-text-3 hover:text-text-2',
                    )}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de progresso da aba ativa */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between mb-1.5 text-xs text-text-2">
                <span>
                  {activeTab === 'firewall'    && 'Trilha Firewall'}
                  {activeTab === 'fundamentos' && 'Trilha Fundamentos'}
                  {activeTab === 'avancados'   && 'Módulos Avançados'}
                </span>
                <span className="font-mono tabular-nums">{activeTrack.completed}/{total} · {percent}%</span>
              </div>
              <div
                className="h-2 bg-bg-3 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={activeTrack.completed}
                aria-valuemin={0}
                aria-valuemax={total}
              >
                <div
                  className={cn('h-full transition-all duration-300', TAB_COLORS[activeTab])}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Lista de módulos da aba ativa */}
            <ul className="max-h-[52vh] overflow-y-auto p-2" role="tabpanel">
              {activeTrack.items.map(m => {
                const isCurrent = m.idx === currentIdx;
                const stateLabel = m.visited
                  ? 'Concluído'
                  : isCurrent ? 'Módulo atual' : 'Pendente';
                return (
                  <li key={m.path}>
                    <Link
                      href={m.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                        'hover:bg-bg-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                        isCurrent && 'bg-accent-bg text-accent-2',
                      )}
                    >
                      <span
                        className={cn(
                          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                          m.visited
                            ? 'bg-ok/20 text-ok'
                            : isCurrent
                              ? 'bg-accent text-white'
                              : 'bg-bg-3 text-text-3',
                        )}
                        aria-hidden="true"
                      >
                        {m.visited ? <Check size={14} /> : m.idx + 1}
                      </span>
                      <span className="flex-1 truncate">{m.title}</span>
                      <span className="sr-only">— {stateLabel}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
