// scripts/a11y-contrast-fix2.mjs — Sprint A11Y-EXT (segunda rodada)
// Substituições literais para zerar o restante de color-contrast/link-in-text-block.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const REPLACEMENTS = [
  // links inline em texto: sublinhado permanente (WCAG link-in-text-block)
  ['text-accent hover:underline', 'text-accent underline'],
  // conector central do fluxo (wan-nat/dnat): text-accent falha em bg-3
  ['text-center text-accent py-1', 'text-center text-accent-2 py-1'],
];

const files = execSync('git ls-files app src', { encoding: 'utf8' })
  .split('\n').filter(f => /\.tsx?$/.test(f) && !f.endsWith('globals.css'));

let changed = 0;
for (const file of files) {
  let src; try { src = readFileSync(file, 'utf8'); } catch { continue; }
  let out = src;
  for (const [from, to] of REPLACEMENTS) out = out.split(from).join(to);
  if (out !== src) { writeFileSync(file, out, 'utf8'); changed++; console.log('  fixed', file); }
}
console.log(`\n${changed} arquivo(s) alterado(s).`);
