/**
 * Testes do motor de migração versionada do localStorage (Sprint STORAGE-MIGRATIONS).
 * Lógica pura — sem React, sem renderização. setup.ts limpa o localStorage entre testes.
 */
import { describe, it, expect } from 'vitest';
import {
  runStorageMigrations,
  getStorageVersion,
  clearAllWorkshopData,
  STORAGE_SCHEMA_VERSION,
} from './migrations';

const VERSION_KEY = 'workshop-schema-version';

describe('getStorageVersion', () => {
  it('retorna 0 quando a chave de versão não existe (pré-versionamento)', () => {
    expect(getStorageVersion()).toBe(0);
  });

  it('retorna o número guardado quando válido', () => {
    localStorage.setItem(VERSION_KEY, '1');
    expect(getStorageVersion()).toBe(1);
  });

  it('retorna 0 quando o valor está corrompido (não-numérico)', () => {
    localStorage.setItem(VERSION_KEY, 'abc');
    expect(getStorageVersion()).toBe(0);
  });

  it('retorna 0 para valores negativos', () => {
    localStorage.setItem(VERSION_KEY, '-3');
    expect(getStorageVersion()).toBe(0);
  });
});

describe('runStorageMigrations', () => {
  it('storage fresco → aplica migrações e marca a versão atual', () => {
    const result = runStorageMigrations();
    expect(result.from).toBe(0);
    expect(result.to).toBe(STORAGE_SCHEMA_VERSION);
    expect(getStorageVersion()).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('já na versão atual → no-op (nenhuma migração aplicada)', () => {
    localStorage.setItem(VERSION_KEY, String(STORAGE_SCHEMA_VERSION));
    const result = runStorageMigrations();
    expect(result.applied).toHaveLength(0);
    expect(result.from).toBe(STORAGE_SCHEMA_VERSION);
    expect(result.to).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('idempotente — rodar duas vezes não reaplica migrações', () => {
    const first = runStorageMigrations();
    expect(first.applied.length).toBeGreaterThan(0);
    const second = runStorageMigrations();
    expect(second.applied).toHaveLength(0);
  });

  it('v1: migra a chave legada `workshop-checklist` → `workshop-checklist-v2`', () => {
    const legacy = JSON.stringify({ 'ping-internet': true });
    localStorage.setItem('workshop-checklist', legacy);

    runStorageMigrations();

    expect(localStorage.getItem('workshop-checklist-v2')).toBe(legacy);
    expect(localStorage.getItem('workshop-checklist')).toBeNull();
  });

  it('v1: NÃO sobrescreve `workshop-checklist-v2` já existente', () => {
    const current = JSON.stringify({ 'dns-resolve': true });
    const legacy = JSON.stringify({ 'ping-internet': true });
    localStorage.setItem('workshop-checklist-v2', current);
    localStorage.setItem('workshop-checklist', legacy);

    runStorageMigrations();

    // O progresso atual (v2) é preservado; a chave legada é apenas removida.
    expect(localStorage.getItem('workshop-checklist-v2')).toBe(current);
    expect(localStorage.getItem('workshop-checklist')).toBeNull();
  });

  it('storage fresco sem chave legada → migração v1 é no-op seguro', () => {
    runStorageMigrations();
    expect(localStorage.getItem('workshop-checklist-v2')).toBeNull();
    expect(getStorageVersion()).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('versão corrompida é tratada como 0 e as migrações rodam', () => {
    localStorage.setItem(VERSION_KEY, 'xyz');
    const result = runStorageMigrations();
    expect(result.from).toBe(0);
    expect(result.to).toBe(STORAGE_SCHEMA_VERSION);
  });
});

describe('clearAllWorkshopData (LGPD)', () => {
  it('remove todas as chaves com prefixo workshop-', () => {
    localStorage.setItem('workshop-badges', '["explorer"]');
    localStorage.setItem('workshop-quiz-score', '80');
    localStorage.setItem('workshop-schema-version', '1');
    localStorage.setItem('workshop-student-name', 'Ada');

    const removed = clearAllWorkshopData();

    expect(removed).toBe(4);
    expect(localStorage.getItem('workshop-badges')).toBeNull();
    expect(localStorage.getItem('workshop-quiz-score')).toBeNull();
    expect(localStorage.getItem('workshop-schema-version')).toBeNull();
    expect(localStorage.getItem('workshop-student-name')).toBeNull();
  });

  it('NÃO remove chaves de outras aplicações', () => {
    localStorage.setItem('workshop-badges', '[]');
    localStorage.setItem('outra-app-config', 'preservar');
    localStorage.setItem('tema-global', 'dark');

    clearAllWorkshopData();

    expect(localStorage.getItem('outra-app-config')).toBe('preservar');
    expect(localStorage.getItem('tema-global')).toBe('dark');
  });

  it('retorna 0 quando não há dados do workshop', () => {
    expect(clearAllWorkshopData()).toBe(0);
  });
});
