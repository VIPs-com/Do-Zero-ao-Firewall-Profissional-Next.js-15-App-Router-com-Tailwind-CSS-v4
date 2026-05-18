import { test, expect } from './fixtures';

/**
 * Sprint JORNADA — cobertura da página /jornada (Jornada Unificada).
 *
 * Página que une as 3 trilhas em uma linha do tempo de 64 módulos, com barra
 * de progresso geral e destaque do próximo módulo (`data-testid="jornada-next"`).
 *
 * Seed de localStorage via `page.addInitScript` (NUNCA `page.evaluate` antes do
 * `goto`) — garante hidratação determinística do BadgeContext.
 */

test('jornada renderiza com h1 e as 3 fases', async ({ page }) => {
  await page.goto('/jornada');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { level: 1, name: /jornada unificada/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /fundamentos linux/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /firewall profissional/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /avançados/i })).toBeVisible();
});

test('jornada: progresso vazio → barra em 0% e próximo módulo é /fhs', async ({ page }) => {
  await page.goto('/jornada');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

  const next = page.getByTestId('jornada-next');
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/fhs');
});

test('jornada: progresso parcial avança o próximo módulo', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('workshop-visited-pages', JSON.stringify(['fhs', 'comandos']));
  });
  await page.goto('/jornada');
  await page.waitForLoadState('networkidle');

  // Com /fhs e /comandos visitados, o próximo é /editores
  await expect(page.getByTestId('jornada-next')).toHaveAttribute('href', '/editores');

  // A barra saiu de 0%
  const valueNow = await page.getByRole('progressbar').getAttribute('aria-valuenow');
  expect(Number(valueNow)).toBeGreaterThan(0);
});

test('jornada: clicar "Continue aqui" navega para o módulo', async ({ page }) => {
  await page.goto('/jornada');
  await page.waitForLoadState('networkidle');

  await page.getByTestId('jornada-next').click();
  await expect(page).toHaveURL(/\/fhs$/);
});
