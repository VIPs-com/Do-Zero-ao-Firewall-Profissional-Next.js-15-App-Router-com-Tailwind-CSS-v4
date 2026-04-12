import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/*
 * Sprint T₀ — configuração mínima do Vitest.
 *
 * - `happy-dom` como ambiente: mais leve que jsdom, cobre o que precisamos
 *   para testar o BadgeContext (localStorage + React Testing Library).
 * - `setupFiles` carrega @testing-library/jest-dom e limpa o localStorage
 *   antes de cada teste — zero contaminação cruzada.
 * - Alias `@/` → `src/` espelhando o tsconfig do projeto.
 *
 * Sem CSS, sem import de `globals.css`, sem Next.js runtime. Testes unitários
 * de módulo React puros.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
