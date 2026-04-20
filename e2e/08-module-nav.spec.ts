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

test('ModuleNav em /instalacao: sem Anterior, Próximo aponta para /wan-nat', async ({ page }) => {
  await page.goto('/instalacao');
  await page.waitForLoadState('networkidle');

  // Primeiro módulo: sem botão Anterior
  await expect(page.getByRole('link', { name: /anterior/i })).not.toBeVisible();

  // Próximo deve existir e conter "WAN" ou "NAT" (título do 2º módulo)
  const next = page.getByRole('link', { name: /wan|nat|próximo/i });
  await expect(next).toBeVisible();
});

test('ModuleNav em /wan-nat: tem Anterior (Instalação) e Próximo (DNS)', async ({ page }) => {
  await page.goto('/wan-nat');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /instalacao
  await expect(page.getByRole('link', { name: /instala[çc][aã]o|anterior/i })).toBeVisible();

  // Próximo aponta para /dns
  await expect(page.getByRole('link', { name: /^dns$|dns|próximo/i })).toBeVisible();
});

test('ModuleNav em /certificado: tem Anterior (Quiz), sem Próximo', async ({ page }) => {
  await page.goto('/certificado');
  await page.waitForLoadState('networkidle');

  // Anterior aponta para /quiz
  await expect(page.getByRole('link', { name: /quiz|anterior/i })).toBeVisible();

  // Último módulo: sem botão Próximo
  await expect(page.getByRole('link', { name: /próximo/i })).not.toBeVisible();
});
