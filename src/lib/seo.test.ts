import { describe, it, expect } from 'vitest';
import { buildMetadata, ROUTE_SEO, SITE_CONFIG } from './seo';

/*
 * Sprint T₁ — seo.ts
 *
 * buildMetadata é uma função pura — sem mocks necessários.
 *
 * Garante que:
 * - A home usa o título completo (SITE_CONFIG.title), não o template "X | Y"
 * - Rotas internas usam o template "<título curto> | Workshop Linux"
 * - Canonical da home = SITE_CONFIG.url (sem trailing slash, sem rota)
 * - Canonical de sub-rota = SITE_CONFIG.url + rota
 * - OG e Twitter refletem os mesmos valores
 * - Todas as rotas definidas em ROUTE_SEO passam pela função sem lançar exceção
 */

const BASE = SITE_CONFIG.url; // 'https://workshop-linux.local' em testes

describe('buildMetadata', () => {
  it('home → título completo (sem template "| Workshop Linux")', () => {
    const meta = buildMetadata('/');
    expect(meta.title).toBe('Do Zero ao Firewall Profissional');
    expect((meta.openGraph as { title?: string })?.title).toBe(SITE_CONFIG.title);
  });

  it('rota interna → título curto + template "| Workshop Linux"', () => {
    const meta = buildMetadata('/dns');
    expect(meta.title).toBe('DNS com BIND9 — Servidor Autoritativo');
    expect((meta.openGraph as { title?: string })?.title).toBe(
      'DNS com BIND9 — Servidor Autoritativo | Workshop Linux',
    );
  });

  it('canonical da home = SITE_CONFIG.url (sem rota)', () => {
    const meta = buildMetadata('/');
    expect((meta.alternates as { canonical?: string })?.canonical).toBe(BASE);
  });

  it('canonical de sub-rota = SITE_CONFIG.url + rota', () => {
    const meta = buildMetadata('/dns');
    expect((meta.alternates as { canonical?: string })?.canonical).toBe(`${BASE}/dns`);
  });

  it('OG e Twitter têm a mesma descrição que ROUTE_SEO[rota]', () => {
    const route = '/vpn-ipsec';
    const meta = buildMetadata(route);
    const expected = ROUTE_SEO[route].description;
    expect(meta.description).toBe(expected);
    expect((meta.openGraph as { description?: string })?.description).toBe(expected);
    expect((meta.twitter as { description?: string })?.description).toBe(expected);
  });

  it('todas as rotas de ROUTE_SEO geram metadata sem lançar exceção', () => {
    const routes = Object.keys(ROUTE_SEO) as (keyof typeof ROUTE_SEO)[];
    expect(() => {
      routes.forEach((r) => buildMetadata(r));
    }).not.toThrow();
    expect(routes.length).toBeGreaterThanOrEqual(21);
  });
});
