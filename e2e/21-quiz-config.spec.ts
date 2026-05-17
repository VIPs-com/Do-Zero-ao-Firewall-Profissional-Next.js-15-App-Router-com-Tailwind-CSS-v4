import { test, expect } from './fixtures';

/**
 * Sprint E2E-Quiz — cobertura da tela de configuração do quiz.
 *
 * O fluxo de jogar o quiz já é coberto por 03-quiz-expert-badge.spec.ts.
 * Aqui validamos a tela inicial: seletor de trilha, tamanho de sessão,
 * preview de contagem e os parâmetros de URL `?trail=`.
 */

test('quiz: tela inicial mostra os seletores de trilha e de sessão', async ({ page }) => {
  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('radiogroup', { name: /trilha do quiz/i })).toBeVisible();
  await expect(page.getByRole('radiogroup', { name: /tamanho da sessão/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Começar Quiz' })).toBeVisible();
});

test('quiz: escolher sessão "Completo" aumenta a contagem de preview', async ({ page }) => {
  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  const startBtn = page.getByRole('button', { name: 'Começar Quiz' });

  // Padrão é "Rápido" (20 questões)
  await expect(startBtn).toContainText('20 questões');

  // "Completo" → todas as questões da trilha (muito mais que 20)
  await page.getByRole('radio', { name: /completo/i }).click();
  await expect(startBtn).not.toContainText('20 questões');
  await expect(startBtn).toContainText(/\d{3} questões/); // contagem de 3 dígitos
});

test('quiz: ?trail=fundamentos pré-seleciona a trilha Fundamentos', async ({ page }) => {
  await page.goto('/quiz?trail=fundamentos');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('radio', { name: /fundamentos/i })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: /todas as trilhas/i })).toHaveAttribute('aria-checked', 'false');
});

test('quiz: trocar de trilha atualiza o radio selecionado', async ({ page }) => {
  await page.goto('/quiz');
  await page.waitForLoadState('networkidle');

  await page.getByRole('radio', { name: /firewall/i }).click();

  await expect(page.getByRole('radio', { name: /firewall/i })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: /todas as trilhas/i })).toHaveAttribute('aria-checked', 'false');
});
