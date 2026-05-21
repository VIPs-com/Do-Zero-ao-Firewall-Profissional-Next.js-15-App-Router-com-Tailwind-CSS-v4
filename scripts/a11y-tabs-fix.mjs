// scripts/a11y-tabs-fix.mjs — Sprint A11Y-EXT
// (1) aba ativa: text-[var(--mod)] falha contraste → text-text (borda colorida mantém o realce)
// (2) container das abas ganha role="tablist" (corrige aria-required-parent dos role="tab")
// Mecânico, literal, idempotente. Não toca globals.css.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const REPLACEMENTS = [
  // (1) contraste da aba ativa — mantém border-[var(--mod)], texto alto contraste
  ["border-[var(--mod)] text-[var(--mod)]", "border-[var(--mod)] text-text"],
  // (2) role="tablist" nos 3 variantes de container conhecidos
  ['<div className="flex gap-2 mb-10 border-b border-border">',
   '<div role="tablist" className="flex gap-2 mb-10 border-b border-border">'],
  ['<div className="flex gap-2 mb-4 border-b border-border">',
   '<div role="tablist" className="flex gap-2 mb-4 border-b border-border">'],
  ['<div className="flex gap-2 border-b border-border">',
   '<div role="tablist" className="flex gap-2 border-b border-border">'],
];

const files = execSync('git ls-files app src', { encoding: 'utf8' })
  .split('\n')
  .filter(f => /\.tsx?$/.test(f));

let changed = 0;
for (const file of files) {
  let src; try { src = readFileSync(file, 'utf8'); } catch { continue; }
  let out = src;
  for (const [from, to] of REPLACEMENTS) {
    // não duplica role="tablist" se já presente
    if (to.includes('role="tablist"') && out.includes(to)) continue;
    out = out.split(from).join(to);
  }
  if (out !== src) { writeFileSync(file, out, 'utf8'); changed++; console.log('  fixed', file); }
}
console.log(`\n${changed} arquivo(s) alterado(s).`);
