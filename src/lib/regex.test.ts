/**
 * Testes do validador de regex (Sprint Ferramentas v2). Lógica pura.
 */
import { describe, it, expect } from 'vitest';
import { testRegex } from './regex';

describe('testRegex', () => {
  it('padrão vazio → sem matches, ok', () => {
    const r = testRegex('', '', 'qualquer texto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.count).toBe(0);
  });

  it('encontra todos os matches (global implícito)', () => {
    const r = testRegex('\\d+', '', 'a1 b22 c333');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.count).toBe(3);
      expect(r.matches.map((m) => m.text)).toEqual(['1', '22', '333']);
      expect(r.matches[0].index).toBe(1);
    }
  });

  it('flag i — case-insensitive', () => {
    const semI = testRegex('erro', '', 'ERRO no log');
    const comI = testRegex('erro', 'i', 'ERRO no log');
    expect(semI.ok && semI.count).toBe(0);
    expect(comI.ok && comI.count).toBe(1);
  });

  it('flag m — multiline (^ casa início de cada linha)', () => {
    const r = testRegex('^linha', 'm', 'linha 1\nlinha 2\nlinha 3');
    expect(r.ok && r.count).toBe(3);
  });

  it('regex inválido retorna erro em vez de lançar', () => {
    const r = testRegex('(abc', '', 'texto');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.length).toBeGreaterThan(0);
  });

  it('match vazio não causa loop infinito', () => {
    const r = testRegex('a*', '', 'aaa');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.count).toBeGreaterThan(0);
  });

  it('caso real — failregex de Fail2ban casa o IP', () => {
    const log = 'Failed password for invalid user admin from 203.0.113.7 port 5512';
    const r = testRegex('from (\\d+\\.\\d+\\.\\d+\\.\\d+)', '', log);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.count).toBe(1);
      expect(r.matches[0].text).toBe('from 203.0.113.7');
    }
  });

  it('índice de cada match aponta para a posição correta', () => {
    const r = testRegex('o', '', 'load balancer');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.matches[0].index).toBe(1);
  });
});
