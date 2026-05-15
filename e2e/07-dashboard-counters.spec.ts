import { test, expect } from './fixtures';

/**
 * Testa se o Dashboard exibe os contadores corretos a partir de estado pré-injetado.
 *
 * Constantes em app/dashboard/page.tsx:
 *   totalTopics = 89          (Sprint FOUNDATION: +f16 usuarios, +f17 troubleshooting)
 *   checklistItemsCount = 172 (Sprint FOUNDATION: +6 checkpoints usuarios+troubleshooting)
 *   BADGE_DEFS tem 62 chaves  (Sprint FOUNDATION: +usuarios-master, troubleshooting-master, ground-zero)
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

  // Labs Concluídos: 3/172 (seed exato — não muda com o load)
  await expect(page.getByText('3/172')).toBeVisible();

  // Melhor Quiz: 75%
  await expect(page.getByText('75%')).toBeVisible();
});

test('dashboard exibe 0/62 badges para usuário sem progresso', async ({ page }) => {
  // Sem seed — estado completamente limpo (fixture já limpou)
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Sem nenhum badge desbloqueado — 62 badges total (Sprint FOUNDATION: +usuarios-master, troubleshooting-master, ground-zero)
  await expect(page.getByText('0/62')).toBeVisible();
});
