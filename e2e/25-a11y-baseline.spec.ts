import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

/**
 * Sprint POLIMENTO — Baseline de acessibilidade (axe-core).
 *
 * Complementa o gate ESTÁTICO (eslint-plugin-jsx-a11y) com uma verificação em
 * RUNTIME: roda o motor axe-core nas 5 rotas-chave do workshop sob as tags
 * WCAG 2.1 A/AA.
 *
 * MODELO DE BASELINE (regressão, não perfeição):
 * o spec NÃO exige zero violações — exige que NENHUMA violação NOVA, fora do
 * conjunto `KNOWN_BASELINE` documentado abaixo, apareça. Assim:
 *   • estabelece cobertura axe real onde antes só havia lint estático;
 *   • trava regressões — qualquer regra WCAG nova quebra o CI na hora;
 *   • é honesto — a dívida de a11y pré-existente fica explícita e rastreável,
 *     não escondida.
 *
 * KNOWN_BASELINE — dívida de acessibilidade conhecida (alvo de um sprint
 * dedicado de a11y no futuro):
 *   - color-contrast        (serious)  contraste de tokens do tema
 *   - aria-required-children(critical) papéis ARIA a revisar
 *   - nested-interactive    (serious)  controles interativos aninhados
 *   - no-focusable-content  (minor)    elemento com role sem conteúdo focável
 * Ao corrigir qualquer uma, remova-a deste conjunto — o spec passa a protegê-la.
 */

const KEY_ROUTES = ['/', '/topicos', '/quiz', '/cheat-sheet', '/dashboard'];

const KNOWN_BASELINE = new Set<string>([
  'color-contrast',
  'aria-required-children',
  'nested-interactive',
  'no-focusable-content',
]);

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
