import { test, expect } from './fixtures';

/**
 * Sprint E2E-FOUNDATION — Módulos F16 /usuarios e F17 /troubleshooting
 *
 * Cobre os comportamentos observáveis dos dois novos módulos do Sprint FOUNDATION:
 *   1. /usuarios renderiza com 3 abas e conteúdo esperado
 *   2. Visitar /usuarios registra a visita no localStorage
 *   3. Checkpoint 'usuario-criado' contabilizado no dashboard (1/172)
 *   4. Badge usuarios-master seeded aparece no dashboard
 *   5. ModuleNav em /usuarios: Anterior → /permissoes, Próximo → /discos
 *   6. /troubleshooting renderiza com 3 abas e conteúdo esperado
 *   7. Visitar /troubleshooting registra a visita no localStorage
 *   8. Checkpoint 'trouble-conectividade' contabilizado no dashboard
 *   9. Badge troubleshooting-master seeded aparece no dashboard
 *  10. ModuleNav em /troubleshooting: Anterior → /ssh-proxy, sem Próximo (F17 = último)
 *  11. Badge ground-zero desbloqueado ao completar os 17 checkpoints (1 por módulo)
 *
 * checklistItemsCount = 172 (Sprint FOUNDATION)
 * FUNDAMENTOS_ORDER = 17 módulos
 */

// Os 17 primeiros checkpoints (1 por módulo Fundamentos) que disparam ground-zero
const ALL_17_FIRST_CHECKPOINTS: Record<string, boolean> = {
  'fhs-explorado': true,          // F01
  'comandos-praticados': true,    // F02
  'editores-usados': true,        // F03
  'processos-controlados': true,  // F04
  'permissoes-configuradas': true,// F05
  'usuario-criado': true,         // F16 (inserido entre F05 e F06)
  'discos-mapeados': true,        // F06
  'logs-lidos': true,             // F07
  'backup-criado': true,          // F08
  'script-escrito': true,         // F09
  'tarefa-agendada': true,        // F10
  'apt-atualizado': true,         // F11
  'bios-uefi-entendido': true,    // F12
  'sed-dominado': true,           // F13
  'rsyslog-configurado': true,    // F14
  'ssh-dinamico': true,           // F15
  'trouble-conectividade': true,  // F17
};

// ── 1. /usuarios — renderização ──────────────────────────────────────────────

test('/usuarios renderiza com 3 abas e conteúdo esperado', async ({ page }) => {
  await page.goto('/usuarios');
  await page.waitForLoadState('networkidle');

  // Heading principal
  await expect(page.getByRole('heading', { name: /gerenciamento de usuários/i }).first()).toBeVisible();

  // 3 abas presentes (role=tab)
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(3);

  // Conteúdo da aba inicial — conceito/adduser
  await expect(page.getByText(/adduser/i).first()).toBeVisible();
});

// ── 2. Rastreamento de visita /usuarios ───────────────────────────────────────

test('visitar /usuarios registra a visita no localStorage', async ({ page }) => {
  await page.goto('/usuarios');
  await page.waitForLoadState('networkidle');

  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-visited-pages') ?? '[]') as string[])
          .some(p => p.includes('usuarios'));
      } catch { return false; }
    },
    { timeout: 5_000 },
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-visited-pages'));
  const pages = JSON.parse(raw ?? '[]') as string[];
  expect(pages.some(p => p.includes('usuarios'))).toBe(true);
});

// ── 3. Checkpoint /usuarios refletido no dashboard ────────────────────────────

test('checkpoint usuario-criado é contabilizado no dashboard (1/172)', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('workshop-checklist-v2', JSON.stringify({ 'usuario-criado': true }));
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('1/172')).toBeVisible();
});

// ── 4. Badge usuarios-master seeded aparece no dashboard ─────────────────────

test('badge usuarios-master seeded aparece no dashboard', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(['usuarios-master']));
    localStorage.setItem(
      'workshop-checklist-v2',
      JSON.stringify({ 'usuario-criado': true, 'grupo-criado': true, 'sudo-configurado': true }),
    );
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Gestão de Usuários').first()).toBeVisible();
});

// ── 5. ModuleNav em /usuarios ─────────────────────────────────────────────────

test('ModuleNav em /usuarios: Anterior aponta para /permissoes e Próximo para /discos', async ({ page }) => {
  await page.goto('/usuarios');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /permissoes (F05)
  const prev = page.getByRole('link', { name: /permissões|anterior/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/permissoes');

  // Próximo aponta para /discos (F06)
  const next = page.getByRole('link', { name: /discos|próximo/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/discos');
});

// ── 6. /troubleshooting — renderização ───────────────────────────────────────

test('/troubleshooting renderiza com 3 abas e conteúdo esperado', async ({ page }) => {
  await page.goto('/troubleshooting');
  await page.waitForLoadState('networkidle');

  // Heading principal
  await expect(page.getByRole('heading', { name: /troubleshooting/i }).first()).toBeVisible();

  // 3 abas presentes
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(3);

  // Conteúdo da aba inicial — metodologia OSI / ping
  await expect(page.getByText(/ping/i).first()).toBeVisible();
});

// ── 7. Rastreamento de visita /troubleshooting ────────────────────────────────

test('visitar /troubleshooting registra a visita no localStorage', async ({ page }) => {
  await page.goto('/troubleshooting');
  await page.waitForLoadState('networkidle');

  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-visited-pages') ?? '[]') as string[])
          .some(p => p.includes('troubleshooting'));
      } catch { return false; }
    },
    { timeout: 5_000 },
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-visited-pages'));
  const pages = JSON.parse(raw ?? '[]') as string[];
  expect(pages.some(p => p.includes('troubleshooting'))).toBe(true);
});

// ── 8. Checkpoint /troubleshooting refletido no dashboard ─────────────────────

test('checkpoint trouble-conectividade é contabilizado no dashboard', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem(
      'workshop-checklist-v2',
      JSON.stringify({ 'usuario-criado': true, 'trouble-conectividade': true }),
    );
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('2/172')).toBeVisible();
});

// ── 9. Badge troubleshooting-master seeded aparece no dashboard ───────────────

test('badge troubleshooting-master seeded aparece no dashboard', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(['troubleshooting-master']));
    localStorage.setItem(
      'workshop-checklist-v2',
      JSON.stringify({
        'trouble-conectividade': true,
        'trouble-porta': true,
        'trouble-logs': true,
      }),
    );
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Troubleshooting Master').first()).toBeVisible();
});

// ── 10. ModuleNav em /troubleshooting ────────────────────────────────────────

test('ModuleNav em /troubleshooting: Anterior aponta para /ssh-proxy, sem Próximo (F17 = último)', async ({ page }) => {
  await page.goto('/troubleshooting');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /ssh-proxy (F15)
  const prev = page.getByRole('link', { name: /ssh.*proxy|proxy socks|anterior/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/ssh-proxy');

  // Último módulo da trilha Fundamentos: sem botão Próximo
  await expect(page.getByRole('link', { name: /próximo/i })).not.toBeVisible();
});

// ── 11. Badge ground-zero — desbloqueio real via 17 checkpoints ───────────────

test('ground-zero é desbloqueado ao completar os 17 checkpoints exigidos', async ({ page }) => {
  // Seed checklist completo (17 primeiros checkpoints) SEM pré-seedar o badge
  await page.evaluate(
    (checkpoints) => {
      localStorage.removeItem('workshop-badges');
      localStorage.setItem('workshop-checklist-v2', JSON.stringify(checkpoints));
    },
    ALL_17_FIRST_CHECKPOINTS,
  );

  // Navega para /fundamentos — BadgeContext executa useEffect e testa ground-zero
  await page.goto('/fundamentos');
  await page.waitForLoadState('networkidle');

  // Aguarda o badge ser gravado no localStorage
  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-badges') ?? '[]') as string[])
          .includes('ground-zero');
      } catch { return false; }
    },
    { timeout: 5_000 },
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  const badges = JSON.parse(raw ?? '[]') as string[];
  expect(badges).toContain('ground-zero');
});
