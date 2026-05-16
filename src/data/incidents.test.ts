/**
 * Testes de integridade dos playbooks de incidente (Sprint Busca Preditiva).
 * Lógica pura — sem React, roda em milissegundos.
 */
import { describe, it, expect } from 'vitest';
import { INCIDENT_ITEMS } from './incidents';

describe('INCIDENT_ITEMS', () => {
  it('tem exatamente 7 playbooks de incidente', () => {
    expect(INCIDENT_ITEMS).toHaveLength(7);
  });

  it('nenhum id duplicado e todos com prefixo inc-', () => {
    const ids = INCIDENT_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id.startsWith('inc-')).toBe(true));
  });

  it('todos têm category "Incidente"', () => {
    INCIDENT_ITEMS.forEach((i) => expect(i.category).toBe('Incidente'));
  });

  it('todos têm title, description e href não-vazios', () => {
    INCIDENT_ITEMS.forEach((i, idx) => {
      expect(i.title.trim().length, `[${idx}] title vazio`).toBeGreaterThan(0);
      expect(i.description.trim().length, `[${idx}] description vazia`).toBeGreaterThan(0);
      expect(i.href.startsWith('/'), `[${idx}] href inválido`).toBe(true);
    });
  });

  it('todos têm keywords (≥3) para a busca preditiva', () => {
    INCIDENT_ITEMS.forEach((i, idx) => {
      expect(Array.isArray(i.keywords), `[${idx}] sem keywords`).toBe(true);
      expect((i.keywords ?? []).length, `[${idx}] poucas keywords`).toBeGreaterThanOrEqual(3);
    });
  });

  it('keywords são minúsculas (matching é case-insensitive sobre query lowercase)', () => {
    INCIDENT_ITEMS.forEach((i) => {
      (i.keywords ?? []).forEach((k) => expect(k).toBe(k.toLowerCase()));
    });
  });

  it('href aponta para um módulo de conteúdo conhecido', () => {
    const validHrefs = ['/discos', '/troubleshooting', '/permissoes', '/processos'];
    INCIDENT_ITEMS.forEach((i) => expect(validHrefs).toContain(i.href));
  });
});
