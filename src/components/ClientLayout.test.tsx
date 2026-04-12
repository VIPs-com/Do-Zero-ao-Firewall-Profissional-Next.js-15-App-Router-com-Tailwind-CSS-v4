import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { BadgeProvider } from '@/context/BadgeContext';

/*
 * Sprint T₁ — ClientLayout
 *
 * Cobre os comportamentos observáveis mais críticos:
 * - Toggle de tema (DOM + localStorage)
 * - Menu mobile (aria-expanded)
 * - Atalho Ctrl+K (unlock badge 'searcher' via localStorage)
 *
 * Mocks necessários:
 * - next/navigation  → usePathname retorna '/'
 * - next/link        → <a> simples (evita contexto de router)
 * - next/dynamic     → GlobalSearch vira () => null (bundle não existe no test env)
 */

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// GlobalSearch é carregado dinamicamente — retorna null no ambiente de teste
vi.mock('next/dynamic', () => ({
  default: () => () => null,
}));

import { ClientLayout } from './ClientLayout';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BadgeProvider>{children}</BadgeProvider>
);

describe('ClientLayout', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light');
    localStorage.clear();
  });

  it('renderiza links de navegação principais', () => {
    render(<ClientLayout><div>content</div></ClientLayout>, { wrapper });
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Quiz').length).toBeGreaterThan(0);
  });

  it('toggleTheme dark→light adiciona classe "light" e persiste no localStorage', () => {
    render(<ClientLayout><div /></ClientLayout>, { wrapper });
    const btn = screen.getByRole('button', { name: /mudar para tema claro/i });
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('workshop-theme')).toBe('light');
  });

  it('toggleTheme light→dark remove classe "light" e persiste "dark"', () => {
    document.documentElement.classList.add('light');
    render(<ClientLayout><div /></ClientLayout>, { wrapper });
    const btn = screen.getByRole('button', { name: /mudar para tema escuro/i });
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorage.getItem('workshop-theme')).toBe('dark');
  });

  it('toggleTheme light→dark desbloqueia badge "night-owl"', () => {
    document.documentElement.classList.add('light');
    render(<ClientLayout><div /></ClientLayout>, { wrapper });
    const btn = screen.getByRole('button', { name: /mudar para tema escuro/i });
    fireEvent.click(btn);
    const badges = JSON.parse(localStorage.getItem('workshop-badges') || '[]');
    expect(badges).toContain('night-owl');
  });

  it('botão de menu mobile alterna aria-expanded', () => {
    render(<ClientLayout><div /></ClientLayout>, { wrapper });
    const menuBtn = screen.getByRole('button', { name: /abrir menu/i });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuBtn);
    // Após abrir, o botão toggle (com aria-expanded) + o backdrop têm o mesmo label.
    // Filtramos pelo que possui o atributo aria-expanded.
    const closeBtns = screen.getAllByRole('button', { name: /fechar menu/i });
    const toggleBtn = closeBtns.find((b) => b.hasAttribute('aria-expanded'));
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('Ctrl+K desbloqueia badge "searcher" via useEffect do atalho', () => {
    render(<ClientLayout><div /></ClientLayout>, { wrapper });
    act(() => {
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    });
    const badges = JSON.parse(localStorage.getItem('workshop-badges') || '[]');
    expect(badges).toContain('searcher');
  });
});
