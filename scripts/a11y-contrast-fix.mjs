// scripts/a11y-contrast-fix.mjs
// Sprint A11Y — substituições literais de classes Tailwind para zerar color-contrast.
// Mecânico e idempotente. NÃO toca em app/globals.css (ajustado à mão).
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Substituições literais, ordem importa (mais longa primeiro).
const REPLACEMENTS = [
  ['bg-accent border-accent text-white', 'bg-accent-strong border-accent-strong text-white'],
  ['bg-accent text-white', 'bg-accent-strong text-white'],
  ['bg-info text-white', 'bg-[#2563eb] text-white'],
  ['bg-[#6366f1] text-white', 'bg-[#4f46e5] text-white'],
  ['text-[#6366f1]', 'text-[#818cf8]'],
];

// Lista de arquivos rastreados em app/ e src/ (.tsx/.ts), exceto globals.css.
const files = execSync('git ls-files app src', { encoding: 'utf8' })
  .split('\n')
  .filter(f => /\.(tsx?|jsx?)$/.test(f) && !f.endsWith('globals.css'));

let changed = 0;
for (const file of files) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  let out = src;
  for (const [from, to] of REPLACEMENTS) out = out.split(from).join(to);
  if (out !== src) { writeFileSync(file, out, 'utf8'); changed++; console.log('  fixed', file); }
}
console.log(`\n${changed} arquivo(s) alterado(s).`);
