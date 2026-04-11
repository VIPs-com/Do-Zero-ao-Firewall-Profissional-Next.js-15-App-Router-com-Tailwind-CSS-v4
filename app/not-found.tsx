import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FileQuestion, Home, BookOpen, Search } from 'lucide-react';

/*
 * 404 page do App Router (Sprint D).
 *
 * Renderizada automaticamente quando notFound() é chamado ou
 * quando uma rota inexistente é acessada. Server Component — sem
 * 'use client', o que mantém o bundle pequeno na rota mais visitada
 * por bots de SEO.
 */
export const metadata: Metadata = {
  title: 'Página não encontrada',
  description:
    'A página que você procura não existe ou foi movida. Volte ao início ou explore o índice de tópicos do Workshop Linux.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-accent-bg border border-accent-bd flex items-center justify-center text-accent mx-auto">
          <FileQuestion size={40} aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <div className="section-label">Erro 404</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-mono">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Página não encontrada
          </h2>
          <p className="text-text-2 leading-relaxed max-w-md mx-auto">
            A rota que você tentou acessar não existe neste workshop. Talvez
            tenha sido movida ou você digitou o endereço errado.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary px-6 py-3">
            <Home size={18} aria-hidden="true" />
            Página inicial
          </Link>
          <Link href="/topicos" className="btn-outline px-6 py-3">
            <BookOpen size={18} aria-hidden="true" />
            Ver tópicos
          </Link>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-text-3 flex items-center justify-center gap-2">
            <Search size={14} aria-hidden="true" />
            Dica: use <kbd className="font-mono bg-bg-3 border border-border px-1.5 py-0.5 rounded text-[10px]">Ctrl+K</kbd> para buscar conteúdo
          </p>
        </div>
      </div>
    </div>
  );
}
