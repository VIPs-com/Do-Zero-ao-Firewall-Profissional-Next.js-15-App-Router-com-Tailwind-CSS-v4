import { test, expect } from './fixtures';

/**
 * Sprint Ferramentas Portáteis v2 — /ferramentas com 3 abas:
 * Calculadora CIDR, Validador de Regex e Gerador de iptables.
 *
 * A lógica pura é coberta por src/lib/{cidr,regex,iptables}.test.ts;
 * aqui validamos a renderização, a troca de abas e o wiring reativo.
 */

test('Ferramentas: página renderiza com a aba CIDR ativa por padrão', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /ferramentas do sysadmin/i })).toBeVisible();

  // CIDR é a aba padrão — resultados do /24 já visíveis
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

test('Regex: a aba valida o padrão e conta os matches', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /validador de regex/i }).click();

  // Padrão de IP padrão contra texto com 2 IPs → 2 matches
  await expect(page.getByText(/2 matches/i)).toBeVisible();

  // Padrão inválido exibe erro
  await page.getByLabel(/padrão/i).fill('(abc');
  await expect(page.getByText(/regex inválido/i)).toBeVisible();
});

test('iptables: a aba gera o comando a partir do formulário', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /gerador de iptables/i }).click();

  // Estado inicial: porta 22, ACCEPT
  await expect(page.getByText('iptables -A INPUT -p tcp --dport 22 -j ACCEPT')).toBeVisible();

  // Mudar a ação para DROP reflete no comando gerado
  await page.getByLabel(/ação/i).selectOption('DROP');
  await expect(page.getByText('iptables -A INPUT -p tcp --dport 22 -j DROP')).toBeVisible();
});

test('iptables: o botão Copiar dá feedback "Copiado!"', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-write', 'clipboard-read']);
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /gerador de iptables/i }).click();
  await page.getByRole('button', { name: /copiar comando/i }).click();

  await expect(page.getByRole('button', { name: /^copiado$/i })).toBeVisible();
});

test('iptables: adicionar e remover regras da lista de script', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /gerador de iptables/i }).click();

  // Adiciona a regra padrão (porta 22)
  await page.getByRole('button', { name: /adicionar à lista/i }).click();
  await expect(page.getByText(/script — 1 regra/i)).toBeVisible();

  // Muda a porta e adiciona uma segunda regra
  await page.getByLabel(/porta destino/i).fill('443');
  await page.getByRole('button', { name: /adicionar à lista/i }).click();
  await expect(page.getByText(/script — 2 regras/i)).toBeVisible();

  // Remove a primeira regra
  await page.getByRole('button', { name: /remover regra 1/i }).click();
  await expect(page.getByText(/script — 1 regra/i)).toBeVisible();
});

test('PS1: a aba renderiza o preview e responde aos presets', async ({ page }) => {
  await page.goto('/ferramentas');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /simulador de ps1/i }).click();

  // Template clássico padrão → preview com usuário@host
  const preview = page.locator('pre').filter({ hasText: 'aluno@servidor' });
  await expect(preview).toBeVisible();

  // Preset minimalista muda o preview
  await page.getByRole('button', { name: 'Minimalista', exact: true }).click();
  await expect(page.locator('#ps1-input')).toHaveValue(/\\W/);

  // Checkbox root troca o $ por #
  await page.getByLabel(/simular como/i).check();
  await expect(page.locator('pre').filter({ hasText: '#' })).toBeVisible();
});
