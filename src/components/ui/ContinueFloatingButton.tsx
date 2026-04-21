'use client';

/*
 * ContinueFloatingButton — botão flutuante "Continuar" (bottom-right).
 *
 * Leva o usuário ao próximo módulo não-visitado da sequência COURSE_ORDER.
 * Aparece em qualquer página de módulo exceto:
 *   - página inicial (/)
 *   - dashboard (/dashboard) — redundante, já há mapa visual
 *   - quando o usuário já está no próximo módulo
 *   - quando todos os 21 módulos foram visitados
 *
 * Quando restar apenas 1 módulo (20/21), ganha ícone 🔥 Flame e pulse suave
 * para incentivar o desbloqueio do badge course-master.
 *
 * Sprint UI-H — parte 2/2 (par com ProgressDropdown).
 */

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Flame } from 'lucide-react';
import { COURSE_ORDER } from '@/data/courseOrder';
import { useBadges } from '@/context/BadgeContext';

export const ContinueFloatingButton: React.FC = () => {
  const { visitedPages } = useBadges();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const { nextModule, completed } = useMemo(() => {
    const total = COURSE_ORDER.length;
    const next = COURSE_ORDER.find(m => {
      const slug = m.path.slice(1);
      return !visitedPages.has(m.path) && !visitedPages.has(slug);
    }) ?? null;
    const remaining = COURSE_ORDER.filter(m => {
      const slug = m.path.slice(1);
      return !visitedPages.has(m.path) && !visitedPages.has(slug);
    }).length;
    return { nextModule: next, completed: total - remaining };
  }, [visitedPages]);

  /* Guards de visibilidade. */
  if (!nextModule) return null;
  if (pathname === nextModule.path) return null;
  if (pathname === '/' || pathname === '/dashboard') return null;

  const total = COURSE_ORDER.length;
  const almostDone = completed === total - 1; // 20/21

  const iconNode = almostDone
    ? <Flame size={18} aria-hidden="true" />
    : <ArrowRight size={18} aria-hidden="true" />;

  const pulseProps = almostDone && !prefersReducedMotion
    ? {
        animate: { scale: [1, 1.08, 1] },
        transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const },
      }
    : {};

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div {...pulseProps}>
        <Link
          href={nextModule.path}
          aria-label={`Continuar para ${nextModule.title} (próximo módulo, ${completed + 1} de ${total})`}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 font-medium text-sm"
        >
          {iconNode}
          <span className="hidden sm:inline">
            Continuar: <strong>{nextModule.title}</strong>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
};
