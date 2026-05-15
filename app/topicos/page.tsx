'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { TOPICS, MODULE_META, TRAIL_MODULES, TRAIL_CONFIG } from '@/data/topics';
import type { TrailTab, Topic } from '@/data/topics';
import { useTabFilter } from '@/hooks/useTabFilter';

type IntentMode = 'estudo' | 'incendio';
type SortFn = (a: Topic, b: Topic) => number;

const SORT_STRATEGIES: Record<IntentMode, SortFn> = {
  estudo: () => 0,
  incendio: (a, b) => {
    const rank: Record<string, number> = { l3: 0, l4: 1, l5: 2, l6: 3, l7: 4 };
    return (rank[a.layerClass] ?? 5) - (rank[b.layerClass] ?? 5);
  },
};

const INTENT_LS_KEY = 'workshop-intent-mode' as const;

// Exportar para testabilidade (tree-shaken em produção)
export { SORT_STRATEGIES, INTENT_LS_KEY };

function getModuleBase(href: string): string {
  return '/' + href.split('#')[0].replace(/^\//, '');
}

// TopicRow memoizado — evita re-render de todos os tópicos ao expandir/fechar outro módulo
interface TopicRowProps {
  topic: Topic;
  idx: number;
  expandedTooltip: string | null;
  onToggleTooltip: (id: string | null) => void;
  intentMode: IntentMode;
  isVisited: (href: string) => boolean;
}

const TopicRow = React.memo(function TopicRow({
  topic, idx, expandedTooltip, onToggleTooltip, intentMode, isVisited,
}: TopicRowProps) {
  const visited = isVisited(topic.href);
  return (
    <div key={topic.id} className={cn('group', idx > 0 && 'border-t border-border/40')}>
      <Link
        href={topic.href}
        className="relative flex items-start gap-3 px-4 py-3 hover:bg-bg-3 transition-colors"
      >
        <span className={cn(
          'font-mono text-[10px] text-text-3 bg-bg-3 px-1.5 py-0.5 rounded shrink-0 mt-0.5 transition-colors',
          visited ? 'bg-ok/20 text-ok' : 'group-hover:bg-accent group-hover:text-white'
        )}>
          {topic.num}
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm text-text-2 group-hover:text-text transition-colors leading-relaxed',
            intentMode === 'incendio' && 'truncate'
          )}>
            {topic.title}
          </p>
          <span className={cn(
            'layer-badge mt-1.5',
            topic.layerClass,
            intentMode === 'incendio' && (topic.layerClass === 'l3' || topic.layerClass === 'l4') && 'text-[var(--color-err)] bg-[rgba(248,81,73,0.1)] border-[rgba(248,81,73,0.3)]'
          )}>
            {topic.layer}
          </span>
        </div>
        <ChevronRight className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" size={13} />
        {/* Tooltip desktop — CSS puro, aria-hidden quando invisível */}
        <div
          role="tooltip"
          aria-hidden="true"
          className="hidden md:block absolute left-full top-0 ml-3 z-50 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 bg-bg-2 border border-border rounded-lg p-3 shadow-lg"
        >
          <p className="text-xs text-text-3">{topic.layer}</p>
          <p className="text-xs text-text-2 mt-1">{topic.group}</p>
          <span className="text-[10px] text-accent">→ {topic.href.split('#')[0]}</span>
        </div>
      </Link>
      {/* Expand mobile */}
      <button
        className="md:hidden w-full text-left px-4 pb-1 text-[11px] text-text-3 hover:text-accent transition-colors"
        onClick={() => onToggleTooltip(expandedTooltip === topic.id ? null : topic.id)}
      >
        {expandedTooltip === topic.id ? '▲ ocultar' : '▼ detalhes'}
      </button>
      {expandedTooltip === topic.id && (
        <div className="md:hidden px-4 pb-2 text-[11px] text-text-3 bg-bg-3 border-t border-border/40">
          {topic.layer} · {topic.group} · {topic.href.split('#')[0]}
        </div>
      )}
    </div>
  );
});

export default function TopicsPage() {
  const { activeTab: activeTrail, setActiveTab: setActiveTrail, tabButtonProps: trailButtonProps } = useTabFilter<TrailTab>('firewall');

  const [intentMode, setIntentMode] = useState<IntentMode>(() => {
    if (typeof window === 'undefined') return 'estudo';
    return localStorage.getItem(INTENT_LS_KEY) === 'incendio' ? 'incendio' : 'estudo';
  });

  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set<string>();
    return localStorage.getItem(INTENT_LS_KEY) === 'incendio'
      ? new Set<string>(TRAIL_MODULES['firewall'])
      : new Set<string>();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null);
  const { visitedPages } = useBadges();

  // Verifica se um path (módulo) foi visitado
  const isVisited = useCallback((path: string): boolean => {
    const clean = path.replace(/^\//, '');
    return visitedPages.has(clean) || visitedPages.has('/' + clean);
  }, [visitedPages]);

  // Agrupa tópicos pelo path base do href (ex: /lan-proxy#x → /lan-proxy)
  // Em modo INCÊNDIO, os tópicos são ordenados por camada OSI (L3 antes de L7)
  const topicsByModule = useMemo(() => {
    const sortFn = SORT_STRATEGIES[intentMode];
    const map = new Map<string, Topic[]>();
    for (const topic of TOPICS) {
      const base = getModuleBase(topic.href);
      if (!map.has(base)) map.set(base, []);
      map.get(base)!.push(topic);
    }
    for (const topics of map.values()) {
      topics.sort(sortFn);
    }
    return map;
  }, [intentMode]);

  // Progresso por trilha (contagem de módulos visitados)
  const trailStats = useMemo(() => {
    const stats: Record<TrailTab, { total: number; visited: number }> = {
      firewall:    { total: 0, visited: 0 },
      fundamentos: { total: 0, visited: 0 },
      avancados:   { total: 0, visited: 0 },
    };
    for (const [path, meta] of Object.entries(MODULE_META)) {
      stats[meta.trail].total++;
      if (isVisited(path)) stats[meta.trail].visited++;
    }
    return stats;
  }, [isVisited]);

  // Handler estável para tooltip mobile — evita recriação a cada render
  const handleToggleTooltip = useCallback((id: string | null) => {
    setExpandedTooltip(id);
  }, []);

  // Abre/fecha accordion de um módulo
  const toggleModule = useCallback((slug: string) => {
    setExpandedTooltip(null);
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  // Toggle de intenção: 📚 Estudo ↔ 🔥 Incêndio
  const toggleIntentMode = useCallback(() => {
    setIntentMode(prev => {
      const next: IntentMode = prev === 'estudo' ? 'incendio' : 'estudo';
      setOpenModules(
        next === 'incendio'
          ? new Set<string>(TRAIL_MODULES[activeTrail])
          : new Set<string>()
      );
      return next;
    });
  }, [activeTrail]);

  // Resultados de busca (flat, todas as trilhas)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.layer.toLowerCase().includes(q) ||
      (MODULE_META[getModuleBase(t.href)]?.label ?? '').toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Persistência da preferência de intenção
  useEffect(() => {
    localStorage.setItem(INTENT_LS_KEY, intentMode);
  }, [intentMode]);

  // Manter módulos expandidos ao mudar trilha em modo INCÊNDIO
  useEffect(() => {
    if (intentMode === 'incendio') {
      setOpenModules(new Set<string>(TRAIL_MODULES[activeTrail]));
    }
  }, [activeTrail, intentMode]);

  const tc = TRAIL_CONFIG[activeTrail];
  const ts = trailStats[activeTrail];
  const pct = ts.total ? Math.round((ts.visited / ts.total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Tópicos</span>
      </div>

      <div className="section-label">Guia Completo</div>
      <h1 className="section-title">Todos os Tópicos</h1>
      <p className="section-sub">
        {TOPICS.length} tópicos organizados em {Object.keys(MODULE_META).length} módulos.
        Escolha sua trilha, expanda um módulo para ver os tópicos e clique para ir direto ao conteúdo.
      </p>

      {/* ── Trail tabs ── */}
      <div role="tablist" className="flex gap-0 border-b border-border mt-10 mb-0">
        {(Object.entries(TRAIL_CONFIG) as [TrailTab, typeof TRAIL_CONFIG[TrailTab]][]).map(([id, cfg]) => {
          const s = trailStats[id];
          return (
            <button
              key={id}
              {...trailButtonProps(id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                activeTrail === id ? cfg.activeTab : 'border-transparent text-text-2 hover:text-text'
              )}
            >
              {cfg.label}
              <span className="text-[11px] font-mono opacity-60 tabular-nums">
                {s.visited}/{s.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Trail hero ── */}
      {!searchQuery && (
        <div className={cn('flex items-center gap-5 bg-bg-2 border rounded-b-xl rounded-tr-xl p-5 mb-6', tc.color + '/30')}>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm mb-0.5">{tc.label}</div>
            <div className="text-xs text-text-3 mb-3">{tc.desc} · {TRAIL_MODULES[activeTrail].length} módulos</div>
            {intentMode === 'estudo' && (
              <>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-700', tc.barColor)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-text-3 mt-1.5">
                  {ts.visited} de {ts.total} módulos visitados · {pct}%
                </div>
              </>
            )}
          </div>
          <Link
            href={tc.hrefStart}
            className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            {ts.visited === 0 ? 'Começar →' : ts.visited === ts.total ? 'Revisar →' : 'Continuar →'}
          </Link>
        </div>
      )}

      {/* ── Busca ── */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" size={15} />
        <input
          type="text"
          placeholder="Buscar em todos os módulos... (ex: DNS, iptables, SNAT, chmod)"
          className="w-full bg-bg-2 border border-border rounded-lg py-2.5 pl-9 pr-20 text-sm focus:border-accent outline-none transition-colors"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-text-3 hover:text-text px-2 py-1 rounded hover:bg-bg-3 transition-colors"
          >
            ✕ limpar
          </button>
        )}
      </div>

      {/* ── Toggle de intenção: Estudo ↔ Incêndio ── */}
      {!searchQuery && (
        <div className="flex items-center justify-between mb-4">
          <button
            aria-pressed={intentMode === 'incendio'}
            onClick={toggleIntentMode}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all',
              intentMode === 'incendio'
                ? 'bg-[rgba(248,81,73,0.12)] border-[rgba(248,81,73,0.4)] text-[var(--color-err)]'
                : 'bg-bg-2 border-border text-text-2 hover:border-accent/50 hover:text-text'
            )}
          >
            <span aria-hidden="true">{intentMode === 'incendio' ? '🔥' : '📚'}</span>
            {intentMode === 'incendio' ? 'MODO OPERACIONAL' : 'Modo Estudo'}
          </button>
          {intentMode === 'incendio' && (
            <span aria-live="polite" className="text-[11px] font-mono text-[var(--color-err)] opacity-70 uppercase tracking-wider">
              L3/L4 primeiro · todos expandidos
            </span>
          )}
        </div>
      )}

      {/* ── Resultados de busca (flat) ── */}
      {searchResults ? (
        <div className="space-y-2">
          <p className="text-xs text-text-3 mb-4">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para &ldquo;<strong className="text-text">{searchQuery}</strong>&rdquo;
          </p>
          {searchResults.map(topic => {
            const base = getModuleBase(topic.href);
            const meta = MODULE_META[base];
            return (
              <Link
                key={topic.id}
                href={topic.href}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border hover:border-accent/50 rounded-xl transition-colors group"
              >
                <span className="text-xl mt-0.5 shrink-0">{meta?.icon ?? '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-3 mb-1 font-medium">{meta?.label ?? base}</p>
                  <p className="text-sm text-text-2 group-hover:text-text transition-colors leading-relaxed">{topic.title}</p>
                  <span className={cn('layer-badge mt-2', topic.layerClass)}>{topic.layer}</span>
                </div>
                {isVisited(base) && <span className="text-ok text-xs font-bold self-center shrink-0">✓</span>}
                <ChevronRight className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" size={14} />
              </Link>
            );
          })}
          {searchResults.length === 0 && (
            <div className="text-center py-16 bg-bg-2 border border-dashed border-border rounded-xl">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-text-3">Nenhum tópico encontrado para &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Accordion por módulo ── */
        <div className="space-y-1.5">
          {TRAIL_MODULES[activeTrail].map(modulePath => {
            const meta = MODULE_META[modulePath];
            if (!meta) return null;
            const topics = topicsByModule.get(modulePath) ?? [];
            const visited = isVisited(modulePath);
            const isOpen = openModules.has(modulePath);

            return (
              <div
                key={modulePath}
                className={cn(
                  'border rounded-xl overflow-hidden transition-all',
                  visited ? 'border-ok/25 bg-bg-2' : 'border-border bg-bg-2',
                  isOpen && 'border-accent/30'
                )}
              >
                {/* Cabeçalho do módulo */}
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-4 text-left hover:bg-bg-3 transition-colors',
                    intentMode === 'incendio' ? 'py-2.5' : 'py-3.5'
                  )}
                  onClick={() => toggleModule(modulePath)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base shrink-0">{meta.icon}</span>
                  <span className={cn(
                    'flex-1 text-sm font-semibold leading-snug',
                    visited ? 'text-text' : 'text-text-2',
                    intentMode === 'incendio' && 'truncate'
                  )}>
                    {meta.label}
                  </span>
                  {topics.length > 0 && (
                    <span className="text-[10px] text-text-3 font-mono tabular-nums shrink-0">
                      {topics.length} tópico{topics.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {visited && (
                    <span className="text-ok text-[11px] font-bold shrink-0 ml-1">✓</span>
                  )}
                  <Link
                    href={modulePath}
                    onClick={e => e.stopPropagation()}
                    className="text-[11px] text-accent hover:text-accent-2 font-bold px-2.5 py-1 rounded-lg hover:bg-accent/10 transition-colors shrink-0"
                  >
                    Abrir →
                  </Link>
                  {topics.length > 0 ? (
                    isOpen
                      ? <ChevronDown size={14} className="text-text-3 shrink-0" />
                      : <ChevronRight size={14} className="text-text-3 shrink-0" />
                  ) : (
                    <span className="w-3.5 shrink-0" />
                  )}
                </button>

                {/* Lista de tópicos (expandida) — TopicRow memoizado */}
                {isOpen && topics.length > 0 && (
                  <div className="border-t border-border/60">
                    {topics.map((topic, idx) => (
                      <TopicRow
                        key={topic.id}
                        topic={topic}
                        idx={idx}
                        expandedTooltip={expandedTooltip}
                        onToggleTooltip={handleToggleTooltip}
                        intentMode={intentMode}
                        isVisited={isVisited}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
