import { test, expect } from './fixtures';

/**
 * Sprint E2E-Progress — cobertura do ProgressDropdown no header.
 *
 * Botão de progresso no header (X/Y módulos) que abre um dialog com 3 abas
 * de trilha (Firewall / Fundamentos / Avançados). A11y: aria-expanded,
 * role=dialog, role=tab, ESC fecha.
 */

test('progress dropdown: abre e fecha o painel a partir do header', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const trigger = page.getByRole('button', { name: /seu progresso/i });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();
  await expect(page.getByRole('dialog', { name: /seu progresso/i })).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('progress dropdown: alternar entre as abas de trilha', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /seu progresso/i }).click();

  const firewallTab = page.getByRole('tab', { name: /firewall/i });
  const fundamentosTab = page.getByRole('tab', { name: /fundamentos/i });

  await expect(firewallTab).toHaveAttribute('aria-selected', 'true');

  await fundamentosTab.click();
  await expect(fundamentosTab).toHaveAttribute('aria-selected', 'true');
  await expect(firewallTab).toHaveAttribute('aria-selected', 'false');
});

test('progress dropdown: ESC fecha o painel', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const trigger = page.getByRole('button', { name: /seu progresso/i });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: /seu progresso/i })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /seu progresso/i })).not.toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
