import { describe, it, expect } from 'vitest';
import { COURSE_ORDER } from './courseOrder';

describe('courseOrder — integridade da sequência de módulos', () => {

  it('tem exatamente 22 módulos', () => {
    expect(COURSE_ORDER).toHaveLength(22);
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
