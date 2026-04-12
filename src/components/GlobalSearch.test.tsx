import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';

/*
 * Sprint T₁ — GlobalSearch
 *
 * Testa o contrato público do componente:
 * - Invisível quando isOpen=false
 * - Dialog acessível quando isOpen=true (role, aria-modal, label)
 * - ESC chama onClose
 * - Filtro por query reduz resultados; query sem match mostra estado vazio
 * - Navegação por teclado (ArrowDown) avança seleção
 *
 * motion/react é mockado com divs simples — as animações não são
 * comportamento do produto e não devem ser testadas aqui.
 */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('motion/react', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  const Div = ({
    children,
    // strip framer-motion-only props
    initial: _i,
    animate: _a,
    exit: _e,
    transition: _t,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) =>
    React.createElement('div', props, children);
  return {
    motion: { div: Div },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => false,
  };
});

import { GlobalSearch } from './GlobalSearch';

describe('GlobalSearch', () => {
  it('não renderiza nada quando isOpen=false', () => {
    const { container } = render(
      <GlobalSearch isOpen={false} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza dialog acessível quando isOpen=true', () => {
    render(<GlobalSearch isOpen onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/busca global do workshop linux/i)).toBeInTheDocument();
  });

  it('ESC chama onClose', () => {
    const onClose = vi.fn();
    render(<GlobalSearch isOpen onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('query sem correspondência exibe estado de "nenhum resultado"', () => {
    render(<GlobalSearch isOpen onClose={vi.fn()} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'zzz_termo_inexistente_xyzxyz' },
    });
    expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
  });

  it('query vazia exibe até 5 itens padrão', () => {
    render(<GlobalSearch isOpen onClose={vi.fn()} />);
    // listbox tem role="listbox", cada item tem role="option"
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
    expect(options.length).toBeLessThanOrEqual(5);
  });

  it('ArrowDown avança aria-selected para o segundo item', () => {
    render(<GlobalSearch isOpen onClose={vi.fn()} />);
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    const options = screen.getAllByRole('option');
    // após um ArrowDown, índice 1 deve ser selected
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
  });
});
