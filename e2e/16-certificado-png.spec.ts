import { test, expect } from './fixtures';

/**
 * Sprint CERT-SHARE — download do certificado em PNG via Canvas.
 *
 * O certificado só é liberado quando `isReady`:
 *   checklistPercentage >= 90  &&  quizScore >= 80
 *
 * checklistPercentage = round(valores true no checklist / 199 * 100) — conta
 * QUALQUER valor true (BadgeContext.checklistPercentage), então seedar 185
 * chaves true resulta em ~93%.
 */

/**
 * Seed que satisfaz isReady (185/199 ≈ 93% + quiz score).
 *
 * Usa `addInitScript` em vez de `evaluate`: o BadgeContext tem um save effect
 * que grava o checklist no mount — semear via `evaluate` antes do `goto` é
 * não-determinístico (o save inicial pode sobrescrever). `addInitScript` injeta
 * o localStorage ANTES de qualquer script da página, garantindo que a hidratação
 * leia o estado semeado. Chamar ANTES do `page.goto('/certificado')`.
 *
 * Pré-semeia também `workshop-badges` com os milestones que o seed dispararia
 * (linux-ninja ≥129 checkpoints · quiz-master score 100) — caso contrário o
 * modal MilestoneCelebration (z-200) abre no load e intercepta os cliques.
 */
async function seedReady(page: import('@playwright/test').Page, quizScore: number) {
  await page.addInitScript((score) => {
    const checklist: Record<string, boolean> = {};
    for (let i = 0; i < 185; i++) checklist[`chk-${i}`] = true;
    localStorage.setItem('workshop-checklist-v2', JSON.stringify(checklist));
    localStorage.setItem('workshop-quiz-score', String(score));
    localStorage.setItem(
      'workshop-badges',
      JSON.stringify(['quiz-beginner', 'quiz-expert', 'quiz-master', 'linux-ninja']),
    );
  }, quizScore);
}

test('certificado: requisitos pendentes bloqueiam a geração', async ({ page }) => {
  // Sem seed — fixture já limpou o localStorage
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Requisitos Pendentes')).toBeVisible();
  // Botão de PNG não existe enquanto o certificado não está liberado
  await expect(page.getByRole('button', { name: /baixar png/i })).not.toBeVisible();
});

test('certificado: botões Baixar PNG / Imprimir / Compartilhar aparecem quando liberado', async ({ page }) => {
  await seedReady(page, 85);
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('button', { name: /baixar png/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /imprimir/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /compartilhar/i })).toBeVisible();
});

test('certificado: clicar em "Baixar PNG" gera o arquivo e desbloqueia o badge', async ({ page }) => {
  await seedReady(page, 90);
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  // Preenche o nome — vira o slug do arquivo
  await page.getByLabel(/seu nome completo/i).fill('Ada Lovelace');

  // Clica "Baixar PNG" e captura o evento de download
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /baixar png/i }).click();
  const download = await downloadPromise;

  // Nome do arquivo com slug normalizado (sem acentos, minúsculo, hífens)
  expect(download.suggestedFilename()).toBe('certificado-workshop-linux-ada-lovelace.png');

  // Badge 'certificado' desbloqueado ao baixar
  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-badges') ?? '[]') as string[])
          .includes('certificado');
      } catch { return false; }
    },
    { timeout: 5_000 },
  );
});

test('certificado: nome com acentos gera slug normalizado no arquivo', async ({ page }) => {
  await seedReady(page, 100);
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  await page.getByLabel(/seu nome completo/i).fill('João Conceição');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /baixar png/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('certificado-workshop-linux-joao-conceicao.png');
});
