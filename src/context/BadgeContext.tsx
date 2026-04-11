import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type BadgeId = 
  | 'quiz-beginner' | 'quiz-expert' | 'quiz-master'
  | 'explorer' | 'deep-diver' | 'night-owl' | 'searcher' | 'topology-pro'
  | 'firewall-master' | 'dns-master' | 'ssl-master' | 'vpn-master'
  | 'proxy-master' | 'knocking-master' | 'certificado' | 'linux-ninja' | 'pivoting-master' | 'defensor-topologia';

export interface BadgeDef {
  icon: string;
  title: string;
  desc: string;
}

export const BADGE_DEFS: Record<BadgeId, BadgeDef> = {
  'quiz-beginner':      { icon: '🥉', title: 'Iniciante',          desc: 'Completou o Quiz pela primeira vez' },
  'quiz-expert':        { icon: '🥇', title: 'Expert',             desc: 'Score ≥ 80% no Quiz' },
  'quiz-master':        { icon: '🏆', title: 'Mestre',             desc: 'Score 100% no Quiz' },
  'explorer':           { icon: '🗺️', title: 'Explorador',         desc: 'Visitou 5+ páginas diferentes' },
  'deep-diver':         { icon: '🤿', title: 'Mergulhador',        desc: 'Visitou todas as 16 páginas de conteúdo' },
  'night-owl':          { icon: '🦉', title: 'Coruja Noturna',     desc: 'Ativou o Dark Mode' },
  'searcher':           { icon: '🔍', title: 'Investigador',       desc: 'Usou a busca global' },
  'topology-pro':       { icon: '🖧', title: 'Topólogo',           desc: 'Clicou em 5+ elementos da topologia' },
  'firewall-master':    { icon: '🛡️', title: 'Firewall Master',    desc: 'Configurou todas as regras de firewall' },
  'dns-master':         { icon: '📖', title: 'DNS Master',         desc: 'Configurou zonas direta e reversa no BIND9' },
  'ssl-master':         { icon: '🔒', title: 'SSL Master',         desc: 'Gerou certificado e configurou HTTPS no Nginx' },
  'vpn-master':         { icon: '🔒', title: 'VPN Architect',      desc: 'Configurou uma VPN IPSec com StrongSwan' },
  'proxy-master':       { icon: '🚪', title: 'Proxy Master',       desc: 'Configurou Squid com ACLs e dstdomain' },
  'knocking-master':    { icon: '🔑', title: 'Knocking Master',    desc: 'Configurou Port Knocking no firewall' },
  'certificado':        { icon: '🎓', title: 'Graduado',           desc: 'Gerou o certificado de conclusão' },
  'linux-ninja':        { icon: '🥷', title: 'Linux Ninja',        desc: 'Completou todos os desafios do workshop' },
  'pivoting-master':    { icon: '💀', title: 'Pivoting Master',    desc: 'Entendeu os riscos de pivoteamento na DMZ' },
  'defensor-topologia': { icon: '🛡️', title: 'Defensor da Topologia', desc: 'Identificou todos os riscos críticos na rede' },
};

export const ALL_CHECKLIST_IDS = [
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona', 'proxy-bloqueio',
  'web-server', 'dnat-funciona', 'port-knocking', 'snat-config', 'established-config',
  'forward-config', 'audit-log', 'dns-recursivo', 'dns-reverso', 'dns-firewall',
  'dnat-web', 'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping', 'vpn-psk', 'pivoting-risk'
]; // 26 checkpoints — deve bater com checklistItemsCount no dashboard

/*
 * PÁGINAS DE CONTEÚDO DO PROJETO (16 rotas técnicas — não inclui home, quiz, dashboard, certificado, topicos)
 * Usadas como limiar para o badge 'deep-diver'.
 * Atualizar se novas rotas de conteúdo forem adicionadas.
 *
 * /instalacao, /wan-nat, /dns, /nginx-ssl, /web-server, /lan-proxy,
 * /dnat, /port-knocking, /vpn-ipsec, /ataques-avancados, /pivoteamento,
 * /audit-logs, /evolucao, /glossario, /cheat-sheet
 */
const CONTENT_PAGES_COUNT = 16;

interface BadgeContextType {
  unlockedBadges: Set<BadgeId>;
  unlockBadge: (id: BadgeId) => void;
  visitedPages: Set<string>;
  trackPageVisit: (page: string) => void;
  topologyClicks: number;
  trackTopologyClick: () => void;
  clickedRisks: Set<string>;
  trackRiskClick: (riskId: string) => void;
  checklist: Record<string, boolean>;
  updateChecklist: (id: string, value: boolean) => void;
  checklistPercentage: number;
  quizScore: number;
  updateQuizScore: (score: number) => void;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlockedBadges, setUnlockedBadges] = useState<Set<BadgeId>>(new Set());
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());
  const [topologyClicks, setTopologyClicks] = useState(0);
  const [clickedRisks, setClickedRisks] = useState<Set<string>>(new Set());
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [lastNotification, setLastNotification] = useState<BadgeId | null>(null);

  // Hidratação do localStorage — cada read é defensivo:
  // se o JSON estiver corrompido (manipulação manual, versão antiga, etc.),
  // logamos o erro e descartamos a chave em vez de quebrar a árvore React.
  useEffect(() => {
    const safeParseArray = <T,>(key: string): T[] | null => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T[]) : null;
      } catch (err) {
        console.warn(`[BadgeContext] localStorage corrompido em "${key}", descartando.`, err);
        localStorage.removeItem(key);
        return null;
      }
    };

    const safeParseObject = <T extends object>(key: string): T | null => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as T) : null;
      } catch (err) {
        console.warn(`[BadgeContext] localStorage corrompido em "${key}", descartando.`, err);
        localStorage.removeItem(key);
        return null;
      }
    };

    const safeParseInt = (key: string): number | null => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    };

    const badges    = safeParseArray<BadgeId>('workshop-badges');
    const pages     = safeParseArray<string>('workshop-visited-pages');
    const clicks    = safeParseInt('workshop-topo-clicks');
    const risks     = safeParseArray<string>('workshop-clicked-risks');
    const checklistData = safeParseObject<Record<string, boolean>>('workshop-checklist-v2');
    const score     = safeParseInt('workshop-quiz-score');

    if (badges)        setUnlockedBadges(new Set(badges));
    if (pages)         setVisitedPages(new Set(pages));
    if (clicks !== null) setTopologyClicks(clicks);
    if (risks)         setClickedRisks(new Set(risks));
    if (checklistData) setChecklist(checklistData);
    if (score !== null)  setQuizScore(score);
  }, []);

  useEffect(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(Array.from(unlockedBadges)));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('workshop-visited-pages', JSON.stringify(Array.from(visitedPages)));
    if (visitedPages.size >= 5)                  unlockBadge('explorer');
    if (visitedPages.size >= CONTENT_PAGES_COUNT) unlockBadge('deep-diver'); // FIX: era 12 (arbitrário) → agora 15 (todas as páginas de conteúdo)
  }, [visitedPages]);

  useEffect(() => {
    localStorage.setItem('workshop-topo-clicks', topologyClicks.toString());
    if (topologyClicks >= 5) unlockBadge('topology-pro');
  }, [topologyClicks]);

  useEffect(() => {
    localStorage.setItem('workshop-clicked-risks', JSON.stringify(Array.from(clickedRisks)));
    if (clickedRisks.size >= 3) unlockBadge('defensor-topologia');
  }, [clickedRisks]);

  useEffect(() => {
    localStorage.setItem('workshop-checklist-v2', JSON.stringify(checklist));

    // Badges por checklist — mapeamento direto
    if (checklist['dns-interno'] && checklist['dns-reverso'])       unlockBadge('dns-master');
    if (checklist['web-server']  || checklist['nginx-ssl'])         unlockBadge('ssl-master');
    if (checklist['proxy-funciona'] && checklist['proxy-bloqueio']) unlockBadge('proxy-master');
    if (checklist['port-knocking'])                                  unlockBadge('knocking-master');
    if (checklist['vpn-up'] && checklist['vpn-ping'])               unlockBadge('vpn-master');
    if (checklist['snat-config'] && checklist['established-config']) unlockBadge('firewall-master');
    if (checklist['pivoting-risk'])                                  unlockBadge('pivoting-master');

    if (Object.values(checklist).filter(v => v).length >= 15) unlockBadge('linux-ninja');
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('workshop-quiz-score', quizScore.toString());
    if (quizScore > 0)    unlockBadge('quiz-beginner'); // FIX: qualquer tentativa = badge
    if (quizScore >= 80)  unlockBadge('quiz-expert');
    if (quizScore === 100) unlockBadge('quiz-master');
  }, [quizScore]);

  const unlockBadge = useCallback((id: BadgeId) => {
    setUnlockedBadges(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      setLastNotification(id);
      setTimeout(() => setLastNotification(null), 4000);
      return next;
    });
  }, []);

  const trackPageVisit = useCallback((page: string) => {
    setVisitedPages(prev => {
      if (prev.has(page)) return prev;
      const next = new Set(prev);
      next.add(page);
      return next;
    });
  }, []);

  const trackTopologyClick = useCallback(() => {
    setTopologyClicks(prev => prev + 1);
  }, []);

  const trackRiskClick = useCallback((riskId: string) => {
    setClickedRisks(prev => {
      if (prev.has(riskId)) return prev;
      const next = new Set(prev);
      next.add(riskId);
      return next;
    });
  }, []);

  const updateChecklist = useCallback((id: string, value: boolean) => {
    setChecklist(prev => ({ ...prev, [id]: value }));
  }, []);

  const checklistPercentage = useMemo(() => {
    const completed = Object.values(checklist).filter(v => v).length;
    return ALL_CHECKLIST_IDS.length > 0
      ? Math.round((completed / ALL_CHECKLIST_IDS.length) * 100)
      : 0;
  }, [checklist]);

  const updateQuizScore = useCallback((score: number) => {
    setQuizScore(score);
  }, []);

  return (
    <BadgeContext.Provider value={{
      unlockedBadges,
      unlockBadge,
      visitedPages,
      trackPageVisit,
      topologyClicks,
      trackTopologyClick,
      clickedRisks,
      trackRiskClick,
      checklist,
      updateChecklist,
      checklistPercentage,
      quizScore,
      updateQuizScore,
    }}>
      {children}
      {lastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-bg-2 border border-accent/40 rounded-xl px-5 py-4 shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="text-2xl">{BADGE_DEFS[lastNotification].icon}</span>
          <div>
            <p className="text-xs text-accent font-mono uppercase tracking-wider">Badge desbloqueado!</p>
            <p className="font-bold text-sm">{BADGE_DEFS[lastNotification].title}</p>
            <p className="text-xs text-text-3">{BADGE_DEFS[lastNotification].desc}</p>
          </div>
        </div>
      )}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => {
  const ctx = useContext(BadgeContext);
  if (!ctx) throw new Error('useBadges must be used within BadgeProvider');
  return ctx;
};
