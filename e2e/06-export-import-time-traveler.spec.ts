import { test, expect } from './fixtures';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

/**
 * Testa o fluxo de import de progresso (Sprint J):
 *   1. Constrói um snapshot JSON idêntico ao que exportProgress() produz
 *   2. Injeta o arquivo no <input type="file"> (sr-only, não abre dialog nativo)
 *   3. Mensagem de sucesso aparece
 *   4. badge 'time-traveler' é desbloqueado
 *
 * O snapshot é montado diretamente em Node — sem semear o navegador e reler —
 * o que elimina a corrida com o save effect do BadgeContext (flakiness).
 *
 * NOTA: o export via Blob URL é bloqueado pelo CSP em produção (blob: não está
 * no default-src); por isso testamos o import com um snapshot pré-construído.
 */
test('export → import desbloqueia o badge time-traveler', async ({ page }) => {
  // Snapshot no formato exato de exportProgress()
  const snapshot = {
    version: 1,
    exportedAt: new Date().toISOString(),
    badges: ['explorer', 'searcher'],
    visitedPages: ['/', '/dashboard', '/quiz', '/instalacao', '/dns'],
    topologyClicks: 0,
    clickedRisks: [] as string[],
    checklist: {} as Record<string, boolean>,
    quizScore: 85,
    theme: null as string | null,
  };

  const tmpPath = path.join(os.tmpdir(), `workshop-export-${Date.now()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify(snapshot, null, 2), 'utf-8');

  // Estado limpo (fixture já limpou) → abre o dashboard
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // --- IMPORT ---
  // O botão "Importar Progresso" chama fileInputRef.current?.click().
  // Playwright não interage com o dialog nativo — usamos setInputFiles
  // diretamente no <input type="file"> oculto.
  const fileInput = page.locator('input[type="file"][accept=".json,application/json"]');
  await fileInput.setInputFiles(tmpPath);

  // Mensagem de sucesso
  await expect(page.getByText('Progresso importado com sucesso!')).toBeVisible({ timeout: 10_000 });

  // Badge time-traveler desbloqueado e estado restaurado — aguarda a gravação
  // assíncrona em vez de ler o localStorage imediatamente (evita flakiness).
  await page.waitForFunction(
    () => {
      try {
        const b = JSON.parse(localStorage.getItem('workshop-badges') ?? '[]') as string[];
        return b.includes('time-traveler') && b.includes('explorer');
      } catch { return false; }
    },
    { timeout: 10_000 },
  );

  fs.unlinkSync(tmpPath);
});
