import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModuleNav } from './ModuleNav';

// next/link renderizado como <a> simples para testes unitários
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => React.createElement('a', { href, ...props }, children),
}));

describe('ModuleNav — navegação sequencial entre módulos', () => {

  it('retorna null para path desconhecido', () => {
    const { container } = render(<ModuleNav currentPath="/pagina-inexistente" />);
    expect(container.firstChild).toBeNull();
  });

  it('/instalacao: sem Anterior, Próximo visível com aria-label e href corretos', () => {
    render(<ModuleNav currentPath="/instalacao" />);

    // Sem link "Anterior" — primeiro da sequência
    expect(screen.queryByRole('link', { name: /módulo anterior/i })).toBeNull();

    // Próximo aponta para /wan-nat
    const next = screen.getByRole('link', { name: /próximo módulo: wan/i });
    expect(next.getAttribute('href')).toBe('/wan-nat');
  });

  it('/wan-nat: Anterior (/instalacao) e Próximo (/dns) com hrefs corretos', () => {
    render(<ModuleNav currentPath="/wan-nat" />);

    const prev = screen.getByRole('link', { name: /módulo anterior: instala/i });
    expect(prev.getAttribute('href')).toBe('/instalacao');

    const next = screen.getByRole('link', { name: /próximo módulo: dns/i });
    expect(next.getAttribute('href')).toBe('/dns');
  });

  it('/certificado: Anterior visível (/quiz), sem Próximo — fim da sequência', () => {
    render(<ModuleNav currentPath="/certificado" />);

    const prev = screen.getByRole('link', { name: /módulo anterior: quiz/i });
    expect(prev.getAttribute('href')).toBe('/quiz');

    // Sem link Próximo — último módulo
    expect(screen.queryByRole('link', { name: /próximo módulo/i })).toBeNull();
  });

  it('/nginx-ssl: hrefs corretos para /dns (anterior) e /lan-proxy (próximo)', () => {
    render(<ModuleNav currentPath="/nginx-ssl" />);

    expect(
      screen.getByRole('link', { name: /módulo anterior: dns/i }).getAttribute('href'),
    ).toBe('/dns');
    expect(
      screen.getByRole('link', { name: /próximo módulo: lan/i }).getAttribute('href'),
    ).toBe('/lan-proxy');
  });
});
