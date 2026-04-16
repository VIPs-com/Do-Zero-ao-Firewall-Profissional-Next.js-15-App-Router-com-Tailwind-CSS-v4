import { test, expect } from './fixtures';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

/**
 * Testa o fluxo de import de progresso (Sprint J):
 *   1. Seed estado no localStorage e gera snapshot JSON (simula o export)
 *   2. Limpa localStorage
 *   3. Injeta o arquivo no <input type="file"> (sr-only, não abre dialog nativo)
 *   4. Mensagem de sucesso aparece
 *   5. badge 'time-traveler' é desbloqueado
 *
 * NOTA: O export via Blob URL é bloqueado pelo CSP em produção (blob: não está
 * no default-src). Testamos o export indiretamente — geramos o snapshot no
 * formato idêntico ao que exportProgress() produz, e testamos o import completo.
 */
test('export → import desbloqueia o badge time-traveler', async ({ page }) => {
  // Seed estado não-trivial
  await page.evaluate(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(['explorer', 'searcher']));
    localStorage.setItem('workshop-quiz-score', '85');
    localStorage.setItem('workshop-visited-pages', JSON.stringify(['/', '/dashboard', '/quiz', '/instalacao', '/dns']));
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // --- GERAR SNAPSHOT (simula o export sem depender de blob: download) ---
  const snapshot = await page.evaluate(() => {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      badges: JSON.parse(localStorage.getItem('workshop-badges') ?? '[]'),
      visitedPages: JSON.parse(localStorage.getItem('workshop-visited-pages') ?? '[]'),
      topologyClicks: parseInt(localStorage.getItem('workshop-topo-clicks') ?? '0', 10),
      clickedRisks: JSON.parse(localStorage.getItem('workshop-clicked-risks') ?? '[]'),
      checklist: JSON.parse(localStorage.getItem('workshop-checklist-v2') ?? '{}'),
      quizScore: parseInt(localStorage.getItem('workshop-quiz-score') ?? '0', 10),
      theme: localStorage.getItem('workshop-theme'),
    };
  });

  expect(snapshot.version).toBe(1);
  expect(snapshot.badges).toContain('explorer');

  // Salva snapshot como arquivo temporário
  const tmpPath = path.join(os.tmpdir(), `workshop-export-${Date.now()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify(snapshot, null, 2), 'utf-8');

  // --- LIMPA ESTADO ---
  await page.evaluate((keys) => keys.forEach((k: string) => localStorage.removeItem(k)), [
    'workshop-badges', 'workshop-visited-pages', 'workshop-quiz-score',
    'workshop-topo-clicks', 'workshop-clicked-risks', 'workshop-checklist-v2', 'workshop-theme',
  ]);
  await page.reload();
  await page.waitForLoadState('networkidle');

  // --- IMPORT ---
  // O botão "Importar Progresso" chama fileInputRef.current?.click().
  // Playwright não consegue interagir com o dialog nativo de arquivo.
  // Usamos setInputFiles diretamente no <input type="file"> oculto.
  const fileInput = page.locator('input[type="file"][accept=".json,application/json"]');
  await fileInput.setInputFiles(tmpPath);

  // Mensagem de sucesso
  await expect(page.getByText('Progresso importado com sucesso!')).toBeVisible({ timeout: 5_000 });

  // Badge time-traveler desbloqueado e estado restaurado
  const badges = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  expect(badges).toContain('time-traveler');
  expect(badges).toContain('explorer');

  // Limpa arquivo temporário
  fs.unlinkSync(tmpPath);
});
