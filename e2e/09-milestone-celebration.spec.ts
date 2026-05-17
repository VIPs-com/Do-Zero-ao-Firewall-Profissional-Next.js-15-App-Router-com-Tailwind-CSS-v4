import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Sprint CE-E2E — MilestoneCelebration modal
 *
 * Estratégia: semear `workshop-quiz-score = 100` via `addInitScript` (não
 * `page.evaluate`) — o script é injetado ANTES de qualquer script da página,
 * então a hidratação do BadgeContext já lê o score semeado. O useEffect de
 * `quizScore` chama `unlockBadge('quiz-master')` → como é um MILESTONE_BADGE,
 * o BadgeProvider renderiza o modal de celebração.
 *
 * `workshop-badges` é removido no seed para forçar um desbloqueio "fresco"
 * (se quiz-master já estivesse no Set, não dispararia o modal).
 *
 * O badge 'quiz-master' é ideal: ativado só pelo score (sem checklist/visits),
 * é MILESTONE_BADGE (modal, não toast) e o CTA navega para /dashboard.
 */

/** Semeia o cenário quiz-master via addInitScript — determinístico em CI. */
async function seedQuizMaster(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem('workshop-badges'); // força desbloqueio fresco
    localStorage.setItem('workshop-quiz-score', '100');
  });
}

const MODAL_TIMEOUT = 10_000; // tolerância para runners lentos de CI

test('modal de celebração aparece ao hidratar com milestone badge', async ({ page }) => {
  await seedQuizMaster(page);
  await page.goto('/quiz');

  // useEffect de quizScore em BadgeContext → unlockBadge('quiz-master')
  // → milestoneBadge !== null → MilestoneCelebration renderiza
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: MODAL_TIMEOUT });
});

test('modal de milestone exibe título do badge correto', async ({ page }) => {
  await seedQuizMaster(page);
  await page.goto('/quiz');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: MODAL_TIMEOUT });

  // Título do badge quiz-master = "Mestre" · label superior
  await expect(modal.getByText('Mestre')).toBeVisible();
  await expect(modal.getByText('Badge Desbloqueado!')).toBeVisible();
});

test('ESC fecha o modal de milestone', async ({ page }) => {
  await seedQuizMaster(page);
  await page.goto('/quiz');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: MODAL_TIMEOUT });

  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible({ timeout: 3_000 });
});

test('botão fechar (×) fecha o modal de milestone', async ({ page }) => {
  await seedQuizMaster(page);
  await page.goto('/quiz');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: MODAL_TIMEOUT });

  await modal.getByLabel('Fechar celebração').click();
  await expect(modal).not.toBeVisible({ timeout: 3_000 });
});

test('CTA do modal navega para o destino correto', async ({ page }) => {
  await seedQuizMaster(page);
  await page.goto('/quiz');

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: MODAL_TIMEOUT });

  // CTA do quiz-master = "Ver meu progresso" → /dashboard
  await modal.getByText('Ver meu progresso').click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('milestones NÃO exibem o toast genérico de 4s', async ({ page }) => {
  await seedQuizMaster(page);
  await page.goto('/quiz');

  await expect(page.getByRole('dialog')).toBeVisible({ timeout: MODAL_TIMEOUT });

  // O toast de slide-in (fixed bottom-6 right-6 z-50) não deve existir para milestones
  await expect(page.locator('.fixed.bottom-6.right-6.z-50')).not.toBeVisible();
});
