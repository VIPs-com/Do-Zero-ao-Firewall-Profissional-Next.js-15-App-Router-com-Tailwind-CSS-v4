import { test, expect } from './fixtures';

/**
 * Testa se a home carrega e o componente TopologyInteractive (lazy via next/dynamic)
 * renderiza o SVG com os atributos de acessibilidade corretos.
 *
 * Atributos verificados em TopologyInteractive.tsx:
 *   <svg role="img" aria-labelledby="topology-title">
 *     <title id="topology-title">Topologia de rede do laboratório Workshop Linux</title>
 */
test('home carrega e topologia SVG renderiza com título acessível', async ({ page }) => {
  await page.goto('/');

  // SVG carregado via next/dynamic (lazy) — aguarda até 15s
  const svg = page.locator('svg[role="img"][aria-labelledby="topology-title"]');
  await expect(svg).toBeVisible({ timeout: 15_000 });

  // Título acessível dentro do SVG
  const title = page.locator('title#topology-title');
  await expect(title).toHaveText('Topologia de rede do laboratório Workshop Linux');
});
