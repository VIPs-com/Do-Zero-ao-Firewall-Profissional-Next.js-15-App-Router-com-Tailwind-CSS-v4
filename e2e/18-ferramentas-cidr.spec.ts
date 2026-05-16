import { test, expect } from './fixtures';

/**
 * Sprint Ferramentas Portáteis — calculadora de sub-redes CIDR (/ferramentas).
 *
 * A página tem um input `#cidr-input` e exibe os resultados ao vivo
 * (parseCidr em useMemo). A lógica de cálculo é coberta por src/lib/cidr.test.ts;
 * aqui validamos a renderização e o wiring reativo.
 */

test('CIDR: exibe os resultados do bloco padrão 192.168.1.0/24', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /calculadora de sub-redes cidr/i })).toBeVisible();

  // Resultados do /24 padrão
  await expect(page.getByText('192.168.1.255')).toBeVisible();        // broadcast
  await expect(page.getByText('254', { exact: true })).toBeVisible(); // hosts utilizáveis
});

test('CIDR: digitar um novo endereço atualiza o resultado ao vivo', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  const input = page.getByLabel(/endereço cidr/i);
  await input.fill('10.0.0.0/8');

  await expect(page.getByText('10.255.255.255')).toBeVisible(); // broadcast do /8
  await expect(page.getByText('privado')).toBeVisible();        // escopo
});

test('CIDR: entrada inválida mostra mensagem de erro', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await page.getByLabel(/endereço cidr/i).fill('999.1.1.1/24');

  await expect(page.getByText(/endereço inválido/i)).toBeVisible();
});
