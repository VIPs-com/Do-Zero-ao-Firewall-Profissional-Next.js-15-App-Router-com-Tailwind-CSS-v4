import { test, expect } from './fixtures';

/**
 * E2E — /treino "Treinamento Tático" (Sprint SRS — Épico B)
 *
 * Estrutura do store: workshop-srs-v1
 *   { version: 1, updatedAt: number, items: Record<number, SRSItem> }
 *
 * SRSItem:
 *   { questionIdx, interval, easeFactor, repetitions,
 *     nextReview (ms), lastReview (ms), lastScore }
 *
 * Para um item ser "pendente" (due): nextReview <= Date.now()
 * Para simular isso, usamos Date.now() - 86_400_000 (ontem).
 */

// ─── Helper: cria um SRSStore com N itens vencidos ─────────────────────────
function makeSRSStore(count: number) {
  const now       = Date.now();
  const yesterday = now - 86_400_000;
  const items: Record<number, object> = {};

  for (let i = 0; i < count; i++) {
    items[i] = {
      questionIdx: i,
      interval:    1,
      easeFactor:  2.5,
      repetitions: 0,
      nextReview:  yesterday,
      lastReview:  yesterday - 86_400_000,
      lastScore:   2,
    };
  }

  return { version: 1, updatedAt: now, items };
}

// ─── 1. Lobby sem dados ────────────────────────────────────────────────────

test('lobby sem dados SRS exibe estado vazio e CTA para o Quiz', async ({ page }) => {
  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  // Título principal
  await expect(page.getByRole('heading', { name: 'Treinamento Tático' })).toBeVisible();

  // Contador de pendentes: 0
  await expect(page.getByText('0').first()).toBeVisible();

  // Mensagem de vazio
  await expect(page.getByText('Nenhuma revisão agendada ainda')).toBeVisible();

  // CTA aponta para /quiz
  const cta = page.getByRole('link', { name: /Ir para o Quiz/ });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '/quiz');
});

// ─── 2. Lobby com pendentes ────────────────────────────────────────────────

test('lobby com 3 itens vencidos exibe contagem e botão Iniciar Missão', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(3));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  // Counter de pendentes mostra 3
  await expect(page.getByText('3').first()).toBeVisible();

  // Botão "Iniciar Missão" com a contagem
  await expect(
    page.getByRole('button', { name: /Iniciar Missão/ })
  ).toBeVisible();
});

// ─── 3. Fluxo: question → Ver Resposta ────────────────────────────────────

test('iniciar missão exibe pergunta com badge e botão Ver Resposta', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(2));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Iniciar Missão/ }).click();

  // Indicador de progresso
  await expect(page.getByText(/Missão 1 \/ 2/)).toBeVisible({ timeout: 5_000 });

  // Pergunta visível (caixa com texto da questão)
  const questionBox = page.locator('.bg-bg-2.border.border-border.rounded-xl').first();
  await expect(questionBox).toBeVisible();

  // Botão Ver Resposta
  await expect(page.getByRole('button', { name: 'Ver Resposta' })).toBeVisible();
});

// ─── 4. Ver Resposta → resposta + score buttons ────────────────────────────

test('clicar Ver Resposta revela resposta correta e 5 botões de score', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(1));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Iniciar Missão/ }).click();
  await page.getByRole('button', { name: 'Ver Resposta' }).click();

  // Label "Resposta correta" aparece
  await expect(page.getByText('✓ Resposta correta')).toBeVisible();

  // 5 botões de score: aria-label="Score N: ..."
  for (let s = 1; s <= 5; s++) {
    await expect(
      page.getByRole('button', { name: new RegExp(`Score ${s}:`) })
    ).toBeVisible();
  }
});

// ─── 5. Score 5 → tela Done ───────────────────────────────────────────────

test('score 5 na última questão leva à tela Sessão concluída', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(1));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Iniciar Missão/ }).click();
  await page.getByRole('button', { name: 'Ver Resposta' }).click();
  await page.getByRole('button', { name: /Score 5:/ }).click();

  // Tela done
  await expect(page.getByText('Sessão concluída')).toBeVisible({ timeout: 5_000 });
});

// ─── 6. SM-2 persiste no localStorage após score ─────────────────────────

test('score 5 avança repetitions de 0→1 no localStorage', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(1));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Iniciar Missão/ }).click();
  await page.getByRole('button', { name: 'Ver Resposta' }).click();
  await page.getByRole('button', { name: /Score 5:/ }).click();

  // Aguarda done screen (garante que o saveSRSData já rodou)
  await page.getByText('Sessão concluída').waitFor({ timeout: 5_000 });

  const raw = await page.evaluate(() => localStorage.getItem('workshop-srs-v1'));
  const store = JSON.parse(raw!);

  // questionIdx 0: score 5 com repetitions=0 → deve ir para repetitions=1, interval=1
  expect(store.items[0].repetitions).toBe(1);
  expect(store.items[0].interval).toBe(1);
  expect(store.items[0].lastScore).toBe(5);
  // easeFactor: 2.5 + 0.1 - (5-5)*(0.08+(5-5)*0.02) = 2.6 (mín 1.3)
  expect(store.items[0].easeFactor).toBeCloseTo(2.6, 2);
});

// ─── 7. Link Dashboard na done screen ─────────────────────────────────────

test('botão Dashboard na tela done navega para /dashboard', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(1));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Iniciar Missão/ }).click();
  await page.getByRole('button', { name: 'Ver Resposta' }).click();
  await page.getByRole('button', { name: /Score 3:/ }).click();

  await page.getByText('Sessão concluída').waitFor({ timeout: 5_000 });

  await page.getByRole('link', { name: /Dashboard/ }).click();
  await expect(page).toHaveURL('/dashboard');
});

// ─── 8. Encerrar sessão volta ao lobby ─────────────────────────────────────

test('botão Encerrar durante sessão retorna ao lobby', async ({ page }) => {
  await page.evaluate((store) => {
    localStorage.setItem('workshop-srs-v1', JSON.stringify(store));
  }, makeSRSStore(3));

  await page.goto('/treino');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /Iniciar Missão/ }).click();
  await page.getByText(/Missão 1 \/ 3/).waitFor({ timeout: 5_000 });

  // Encerrar está visível como botão inline
  await page.getByRole('button', { name: /Encerrar/ }).click();

  // Volta ao lobby — título "Treinamento Tático" e botão Iniciar novamente
  await expect(page.getByRole('heading', { name: 'Treinamento Tático' })).toBeVisible({ timeout: 5_000 });
  await expect(page.getByRole('button', { name: /Iniciar Missão/ })).toBeVisible();
});
