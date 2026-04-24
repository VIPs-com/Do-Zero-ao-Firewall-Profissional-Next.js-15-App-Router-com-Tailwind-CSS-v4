import { test, expect } from './fixtures';

/**
 * Sprint T-Fund — E2E da Trilha Fundamentos Linux
 *
 * Cobre os principais comportamentos observáveis:
 *   1. /fundamentos renderiza o índice com os 10 módulos listados
 *   2. Visitar /fhs registra a visita no localStorage
 *   3. Checkpoint de um módulo Fundamentos é contabilizado no dashboard
 *   4. Badge fundamentos-master seeded aparece no dashboard
 *   5. ModuleNav em /fhs: sem Anterior, Próximo aponta para /comandos
 *   6. ModuleNav em /comandos: Anterior (FHS) + Próximo (Editores)
 *   7. ModuleNav em /cron: Anterior (Shell Script), sem Próximo
 *   8. Badge fundamentos-master desbloqueado ao completar todos os 10 checkpoints
 *
 * Os checkpoints da trilha Fundamentos (10 IDs):
 *   fhs-explorado | comandos-praticados | editores-usados | processos-controlados |
 *   permissoes-configuradas | discos-mapeados | logs-lidos | backup-criado |
 *   script-escrito | tarefa-agendada
 */

const ALL_FUNDAMENTOS_CHECKPOINTS: Record<string, boolean> = {
  'fhs-explorado': true,
  'comandos-praticados': true,
  'editores-usados': true,
  'processos-controlados': true,
  'permissoes-configuradas': true,
  'discos-mapeados': true,
  'logs-lidos': true,
  'backup-criado': true,
  'script-escrito': true,
  'tarefa-agendada': true,
};

// ── 1. Índice /fundamentos ─────────────────────────────────────────────────

test('/fundamentos renderiza o índice com os 10 módulos', async ({ page }) => {
  await page.goto('/fundamentos');
  await page.waitForLoadState('networkidle');

  // Título da trilha
  await expect(page.getByRole('heading', { name: /fundamentos linux/i })).toBeVisible();

  // Os 10 módulos devem estar listados (verificamos uma amostra)
  await expect(page.getByText(/Estrutura do Sistema/i).first()).toBeVisible(); // Módulo 01
  await expect(page.getByText(/Comandos Essenciais/i).first()).toBeVisible();  // Módulo 02
  await expect(page.getByText(/Agendamento de Tarefas/i).first()).toBeVisible(); // Módulo 10
});

// ── 2. Rastreamento de visita ──────────────────────────────────────────────

test('visitar /fhs registra a visita no localStorage', async ({ page }) => {
  await page.goto('/fhs');
  await page.waitForLoadState('networkidle');

  // Aguarda o useEffect trackPageVisit('/fhs') persistir no localStorage
  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-visited-pages') ?? '[]') as string[])
          .some(p => p.includes('fhs'));
      } catch { return false; }
    },
    { timeout: 5_000 }
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-visited-pages'));
  const pages = JSON.parse(raw ?? '[]') as string[];
  expect(pages.some(p => p.includes('fhs'))).toBe(true);
});

// ── 3. Checkpoint Fundamentos reflete no dashboard ─────────────────────────

test('checkpoint de módulo Fundamentos é contabilizado no dashboard', async ({ page }) => {
  // Seed: apenas 1 checkpoint Fundamentos
  await page.evaluate(() => {
    localStorage.setItem('workshop-checklist-v2', JSON.stringify({ 'fhs-explorado': true }));
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Labs Concluídos deve mostrar 1/76
  await expect(page.getByText('1/76')).toBeVisible();
});

// ── 4. Badge fundamentos-master seeded aparece no dashboard ───────────────

test('badge fundamentos-master seeded aparece no dashboard', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(['fundamentos-master']));
    localStorage.setItem(
      'workshop-checklist-v2',
      JSON.stringify({
        'fhs-explorado': true, 'comandos-praticados': true, 'editores-usados': true,
        'processos-controlados': true, 'permissoes-configuradas': true, 'discos-mapeados': true,
        'logs-lidos': true, 'backup-criado': true, 'script-escrito': true, 'tarefa-agendada': true,
      })
    );
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Badge card 'Fundamentos Master' visível no grid de badges
  await expect(page.getByText('Fundamentos Master').first()).toBeVisible();
});

// ── 5-7. ModuleNav da Trilha Fundamentos ──────────────────────────────────

test('ModuleNav em /fhs: sem Anterior, Próximo aponta para /comandos', async ({ page }) => {
  await page.goto('/fhs');
  await page.waitForLoadState('networkidle');

  // Primeiro módulo: sem botão Anterior
  await expect(page.getByRole('link', { name: /anterior/i })).not.toBeVisible();

  // Próximo deve conter "Comandos" (2º módulo da trilha Fundamentos)
  const next = page.getByRole('link', { name: /comandos|próximo/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/comandos');
});

test('ModuleNav em /comandos: tem Anterior (FHS) e Próximo (Editores)', async ({ page }) => {
  await page.goto('/comandos');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /fhs
  const prev = page.getByRole('link', { name: /fhs|estrutura|anterior/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/fhs');

  // Próximo aponta para /editores
  const next = page.getByRole('link', { name: /editores|próximo/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/editores');
});

test('ModuleNav em /cron: tem Anterior (Shell Script), sem Próximo', async ({ page }) => {
  await page.goto('/cron');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /shell-script
  const prev = page.getByRole('link', { name: /shell|script|anterior/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/shell-script');

  // Último módulo: sem botão Próximo
  await expect(page.getByRole('link', { name: /próximo/i })).not.toBeVisible();
});

// ── 8. Desbloqueio real do badge via checkpoints ───────────────────────────

test('fundamentos-master é desbloqueado ao completar os 10 checkpoints', async ({ page }) => {
  // Seed checklist completo SEM pré-seedar o badge
  await page.evaluate(
    (checkpoints) => {
      localStorage.removeItem('workshop-badges');
      localStorage.setItem('workshop-checklist-v2', JSON.stringify(checkpoints));
    },
    ALL_FUNDAMENTOS_CHECKPOINTS,
  );

  // Navega para /fundamentos — BadgeContext executa o useEffect do checklist
  await page.goto('/fundamentos');
  await page.waitForLoadState('networkidle');

  // Aguarda o badge ser gravado no localStorage (useEffect assíncrono)
  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-badges') ?? '[]') as string[])
          .includes('fundamentos-master');
      } catch { return false; }
    },
    { timeout: 5_000 }
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  const badges = JSON.parse(raw ?? '[]') as string[];
  expect(badges).toContain('fundamentos-master');
});
