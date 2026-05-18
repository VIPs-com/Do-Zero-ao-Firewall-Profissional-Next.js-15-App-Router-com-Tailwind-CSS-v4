/**
 * Testes do codificador/decodificador Base64 (Sprint Ferramentas v4). Lógica pura.
 */
import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from './base64';

describe('encodeBase64', () => {
  it('codifica ASCII simples', () => {
    const r = encodeBase64('hello');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('aGVsbG8=');
  });

  it('texto vazio → string vazia', () => {
    expect(encodeBase64('').output).toBe('');
  });

  it('codifica UTF-8 (acentos e símbolos)', () => {
    const r = encodeBase64('ção');
    expect(r.ok).toBe(true);
    // Decodificar de volta deve devolver o original
    expect(decodeBase64(r.output).output).toBe('ção');
  });
});

describe('decodeBase64', () => {
  it('decodifica ASCII simples', () => {
    const r = decodeBase64('aGVsbG8=');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('hello');
  });

  it('caso real — Secret do Kubernetes', () => {
    // echo -n 'password' | base64  →  cGFzc3dvcmQ=
    expect(decodeBase64('cGFzc3dvcmQ=').output).toBe('password');
  });

  it('ignora espaços em branco ao redor', () => {
    expect(decodeBase64('  aGVsbG8=  ').output).toBe('hello');
  });

  it('string vazia → ok com saída vazia', () => {
    const r = decodeBase64('');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('');
  });

  it('Base64 inválido retorna erro em vez de lançar', () => {
    const r = decodeBase64('isto não é base64 @@@');
    expect(r.ok).toBe(false);
    expect(r.error.length).toBeGreaterThan(0);
  });

  it('round-trip preserva o texto UTF-8', () => {
    const original = 'café — naïve — 日本語 — 🔥';
    const encoded = encodeBase64(original);
    expect(encoded.ok).toBe(true);
    expect(decodeBase64(encoded.output).output).toBe(original);
  });
});
