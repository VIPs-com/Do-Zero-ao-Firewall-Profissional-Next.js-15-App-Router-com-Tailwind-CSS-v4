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
  'quiz-beginner':   { icon: '🥉', title: 'Iniciante', desc: 'Completou o Quiz pela primeira vez' },
  'quiz-expert':     { icon: '🥇', title: 'Expert', desc: 'Score ≥ 80% no Quiz' },
  'quiz-master':     { icon: '🏆', title: 'Mestre', desc: 'Score 100% no Quiz' },
  'explorer':        { icon: '🗺️', title: 'Explorador', desc: 'Visitou 5+ páginas diferentes' },
  'deep-diver':      { icon: '🤿', title: 'Mergulhador', desc: 'Visitou todas as páginas de conteúdo' },
  'night-owl':       { icon: '🦉', title: 'Coruja Noturna', desc: 'Usou o Dark Mode' },
  'searcher':        { icon: '🔍', title: 'Investigador', desc: 'Usou a busca global' },
  'topology-pro':    { icon: '🖧', title: 'Topólogo', desc: 'Clicou em 5+ elementos da topologia' },
  'firewall-master': { icon: '🛡️', title: 'Firewall Master', desc: 'Configurou todas as regras de firewall' },
  'dns-master':      { icon: '📖', title: 'DNS Master', desc: 'Configurou zonas direta e reversa no BIND9' },
  'ssl-master':      { icon: '🔒', title: 'SSL Master', desc: 'Gerou certificado e configurou HTTPS no Nginx' },
  'vpn-master':      { icon: '🔒', title: 'VPN Architect', desc: 'Configurou uma VPN IPSec com StrongSwan' },
  'proxy-master':    { icon: '🚪', title: 'Proxy Master', desc: 'Configurou Squid com ACLs e dstdomain' },
  'knocking-master': { icon: '🔑', title: 'Knocking Master', desc: 'Configurou Port Knocking no firewall' },
  'certificado':     { icon: '🎓', title: 'Graduado', desc: 'Gerou o certificado de conclusão' },
  'linux-ninja':     { icon: '🥷', title: 'Linux Ninja', desc: 'Completou todos os desafios do workshop' },
  'pivoting-master': { icon: '💀', title: 'Pivoting Master', desc: 'Entendeu os riscos de pivoteamento na DMZ' },
  'defensor-topologia': { icon: '🛡️', title: 'Defensor da Topologia', desc: 'Identificou todos os riscos críticos na rede' },
};

export const ALL_CHECKLIST_IDS = [
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona', 'proxy-bloqueio',
  'web-server', 'dnat-funciona', 'port-knocking', 'snat-config', 'established-config',
  'forward-config', 'audit-log', 'dns-recursivo', 'dns-reverso', 'dns-firewall',
  'dnat-web', 'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping', 'vpn-psk', 'pivoting-risk'
];

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

  useEffect(() => {
    const savedBadges = localStorage.getItem('workshop-badges');
    const savedPages = localStorage.getItem('workshop-visited-pages');
    const savedClicks = localStorage.getItem('workshop-topo-clicks');
    const savedRisks = localStorage.getItem('workshop-clicked-risks');
    const savedChecklist = localStorage.getItem('workshop-checklist-v2');
    const savedScore = localStorage.getItem('workshop-quiz-score');

    if (savedBadges) setUnlockedBadges(new Set(JSON.parse(savedBadges)));
    if (savedPages) setVisitedPages(new Set(JSON.parse(savedPages)));
    if (savedClicks) setTopologyClicks(parseInt(savedClicks, 10));
    if (savedRisks) setClickedRisks(new Set(JSON.parse(savedRisks)));
    if (savedChecklist) setChecklist(JSON.parse(savedChecklist));
    if (savedScore) setQuizScore(parseInt(savedScore, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(Array.from(unlockedBadges)));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('workshop-visited-pages', JSON.stringify(Array.from(visitedPages)));
    if (visitedPages.size >= 5) unlockBadge('explorer');
    if (visitedPages.size >= 12) unlockBadge('deep-diver');
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
    const completedCount = Object.values(checklist).filter(v => v).length;
    
    // Sync specific items to badges
    if (checklist['dns-interno'] && checklist['dns-reverso']) unlockBadge('dns-master');
    if (checklist['web-server'] || checklist['nginx-ssl']) unlockBadge('ssl-master');
    if (checklist['proxy-funciona'] && checklist['proxy-bloqueio']) unlockBadge('proxy-master');
    if (checklist['port-knocking']) unlockBadge('knocking-master');
    if (checklist['vpn-up'] && checklist['vpn-ping']) unlockBadge('vpn-master');
    if (checklist['snat-config'] && checklist['established-config']) unlockBadge('firewall-master');
    if (checklist['pivoting-risk']) unlockBadge('pivoting-master');
    
    if (completedCount >= 15) unlockBadge('linux-ninja');
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('workshop-quiz-score', quizScore.toString());
    if (quizScore >= 80) unlockBadge('quiz-expert');
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
    setChecklist(prev => {
      if (prev[id] === value) return prev;
      return { ...prev, [id]: value };
    });
  }, []);

  const updateQuizScore = useCallback((score: number) => {
    setQuizScore(score);
  }, []);

  const checklistPercentage = useMemo(() => {
    const completed = ALL_CHECKLIST_IDS.filter(id => checklist[id]).length;
    return Math.round((completed / ALL_CHECKLIST_IDS.length) * 100);
  }, [checklist]);

  const contextValue = useMemo(() => ({ 
    unlockedBadges, unlockBadge, visitedPages, trackPageVisit, 
    topologyClicks, trackTopologyClick, clickedRisks, trackRiskClick,
    checklist, updateChecklist, checklistPercentage,
    quizScore, updateQuizScore
  }), [
    unlockedBadges, unlockBadge, visitedPages, trackPageVisit, 
    topologyClicks, trackTopologyClick, clickedRisks, trackRiskClick,
    checklist, updateChecklist, checklistPercentage,
    quizScore, updateQuizScore
  ]);

  return (
    <BadgeContext.Provider value={contextValue}>
      {children}
      {lastNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-bg-2 border border-accent rounded-lg p-4 shadow-lg animate-in slide-in-from-bottom-10">
          <div className="text-3xl">{BADGE_DEFS[lastNotification].icon}</div>
          <div>
            <div className="text-xs font-bold text-accent uppercase tracking-wider">🏆 Badge Desbloqueado!</div>
            <div className="text-sm font-semibold">{BADGE_DEFS[lastNotification].title}</div>
            <div className="text-xs text-text-2">{BADGE_DEFS[lastNotification].desc}</div>
          </div>
        </div>
      )}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => {
  const context = useContext(BadgeContext);
  if (!context) throw new Error('useBadges must be used within a BadgeProvider');
  return context;
};
