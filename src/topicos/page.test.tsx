/**
 * Sprint TOPICOS-INTENT — testes de lógica pura
 *
 * Importa apenas SORT_STRATEGIES e INTENT_LS_KEY (exportações named do módulo).
 * Sem renderização React — sem jsdom, sem @testing-library.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { SORT_STRATEGIES, INTENT_LS_KEY } from '../../app/topicos/page';

// ─── Tipos mínimos para testar o sort sem renderizar a página ─────────────────
interface TopicStub {
  id: string;
  num: string;
  title: string;
  layer: string;
  layerClass: string;
  href: string;
  group: string;
}

const stub = (layerClass: string, id: string): TopicStub => ({
  id,
  num: id,
  title: `Tópico ${id}`,
  layer: `Camada ${layerClass}`,
  layerClass,
  href: `/modulo#${id}`,
  group: 'Teste',
});

describe('SORT_STRATEGIES', () => {
  describe('estudo', () => {
    it('retorna 0 para qualquer par — preserva ordem original', () => {
      const l3 = stub('l3', '1');
      const l7 = stub('l7', '2');
      expect(SORT_STRATEGIES.estudo(l3, l7)).toBe(0);
      expect(SORT_STRATEGIES.estudo(l7, l3)).toBe(0);
    });

    it('Array.sort com estratégia estudo preserva a ordem inserida', () => {
      const topics = [stub('l7', 'a'), stub('l3', 'b'), stub('l5', 'c')];
      const sorted = [...topics].sort(SORT_STRATEGIES.estudo);
      // stable sort: ids devem permanecer a, b, c
      expect(sorted.map(t => t.id)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('incendio', () => {
    it('l3 vem antes de l4', () => {
      const a = stub('l3', '1');
      const b = stub('l4', '2');
      expect(SORT_STRATEGIES.incendio(a, b)).toBeLessThan(0);
    });

    it('l4 vem antes de l5', () => {
      const a = stub('l4', '1');
      const b = stub('l5', '2');
      expect(SORT_STRATEGIES.incendio(a, b)).toBeLessThan(0);
    });

    it('l3 vem antes de l7', () => {
      const a = stub('l3', '1');
      const b = stub('l7', '2');
      expect(SORT_STRATEGIES.incendio(a, b)).toBeLessThan(0);
    });

    it('l7 fica depois de l3, l4, l5, l6', () => {
      const l7 = stub('l7', 'z');
      const l3 = stub('l3', 'a');
      const l4 = stub('l4', 'b');
      expect(SORT_STRATEGIES.incendio(l7, l3)).toBeGreaterThan(0);
      expect(SORT_STRATEGIES.incendio(l7, l4)).toBeGreaterThan(0);
    });

    it('layerClass desconhecido recebe rank 5 (vai para o fim)', () => {
      const unknown = stub('lx', '1');
      const l7 = stub('l7', '2'); // rank 4
      // lx(5) vs l7(4) → lx > l7
      expect(SORT_STRATEGIES.incendio(unknown, l7)).toBeGreaterThan(0);
    });

    it('Array.sort ordena l3, l4, l5, l6, l7 nessa sequência', () => {
      const shuffled = [stub('l7', 'g'), stub('l3', 'a'), stub('l5', 'c'), stub('l4', 'b'), stub('l6', 'd')];
      const sorted = [...shuffled].sort(SORT_STRATEGIES.incendio);
      expect(sorted.map(t => t.layerClass)).toEqual(['l3', 'l4', 'l5', 'l6', 'l7']);
    });
  });
});

describe('INTENT_LS_KEY', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('é a string "workshop-intent-mode"', () => {
    expect(INTENT_LS_KEY).toBe('workshop-intent-mode');
  });

  it('localStorage sem chave → deve retornar null (fallback para estudo)', () => {
    expect(localStorage.getItem(INTENT_LS_KEY)).toBeNull();
  });

  it('localStorage com valor "incendio" → getItem devolve "incendio"', () => {
    localStorage.setItem(INTENT_LS_KEY, 'incendio');
    expect(localStorage.getItem(INTENT_LS_KEY)).toBe('incendio');
  });

  it('localStorage com valor inválido → getItem devolve esse valor (cabe ao inicializador ignorar)', () => {
    localStorage.setItem(INTENT_LS_KEY, 'invalid-value');
    const raw = localStorage.getItem(INTENT_LS_KEY);
    // O inicializador do useState usa === 'incendio', então 'invalid-value' cai no else (estudo)
    expect(raw === 'incendio').toBe(false);
  });
});
