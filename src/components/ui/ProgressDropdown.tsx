'use client';

/*
 * ProgressDropdown — dropdown "Seu Progresso" do header.
 *
 * Mostra X/21 módulos visitados e expande uma lista completa dos 21 módulos do
 * curso (COURSE_ORDER) com estados:
 *   ✅ visitado       🟡 atual (primeiro não-visitado)       ⬜ pendente
 *
 * A11y: role=dialog, aria-modal=false, focus trap quando aberto, ESC fecha,
 * clique fora fecha, hover/focus-visible respeitando tokens de tema.
 *
 * Sprint UI-H — parte 1/2 (par com ContinueFloatingButton).
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ListChecks, Check } from 'lucide-react';
import { COURSE_ORDER } from '@/data/courseOrder';
import { useBadges } from '@/context/BadgeContext';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { cn } from '@/lib/utils';

export const ProgressDropdown: React.FC = () => {
  const { visitedPages } = useBadges();
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, () => setIsOpen(false));
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  /* Derivação memoizada dos 21 módulos com status. */
  const { modules, completed, currentIdx } = useMemo(() => {
    const list = COURSE_ORDER.map((m, idx) => {
      const slug = m.path.slice(1);
      const visited = visitedPages.has(m.path) || visitedPages.has(slug);
      return { ...m, idx, visited };
    });
    const done = list.filter(m => m.visited).length;
    const curr = list.findIndex(m => !m.visited);
    return { modules: list, completed: done, currentIdx: curr };
  }, [visitedPages]);

  const total = COURSE_ORDER.length;
  const percent = Math.round((completed / total) * 100);

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
        initial: { opacity: 0, y: -8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit:    { opacity: 0, y: -8, scale: 0.98 },
        transition: { duration: 0.16, ease: 'easeOut' as const },
      };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        aria-controls="progress-panel"
        aria-haspopup="menu"
        aria-label={`Seu progresso: ${completed} de ${total} módulos concluídos`}
        className="p-2 rounded-md bg-bg-3 border border-border text-text-2 hover:border-accent hover:text-text transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center gap-2"
        title="Seu progresso no curso"
      >
        <ListChecks size={18} aria-hidden="true" />
        <span className="hidden sm:inline text-xs font-mono tabular-nums">
          {completed}/{total}
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
            {/* Header com barra de progresso */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h2 id="progress-title" className="text-sm font-bold text-text">
                  Seu Progresso
                </h2>
                <span className="text-xs font-mono text-text-2 tabular-nums">
                  {completed}/{total} · {percent}%
                </span>
              </div>
              <div className="h-2 bg-bg-3 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}>
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Lista de módulos */}
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {modules.map(m => {
                const isCurrent = m.idx === currentIdx;
                const stateLabel = m.visited
                  ? 'Concluído'
                  : isCurrent
                    ? 'Módulo atual'
                    : 'Pendente';
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
