import { test, expect } from './fixtures';
import { ROUTE_SEO } from '../src/lib/seo';

/**
 * Sprint E2E-FULL — Smoke test de todas as rotas do ROUTE_SEO
 *
 * Objetivo: garantir que TODAS as 85 rotas registradas renderizam sem crash.
 * Diferente dos specs de feature (badges, busca, etc.), este spec é puramente
 * estrutural — varre o ecossistema inteiro e pega regressões silenciosas que
 * o build não detecta (crash em runtime, error boundary acionado, página sem
 * <h1>, exceção JS não-capturada).
 *
 * A lista de rotas vem de `ROUTE_SEO` (fonte única de verdade em src/lib/seo.ts),
 * então qualquer rota nova fica automaticamente coberta. seo.ts só tem um
 * `import type` do Next — seguro de importar no contexto Node do Playwright.
 *
 * Para cada rota verifica:
 *   1. HTTP status < 400 (sem 404/500)
 *   2. O error boundary global (app/error.tsx) NÃO foi acionado
 *   3. Existe um <h1> visível (página renderizou conteúdo real)
 *   4. Nenhuma exceção JavaScript não-capturada foi lançada
 */

const ALL_ROUTES = Object.keys(ROUTE_SEO);

// Heading estável do error boundary global (app/error.tsx)
const ERROR_BOUNDARY_HEADING = 'Algo deu errado por aqui';

test.describe('Smoke — todas as rotas renderizam sem crash', () => {
  test('ROUTE_SEO contém as 85 rotas esperadas', () => {
    expect(ALL_ROUTES.length).toBe(85);
  });

  for (const route of ALL_ROUTES) {
    test(`${route} renderiza sem erro`, async ({ page }) => {
      const jsErrors: string[] = [];
      page.on('pageerror', (err) => jsErrors.push(err.message));

      const response = await page.goto(route);
      await page.waitForLoadState('networkidle');

      // 1. HTTP OK
      expect(
        response?.status() ?? 0,
        `${route} retornou HTTP ${response?.status()}`,
      ).toBeLessThan(400);

      // 2. Error boundary NÃO acionado
      await expect(
        page.getByRole('heading', { name: ERROR_BOUNDARY_HEADING }),
        `${route} acionou o error boundary global`,
      ).not.toBeVisible();

      // 3. Página tem um <h1> visível
      await expect(
        page.locator('h1').first(),
        `${route} renderizou sem nenhum <h1>`,
      ).toBeVisible();

      // 4. Nenhuma exceção JS não-capturada
      expect(
        jsErrors,
        `${route} lançou exceção(ões) JS: ${jsErrors.join(' | ')}`,
      ).toHaveLength(0);
    });
  }
});
