/**
 * Validador de expressões regulares — lógica pura (Sprint Ferramentas v2).
 *
 * Testa um padrão regex contra um texto e retorna os matches encontrados,
 * ou uma mensagem de erro se o padrão for inválido. Zero React, testável.
 */

export interface RegexMatch {
  /** Trecho casado. */
  text: string;
  /** Posição (índice de caractere) onde o match começa. */
  index: number;
}

/**
 * Resultado do teste de regex. Shape único (não-discriminado): todos os campos
 * estão sempre presentes — em sucesso, `error` é `''`; em falha, `matches` é `[]`
 * e `count` é `0`. Simples de consumir sem narrowing.
 */
export interface RegexResult {
  /** `true` se o padrão é válido. */
  ok: boolean;
  /** Matches encontrados (vazio em caso de erro). */
  matches: RegexMatch[];
  /** Quantidade de matches. */
  count: number;
  /** Mensagem de erro (`''` quando `ok`). */
  error: string;
}

/** Limite defensivo de matches — evita travar a UI com padrões patológicos. */
const MAX_MATCHES = 5000;

/**
 * Testa `pattern` (com as `flags` informadas) contra `text`.
 *
 * A flag `g` é sempre aplicada internamente para coletar TODOS os matches —
 * as flags relevantes para o usuário são `i` (case-insensitive), `m`
 * (multiline) e `s` (dotAll).
 */
export function testRegex(pattern: string, flags: string, text: string): RegexResult {
  if (pattern === '') return { ok: true, matches: [], count: 0, error: '' };

  let re: RegExp;
  try {
    const withGlobal = flags.includes('g') ? flags : flags + 'g';
    re = new RegExp(pattern, withGlobal);
  } catch (err) {
    return { ok: false, matches: [], count: 0, error: (err as Error).message };
  }

  const matches: RegexMatch[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ text: m[0], index: m.index });
    // Match vazio (ex.: `a*`) não avança lastIndex — força o avanço.
    if (m[0] === '') re.lastIndex++;
    if (matches.length >= MAX_MATCHES) break;
  }

  return { ok: true, matches, count: matches.length, error: '' };
}
