import { test, expect } from './fixtures';

/**
 * Sprint E2E-Glossário — cobertura da página /glossario.
 *
 * Página com busca ao vivo e filtro por categoria sobre os termos técnicos.
 * Aqui validamos a renderização, a busca (com estado vazio) e o filtro.
 */

test('glossario renderiza com busca e botões de categoria', async ({ page }) => {
  await page.goto('/glossario');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /glossário hacker/i })).toBeVisible();
  await expect(page.getByPlaceholder(/buscar termo/i)).toBeVisible();
  await expect(page.getByRole('button', { name: '📚 Todos' })).toBeVisible();
});

test('glossario: a busca filtra os termos e mostra estado vazio', async ({ page }) => {
  await page.goto('/glossario');
  await page.waitForLoadState('networkidle');

  const search = page.getByPlaceholder(/buscar termo/i);

  // Termo conhecido → o card do termo aparece
  await search.fill('IKEv2');
  await expect(page.getByRole('heading', { name: 'IKEv2', exact: true })).toBeVisible();

  // Termo improvável → estado vazio
  await search.fill('zzznaoexisteglossario');
  await expect(page.getByText(/nenhum termo encontrado/i)).toBeVisible();
});

test('glossario: filtrar por categoria restringe a lista de termos', async ({ page }) => {
  await page.goto('/glossario');
  await page.waitForLoadState('networkidle');

  const cardsBefore = await page.locator('div.grid > div').count();
  expect(cardsBefore).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'VPN', exact: true }).click();

  const cardsAfter = await page.locator('div.grid > div').count();
  expect(cardsAfter).toBeGreaterThan(0);
  expect(cardsAfter).toBeLessThan(cardsBefore);

  // Todos os cards visíveis pertencem à categoria VPN
  await expect(page.getByRole('heading', { name: 'IPSec', exact: true })).toBeVisible();
});
