import { test, expect } from './fixtures';

/**
 * Testa o componente ModuleNav (Anterior / Próximo) nos extremos da sequência.
 *
 * Sequência: instalacao → wan-nat → ... → quiz → certificado
 * Arquivo:   src/components/ui/ModuleNav.tsx + src/data/courseOrder.ts
 *
 * Casos testados:
 *   1. Primeiro módulo (/instalacao) — sem Anterior, Próximo visível
 *   2. Módulo intermediário (/wan-nat) — ambos visíveis
 *   3. Último módulo (/certificado) — Anterior visível, sem Próximo
 */

// ModuleNav: prev/next usam aria-label estável ("Módulo anterior:" / "Próximo módulo:")
// — locators precisos evitam strict-mode violation com links homônimos da página.

test('ModuleNav em /instalacao: sem Anterior, Próximo aponta para /wan-nat', async ({ page }) => {
  await page.goto('/instalacao');
  await page.waitForLoadState('networkidle');

  // Primeiro módulo: sem botão Anterior
  await expect(page.getByRole('link', { name: /^módulo anterior:/i })).not.toBeVisible();

  // Próximo é o 2º módulo (/wan-nat)
  const next = page.getByRole('link', { name: /^próximo módulo:/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/wan-nat');
});

test('ModuleNav em /wan-nat: tem Anterior (Instalação) e Próximo (DNS)', async ({ page }) => {
  await page.goto('/wan-nat');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /instalacao
  const prev = page.getByRole('link', { name: /^módulo anterior:/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/instalacao');

  // Próximo aponta para /dns
  const next = page.getByRole('link', { name: /^próximo módulo:/i });
  await expect(next).toBeVisible();
  await expect(next).toHaveAttribute('href', '/dns');
});

test('ModuleNav em /certificado: tem Anterior (Quiz), sem Próximo', async ({ page }) => {
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /quiz
  const prev = page.getByRole('link', { name: /^módulo anterior:/i });
  await expect(prev).toBeVisible();
  await expect(prev).toHaveAttribute('href', '/quiz');

  // Último módulo: sem botão Próximo
  await expect(page.getByRole('link', { name: /^próximo módulo:/i })).not.toBeVisible();
});

// ── Sprint TRILHA-GUIADA — handoff de fim-de-trilha ────────────────────────────

test('ModuleNav handoff: /troubleshooting (Fundamentos) → /instalacao (Firewall)', async ({ page }) => {
  await page.goto('/troubleshooting');
  await page.waitForLoadState('networkidle');

  const handoff = page.getByRole('link', { name: /trilha fundamentos conclu.da.*continue em trilha firewall/i });
  await expect(handoff).toBeVisible();
  await expect(handoff).toHaveAttribute('href', '/instalacao');
});

test('ModuleNav handoff: /certificado (Firewall) → /avancados', async ({ page }) => {
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  const handoff = page.getByRole('link', { name: /trilha firewall conclu.da.*continue em trilha avan.ada/i });
  await expect(handoff).toBeVisible();
  await expect(handoff).toHaveAttribute('href', '/avancados');
});

test('ModuleNav handoff: /resposta-incidentes (capstone) → /jornada', async ({ page }) => {
  await page.goto('/resposta-incidentes');
  await page.waitForLoadState('networkidle');

  const handoff = page.getByRole('link', { name: /trilha avan.ada conclu.da.*continue em sua jornada completa/i });
  await expect(handoff).toBeVisible();
  await expect(handoff).toHaveAttribute('href', '/jornada');
});
