import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/*
 * Sprint T₀ — setup global dos testes.
 *
 * - localStorage é zerado antes de cada teste para evitar contaminação
 *   cruzada entre casos (o BadgeContext hidrata de lá no mount).
 * - cleanup() do RTL desmonta árvores órfãs entre testes.
 */
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
