import React from 'react';

/*
 * Loading boundary global do App Router (Sprint D).
 *
 * Renderizado automaticamente como Suspense fallback enquanto qualquer
 * Server Component da árvore está suspenso. Server Component puro —
 * sem JS no cliente, sem 'use client'.
 *
 * Como praticamente todas as nossas páginas são 'use client' e tudo
 * vive em localStorage, este boundary aparece principalmente em
 * navegação inicial e prefetch.
 */
export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4 py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner — anéis concêntricos com a cor accent */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        </div>

        <div className="text-center space-y-1">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[2px] text-accent">
            Carregando
          </div>
          <div className="text-sm text-text-2">Preparando o conteúdo…</div>
        </div>

        <span className="sr-only">Carregando conteúdo, aguarde.</span>
      </div>
    </div>
  );
}
