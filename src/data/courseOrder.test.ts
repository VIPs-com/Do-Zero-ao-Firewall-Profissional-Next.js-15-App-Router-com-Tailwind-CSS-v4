import { describe, it, expect } from 'vitest';
import { COURSE_ORDER, FUNDAMENTOS_ORDER } from './courseOrder';

describe('courseOrder — integridade da sequência de módulos', () => {

  it('tem exatamente 23 módulos', () => {
    expect(COURSE_ORDER).toHaveLength(23);
  });

  it('não há paths duplicados', () => {
    const paths = COURSE_ORDER.map(m => m.path);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });

  it('primeiro módulo tem prev=null e último tem next=null', () => {
    expect(COURSE_ORDER[0].prev).toBeNull();
    expect(COURSE_ORDER[COURSE_ORDER.length - 1].next).toBeNull();
  });

  it('começa em /instalacao e termina em /certificado', () => {
    expect(COURSE_ORDER[0].path).toBe('/instalacao');
    expect(COURSE_ORDER[COURSE_ORDER.length - 1].path).toBe('/certificado');
  });

  it('todos os valores prev (não-null) apontam para paths existentes', () => {
    const paths = new Set(COURSE_ORDER.map(m => m.path));
    COURSE_ORDER.forEach(m => {
      if (m.prev !== null) {
        expect(
          paths.has(m.prev),
          `prev="${m.prev}" em "${m.path}" não existe na sequência`,
        ).toBe(true);
      }
    });
  });

  it('todos os valores next (não-null) apontam para paths existentes', () => {
    const paths = new Set(COURSE_ORDER.map(m => m.path));
    COURSE_ORDER.forEach(m => {
      if (m.next !== null) {
        expect(
          paths.has(m.next),
          `next="${m.next}" em "${m.path}" não existe na sequência`,
        ).toBe(true);
      }
    });
  });

  it('bidirecionalidade: se A.next=B então B.prev=A', () => {
    const byPath = Object.fromEntries(COURSE_ORDER.map(m => [m.path, m]));
    COURSE_ORDER.forEach(m => {
      if (m.next) {
        const nextModule = byPath[m.next];
        expect(nextModule.prev).toBe(m.path);
      }
    });
  });

  it('todos os módulos têm title não-vazio', () => {
    COURSE_ORDER.forEach(m => {
      expect(m.title.trim().length).toBeGreaterThan(0);
    });
  });

  it('todos os módulos têm path começando com /', () => {
    COURSE_ORDER.forEach(m => {
      expect(m.path.startsWith('/')).toBe(true);
    });
  });
});

describe('FUNDAMENTOS_ORDER — integridade da trilha Fundamentos Linux', () => {

  it('tem exatamente 10 módulos', () => {
    expect(FUNDAMENTOS_ORDER).toHaveLength(10);
  });

  it('não há paths duplicados', () => {
    const paths = FUNDAMENTOS_ORDER.map(m => m.path);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });

  it('primeiro módulo tem prev=null e último tem next=null', () => {
    expect(FUNDAMENTOS_ORDER[0].prev).toBeNull();
    expect(FUNDAMENTOS_ORDER[FUNDAMENTOS_ORDER.length - 1].next).toBeNull();
  });

  it('começa em /fhs e termina em /cron', () => {
    expect(FUNDAMENTOS_ORDER[0].path).toBe('/fhs');
    expect(FUNDAMENTOS_ORDER[FUNDAMENTOS_ORDER.length - 1].path).toBe('/cron');
  });

  it('todos os valores prev (não-null) apontam para paths existentes', () => {
    const paths = new Set(FUNDAMENTOS_ORDER.map(m => m.path));
    FUNDAMENTOS_ORDER.forEach(m => {
      if (m.prev !== null) {
        expect(
          paths.has(m.prev),
          `prev="${m.prev}" em "${m.path}" não existe na sequência`,
        ).toBe(true);
      }
    });
  });

  it('todos os valores next (não-null) apontam para paths existentes', () => {
    const paths = new Set(FUNDAMENTOS_ORDER.map(m => m.path));
    FUNDAMENTOS_ORDER.forEach(m => {
      if (m.next !== null) {
        expect(
          paths.has(m.next),
          `next="${m.next}" em "${m.path}" não existe na sequência`,
        ).toBe(true);
      }
    });
  });

  it('bidirecionalidade: se A.next=B então B.prev=A', () => {
    const byPath = Object.fromEntries(FUNDAMENTOS_ORDER.map(m => [m.path, m]));
    FUNDAMENTOS_ORDER.forEach(m => {
      if (m.next) {
        const nextModule = byPath[m.next];
        expect(nextModule.prev).toBe(m.path);
      }
    });
  });

  it('todos os módulos têm title não-vazio', () => {
    FUNDAMENTOS_ORDER.forEach(m => {
      expect(m.title.trim().length).toBeGreaterThan(0);
    });
  });

  it('nenhum path da trilha Fundamentos coincide com COURSE_ORDER (trilhas independentes)', () => {
    const courseOrderPaths = new Set(COURSE_ORDER.map(m => m.path));
    FUNDAMENTOS_ORDER.forEach(m => {
      expect(
        courseOrderPaths.has(m.path),
        `"${m.path}" existe em ambas as trilhas — elas devem ser independentes`,
      ).toBe(false);
    });
  });
});
