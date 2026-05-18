/**
 * Testes da Jornada Unificada (Sprint JORNADA). Lógica pura.
 */
import { describe, it, expect } from 'vitest';
import {
  JOURNEY,
  JOURNEY_TOTAL_MINUTES,
  getNextJourneyModule,
  getJourneyProgress,
} from './journey';
import { FUNDAMENTOS_ORDER, COURSE_ORDER, ADVANCED_ORDER } from './courseOrder';

describe('JOURNEY', () => {
  it('tem exatamente 68 módulos (17 + 25 + 26)', () => {
    expect(JOURNEY).toHaveLength(68);
  });

  it('todos os paths são únicos', () => {
    const paths = JOURNEY.map((m) => m.path);
    expect(new Set(paths).size).toBe(68);
  });

  it('ordem das fases: Fundamentos (0–16), Firewall (17–41), Avançados (42–67)', () => {
    JOURNEY.slice(0, 17).forEach((m) => expect(m.trail).toBe('fundamentos'));
    JOURNEY.slice(17, 42).forEach((m) => expect(m.trail).toBe('firewall'));
    JOURNEY.slice(42).forEach((m) => expect(m.trail).toBe('avancados'));
  });

  it('começa em /fhs e termina em /resposta-incidentes', () => {
    expect(JOURNEY[0].path).toBe('/fhs');
    expect(JOURNEY[JOURNEY.length - 1].path).toBe('/resposta-incidentes');
  });

  it('todo módulo tem estMin > 0 e dificuldade válida', () => {
    JOURNEY.forEach((m) => {
      expect(m.estMin, m.path).toBeGreaterThan(0);
      expect(['iniciante', 'intermediario', 'avancado']).toContain(m.difficulty);
    });
  });

  it('invariante dificuldade-por-trilha', () => {
    const expected = { fundamentos: 'iniciante', firewall: 'intermediario', avancados: 'avancado' };
    JOURNEY.forEach((m) => expect(m.difficulty, m.path).toBe(expected[m.trail]));
  });

  it('todo path dos 3 arrays de ordem existe em JOURNEY', () => {
    const journeyPaths = new Set(JOURNEY.map((m) => m.path));
    [...FUNDAMENTOS_ORDER, ...COURSE_ORDER, ...ADVANCED_ORDER].forEach((m) => {
      expect(journeyPaths.has(m.path), m.path).toBe(true);
    });
  });

  it('JOURNEY_TOTAL_MINUTES é a soma dos estMin', () => {
    expect(JOURNEY_TOTAL_MINUTES).toBe(JOURNEY.reduce((s, m) => s + m.estMin, 0));
    expect(JOURNEY_TOTAL_MINUTES).toBeGreaterThan(0);
  });
});

describe('getNextJourneyModule', () => {
  it('progresso vazio → primeiro módulo (/fhs)', () => {
    expect(getNextJourneyModule([])?.path).toBe('/fhs');
  });

  it('parcial → primeiro módulo incompleto', () => {
    const next = getNextJourneyModule(['/fhs', 'fhs', '/comandos']);
    expect(next?.path).toBe('/editores');
  });

  it('aceita slug e path indistintamente', () => {
    expect(getNextJourneyModule(['fhs'])?.path).toBe('/comandos');
  });

  it('checkpoint marcado conta como concluído', () => {
    const next = getNextJourneyModule([], { 'fhs-explorado': true });
    expect(next?.path).toBe('/comandos');
  });

  it('tudo visitado → null', () => {
    const all = JOURNEY.map((m) => m.path);
    expect(getNextJourneyModule(all)).toBeNull();
  });
});

describe('getJourneyProgress', () => {
  it('progresso vazio → 0/68 (0%)', () => {
    expect(getJourneyProgress([])).toEqual({ completed: 0, total: 68, percent: 0 });
  });

  it('tudo concluído → 68/68 (100%)', () => {
    const all = JOURNEY.map((m) => m.path);
    expect(getJourneyProgress(all)).toEqual({ completed: 68, total: 68, percent: 100 });
  });

  it('conta visitas e arredonda o percentual', () => {
    const r = getJourneyProgress(JOURNEY.slice(0, 34).map((m) => m.path));
    expect(r.completed).toBe(34);
    expect(r.percent).toBe(50); // 34/68 = 50%
  });
});
