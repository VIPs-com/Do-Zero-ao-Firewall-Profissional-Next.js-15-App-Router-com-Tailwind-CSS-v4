/**
 * Simulador de prompt PS1 do Bash — lógica pura (Sprint Ferramentas v3).
 *
 * Expande as sequências de escape de um template PS1 num preview, incluindo
 * cores ANSI. Zero React, totalmente testável.
 */

export interface Ps1Context {
  /** Nome do usuário (`\u`). */
  user: string;
  /** Hostname curto (`\h` / `\H`). */
  host: string;
  /** Diretório de trabalho absoluto. */
  cwd: string;
  /** Diretório home — usado para abreviar o cwd com `~`. */
  home: string;
  /** Se o usuário é root — define `\$` como `#`. */
  isRoot: boolean;
}

/** Contexto-padrão de exemplo para o preview. */
export const DEFAULT_PS1_CONTEXT: Ps1Context = {
  user: 'aluno',
  host: 'servidor',
  cwd: '/home/aluno/projetos',
  home: '/home/aluno',
  isRoot: false,
};

export interface Ps1Segment {
  /** Texto literal do segmento. */
  text: string;
  /** Cor CSS (derivada de código ANSI). `undefined` = cor padrão do terminal. */
  color?: string;
  /** Se o segmento está em negrito. */
  bold: boolean;
}

/** Códigos SGR de cor de primeiro plano → cor CSS (paleta One Dark). */
const ANSI_FG: Record<number, string> = {
  30: '#3b4048', 31: '#e06c75', 32: '#98c379', 33: '#e5c07b',
  34: '#61afef', 35: '#c678dd', 36: '#56b6c2', 37: '#abb2bf',
  90: '#5c6370', 91: '#e06c75', 92: '#98c379', 93: '#e5c07b',
  94: '#61afef', 95: '#c678dd', 96: '#56b6c2', 97: '#ffffff',
};

/** cwd com o home abreviado para `~` (escape `\w`). */
function cwdToW(ctx: Ps1Context): string {
  return ctx.cwd.startsWith(ctx.home)
    ? '~' + ctx.cwd.slice(ctx.home.length)
    : ctx.cwd;
}

/** Apenas o último componente do cwd (escape `\W`). */
function cwdToShortW(ctx: Ps1Context): string {
  const w = cwdToW(ctx);
  if (w === '~' || w === '/') return w;
  const base = w.replace(/\/+$/, '').split('/').pop();
  return base || '/';
}

/**
 * Converte um template PS1 em segmentos coloridos prontos para preview.
 * Reconhece os escapes mais comuns (`\u \h \H \w \W \$ \s \v \d \t \A \n`)
 * e sequências de cor ANSI (`\e[..m` ou `\033[..m`), além de ignorar os
 * marcadores de não-impressão `\[` e `\]`.
 */
export function renderPs1(template: string, ctx: Ps1Context = DEFAULT_PS1_CONTEXT): Ps1Segment[] {
  const segments: Ps1Segment[] = [];
  let cur = '';
  let color: string | undefined;
  let bold = false;

  const flush = () => {
    if (cur !== '') {
      segments.push({ text: cur, color, bold });
      cur = '';
    }
  };

  for (let i = 0; i < template.length; i++) {
    const ch = template[i];
    if (ch !== '\\') { cur += ch; continue; }

    const next = template[i + 1];

    // Sequência de cor ANSI: \e[..m  ou  \033[..m
    if (next === 'e' || (next === '0' && template.slice(i + 1, i + 4) === '033')) {
      const escLen = next === 'e' ? 2 : 4;
      const j = i + escLen;
      if (template[j] === '[') {
        const close = template.indexOf('m', j);
        if (close !== -1) {
          flush();
          const codes = template.slice(j + 1, close).split(';').map(Number);
          for (const code of codes) {
            if (code === 0) { color = undefined; bold = false; }
            else if (code === 1) bold = true;
            else if (code === 22) bold = false;
            else if (ANSI_FG[code]) color = ANSI_FG[code];
          }
          i = close;
          continue;
        }
      }
      i += escLen - 1;
      continue;
    }

    switch (next) {
      case 'u': cur += ctx.user; break;
      case 'h': case 'H': cur += ctx.host; break;
      case 'w': cur += cwdToW(ctx); break;
      case 'W': cur += cwdToShortW(ctx); break;
      case '$': cur += ctx.isRoot ? '#' : '$'; break;
      case 's': cur += 'bash'; break;
      case 'v': cur += '5.2'; break;
      case 'd': cur += 'Sáb 17 Mai'; break;
      case 't': cur += '14:30:00'; break;
      case 'A': cur += '14:30'; break;
      case 'n': flush(); segments.push({ text: '\n', color, bold }); break;
      case '\\': cur += '\\'; break;
      case '[': case ']': break; // marcadores de não-impressão
      case 'a': case 'r': break;  // bell / carriage return — ignorados
      case undefined: cur += '\\'; break;
      default: cur += '\\' + next; break;
    }
    i++;
  }

  flush();
  return segments;
}

/** Versão texto-puro do prompt (sem cores) — útil para testes e fallback. */
export function expandPs1(template: string, ctx: Ps1Context = DEFAULT_PS1_CONTEXT): string {
  return renderPs1(template, ctx).map((s) => s.text).join('');
}
