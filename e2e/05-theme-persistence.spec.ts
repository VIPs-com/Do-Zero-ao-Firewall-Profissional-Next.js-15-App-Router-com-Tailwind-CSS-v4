import { test, expect } from './fixtures';

/**
 * Testa o toggle de tema e persistência no localStorage.
 *
 * ClientLayout.tsx:
 *   aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
 *
 * Ao ativar light mode: document.documentElement.classList.add('light') + localStorage 'light'
 * Ao ativar dark mode:  document.documentElement.classList.remove('light') + localStorage 'dark'
 *
 * Nota sobre anti-FOUC em E2E:
 *   O script síncrono em layout.tsx aplica a classe ANTES do primeiro paint em browsers reais.
 *   Em ambiente Playwright com build de produção, o CSP nonce per-request e a hidratação do
 *   React podem sobrescrever o className do <html>, tornando esse comportamento difícil de
 *   testar de forma confiável. O que testamos aqui é o mecanismo de toggle e persistência
 *   no localStorage — o comportamento observável pelo usuário real.
 */
test('toggle dark→light funciona, salva no localStorage e toggle light→dark reverte', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Padrão: dark mode
  const isDarkInitially = await page.evaluate(() =>
    !document.documentElement.classList.contains('light')
  );
  expect(isDarkInitially).toBe(true);

  // Botão mostra "Mudar para tema claro" quando em dark mode
  const toggleBtn = page.getByRole('button', { name: 'Mudar para tema claro' });
  await expect(toggleBtn).toBeVisible();

  // Ativa light mode
  await toggleBtn.click();

  // Classe 'light' adicionada ao <html>
  const isLightAfterToggle = await page.evaluate(() =>
    document.documentElement.classList.contains('light')
  );
  expect(isLightAfterToggle).toBe(true);

  // localStorage persistiu 'light'
  const lsTheme = await page.evaluate(() => localStorage.getItem('workshop-theme'));
  expect(lsTheme).toBe('light');

  // Toggle de volta ao dark
  const toggleDark = page.getByRole('button', { name: 'Mudar para tema escuro' });
  await expect(toggleDark).toBeVisible();
  await toggleDark.click();

  // Classe 'light' removida
  const isDarkAfterToggleBack = await page.evaluate(() =>
    !document.documentElement.classList.contains('light')
  );
  expect(isDarkAfterToggleBack).toBe(true);

  // localStorage salva 'dark' ao ativar dark mode (ClientLayout.tsx linha 99)
  const lsThemeDark = await page.evaluate(() => localStorage.getItem('workshop-theme'));
  expect(lsThemeDark).toBe('dark');
});

test('badge night-owl é desbloqueado ao ativar dark mode', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Vai para light primeiro
  await page.getByRole('button', { name: 'Mudar para tema claro' }).click();

  // Volta para dark — isso chama unlockBadge('night-owl')
  await page.getByRole('button', { name: 'Mudar para tema escuro' }).click();
  await page.waitForTimeout(200); // aguarda React salvar no LS

  const badges = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  expect(badges).toContain('night-owl');
});
