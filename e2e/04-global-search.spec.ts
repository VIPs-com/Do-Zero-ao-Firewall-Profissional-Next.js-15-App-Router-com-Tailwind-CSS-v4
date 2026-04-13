import { test, expect } from './fixtures';

/**
 * Testa a busca global (⌘K / Ctrl+K).
 *
 * GlobalSearch usa:
 *   role="dialog" aria-labelledby → h2.sr-only "Busca global do Workshop Linux"
 *   input type="text" role="combobox" aria-label="Busca global"
 *
 * handleSelect: router.push(item.href) + onClose() → dialog fecha via AnimatePresence
 */
test('Ctrl+K abre busca, digitar filtra, Enter navega e fecha o dialog', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Abre via Ctrl+K
  await page.keyboard.press('Control+k');

  // Dialog aparece (role="dialog" com conteúdo "Busca global")
  const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Busca global' });
  await expect(dialog).toBeVisible({ timeout: 5_000 });

  // Input com role="combobox" fica focado após 100ms setTimeout
  const input = dialog.locator('[role="combobox"]');
  await expect(input).toBeVisible();
  await input.focus();

  // Digita para filtrar
  await input.fill('dns');

  // Aguarda resultados aparecerem (ao menos 1 botão)
  const results = dialog.locator('button').filter({ hasText: /dns/i });
  await expect(results.first()).toBeVisible({ timeout: 3_000 });

  // Guarda URL atual antes de navegar
  const urlBefore = page.url();

  // Navega com Enter (GlobalSearch.handleKeyDown: e.key === 'Enter' → handleSelect)
  await page.keyboard.press('Enter');

  // Aguarda URL mudar (router.push completou)
  await page.waitForFunction(
    (before) => window.location.href !== before,
    urlBefore,
    { timeout: 10_000 }
  );

  // Dialog fecha (AnimatePresence — aguarda até 5s pela animação de saída)
  await expect(dialog).not.toBeVisible({ timeout: 5_000 });

  // Badge 'searcher' desbloqueado (unlockBadge chamado em handleSearchOpen)
  const badges = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  expect(badges).toContain('searcher');
});

test('ESC fecha a busca global', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.keyboard.press('Control+k');

  const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Busca global' });
  await expect(dialog).toBeVisible({ timeout: 5_000 });

  // ESC → onClose() via keydown listener do GlobalSearch
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible({ timeout: 3_000 });
});
