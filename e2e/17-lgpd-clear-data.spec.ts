import { test, expect } from './fixtures';

/**
 * Sprint LGPD — botão "Apagar todos os meus dados" no Dashboard.
 *
 * O componente ClearDataDialog abre um modal de confirmação; ao confirmar,
 * `clearAllWorkshopData()` remove todas as chaves `workshop-*` e a página
 * recarrega. O cancelamento e o ESC preservam os dados.
 *
 * Marcador de teste: `workshop-student-name` — chave escrita só por
 * /certificado, NUNCA pelo /dashboard, então não há corrida de hidratação.
 */

test('LGPD: cancelar o modal preserva os dados', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => localStorage.setItem('workshop-student-name', 'TESTE-LGPD'));

  await page.getByRole('button', { name: /apagar todos os meus dados/i }).click();
  const dialog = page.getByRole('dialog', { name: /apagar todos os seus dados/i });
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: /^cancelar$/i }).click();
  await expect(dialog).not.toBeVisible();

  const name = await page.evaluate(() => localStorage.getItem('workshop-student-name'));
  expect(name).toBe('TESTE-LGPD');
});

test('LGPD: ESC fecha o modal sem apagar nada', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => localStorage.setItem('workshop-student-name', 'TESTE-LGPD'));

  await page.getByRole('button', { name: /apagar todos os meus dados/i }).click();
  const dialog = page.getByRole('dialog', { name: /apagar todos os seus dados/i });
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();

  const name = await page.evaluate(() => localStorage.getItem('workshop-student-name'));
  expect(name).toBe('TESTE-LGPD');
});

test('LGPD: confirmar apaga todas as chaves workshop-* e recarrega', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => localStorage.setItem('workshop-student-name', 'TESTE-LGPD'));

  await page.getByRole('button', { name: /apagar todos os meus dados/i }).click();
  await page.getByRole('button', { name: /^apagar tudo$/i }).click();

  // O componente chama window.location.reload() — aguarda a chave-marcador
  // sumir (o /dashboard nunca recria workshop-student-name).
  await page.waitForFunction(
    () => localStorage.getItem('workshop-student-name') === null,
    { timeout: 5_000 },
  );

  const name = await page.evaluate(() => localStorage.getItem('workshop-student-name'));
  expect(name).toBeNull();
});
