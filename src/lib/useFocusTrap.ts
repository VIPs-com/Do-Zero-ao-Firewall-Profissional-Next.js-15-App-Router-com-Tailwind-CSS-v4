'use client';

import { useEffect, useRef } from 'react';

/*
 * Hook de focus trap acessível para modais/diálogos.
 * - Captura o foco dentro do container quando ativo
 * - Tab/Shift+Tab circulam apenas pelos elementos focáveis internos
 * - Tecla ESC dispara onClose
 * - Restaura o foco para o elemento anterior ao desmontar
 *
 * Uso:
 *   const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);
 *   <div ref={ref} role="dialog" aria-modal="true">...</div>
 *
 * Conformidade: WCAG 2.1 — 2.1.2 No Keyboard Trap, 2.4.3 Focus Order.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean,
  onClose?: () => void,
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Guarda o elemento focado antes de abrir o modal
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Foca no primeiro elemento focável (ou no próprio container como fallback)
    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.tabIndex = -1;
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      // Recalcula em cada Tab — o conteúdo do modal pode mudar
      const items = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restaura o foco para o elemento que o tinha antes do modal abrir
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isActive, onClose]);

  return containerRef;
}
