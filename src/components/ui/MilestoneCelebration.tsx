'use client';

/*
 * MilestoneCelebration — modal de celebração para badges de milestone.
 *
 * Renderizado dentro do BadgeProvider quando `milestoneBadge !== null`.
 * Para badges course-master e quiz-master: dispara canvas-confetti (lazy).
 * Para demais milestones (linux-ninja, sigma-master, certificado): celebração visual sem confetti.
 *
 * A11y: role=dialog, aria-modal=true, useFocusTrap, ESC fecha.
 * Motion: respeita prefers-reduced-motion.
 *
 * Sprint CE — Celebração & Engajamento.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { BADGE_DEFS, BadgeId } from '@/context/BadgeContext';
import { useFocusTrap } from '@/lib/useFocusTrap';

interface Props {
  badgeId: BadgeId;
  onClose: () => void;
}

const CTA: Record<string, { label: string; href: string }> = {
  'course-master': { label: '🎓 Ver meu certificado',   href: '/certificado' },
  'quiz-master':   { label: '📊 Ver meu progresso',     href: '/dashboard' },
  'linux-ninja':   { label: '🏆 Ver minhas conquistas', href: '/dashboard#badges' },
  'sigma-master':  { label: '📊 Ver meu progresso',     href: '/dashboard' },
  'certificado':   { label: '📊 Ver painel completo',   href: '/dashboard' },
};

const CONFETTI_BADGES = new Set<BadgeId>(['course-master', 'quiz-master']);

export const MilestoneCelebration: React.FC<Props> = ({ badgeId, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useFocusTrap<HTMLDivElement>(true, onClose);
  const badge = BADGE_DEFS[badgeId];
  const cta = CTA[badgeId] ?? { label: '📊 Ver progresso', href: '/dashboard' };

  /* Confetti — lazy, não entra no bundle inicial */
  useEffect(() => {
    if (prefersReducedMotion || !CONFETTI_BADGES.has(badgeId)) return;
    let cancelled = false;
    const run = async () => {
      const { default: confetti } = await import('canvas-confetti');
      if (cancelled) return;
      const colors = ['#e05a2b', '#f97316', '#22c55e', '#3b82f6', '#fbbf24', '#a855f7'];
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 }, colors });
      setTimeout(() => {
        if (!cancelled) confetti({ particleCount: 80, spread: 130, origin: { y: 0.4 }, colors });
      }, 400);
    };
    run();
    return () => { cancelled = true; };
  }, [badgeId, prefersReducedMotion]);

  const overlayMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };

  const cardMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, scale: 0.88, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.92, y: 10 }, transition: { duration: 0.28, ease: 'easeOut' as const } };

  return (
    <AnimatePresence>
      <motion.div
        {...overlayMotion}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          {...cardMotion}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="milestone-title"
          aria-describedby="milestone-desc"
          onClick={e => e.stopPropagation()}
          className="relative max-w-sm w-full bg-bg-2 border border-accent/30 rounded-2xl shadow-2xl p-8 text-center"
        >
          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md text-text-3 hover:text-text hover:bg-bg-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Fechar celebração"
          >
            <X size={16} />
          </button>

          {/* Brilho decorativo */}
          <div className="absolute inset-0 rounded-2xl bg-accent/5 pointer-events-none" />

          {/* Emoji do badge */}
          <motion.div
            animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="text-6xl mb-4 select-none"
            aria-hidden="true"
          >
            {badge.icon}
          </motion.div>

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-2">
            Badge Desbloqueado!
          </p>

          {/* Título */}
          <h2 id="milestone-title" className="text-2xl font-black mb-3 text-text">
            {badge.title}
          </h2>

          {/* Descrição */}
          <p id="milestone-desc" className="text-sm text-text-2 leading-relaxed mb-8">
            {badge.desc}
          </p>

          {/* CTA */}
          <Link
            href={cta.href}
            onClick={onClose}
            className="btn-primary w-full justify-center py-3"
          >
            {cta.label}
          </Link>

          {/* Barra de auto-close visual (5s, CSS animation) */}
          <div className="mt-4 h-0.5 bg-bg-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/40"
              style={{
                animation: prefersReducedMotion ? 'none' : 'milestone-close 5s linear forwards',
                width: prefersReducedMotion ? '0%' : '100%',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
