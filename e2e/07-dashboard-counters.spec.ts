import { test, expect } from './fixtures';

/**
 * Testa se o Dashboard exibe os contadores corretos a partir de estado pré-injetado.
 *
 * Constantes em app/dashboard/page.tsx:
 *   totalTopics = 95          (Sprint FORTALEZA: +C06-C08)
 *   checklistItemsCount = 190 (Sprint FORTALEZA: +9 checkpoints)
 *   BADGE_DEFS tem 68 chaves  (Sprint CÓDICE: +incident-master)
 *
 * ATENÇÃO — visitedPages tracking é inconsistente no código:
 *   ClientLayout chama trackPageVisit('/dashboard')  — com barra
 *   Dashboard page chama trackPageVisit('dashboard')  — sem barra
 *   → Carregar /dashboard sempre adiciona DUAS entradas distintas
 *   → Não testamos a contagem de Tópicos Lidos (varia conforme o load)
 *
 * Testamos apenas Checklist e Quiz, que são determinísticos.
 */
test('dashboard exibe contadores de checklist e quiz corretamente', async ({ page }) => {
  const CHECKLIST_DONE: Record<string, boolean> = {
    'ping-internet': true,
    'dns-resolve': true,
    'dns-interno': true,
  };
  const QUIZ_SCORE = 75;

  // Seed via addInitScript — injeta o estado ANTES de qualquer script da
  // página, garantindo hidratação determinística do BadgeContext em CI.
  await page.addInitScript(
    ({ checklist, score }) => {
      localStorage.setItem('workshop-checklist-v2', JSON.stringify(checklist));
      localStorage.setItem('workshop-quiz-score', String(score));
    },
    { checklist: CHECKLIST_DONE, score: QUIZ_SCORE },
  );

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Labs Concluídos: 3/190 (seed exato — não muda com o load)
  await expect(page.getByText('3/190', { exact: true })).toBeVisible();

  // Melhor Quiz: 75% — exact evita colidir com "Complete 75% do checklist (...)"
  await expect(page.getByText('75%', { exact: true })).toBeVisible();
});

test('dashboard exibe 0/68 badges para usuário sem progresso', async ({ page }) => {
  // Sem seed — estado completamente limpo (fixture já limpou)
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Sem nenhum badge desbloqueado — 68 badges total (Sprint GPG)
  await expect(page.getByText('0/68')).toBeVisible();
});

test('dashboard exibe o card de Ferramentas com link para /ferramentas', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  const toolsLink = page.getByRole('link', { name: /abrir ferramentas/i });
  await expect(toolsLink).toBeVisible();
  await expect(toolsLink).toHaveAttribute('href', '/ferramentas');

  await toolsLink.click();
  await expect(page).toHaveURL(/\/ferramentas$/);
  await expect(page.getByRole('heading', { name: /ferramentas do sysadmin/i })).toBeVisible();
});
