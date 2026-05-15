/**
 * Testes unitários do useTabFilter (Sprint HOOK).
 * Usa renderHook do @testing-library/react — zero renderização de componentes.
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabFilter } from './useTabFilter';

// ── Tipo representativo (3 abas, igual ao padrão UX-TABS) ────────────────────
type DemoTab = 'conceito' | 'config' | 'referencia';

describe('useTabFilter', () => {

  // ── Estado inicial ──────────────────────────────────────────────────────────
  it('retorna a aba inicial corretamente', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    expect(result.current.activeTab).toBe('conceito');
  });

  it('funciona com qualquer string como initial', () => {
    const { result } = renderHook(() => useTabFilter('firewall'));
    expect(result.current.activeTab).toBe('firewall');
  });

  // ── isActive ────────────────────────────────────────────────────────────────
  it('isActive retorna true para a aba ativa', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    expect(result.current.isActive('conceito')).toBe(true);
  });

  it('isActive retorna false para abas inativas', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    expect(result.current.isActive('config')).toBe(false);
    expect(result.current.isActive('referencia')).toBe(false);
  });

  // ── setActiveTab ────────────────────────────────────────────────────────────
  it('setActiveTab muda a aba ativa', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    act(() => { result.current.setActiveTab('config'); });
    expect(result.current.activeTab).toBe('config');
  });

  it('setActiveTab atualiza isActive corretamente após troca', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    act(() => { result.current.setActiveTab('referencia'); });
    expect(result.current.isActive('referencia')).toBe(true);
    expect(result.current.isActive('conceito')).toBe(false);
  });

  it('setActiveTab para mesma aba não causa erro', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    act(() => { result.current.setActiveTab('conceito'); });
    expect(result.current.activeTab).toBe('conceito');
  });

  // ── tabButtonProps ──────────────────────────────────────────────────────────
  it('tabButtonProps tem role="tab"', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    expect(result.current.tabButtonProps('conceito').role).toBe('tab');
    expect(result.current.tabButtonProps('config').role).toBe('tab');
  });

  it('tabButtonProps aria-selected=true para aba ativa', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    expect(result.current.tabButtonProps('conceito')['aria-selected']).toBe(true);
  });

  it('tabButtonProps aria-selected=false para abas inativas', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    expect(result.current.tabButtonProps('config')['aria-selected']).toBe(false);
    expect(result.current.tabButtonProps('referencia')['aria-selected']).toBe(false);
  });

  it('tabButtonProps onClick muda a aba ativa', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    act(() => { result.current.tabButtonProps('config').onClick(); });
    expect(result.current.activeTab).toBe('config');
    expect(result.current.isActive('config')).toBe(true);
  });

  it('tabButtonProps aria-selected se atualiza após troca de aba', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    act(() => { result.current.setActiveTab('config'); });
    expect(result.current.tabButtonProps('config')['aria-selected']).toBe(true);
    expect(result.current.tabButtonProps('conceito')['aria-selected']).toBe(false);
  });

  // ── Referências estáveis ────────────────────────────────────────────────────
  it('setActiveTab tem referência estável entre renders', () => {
    const { result, rerender } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    const ref1 = result.current.setActiveTab;
    rerender();
    expect(result.current.setActiveTab).toBe(ref1);
  });

  // ── Sequência completa de navegação ────────────────────────────────────────
  it('navega pelas 3 abas em sequência corretamente', () => {
    const { result } = renderHook(() => useTabFilter<DemoTab>('conceito'));
    const tabs: DemoTab[] = ['conceito', 'config', 'referencia'];
    for (const tab of tabs) {
      act(() => { result.current.setActiveTab(tab); });
      expect(result.current.activeTab).toBe(tab);
      expect(result.current.isActive(tab)).toBe(true);
      // Outros devem ser false
      tabs.filter(t => t !== tab).forEach(other => {
        expect(result.current.isActive(other)).toBe(false);
      });
    }
  });
});
