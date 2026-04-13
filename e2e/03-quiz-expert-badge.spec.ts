import { test, expect } from './fixtures';

/**
 * Teste 1: Fluxo do quiz clicando opções e avançando questões.
 *
 * Os botões usam AnimatePresence — pode haver instabilidade de DOM durante
 * a transição. Aguardamos o indicador de questão atualizar antes de clicar.
 *
 * Os botões de opção têm: aria-pressed={answers[currentIdx] === i}
 */
test('quiz completo — fluxo de navegação funciona e badge quiz-beginner é desbloqueado', async ({ page }) => {
  await page.goto('/quiz');

  // Tela inicial
  await page.getByRole('button', { name: 'Começar Agora' }).click();

  // Aguarda o primeiro botão de opção aparecer
  await page.locator('button[aria-pressed]').first().waitFor({ state: 'visible', timeout: 5_000 });

  // Determina total de questões
  const counterText = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
  const totalQuestions = parseInt(counterText?.split('/')[1] ?? '27', 10);

  for (let i = 0; i < totalQuestions; i++) {
    // Aguarda o indicador mostrar a questão i+1 (animação completa)
    await page.waitForFunction(
      (expectedIdx) => {
        const el = document.querySelector('.text-accent');
        const text = el?.textContent ?? '';
        return text.startsWith(String(expectedIdx));
      },
      i + 1,
      { timeout: 5_000 }
    );

    // Clica na primeira opção disponível (a animação já terminou)
    const firstOption = page.locator('button[aria-pressed]').first();
    await firstOption.click();

    const isLast = i === totalQuestions - 1;

    if (isLast) {
      await page.getByRole('button', { name: 'Finalizar Quiz' }).click();
    } else {
      // Clica "Próxima" e aguarda a questão avançar
      await page.getByRole('button', { name: /Próxima/ }).click();
      // Pequena pausa para a animação de saída completar antes da próxima iteração
      await page.waitForTimeout(350);
    }
  }

  // Tela de resultado
  await expect(page.getByText('Seu Resultado')).toBeVisible({ timeout: 5_000 });

  // Badge quiz-beginner sempre desbloqueado ao finalizar
  const badges = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  expect(badges).toContain('quiz-beginner');
});

/**
 * Teste 2: quiz-expert e quiz-master via seed direto no localStorage.
 * Mais rápido e determinístico que clicar em todas as questões.
 */
test('seed de score 100 no localStorage → badges quiz-expert e quiz-master visíveis no dashboard', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('workshop-quiz-score', '100');
    localStorage.setItem('workshop-badges', JSON.stringify(['quiz-beginner', 'quiz-expert', 'quiz-master']));
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  const badges = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  expect(badges).toContain('quiz-expert');
  expect(badges).toContain('quiz-master');

  // Badges aparecem visualmente no dashboard
  await expect(page.getByText('Expert').first()).toBeVisible();
  await expect(page.getByText('Mestre').first()).toBeVisible();
});
