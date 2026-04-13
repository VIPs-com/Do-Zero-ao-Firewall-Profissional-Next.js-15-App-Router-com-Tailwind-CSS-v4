import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

/**
 * Chaves de localStorage usadas pelo BadgeContext.
 * Devem espelhar exatamente as chaves em src/context/BadgeContext.tsx.
 */
const WORKSHOP_LS_KEYS = [
  'workshop-badges',
  'workshop-visited-pages',
  'workshop-topo-clicks',
  'workshop-clicked-risks',
  'workshop-checklist-v2',
  'workshop-quiz-score',
  'workshop-theme',
];

/**
 * Fixture `resetStorage` — executa automaticamente antes de cada teste.
 * Navega até '/' para ter acesso ao localStorage da origem e limpa
 * todas as chaves do workshop, garantindo isolamento entre testes.
 */
export const test = base.extend<{ resetStorage: void }>({
  resetStorage: [
    async ({ page }, use) => {
      await page.goto('/');
      await page.evaluate((keys) => {
        keys.forEach((k) => localStorage.removeItem(k));
      }, WORKSHOP_LS_KEYS);
      await use();
    },
    { auto: true },
  ],
});
