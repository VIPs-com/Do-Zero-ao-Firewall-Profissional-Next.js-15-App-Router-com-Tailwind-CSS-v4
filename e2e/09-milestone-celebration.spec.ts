import { test, expect } from './fixtures';

/**
 * Sprint CE-E2E — MilestoneCelebration modal
 *
 * Estratégia: seed 'quiz-master' direto no localStorage + reload.
 * O BadgeContext hidrata e detecta que quiz-master é um MILESTONE_BADGE,
 * setando milestoneBadge → BadgeProvider renderiza o modal.
 *
 * O badge 'quiz-master' é ideal para testar porque:
 *   - É ativado apenas pelo score (sem dependência de checklist/visits)
 *   - É um MILESTONE_BADGE (dispara modal, não toast)
 *   - Seu CTA navega para /dashboard (fácil de assertar)
 */

test('modal de celebração aparece ao hidratar com milestone badge', async ({ page }) => {
  // Seed: quiz-master desbloqueado + score 100
  await page.evaluate(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(['quiz-master']));
    localStorage.setItem('workshop-quiz-score', '100');
  });

  // Reload para acionar hidratação do BadgeContext
  // Nota: após hidratação, milestoneBadge fica null (já estava no Set antes)
  // Para dispara o modal, precisamos que unlockBadge() seja chamado pela primeira vez.
  // Seed via quiz-score = 100 → useEffect → unlockBadge('quiz-master') → modal.
  // Limpamos workshop-badges para forçar o desbloqueio fresco.
  await page.evaluate(() => {
    localStorage.removeItem('workshop-badges'); // força desbloqueio fresh
    localStorage.setItem('workshop-quiz-score', '100');
  });

  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  // O useEffect do quizScore em BadgeContext dispara unlockBadge('quiz-master')
  // → milestoneBadge !== null → MilestoneCelebration renderiza
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 5_000 });
});

test('modal de milestone exibe título do badge correto', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('workshop-badges');
    localStorage.setItem('workshop-quiz-score', '100');
  });

  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 5_000 });

  // Título do badge quiz-master = "Mestre"
  await expect(modal.getByText('Mestre')).toBeVisible();
  // Label superior
  await expect(modal.getByText('Badge Desbloqueado!')).toBeVisible();
});

test('ESC fecha o modal de milestone', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('workshop-badges');
    localStorage.setItem('workshop-quiz-score', '100');
  });

  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 5_000 });

  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible({ timeout: 3_000 });
});

test('botão fechar (×) fecha o modal de milestone', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('workshop-badges');
    localStorage.setItem('workshop-quiz-score', '100');
  });

  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 5_000 });

  await modal.getByLabel('Fechar celebração').click();
  await expect(modal).not.toBeVisible({ timeout: 3_000 });
});

test('CTA do modal navega para o destino correto', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('workshop-badges');
    localStorage.setItem('workshop-quiz-score', '100');
  });

  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 5_000 });

  // CTA do quiz-master = "Ver meu progresso" → /dashboard
  await modal.getByText('Ver meu progresso').click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('milestones NÃO exibem o toast genérico de 4s', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('workshop-badges');
    localStorage.setItem('workshop-quiz-score', '100');
  });

  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  // Modal deve aparecer
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

  // Toast (texto "Badge desbloqueado!" fora de role=dialog) NÃO deve existir
  // O toast usa text-xs + font-mono; o modal usa texto diferente internamente.
  // Verificamos que o toast de slide-in (fixed bottom-6 right-6 z-50) não está presente.
  const toast = page.locator('.fixed.bottom-6.right-6.z-50');
  await expect(toast).not.toBeVisible();
});
