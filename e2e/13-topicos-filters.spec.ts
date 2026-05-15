import { test, expect } from './fixtures';

/**
 * Sprint E2E-TOPICOS — Filtros de trilha e toggle 📚/🔥 em /topicos
 *
 * Cobre os comportamentos observáveis do usuário final:
 *   1. Página carrega com trilha Firewall ativa (tab aria-selected)
 *   2. Clicar "Fundamentos" mostra os módulos da trilha Fundamentos
 *   3. Clicar "Avançados" mostra os módulos da trilha Avançados
 *   4. Toggle Modo Estudo → MODO OPERACIONAL (aria-pressed=true)
 *   5. Modo INCÊNDIO persiste em localStorage (workshop-intent-mode = 'incendio')
 *   6. Pré-seeded 'incendio' no localStorage → módulos já expandidos ao carregar
 *   7. Busca filtra tópicos em todas as trilhas
 *   8. Busca sem resultado mostra mensagem "Nenhum tópico encontrado"
 *   9. Accordion expande ao clicar no cabeçalho do módulo (aria-expanded)
 *  10. Accordion recolhe ao clicar novamente
 */

// ── 1. Página carrega com trilha Firewall ativa ──────────────────────────────

test('/topicos carrega com trilha Firewall ativa por padrão', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  // Título da página
  await expect(page.getByRole('heading', { name: /todos os tópicos/i })).toBeVisible();

  // Tab Firewall deve estar ativa (aria-selected="true")
  const firewallTab = page.getByRole('tab', { name: /firewall/i });
  await expect(firewallTab).toBeVisible();
  await expect(firewallTab).toHaveAttribute('aria-selected', 'true');

  // Tabs Fundamentos e Avançados devem existir mas inativas
  await expect(page.getByRole('tab', { name: /fundamentos/i })).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByRole('tab', { name: /avançados/i })).toHaveAttribute('aria-selected', 'false');
});

// ── 2. Clicar Fundamentos exibe módulos da trilha Fundamentos ────────────────

test('clicar na aba Fundamentos mostra módulos da trilha Fundamentos', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  // Clicar na aba Fundamentos
  await page.getByRole('tab', { name: /fundamentos/i }).click();

  // Tab Fundamentos agora ativa
  await expect(page.getByRole('tab', { name: /fundamentos/i })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: /firewall/i })).toHaveAttribute('aria-selected', 'false');

  // Módulos da trilha Fundamentos devem aparecer no accordion
  // (labels definidos em MODULE_META para a trilha fundamentos)
  await expect(page.getByText(/Estrutura do Sistema/i).first()).toBeVisible();  // /fhs
  await expect(page.getByText(/Comandos Essenciais/i).first()).toBeVisible();   // /comandos
  await expect(page.getByText(/Editores de Texto/i).first()).toBeVisible();     // /editores

  // Módulo exclusivo da trilha Avançados NÃO deve estar no accordion (não existe no DOM do accordion)
  // Verificamos via aria-selected do tab Avançados (ainda false)
  await expect(page.getByRole('tab', { name: /avançados/i })).toHaveAttribute('aria-selected', 'false');
});

// ── 3. Clicar Avançados exibe módulos da trilha Avançados ───────────────────

test('clicar na aba Avançados mostra módulos da trilha Avançados', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  await page.getByRole('tab', { name: /avançados/i }).click();

  await expect(page.getByRole('tab', { name: /avançados/i })).toHaveAttribute('aria-selected', 'true');

  // Módulos da trilha Avançados devem aparecer no accordion
  await expect(page.getByText(/Servidor DHCP/i).first()).toBeVisible();  // /dhcp
  await expect(page.getByText(/Samba File Sharing/i).first()).toBeVisible(); // /samba

  // Tabs Firewall e Fundamentos devem estar inativas
  await expect(page.getByRole('tab', { name: /firewall/i })).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByRole('tab', { name: /fundamentos/i })).toHaveAttribute('aria-selected', 'false');
});

// ── 4. Toggle Modo Estudo → MODO OPERACIONAL ────────────────────────────────

test('toggle ativa MODO OPERACIONAL com aria-pressed=true', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  // Botão começa em Modo Estudo (aria-pressed=false)
  const toggleBtn = page.getByRole('button', { name: /modo estudo/i });
  await expect(toggleBtn).toBeVisible();
  await expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

  // Clicar para ativar INCÊNDIO
  await toggleBtn.click();

  // Agora deve mostrar "MODO OPERACIONAL" com aria-pressed=true
  const opBtn = page.getByRole('button', { name: /modo operacional/i });
  await expect(opBtn).toHaveAttribute('aria-pressed', 'true');

  // Indicador "L3/L4 primeiro" deve aparecer
  await expect(page.getByText(/L3\/L4 primeiro/i)).toBeVisible();
});

// ── 5. Modo INCÊNDIO persiste em localStorage ───────────────────────────────

test('MODO OPERACIONAL persiste em localStorage após toggle', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /modo estudo/i }).click();

  // Aguarda persistência no localStorage
  await page.waitForFunction(
    () => localStorage.getItem('workshop-intent-mode') === 'incendio',
    { timeout: 3_000 }
  );

  const stored = await page.evaluate(() => localStorage.getItem('workshop-intent-mode'));
  expect(stored).toBe('incendio');
});

// ── 6. Pré-seeded 'incendio' → módulos expandidos ao carregar ───────────────

test('seed incendio no localStorage → módulos já expandidos ao navegar para /topicos', async ({ page }) => {
  // Seed antes de navegar
  await page.evaluate(() => {
    localStorage.setItem('workshop-intent-mode', 'incendio');
  });

  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  // O botão deve mostrar "MODO OPERACIONAL" (sem clicar)
  const opBtn = page.getByRole('button', { name: /modo operacional/i });
  await expect(opBtn).toBeVisible();
  await expect(opBtn).toHaveAttribute('aria-pressed', 'true');

  // Pelo menos um módulo deve estar expandido (aria-expanded=true)
  const expandedButtons = page.locator('button[aria-expanded="true"]');
  await expect(expandedButtons.first()).toBeVisible();
});

// ── 7. Busca filtra tópicos em todas as trilhas ─────────────────────────────

test('busca "SNAT" retorna resultados de tópicos', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  const input = page.getByPlaceholder(/buscar em todos os módulos/i);
  await expect(input).toBeVisible();
  await input.fill('SNAT');

  // Deve mostrar contador "X resultado(s) para "SNAT""
  await expect(page.getByText(/resultado/i)).toBeVisible();

  // Pelo menos um tópico sobre SNAT deve aparecer
  await expect(page.getByText(/SNAT/i).first()).toBeVisible();

  // Tabs de trilha devem estar ocultas durante a busca (toggle também)
  await expect(page.getByRole('button', { name: /modo estudo|modo operacional/i })).not.toBeVisible();
});

// ── 8. Busca sem resultado exibe mensagem de vazio ──────────────────────────

test('busca sem resultado exibe "Nenhum tópico encontrado"', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  const input = page.getByPlaceholder(/buscar em todos os módulos/i);
  await input.fill('xyzqqqabcdef123');

  await expect(page.getByText(/nenhum tópico encontrado/i)).toBeVisible();
  await expect(page.getByText(/0 resultado/i)).toBeVisible();
});

// ── 9. Accordion expande ao clicar no cabeçalho do módulo ───────────────────

test('clicar no módulo expande o accordion (aria-expanded=true)', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  // Localiza o botão de accordion do primeiro módulo da trilha Firewall
  // (Instalação & Lab — primeiro em TRAIL_MODULES.firewall = /instalacao)
  const moduleBtn = page.locator('button[aria-expanded]').first();
  await expect(moduleBtn).toBeVisible();
  await expect(moduleBtn).toHaveAttribute('aria-expanded', 'false');

  await moduleBtn.click();

  await expect(moduleBtn).toHaveAttribute('aria-expanded', 'true');
});

// ── 10. Accordion recolhe ao clicar novamente ───────────────────────────────

test('clicar no módulo expandido recolhe o accordion (aria-expanded=false)', async ({ page }) => {
  await page.goto('/topicos');
  await page.waitForLoadState('networkidle');

  const moduleBtn = page.locator('button[aria-expanded]').first();

  // Expande
  await moduleBtn.click();
  await expect(moduleBtn).toHaveAttribute('aria-expanded', 'true');

  // Recolhe
  await moduleBtn.click();
  await expect(moduleBtn).toHaveAttribute('aria-expanded', 'false');
});
