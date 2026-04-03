'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Search, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { GlobalSearch } from './GlobalSearch';

const NAV_LINKS = [
  { href: '/',            label: 'Início',      icon: '🏠' },
  { href: '/dashboard',   label: 'Dashboard',   icon: '📊' },
  { href: '/topicos',     label: 'Tópicos',     icon: '📚' },
  { href: '/instalacao',  label: 'Instalação',  icon: '🛠️' },
  { href: '/quiz',        label: 'Quiz',        icon: '🧠' },
  { href: '/cheat-sheet', label: 'Cheat Sheet', icon: '⚡' },
  { href: '/certificado', label: 'Certificado', icon: '🎓' },
];

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { trackPageVisit, unlockBadge } = useBadges();

  /*
   * BUG CORRIGIDO #3 — Estado do tema derivado do DOM, não de um booleano isolado.
   *
   * Antes: useState(true) → assumia dark mode fixo e não sincronizava com o
   * script anti-FOUC do layout.tsx, causando ícone errado no botão ao carregar.
   *
   * Agora: lemos diretamente a classe do <html> no momento da montagem,
   * garantindo que o ícone (Sol/Lua) reflita o tema real desde o primeiro render.
   */
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true; // SSR: assume dark
    return !document.documentElement.classList.contains('light');
  });

  /* Sincroniza ícone caso o script anti-FOUC já tenha aplicado "light" antes da
   * hidratação do React (edge case em navegação direta com preferência salva). */
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains('light'));
  }, []);

  /* ---- Atalho de teclado para busca ---- */
  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true);
    unlockBadge('searcher');
  }, [unlockBadge]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleSearchOpen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSearchOpen]);

  /* ---- Rastreio de página ---- */
  useEffect(() => {
    trackPageVisit(pathname);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [pathname, trackPageVisit]);

  /* ---- Toggle de tema ---- */
  const toggleTheme = useCallback(() => {
    const goingLight = isDark; // se estava dark, vai para light; e vice-versa

    setIsDark(!isDark);

    if (goingLight) {
      /* Usuário ativou o modo CLARO */
      document.documentElement.classList.add('light');
      localStorage.setItem('workshop-theme', 'light');
    } else {
      /* Usuário ativou o modo ESCURO
       *
       * BUG CORRIGIDO #4 — Badge "night-owl" estava sendo desbloqueado quando
       * o usuário ia para o modo CLARO (bloco else anterior). O nome do badge
       * é "Coruja Noturna" e a descrição diz "Usou o Dark Mode" — o desbloqueio
       * deve ocorrer quando o usuário ATIVA o dark mode, não o light.
       */
      document.documentElement.classList.remove('light');
      localStorage.setItem('workshop-theme', 'dark');
      unlockBadge('night-owl');
    }
  }, [isDark, unlockBadge]);

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      <header className="sticky top-0 z-40 h-16 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-lg shrink-0">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-white">
              <Terminal size={18} />
            </div>
            <span className="hidden sm:inline">Workshop Linux</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  pathname === link.href
                    ? 'bg-accent-bg text-accent-2'
                    : 'text-text-2 hover:bg-bg-3 hover:text-text',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-2">

            {/* Busca */}
            <button
              onClick={handleSearchOpen}
              className="p-2 rounded-md bg-bg-3 border border-border text-text-2 hover:border-accent hover:text-text transition-all lg:w-48 lg:flex lg:items-center lg:justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Buscar conteúdo (Ctrl+K)"
            >
              <div className="flex items-center gap-2">
                <Search size={16} aria-hidden="true" />
                <span className="hidden lg:inline text-xs">Buscar...</span>
              </div>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-bg px-1.5 font-mono text-[10px] font-medium text-text-3">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Toggle de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-bg-3 border border-border text-text-2 hover:border-accent hover:text-text transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              title={isDark ? 'Tema claro' : 'Tema escuro'}
            >
              {isDark
                ? <Sun  size={18} aria-hidden="true" />
                : <Moon size={18} aria-hidden="true" />}
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-md bg-bg-3 border border-border text-text-2 hover:border-accent hover:text-text transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen
                ? <X    size={18} aria-hidden="true" />
                : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="absolute top-16 left-0 right-0 bg-bg-2 border-b border-border p-4 flex flex-col gap-1 animate-in slide-in-from-top-10">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-accent-bg text-accent-2'
                    : 'text-text-2 hover:bg-bg-3 hover:text-text',
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {children}
      </main>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <footer className="bg-bg-2 border-t border-border py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-text-3 leading-relaxed">
            <strong className="text-accent">Workshop Linux</strong> — Do Zero ao Firewall
            <br />
            Documentação técnica de estudo pessoal · Modelo OSI aplicado na prática
          </p>
          <p className="mt-6 text-[11px] text-text-3 uppercase tracking-widest opacity-50">
            © 2026 · Desenvolvido com ❤️ para a comunidade Linux
          </p>
        </div>
      </footer>
    </div>
  );
};
