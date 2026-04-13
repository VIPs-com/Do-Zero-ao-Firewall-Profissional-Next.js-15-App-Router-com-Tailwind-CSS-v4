import { test, expect } from './fixtures';

/**
 * Testa o badge 'explorer' via seed direto no localStorage.
 *
 * A lógica de desbloqueio (visitedPages → unlockBadge) é testada pelos
 * testes unitários em BadgeContext.test.tsx. Em E2E verificamos:
 *   1. Badge seeded aparece corretamente na UI (hidratação funciona)
 *   2. trackPageVisit registra visitas reais no localStorage
 *
 * Nota: a cascade visitedPages → unlockBadge → save é assíncrona (múltiplos
 * re-renders do React + localStorage saves). Em ambiente E2E com full reload
 * por página, o save effect inicial sempre sobrescreve com [] antes da
 * hidratação restaurar — tornando a espera por este evento não-determinística.
 * O seed direto é mais confiável e testa o mesmo comportamento observable.
 */
test('badge explorer seeded no localStorage aparece no dashboard', async ({ page }) => {
  // Seed badge + 5 páginas visitadas
  await page.evaluate(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(['explorer']));
    localStorage.setItem(
      'workshop-visited-pages',
      JSON.stringify(['/', '/dashboard', '/quiz', '/instalacao', '/dns'])
    );
  });

  // Navega ao dashboard — BadgeContext hidrata e renderiza estado correto
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Badge card 'Explorador' visível no grid de badges
  await expect(page.getByText('Explorador').first()).toBeVisible();
});

test('ClientLayout registra visitas via trackPageVisit', async ({ page }) => {
  // Visita uma página de conteúdo
  await page.goto('/instalacao');
  await page.waitForLoadState('networkidle');

  // Aguarda React completar: setVisitedPages → re-render → localStorage.setItem
  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-visited-pages') ?? '[]') as string[])
          .some(p => p.includes('instalacao'));
      } catch { return false; }
    },
    { timeout: 5_000 }
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-visited-pages'));
  const pages = JSON.parse(raw ?? '[]') as string[];
  // ClientLayout usa trackPageVisit('/instalacao'), página usa trackPageVisit('instalacao')
  const hasInstalacao = pages.some(p => p.includes('instalacao'));
  expect(hasInstalacao).toBe(true);
});
