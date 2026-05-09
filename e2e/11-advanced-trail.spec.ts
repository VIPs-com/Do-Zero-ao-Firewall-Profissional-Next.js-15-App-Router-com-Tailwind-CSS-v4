import { test, expect } from './fixtures';

/**
 * Sprint Advanced-E2E — E2E da Trilha Avançada (20 módulos v3.0→v5.0)
 *
 * Espelha 10-fundamentos-trail.spec.ts para a trilha avançada.
 *
 * ADVANCED_ORDER (src/data/courseOrder.ts):
 *   v3.0 Servidores (8): /dhcp → /samba → /apache → /openvpn →
 *                        /traefik → /ldap → /pihole → /nfs
 *   v4.0 Infraestrutura (8): /ansible → /monitoring → /kubernetes → /terraform →
 *                             /suricata → /ebpf → /service-mesh → /sre
 *   v5.0 Cloud (4): /cicd → /opnsense → /nextcloud → /ebpf-avancado
 *
 * Casos testados:
 *   1. /avancados renderiza o índice com módulos das 3 fases
 *   2. Visitar /dhcp registra a visita no localStorage
 *   3. Badge advanced-master seeded aparece no dashboard
 *   4. ModuleNav em /dhcp: sem Anterior (1º da trilha), Próximo → /samba
 *   5. ModuleNav em /ebpf-avancado: Anterior → /nextcloud, sem Próximo (último)
 *   6. advanced-master desbloqueado ao visitar todos os 20 módulos
 */

/** Todos os paths da ADVANCED_ORDER */
const ALL_ADVANCED_PATHS = [
  '/dhcp', '/samba', '/apache', '/openvpn', '/traefik', '/ldap', '/pihole', '/nfs',
  '/ansible', '/monitoring', '/kubernetes', '/terraform', '/suricata', '/ebpf',
  '/service-mesh', '/sre', '/cicd', '/opnsense', '/nextcloud', '/ebpf-avancado',
];

// ── 1. Índice /avancados ──────────────────────────────────────────────────

test('/avancados renderiza o índice com módulos das 3 fases', async ({ page }) => {
  await page.goto('/avancados');
  await page.waitForLoadState('networkidle');

  // Título da trilha
  await expect(page.getByRole('heading', { name: /avançad/i }).first()).toBeVisible();

  // Amostra de módulos das 3 fases
  await expect(page.getByText(/Servidor DHCP/i).first()).toBeVisible();        // v3.0
  await expect(page.getByText(/Kubernetes/i).first()).toBeVisible();           // v4.0
  await expect(page.getByText(/GitHub Actions|CI\/CD/i).first()).toBeVisible(); // v5.0
  await expect(page.getByText(/eBPF Avançado/i).first()).toBeVisible();        // último
});

// ── 2. Rastreamento de visita ─────────────────────────────────────────────

test('visitar /dhcp registra a visita no localStorage', async ({ page }) => {
  await page.goto('/dhcp');
  await page.waitForLoadState('networkidle');

  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-visited-pages') ?? '[]') as string[])
          .some(p => p.includes('dhcp'));
      } catch { return false; }
    },
    { timeout: 5_000 }
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-visited-pages'));
  const pages = JSON.parse(raw ?? '[]') as string[];
  expect(pages.some(p => p.includes('dhcp'))).toBe(true);
});

// ── 3. Badge advanced-master seeded aparece no dashboard ──────────────────

test('badge advanced-master seeded aparece no dashboard', async ({ page }) => {
  await page.evaluate((paths) => {
    localStorage.setItem('workshop-badges', JSON.stringify(['advanced-master']));
    localStorage.setItem('workshop-visited-pages', JSON.stringify(paths));
  }, ALL_ADVANCED_PATHS);

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Badge card 'Advanced Master' visível no grid de badges
  await expect(page.getByText('Advanced Master').first()).toBeVisible();
});

// ── 4. ModuleNav em /dhcp: sem Anterior (1º), Próximo → /samba ───────────

test('ModuleNav em /dhcp: sem Anterior, Próximo aponta para /samba', async ({ page }) => {
  await page.goto('/dhcp');
  await page.waitForLoadState('networkidle');

  // Primeiro módulo da trilha avançada: sem botão Anterior
  await expect(page.getByRole('link', { name: /anterior/i })).not.toBeVisible();

  // Próximo deve apontar para /samba
  const next = page.getByRole('link', { name: /samba|próximo/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/samba');
});

// ── 5. ModuleNav em /ebpf-avancado: Anterior → /nextcloud, sem Próximo ───

test('ModuleNav em /ebpf-avancado: Anterior aponta para /nextcloud, sem Próximo', async ({ page }) => {
  await page.goto('/ebpf-avancado');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /nextcloud (penúltimo)
  const prev = page.getByRole('link', { name: /nextcloud|anterior/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/nextcloud');

  // Último módulo da trilha: sem botão Próximo
  await expect(page.getByRole('link', { name: /próximo/i })).not.toBeVisible();
});

// ── 6. Desbloqueio real do badge ao visitar todos os 20 módulos ──────────

test('advanced-master é desbloqueado ao visitar todos os 20 módulos', async ({ page }) => {
  // Seed: todos os 20 paths visitados, sem pré-seedar o badge
  await page.evaluate((paths) => {
    localStorage.removeItem('workshop-badges');
    localStorage.setItem('workshop-visited-pages', JSON.stringify(paths));
  }, ALL_ADVANCED_PATHS);

  // Navega para /avancados — BadgeContext executa o useEffect de visitedPages
  await page.goto('/avancados');
  await page.waitForLoadState('networkidle');

  // Aguarda o badge ser gravado no localStorage (useEffect assíncrono)
  await page.waitForFunction(
    () => {
      try {
        return (JSON.parse(localStorage.getItem('workshop-badges') ?? '[]') as string[])
          .includes('advanced-master');
      } catch { return false; }
    },
    { timeout: 5_000 }
  );

  const raw = await page.evaluate(() => localStorage.getItem('workshop-badges'));
  const badges = JSON.parse(raw ?? '[]') as string[];
  expect(badges).toContain('advanced-master');
});
