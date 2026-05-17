/**
 * Testes de integridade dos itens de busca global (Sprint CONSOLIDACAO).
 * Valida contagem, IDs únicos, campos obrigatórios e hrefs válidos.
 * Zero renderização React — roda em milissegundos.
 */
import { describe, it, expect } from 'vitest';
import { SEARCH_ITEMS } from './searchItems';

describe('SEARCH_ITEMS', () => {
  it('tem exatamente 245 itens', () => {
    expect(SEARCH_ITEMS).toHaveLength(245);
  });

  it('nenhum id duplicado', () => {
    const ids = SEARCH_ITEMS.map(item => item.id);
    const unique = new Set(ids);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(unique.size, `IDs duplicados: ${[...new Set(duplicates)].join(', ')}`).toBe(ids.length);
  });

  it('todos têm: id, title, description, href, category (strings não-vazias)', () => {
    SEARCH_ITEMS.forEach((item, i) => {
      expect(typeof item.id,          `[${i}] id não é string`).toBe('string');
      expect(typeof item.title,       `[${i}] title não é string`).toBe('string');
      expect(typeof item.description, `[${i}] description não é string`).toBe('string');
      expect(typeof item.href,        `[${i}] href não é string`).toBe('string');
      expect(typeof item.category,    `[${i}] category não é string`).toBe('string');
    });
  });

  it('todos os href começam com "/"', () => {
    SEARCH_ITEMS.forEach((item, i) => {
      expect(item.href.startsWith('/'),
        `[${i}] id="${item.id}" href="${item.href}" não começa com /`).toBe(true);
    });
  });

  it('nenhum campo está vazio (string vazia)', () => {
    SEARCH_ITEMS.forEach((item, i) => {
      expect(item.id.trim().length,          `[${i}] id vazio`).toBeGreaterThan(0);
      expect(item.title.trim().length,       `[${i}] title vazio`).toBeGreaterThan(0);
      expect(item.description.trim().length, `[${i}] description vazio`).toBeGreaterThan(0);
      expect(item.href.trim().length,        `[${i}] href vazio`).toBeGreaterThan(0);
      expect(item.category.trim().length,    `[${i}] category vazio`).toBeGreaterThan(0);
    });
  });
});
