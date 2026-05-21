import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

/**
 * Sprint POLIMENTO — Baseline de acessibilidade (axe-core).
 *
 * Complementa o gate ESTÁTICO (eslint-plugin-jsx-a11y) com uma verificação em
 * RUNTIME: roda o motor axe-core nas 5 rotas-chave do workshop sob as tags
 * WCAG 2.1 A/AA.
 *
 * MODELO: ZERO violações (Sprint A11Y — baseline zerado).
 * O `KNOWN_BASELINE` ficou VAZIO: o spec agora exige zero violações WCAG
 * 2.1 A/AA nas 5 rotas-chave. Qualquer violação (existente ou nova) quebra
 * o CI. A dívida de a11y que antes era tolerada foi eliminada:
 *   - color-contrast        → tokens ajustados (accent-strong p/ botões,
 *                             text-3 elevado, indigo/info/rodapé corrigidos)
 *   - aria-required-children → TroubleshootingCard: role="list" só com listitems
 *   - nested-interactive     → SVG da topologia role="group"; accordions /topicos
 *                              com toggle e link como irmãos (não aninhados)
 *   - no-focusable-content   → sem ocorrências
 * Se uma regressão futura introduzir dívida temporária, adicione o id ao
 * conjunto abaixo COM um comentário e um issue — nunca silenciosamente.
 */

const KEY_ROUTES = ['/', '/topicos', '/quiz', '/cheat-sheet', '/dashboard'];

const KNOWN_BASELINE = new Set<string>([]);

for (const route of KEY_ROUTES) {
  test(`a11y baseline — ${route} sem violações WCAG novas`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const newViolations = results.violations.filter(v => !KNOWN_BASELINE.has(v.id));

    expect(
      newViolations,
      `Violação de a11y NOVA em ${route} (fora do baseline):\n` +
        newViolations.map(v => `  [${v.impact}] ${v.id} — ${v.help}`).join('\n'),
    ).toEqual([]);
  });
}
