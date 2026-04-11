'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

/*
 * Error boundary global do App Router (Sprint D).
 *
 * Captura erros não tratados em qualquer rota e mostra UI amigável
 * em vez de uma tela em branco. O parâmetro `reset` re-renderiza o
 * segmento sem recarregar a página inteira.
 *
 * Server Components NÃO podem ser error boundaries — por isso 'use client'.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Loga no console do browser para facilitar debug em produção.
    // Em um futuro Sprint, isso poderia ir para um serviço como Sentry.
    console.error('[Workshop Linux] Erro não tratado:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-err/10 border border-err/30 flex items-center justify-center text-err mx-auto">
          <AlertTriangle size={40} aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <div className="section-label">Erro inesperado</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Algo deu errado por aqui
          </h1>
          <p className="text-text-2 leading-relaxed max-w-md mx-auto">
            Encontramos um erro ao carregar esta página. Você pode tentar novamente
            ou voltar para a página inicial.
          </p>
        </div>

        {error.digest && (
          <div className="inline-block bg-bg-2 border border-border rounded-md px-4 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-3 mr-2">
              Código:
            </span>
            <code className="font-mono text-xs text-text-2">{error.digest}</code>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="btn-primary px-6 py-3"
            aria-label="Tentar novamente"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Tentar novamente
          </button>
          <Link href="/" className="btn-outline px-6 py-3">
            <Home size={18} aria-hidden="true" />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
