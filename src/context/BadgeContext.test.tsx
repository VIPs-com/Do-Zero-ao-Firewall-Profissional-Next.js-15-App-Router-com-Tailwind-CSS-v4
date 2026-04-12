import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import {
  BadgeProvider,
  useBadges,
  CONTENT_PAGES_COUNT,
  ALL_CHECKLIST_IDS,
  type BadgeId,
} from './BadgeContext';

/*
 * Sprint T₀ — rede de segurança do BadgeContext.
 *
 * Esses testes existem PRINCIPALMENTE para proteger o Sprint I (WireGuard +
 * Fail2ban), que vai mudar CONTENT_PAGES_COUNT de 16 → 17 → 18. Qualquer
 * off-by-one no refactor quebra o teste #2 imediatamente.
 *
 * O resto cobre os gatilhos de badge mais críticos para garantir que a
 * lógica de unlock não regrida em refactors futuros.
 */

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BadgeProvider>{children}</BadgeProvider>
);

describe('BadgeContext', () => {
  it('unlockBadge adiciona ao Set e persiste no localStorage', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      result.current.unlockBadge('certificado');
    });

    expect(result.current.unlockedBadges.has('certificado')).toBe(true);
    const persisted = JSON.parse(localStorage.getItem('workshop-badges') || '[]');
    expect(persisted).toContain('certificado');
  });

  it('trackPageVisit × CONTENT_PAGES_COUNT desbloqueia deep-diver', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      for (let i = 0; i < CONTENT_PAGES_COUNT; i++) {
        result.current.trackPageVisit(`/rota-${i}`);
      }
    });

    expect(result.current.unlockedBadges.has('deep-diver')).toBe(true);
    // explorer também — 5 <= CONTENT_PAGES_COUNT
    expect(result.current.unlockedBadges.has('explorer')).toBe(true);
  });

  it('trackPageVisit × 5 desbloqueia explorer mas NÃO deep-diver', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.trackPageVisit(`/rota-${i}`);
      }
    });

    expect(result.current.unlockedBadges.has('explorer')).toBe(true);
    expect(result.current.unlockedBadges.has('deep-diver')).toBe(false);
  });

  it('state hidrata do localStorage no mount', () => {
    const seededBadges: BadgeId[] = ['quiz-expert', 'explorer'];
    localStorage.setItem('workshop-badges', JSON.stringify(seededBadges));
    localStorage.setItem(
      'workshop-visited-pages',
      JSON.stringify(['/a', '/b', '/c']),
    );
    localStorage.setItem('workshop-topo-clicks', '3');
    localStorage.setItem('workshop-quiz-score', '85');

    const { result } = renderHook(() => useBadges(), { wrapper });

    expect(result.current.unlockedBadges.has('quiz-expert')).toBe(true);
    expect(result.current.unlockedBadges.has('explorer')).toBe(true);
    expect(result.current.visitedPages.size).toBe(3);
    expect(result.current.topologyClicks).toBe(3);
    expect(result.current.quizScore).toBe(85);
  });

  it('localStorage corrompido é descartado sem quebrar a árvore', () => {
    localStorage.setItem('workshop-badges', '{not-json');
    localStorage.setItem('workshop-visited-pages', 'garbage');
    localStorage.setItem('workshop-checklist-v2', '[]'); // array onde deveria ser object

    const { result } = renderHook(() => useBadges(), { wrapper });

    expect(result.current.unlockedBadges.size).toBe(0);
    expect(result.current.visitedPages.size).toBe(0);
    expect(result.current.checklist).toEqual({});
  });

  it('trackTopologyClick × 5 desbloqueia topology-pro', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.trackTopologyClick();
      }
    });

    expect(result.current.topologyClicks).toBe(5);
    expect(result.current.unlockedBadges.has('topology-pro')).toBe(true);
  });

  it('trackRiskClick × 3 desbloqueia defensor-topologia', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      result.current.trackRiskClick('risk-1');
      result.current.trackRiskClick('risk-2');
      result.current.trackRiskClick('risk-3');
    });

    expect(result.current.clickedRisks.size).toBe(3);
    expect(result.current.unlockedBadges.has('defensor-topologia')).toBe(true);
  });

  it('updateQuizScore(100) desbloqueia as 3 badges de quiz', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      result.current.updateQuizScore(100);
    });

    expect(result.current.unlockedBadges.has('quiz-beginner')).toBe(true);
    expect(result.current.unlockedBadges.has('quiz-expert')).toBe(true);
    expect(result.current.unlockedBadges.has('quiz-master')).toBe(true);
  });

  it('updateChecklist com dns-interno + dns-reverso desbloqueia dns-master', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      result.current.updateChecklist('dns-interno', true);
      result.current.updateChecklist('dns-reverso', true);
    });

    expect(result.current.unlockedBadges.has('dns-master')).toBe(true);
    const persisted = JSON.parse(
      localStorage.getItem('workshop-checklist-v2') || '{}',
    );
    expect(persisted['dns-interno']).toBe(true);
    expect(persisted['dns-reverso']).toBe(true);
  });

  it('checklistPercentage reflete progresso parcial', () => {
    const { result } = renderHook(() => useBadges(), { wrapper });

    act(() => {
      result.current.updateChecklist('ping-internet', true);
      result.current.updateChecklist('dns-resolve', true);
    });

    // 2 de ALL_CHECKLIST_IDS.length checkpoints (sobe conforme novas rotas são adicionadas)
    expect(result.current.checklistPercentage).toBe(Math.round((2 / ALL_CHECKLIST_IDS.length) * 100));
  });
});
