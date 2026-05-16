import { test, expect } from './fixtures';

/**
 * Sprint CERTIFICACOES — hub /certificacoes (LPIC-1 / CompTIA Linux+).
 *
 * Página de mapeamento: tópico de certificação → módulo do Workshop.
 * O smoke test (15) cobre a renderização; aqui validamos o conteúdo
 * e a navegação dos links de módulo.
 */

test('certificações: hub exibe o mapa LPIC-1 / CompTIA Linux+', async ({ page }) => {
  await page.goto('/certificacoes');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /rumo à certificação linux/i })).toBeVisible();

  // Domínios do núcleo comum
  await expect(page.getByRole('heading', { name: /linha de comando gnu\/unix/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /usuários, grupos e permissões/i })).toBeVisible();

  // Bloco de diagnóstico (strace/ltrace/lsof — cai na LPIC-1)
  await expect(page.getByRole('heading', { name: /strace, ltrace e lsof/i })).toBeVisible();
});

test('certificações: link de módulo navega para o conteúdo', async ({ page }) => {
  await page.goto('/certificacoes');
  await page.waitForLoadState('networkidle');

  // O link de "Pacotes" leva ao módulo /pacotes
  const link = page.getByRole('link', { name: 'Pacotes' }).first();
  await expect(link).toHaveAttribute('href', '/pacotes');
  await link.click();
  await expect(page).toHaveURL('/pacotes');
});
