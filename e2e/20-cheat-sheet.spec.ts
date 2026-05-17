import { test, expect } from './fixtures';

/**
 * Sprint E2E-Cheat — cobertura da página /cheat-sheet.
 *
 * Página interativa com 4 abas (Comandos / Workflows / Windows↔Linux /
 * Scripts & VIM), busca ao vivo, filtros de camada OSI, botões de copiar
 * e modo de impressão. Aqui validamos a busca, a troca de abas, os filtros
 * e o feedback de cópia.
 */

test('cheat-sheet renderiza com as 4 abas e a aba Comandos ativa', async ({ page }) => {
  await page.goto('/cheat-sheet');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /comandos essenciais/i })).toBeVisible();

  await expect(page.getByRole('tab', { name: /comandos/i })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: /workflows/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /windows/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /scripts/i })).toBeVisible();
});

test('cheat-sheet: a busca filtra os comandos e mostra estado vazio', async ({ page }) => {
  await page.goto('/cheat-sheet');
  await page.waitForLoadState('networkidle');

  const search = page.getByPlaceholder(/buscar comando/i);

  // Termo conhecido → ainda há cartões de comando
  await search.fill('iptables');
  await expect(page.locator('code', { hasText: 'iptables' }).first()).toBeVisible();

  // Termo improvável → estado vazio
  await search.fill('zzznaoexistecomando');
  await expect(page.getByText(/nenhum comando encontrado/i)).toBeVisible();
});

test('cheat-sheet: trocar de aba atualiza aria-selected', async ({ page }) => {
  await page.goto('/cheat-sheet');
  await page.waitForLoadState('networkidle');

  await page.getByRole('tab', { name: /scripts/i }).click();

  await expect(page.getByRole('tab', { name: /scripts/i })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: /comandos/i })).toHaveAttribute('aria-selected', 'false');
});

test('cheat-sheet: filtro de camada OSI restringe a lista', async ({ page }) => {
  await page.goto('/cheat-sheet');
  await page.waitForLoadState('networkidle');

  const cardsBefore = await page.locator('div.grid > div').count();

  await page.getByRole('button', { name: '🌐 Camada 3' }).click();

  const cardsAfter = await page.locator('div.grid > div').count();
  expect(cardsAfter).toBeGreaterThan(0);
  expect(cardsAfter).toBeLessThanOrEqual(cardsBefore);
});

test('cheat-sheet: botão Copiar dá feedback "Copiado!"', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-write', 'clipboard-read']);
  await page.goto('/cheat-sheet');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /^copiar$/i }).first().click();
  await expect(page.getByRole('button', { name: /copiado/i }).first()).toBeVisible();
});
