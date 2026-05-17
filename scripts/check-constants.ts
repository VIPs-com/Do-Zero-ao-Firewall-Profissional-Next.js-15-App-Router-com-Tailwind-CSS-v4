/**
 * Reconciliação de constantes — valida que os números espalhados pelo projeto
 * batem com os arrays reais (fonte da verdade). Roda com `npx tsx`.
 *
 * Pega o drift recorrente: contadores hardcoded no dashboard/BadgeContext que
 * deixam de bater com os dados quando um módulo novo é adicionado.
 *
 * Uso:  npx tsx scripts/check-constants.ts
 * Saída: relatório + exit code 1 se houver qualquer divergência.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { COURSE_ORDER, FUNDAMENTOS_ORDER, ADVANCED_ORDER } from '../src/data/courseOrder';
import { BADGE_DEFS } from '../src/data/badges';
import { TOPICS } from '../src/data/topics';
import { QUIZ_QUESTIONS } from '../src/data/quizQuestions';
import { SEARCH_ITEMS } from '../src/data/searchItems';
import { ROUTE_SEO } from '../src/lib/seo';
import { ALL_CHECKLIST_IDS, CONTENT_PAGES_COUNT } from '../src/context/BadgeContext';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');

/** Extrai o primeiro número capturado por um regex num arquivo. */
function num(rel: string, re: RegExp): number | null {
  const m = read(rel).match(re);
  return m ? parseInt(m[1], 10) : null;
}

const checks: Array<{ label: string; real: number; found: number | null }> = [];
const add = (label: string, real: number, found: number | null) =>
  checks.push({ label, real, found });

// ── Fonte da verdade: os arrays ──────────────────────────────────────────────
const checklistLen = ALL_CHECKLIST_IDS.length;
const topicsLen = TOPICS.length;
const badgeCount = Object.keys(BADGE_DEFS).length;

// ── Cross-checks contra números hardcoded ────────────────────────────────────
add(
  'dashboard checklistItemsCount === ALL_CHECKLIST_IDS.length',
  checklistLen,
  num('app/dashboard/page.tsx', /checklistItemsCount\s*=\s*(\d+)/),
);
add(
  'dashboard totalTopics === TOPICS.length',
  topicsLen,
  num('app/dashboard/page.tsx', /totalTopics\s*=\s*(\d+)/),
);
add(
  'BadgeContext linux-ninja threshold === floor(checkpoints * 0.75)',
  Math.floor(checklistLen * 0.75),
  num('src/context/BadgeContext.tsx', /length >= (\d+)\) unlockBadge\('linux-ninja'\)/),
);
add(
  'searchItems.test.ts count === SEARCH_ITEMS.length',
  SEARCH_ITEMS.length,
  num('src/data/searchItems.test.ts', /toHaveLength\((\d+)\)/),
);
add(
  'courseOrder.test.ts ADVANCED === ADVANCED_ORDER.length',
  ADVANCED_ORDER.length,
  num('src/data/courseOrder.test.ts', /ADVANCED_ORDER\).toHaveLength\((\d+)\)/),
);
add(
  'quiz.test.ts total === QUIZ_QUESTIONS.length',
  QUIZ_QUESTIONS.length,
  num('src/data/quiz.test.ts', /QUIZ_QUESTIONS\).toHaveLength\((\d+)\)/),
);
add(
  'e2e/15-routes-smoke ALL_ROUTES === ROUTE_SEO keys',
  Object.keys(ROUTE_SEO).length,
  num('e2e/15-routes-smoke.spec.ts', /toBe\((\d+)\)/),
);

// ── Relatório dos totais (fonte da verdade) ──────────────────────────────────
console.log('\n📊 Totais reais (fonte da verdade — os arrays):');
console.log(`   COURSE_ORDER ........ ${COURSE_ORDER.length} módulos (Firewall)`);
console.log(`   FUNDAMENTOS_ORDER ... ${FUNDAMENTOS_ORDER.length} módulos`);
console.log(`   ADVANCED_ORDER ...... ${ADVANCED_ORDER.length} módulos`);
console.log(`   BADGE_DEFS .......... ${badgeCount} badges`);
console.log(`   ALL_CHECKLIST_IDS ... ${checklistLen} checkpoints`);
console.log(`   TOPICS .............. ${topicsLen} tópicos`);
console.log(`   QUIZ_QUESTIONS ...... ${QUIZ_QUESTIONS.length} questões`);
console.log(`   SEARCH_ITEMS ........ ${SEARCH_ITEMS.length} itens de busca`);
console.log(`   ROUTE_SEO ........... ${Object.keys(ROUTE_SEO).length} rotas`);
console.log(`   CONTENT_PAGES_COUNT . ${CONTENT_PAGES_COUNT}`);

// ── Verificação das divergências ─────────────────────────────────────────────
console.log('\n🔎 Reconciliação:');
let failed = 0;
for (const c of checks) {
  const ok = c.found === c.real;
  if (!ok) failed++;
  const mark = ok ? '✓' : '✗';
  const detail = ok ? `${c.real}` : `esperado ${c.real}, encontrado ${c.found}`;
  console.log(`   ${mark} ${c.label} — ${detail}`);
}

if (failed > 0) {
  console.error(`\n❌ ${failed} divergência(s) encontrada(s).\n`);
  process.exit(1);
}
console.log('\n✅ Todas as constantes estão reconciliadas.\n');
