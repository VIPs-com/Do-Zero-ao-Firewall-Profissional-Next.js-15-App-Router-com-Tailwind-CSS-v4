'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { ProgressDropdown } from './ui/ProgressDropdown';

/*
 * Sprint F — GlobalSearch só entra em cena quando o usuário aperta ⌘K / clica em Buscar.
 * next/dynamic remove o bundle (fuse.js + listbox) do carregamento inicial.
 */
const GlobalSearch = dynamic(
  () => import('./GlobalSearch').then((m) => ({ default: m.GlobalSearch })),
  { ssr: false },
);

const NAV_LINKS = [
  { href: '/',             label: 'Início',      icon: '🏠' },
  { href: '/dashboard',    label: 'Dashboard',   icon: '📊' },
  { href: '/jornada',      label: 'Jornada',     icon: '🧭' },
  { href: '/fundamentos',  label: 'Fundamentos', icon: '🐧' },
  { href: '/avancados',    label: 'Avançados',   icon: '🚀' },
  { href: '/topicos',      label: 'Tópicos',     icon: '📚' },
  { href: '/instalacao',   label: 'Instalação',  icon: '🛠️' },
  { href: '/quiz',         label: 'Quiz',        icon: '🧠' },
  { href: '/treino',       label: 'Treino',      icon: '🎯' },
  { href: '/cheat-sheet',  label: 'Cheat Sheet', icon: '⚡' },
  { href: '/ferramentas',  label: 'Ferramentas', icon: '🧮' },
  { href: '/certificado',  label: 'Certificado', icon: '🎓' },
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
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-white text-lg leading-none">
              🐧
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
              suppressHydrationWarning
            >
              <span suppressHydrationWarning>
                {isDark
                  ? <Sun  size={18} aria-hidden="true" />
                  : <Moon size={18} aria-hidden="true" />}
              </span>
            </button>

            {/* Progresso do curso — Sprint UI-H */}
            <ProgressDropdown />

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
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full"
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

      <footer className="bg-bg-2 border-t border-border mt-auto">
        {/* Grid principal */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Coluna 1 — Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-xl leading-none" aria-hidden="true">🐧</span>
              <span className="font-bold text-text group-hover:text-accent transition-colors">Workshop Linux</span>
            </Link>
            <p className="text-xs text-text-3 leading-relaxed">
              Do zero ao firewall profissional. Aprenda segurança de redes Linux com laboratório real — WAN, DMZ e LAN.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Next.js 15', 'React 19', 'Tailwind v4', 'TypeScript'].map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-text-3">{tag}</span>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <Link href="/dashboard" className="text-xs text-accent hover:text-accent-2 transition-colors">Dashboard →</Link>
              <Link href="/certificado" className="text-xs text-text-2 hover:text-text transition-colors">Certificado →</Link>
            </div>
          </div>

          {/* Coluna 2 — Trilha Firewall v1.0 */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">🔥 Trilha Firewall</p>
            <ul className="space-y-1.5">
              {[
                { href: '/instalacao', label: 'Instalação & Lab' },
                { href: '/wan-nat', label: 'WAN & NAT' },
                { href: '/dns', label: 'DNS' },
                { href: '/nginx-ssl', label: 'Nginx & SSL' },
                { href: '/lan-proxy', label: 'Proxy Transparente' },
                { href: '/dnat', label: 'DNAT & Port Forward' },
                { href: '/vpn-ipsec', label: 'VPN IPSec' },
                { href: '/wireguard', label: 'WireGuard' },
                { href: '/docker', label: 'Docker Networking' },
                { href: '/hardening', label: 'Hardening' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-text-3 hover:text-text transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Fundamentos v2.0 */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6366f1]">🐧 Fundamentos Linux</p>
            <ul className="space-y-1.5">
              {[
                { href: '/fhs', label: 'Estrutura do Sistema' },
                { href: '/comandos', label: 'Comandos Essenciais' },
                { href: '/processos', label: 'Processos' },
                { href: '/permissoes', label: 'Permissões & Usuários' },
                { href: '/discos', label: 'Discos & Partições' },
                { href: '/shell-script', label: 'Shell Script' },
                { href: '/cron', label: 'Cron & Agendamento' },
                { href: '/boot', label: 'Processo de Boot' },
                { href: '/pacotes', label: 'Instalação de Programas' },
                { href: '/rsyslog', label: 'Logs Centralizados' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-text-3 hover:text-text transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 — Avançados v3.0–v5.0 */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-info">🚀 Servidores & IaC</p>
            <ul className="space-y-1.5">
              {[
                { href: '/dhcp', label: 'DHCP' },
                { href: '/samba', label: 'Samba' },
                { href: '/apache', label: 'Apache' },
                { href: '/openvpn', label: 'OpenVPN' },
                { href: '/traefik', label: 'Traefik' },
                { href: '/ansible', label: 'Ansible' },
                { href: '/monitoring', label: 'Prometheus + Grafana' },
                { href: '/kubernetes', label: 'Kubernetes / K3s' },
                { href: '/terraform', label: 'Terraform' },
                { href: '/cicd', label: 'CI/CD GitHub Actions' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-text-3 hover:text-text transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barra inferior — stats + copyright */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center sm:justify-start gap-5">
              {[
                { value: '63', label: 'módulos' },
                { value: '265', label: 'questões' },
                { value: '62', label: 'conquistas' },
                { value: '172', label: 'checkpoints' },
              ].map(stat => (
                <div key={stat.label} className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-accent">{stat.value}</span>
                  <span className="text-[11px] text-text-3">{stat.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-text-3 uppercase tracking-widest opacity-50 text-center">
              © 2026 · Desenvolvido com ❤️ para a comunidade Linux
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
