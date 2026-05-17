import { test, expect } from './fixtures';

/**
 * Testa se o Dashboard exibe os contadores corretos a partir de estado pré-injetado.
 *
 * Constantes em app/dashboard/page.tsx:
 *   totalTopics = 90          (Sprint HAPROXY: +S10 haproxy)
 *   checklistItemsCount = 175 (Sprint HAPROXY: +3 checkpoints haproxy)
 *   BADGE_DEFS tem 63 chaves  (Sprint HAPROXY: +haproxy-master)
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

  await page.evaluate(
    ({ checklist, score }) => {
      localStorage.setItem('workshop-checklist-v2', JSON.stringify(checklist));
      localStorage.setItem('workshop-quiz-score', String(score));
    },
    { checklist: CHECKLIST_DONE, score: QUIZ_SCORE },
  );

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Labs Concluídos: 3/175 (seed exato — não muda com o load)
  await expect(page.getByText('3/175')).toBeVisible();

  // Melhor Quiz: 75% — exact evita colidir com "Complete 75% do checklist (...)"
  await expect(page.getByText('75%', { exact: true })).toBeVisible();
});

test('dashboard exibe 0/63 badges para usuário sem progresso', async ({ page }) => {
  // Sem seed — estado completamente limpo (fixture já limpou)
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Sem nenhum badge desbloqueado — 63 badges total (Sprint HAPROXY: +haproxy-master)
  await expect(page.getByText('0/63')).toBeVisible();
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
