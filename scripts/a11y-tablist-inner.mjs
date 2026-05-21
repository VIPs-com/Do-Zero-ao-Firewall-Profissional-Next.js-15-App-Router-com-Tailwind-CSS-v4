// scripts/a11y-tablist-inner.mjs — Sprint A11Y-EXT
// Adiciona role="tablist" ao container INTERNO das abas (<div className="flex gap-2">)
// — apenas quando ele segue imediatamente um <div ...border-b border-border...>,
// assinatura inequívoca da barra de abas (corrige aria-required-parent dos role="tab"
// em páginas com a estrutura outer-border + inner-flex).
// Contextual, idempotente. Não toca globals.css.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const RE = /(border-b border-border[^"]*">\s*)<div className="flex gap-2">/g;

const files = execSync('git ls-files app', { encoding: 'utf8' })
  .split('\n').filter(f => /\.tsx$/.test(f));

let changed = 0;
for (const file of files) {
  let src; try { src = readFileSync(file, 'utf8'); } catch { continue; }
  const out = src.replace(RE, '$1<div role="tablist" className="flex gap-2">');
  if (out !== src) { writeFileSync(file, out, 'utf8'); changed++; console.log('  fixed', file); }
}
console.log(`\n${changed} arquivo(s) alterado(s).`);
