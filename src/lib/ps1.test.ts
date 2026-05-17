/**
 * Testes do simulador de prompt PS1 (Sprint Ferramentas v3). Lógica pura.
 */
import { describe, it, expect } from 'vitest';
import { renderPs1, expandPs1, DEFAULT_PS1_CONTEXT } from './ps1';

describe('expandPs1', () => {
  it('PS1 clássico do Debian — \\u@\\h:\\w\\$', () => {
    expect(expandPs1('\\u@\\h:\\w\\$ ')).toBe('aluno@servidor:~/projetos$ ');
  });

  it('\\W usa apenas o último componente do cwd', () => {
    expect(expandPs1('\\W \\$ ')).toBe('projetos $ ');
  });

  it('\\$ vira # quando o usuário é root', () => {
    expect(expandPs1('\\$ ', { ...DEFAULT_PS1_CONTEXT, isRoot: true })).toBe('# ');
  });

  it('\\w abrevia o home para ~', () => {
    expect(expandPs1('\\w', { ...DEFAULT_PS1_CONTEXT, cwd: '/home/aluno' })).toBe('~');
  });

  it('\\w fora do home mostra o caminho absoluto', () => {
    expect(expandPs1('\\w', { ...DEFAULT_PS1_CONTEXT, cwd: '/etc/nginx' })).toBe('/etc/nginx');
  });

  it('códigos de cor ANSI são removidos do texto puro', () => {
    expect(expandPs1('\\[\\e[1;32m\\]\\u\\[\\e[0m\\]')).toBe('aluno');
  });

  it('aceita a forma octal \\033 da sequência de escape', () => {
    expect(expandPs1('\\033[34m\\h\\033[0m')).toBe('servidor');
  });

  it('\\n insere uma quebra de linha', () => {
    expect(expandPs1('\\u\\n\\$ ')).toBe('aluno\n$ ');
  });

  it('\\\\ produz uma barra invertida literal', () => {
    expect(expandPs1('\\\\')).toBe('\\');
  });

  it('escape desconhecido é preservado com a barra', () => {
    expect(expandPs1('\\u\\z')).toBe('aluno\\z');
  });
});

describe('renderPs1', () => {
  it('aplica a cor ANSI ao segmento correspondente', () => {
    const segs = renderPs1('\\[\\e[32m\\]\\u\\[\\e[0m\\]@\\h');
    const userSeg = segs.find((s) => s.text === 'aluno');
    expect(userSeg?.color).toBe('#98c379');
    const hostSeg = segs.find((s) => s.text === 'servidor');
    expect(hostSeg?.color).toBeUndefined();
  });

  it('o código 1 marca o segmento como negrito', () => {
    const segs = renderPs1('\\[\\e[1;34m\\]\\w');
    expect(segs[0].bold).toBe(true);
  });

  it('template vazio retorna lista vazia', () => {
    expect(renderPs1('')).toEqual([]);
  });
});
