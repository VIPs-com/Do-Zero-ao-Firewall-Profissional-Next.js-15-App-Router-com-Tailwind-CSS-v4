/**
 * src/lib/srs.test.ts — Testes do motor SM-2 Lite
 *
 * Testa apenas lógica pura — sem renderização React, sem @testing-library.
 * Importa diretamente de srs.ts para validar o algoritmo isoladamente.
 * Casos obrigatórios levantados pela QA Lead (Carla Nunes) na Mesa Redonda.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateNextReview,
  getDueItems,
  getTotalDue,
  getSRSData,
  saveSRSData,
  seedItem,
  applyReview,
  type SRSItem,
  type SRSStore,
} from './srs';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const NOW = 1_700_000_000_000; // timestamp fixo para reproducibilidade

const baseItem = (overrides: Partial<SRSItem> = {}): SRSItem => ({
  questionIdx: 0,
  interval: 1,
  easeFactor: 2.5,
  repetitions: 0,
  nextReview: NOW,
  lastReview: NOW,
  lastScore: 3,
  ...overrides,
});

const emptyStore = (): SRSStore => ({
  version: 1,
  items: {},
  updatedAt: NOW,
});

// ─── calculateNextReview ──────────────────────────────────────────────────────

describe('calculateNextReview', () => {
  describe('score 1-2 (esqueceu)', () => {
    it('score 1 — reseta repetitions para 0', () => {
      const item   = baseItem({ repetitions: 3, interval: 15 });
      const result = calculateNextReview(item, 1, NOW);
      expect(result.repetitions).toBe(0);
    });

    it('score 1 — reseta interval para 1', () => {
      const item   = baseItem({ repetitions: 3, interval: 15 });
      const result = calculateNextReview(item, 1, NOW);
      expect(result.interval).toBe(1);
    });

    it('score 2 — reseta repetitions para 0', () => {
      const item   = baseItem({ repetitions: 5, interval: 30 });
      const result = calculateNextReview(item, 2, NOW);
      expect(result.repetitions).toBe(0);
    });

    it('score 2 — reseta interval para 1', () => {
      const item   = baseItem({ repetitions: 5, interval: 30 });
      const result = calculateNextReview(item, 2, NOW);
      expect(result.interval).toBe(1);
    });

    it('score 1 — penaliza easeFactor (max 1.3)', () => {
      const item   = baseItem({ easeFactor: 2.5 });
      const result = calculateNextReview(item, 1, NOW);
      expect(result.easeFactor).toBeCloseTo(2.3, 5);
    });

    it('easeFactor NUNCA cai abaixo de 1.3 (invariante crítico)', () => {
      // Aplica score 1 repetidamente para tentar forçar abaixo de 1.3
      let item = baseItem({ easeFactor: 1.3 });
      for (let i = 0; i < 20; i++) {
        item = calculateNextReview(item, 1, NOW);
        expect(item.easeFactor).toBeGreaterThanOrEqual(1.3);
      }
    });
  });

  describe('score 3-5 (lembrou)', () => {
    it('score 3 — primeira repetição: interval = 1', () => {
      const item   = baseItem({ repetitions: 0, interval: 1 });
      const result = calculateNextReview(item, 3, NOW);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    it('score 5 — segunda repetição: interval = 6', () => {
      const item   = baseItem({ repetitions: 1, interval: 1 });
      const result = calculateNextReview(item, 5, NOW);
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('score 5 — terceira repetição: interval = round(6 * easeFactor)', () => {
      const item   = baseItem({ repetitions: 2, interval: 6, easeFactor: 2.5 });
      const result = calculateNextReview(item, 5, NOW);
      expect(result.interval).toBe(Math.round(6 * 2.5)); // 15
      expect(result.repetitions).toBe(3);
    });

    it('score 5 — easeFactor cresce (não ultrapassa razoavelmente)', () => {
      const item   = baseItem({ easeFactor: 2.5 });
      const result = calculateNextReview(item, 5, NOW);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('score 3 — easeFactor permanece igual (sem penalidade, sem bônus)', () => {
      const item   = baseItem({ easeFactor: 2.5 });
      const result = calculateNextReview(item, 3, NOW);
      // score 3: delta = 0.1 - (5-3)*(0.08+(5-3)*0.02) = 0.1 - 2*0.12 = -0.14
      // ef = max(1.3, 2.5 - 0.14) = max(1.3, 2.36) = 2.36
      expect(result.easeFactor).toBeCloseTo(2.36, 5);
    });

    it('score 4 — easeFactor levemente reduzido', () => {
      const item   = baseItem({ easeFactor: 2.5 });
      const result = calculateNextReview(item, 4, NOW);
      // delta = 0.1 - 1*0.1 = 0.0 → ef = 2.5
      expect(result.easeFactor).toBeCloseTo(2.5, 5);
    });
  });

  describe('campos timestamp', () => {
    it('nextReview = now + interval * 86_400_000', () => {
      const item   = baseItem({ repetitions: 0 });
      const result = calculateNextReview(item, 5, NOW);
      expect(result.nextReview).toBe(NOW + result.interval * 86_400_000);
    });

    it('lastReview é atualizado para now', () => {
      const item   = baseItem({ lastReview: 0 });
      const result = calculateNextReview(item, 5, NOW);
      expect(result.lastReview).toBe(NOW);
    });

    it('lastScore é gravado corretamente', () => {
      const item   = baseItem();
      const result = calculateNextReview(item, 4, NOW);
      expect(result.lastScore).toBe(4);
    });

    it('não muta o item original', () => {
      const item   = baseItem({ repetitions: 2, interval: 6 });
      const before = { ...item };
      calculateNextReview(item, 5, NOW);
      expect(item.repetitions).toBe(before.repetitions);
      expect(item.interval).toBe(before.interval);
    });
  });
});

// ─── getDueItems ──────────────────────────────────────────────────────────────

describe('getDueItems', () => {
  it('retorna [] quando store vazio', () => {
    expect(getDueItems(emptyStore(), NOW, 254)).toHaveLength(0);
  });

  it('retorna apenas items com nextReview <= now', () => {
    const store: SRSStore = {
      ...emptyStore(),
      items: {
        0: baseItem({ questionIdx: 0, nextReview: NOW - 1000 }),  // vencido
        1: baseItem({ questionIdx: 1, nextReview: NOW + 1000 }),  // futuro
      },
    };
    const due = getDueItems(store, NOW, 254);
    expect(due).toHaveLength(1);
    expect(due[0].questionIdx).toBe(0);
  });

  it('ordena por nextReview ASC (mais atrasado primeiro)', () => {
    const store: SRSStore = {
      ...emptyStore(),
      items: {
        0: baseItem({ questionIdx: 0, nextReview: NOW - 2000 }),  // mais atrasado
        1: baseItem({ questionIdx: 1, nextReview: NOW - 500 }),   // menos atrasado
        2: baseItem({ questionIdx: 2, nextReview: NOW - 1000 }),  // meio
      },
    };
    const due = getDueItems(store, NOW, 254);
    expect(due.map(i => i.questionIdx)).toEqual([0, 2, 1]);
  });

  it('filtra indexes >= totalQuestions', () => {
    const store: SRSStore = {
      ...emptyStore(),
      items: {
        999: baseItem({ questionIdx: 999, nextReview: NOW - 1000 }),  // fora do range
        0:   baseItem({ questionIdx: 0,   nextReview: NOW - 1000 }),  // válido
      },
    };
    const due = getDueItems(store, NOW, 5);  // apenas 5 questões
    expect(due).toHaveLength(1);
    expect(due[0].questionIdx).toBe(0);
  });
});

describe('getTotalDue', () => {
  it('retorna 0 para store vazio', () => {
    expect(getTotalDue(emptyStore(), NOW, 254)).toBe(0);
  });

  it('conta corretamente items vencidos', () => {
    const store: SRSStore = {
      ...emptyStore(),
      items: {
        0: baseItem({ questionIdx: 0, nextReview: NOW - 1 }),
        1: baseItem({ questionIdx: 1, nextReview: NOW - 1 }),
        2: baseItem({ questionIdx: 2, nextReview: NOW + 9999 }),
      },
    };
    expect(getTotalDue(store, NOW, 254)).toBe(2);
  });
});

// ─── seedItem ─────────────────────────────────────────────────────────────────

describe('seedItem', () => {
  it('cria item com interval=1, easeFactor=2.5, nextReview=now+86400000', () => {
    const store  = emptyStore();
    const result = seedItem(store, 42, NOW);
    const item   = result.items[42];
    expect(item).toBeDefined();
    expect(item.interval).toBe(1);
    expect(item.easeFactor).toBe(2.5);
    expect(item.nextReview).toBe(NOW + 86_400_000);
  });

  it('lastScore = 2 como baseline de seed', () => {
    const result = seedItem(emptyStore(), 0, NOW);
    expect(result.items[0].lastScore).toBe(2);
  });

  it('NÃO sobrescreve item existente', () => {
    const existingItem = baseItem({ questionIdx: 0, easeFactor: 1.5, interval: 10 });
    const store: SRSStore = { ...emptyStore(), items: { 0: existingItem } };
    const result = seedItem(store, 0, NOW);
    expect(result.items[0].easeFactor).toBe(1.5);  // preservado
    expect(result.items[0].interval).toBe(10);     // preservado
  });

  it('retorna novo store sem mutar o original', () => {
    const store  = emptyStore();
    const result = seedItem(store, 5, NOW);
    expect(store.items[5]).toBeUndefined();    // original intacto
    expect(result.items[5]).toBeDefined();     // novo store tem o item
  });
});

// ─── getSRSData / saveSRSData ─────────────────────────────────────────────────

describe('getSRSData', () => {
  beforeEach(() => localStorage.clear());

  it('retorna emptyStore se localStorage vazio', () => {
    const store = getSRSData();
    expect(store.version).toBe(1);
    expect(store.items).toEqual({});
  });

  it('retorna emptyStore se JSON corrompido', () => {
    localStorage.setItem('workshop-srs-v1', 'INVALID_JSON{{{');
    const store = getSRSData();
    expect(store.version).toBe(1);
    expect(store.items).toEqual({});
  });

  it('retorna emptyStore se version !== 1', () => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify({ version: 2, items: {} }));
    const store = getSRSData();
    expect(store.version).toBe(1);
    expect(store.items).toEqual({});
  });

  it('retorna emptyStore se items não é object', () => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify({ version: 1, items: [] }));
    const store = getSRSData();
    expect(store.items).toEqual({});
  });

  it('round-trip: saveSRSData → getSRSData preserva todos os campos', () => {
    const original: SRSStore = {
      version: 1,
      updatedAt: NOW,
      items: {
        7: baseItem({ questionIdx: 7, interval: 14, easeFactor: 1.8, repetitions: 3 }),
      },
    };
    saveSRSData(original);
    const loaded = getSRSData();
    expect(loaded.items[7].interval).toBe(14);
    expect(loaded.items[7].easeFactor).toBe(1.8);
    expect(loaded.items[7].repetitions).toBe(3);
  });
});

// ─── applyReview ──────────────────────────────────────────────────────────────

describe('applyReview', () => {
  beforeEach(() => localStorage.clear());

  it('atualiza o item e persiste no localStorage', () => {
    const store = seedItem(emptyStore(), 0, NOW);
    const after = applyReview(store, 0, 5);
    expect(after.items[0].repetitions).toBe(1);

    const persisted = getSRSData();
    expect(persisted.items[0].repetitions).toBe(1);
  });

  it('retorna store inalterado se questionIdx não existe', () => {
    const store  = emptyStore();
    const result = applyReview(store, 999, 5);
    expect(result).toEqual(store);
  });
});
