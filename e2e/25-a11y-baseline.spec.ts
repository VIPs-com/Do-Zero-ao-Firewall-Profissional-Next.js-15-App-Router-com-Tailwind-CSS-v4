import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { ROUTE_SEO } from '../src/lib/seo';

/**
 * Sprint A11Y + A11Y-EXT — Baseline de acessibilidade (axe-core) em RUNTIME.
 *
 * Roda o motor axe-core sob as tags WCAG 2.1 A/AA em TODAS as rotas do
 * `ROUTE_SEO` (fonte única de verdade — qualquer rota nova entra de graça,
 * como no smoke test 15). Complementa o gate ESTÁTICO (eslint-plugin-jsx-a11y).
 *
 * MODELO: ZERO violações. O `KNOWN_BASELINE` está VAZIO — qualquer violação
 * (existente ou nova) quebra o CI. A dívida de a11y foi eliminada em duas
 * frentes:
 *   • Sprint A11Y    — 5 rotas-chave (tokens de tema, SVG topologia, accordions).
 *   • Sprint A11Y-EXT — site inteiro: CodeBlock (.code-lang, <pre> focável),
 *     abas com role="tablist" + texto de aba alto-contraste, links em texto
 *     sublinhados (link-in-text-block), tints de cor de módulo e badges.
 *
 * Se uma regressão futura introduzir dívida temporária, adicione o id ao
 * conjunto abaixo COM um comentário e um issue — nunca silenciosamente.
 */

const ALL_ROUTES = Object.keys(ROUTE_SEO);

const KNOWN_BASELINE = new Set<string>([]);

for (const route of ALL_ROUTES) {
  test(`a11y — ${route} sem violações WCAG`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = results.violations.filter(v => !KNOWN_BASELINE.has(v.id));

    expect(
      violations,
      `Violação de a11y em ${route}:\n` +
        violations
          .map(v => `  [${v.impact}] ${v.id} (${v.nodes.length}) — ${v.help}\n` +
            v.nodes.slice(0, 2).map(n => `      ${n.html.slice(0, 120)}`).join('\n'))
          .join('\n'),
    ).toEqual([]);
  });
}
