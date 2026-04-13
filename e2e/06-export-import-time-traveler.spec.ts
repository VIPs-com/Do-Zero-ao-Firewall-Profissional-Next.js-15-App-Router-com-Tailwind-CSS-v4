import { test, expect } from './fixtures';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

/**
 * Testa o fluxo completo de export/import de progresso (Sprint J):
 *   1. Seed estado no localStorage
 *   2. Dashboard → clica "Exportar Progresso" → salva o arquivo
 *   3. Limpa localStorage
 *   4. Injeta o arquivo no <input type="file"> (sr-only, não abre dialog nativo)
 *   5. Mensagem de sucesso aparece
 *   6. badge 'time-traveler' é desbloqueado
 *
 * Dashboard usa:
 *   <input ref={fileInputRef} type="file" accept=".json,application/json"
 *          aria-label="Selecionar arquivo de progresso para importar" className="sr-only" />
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

  // --- EXPORT ---
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Exportar Progresso/i }).click();
  const download = await downloadPromise;

  const tmpPath = path.join(os.tmpdir(), `workshop-export-${Date.now()}.json`);
  await download.saveAs(tmpPath);

  const exportedData = JSON.parse(fs.readFileSync(tmpPath, 'utf-8'));
  expect(exportedData.version).toBe(1);
  expect(exportedData.badges).toContain('explorer');

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
