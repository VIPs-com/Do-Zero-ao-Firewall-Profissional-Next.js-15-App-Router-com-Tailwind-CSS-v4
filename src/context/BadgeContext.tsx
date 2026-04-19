import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type BadgeId =
  | 'quiz-beginner' | 'quiz-expert' | 'quiz-master'
  | 'explorer' | 'deep-diver' | 'night-owl' | 'searcher' | 'topology-pro'
  | 'firewall-master' | 'dns-master' | 'ssl-master' | 'vpn-master'
  | 'proxy-master' | 'knocking-master' | 'certificado' | 'linux-ninja' | 'pivoting-master' | 'defensor-topologia'
  | 'time-traveler'
  | 'wireguard-master'
  | 'fail2ban-master'
  | 'proxmox-pioneer'
  | 'resgate-gold'
  | 'sigma-master';

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
  'deep-diver':         { icon: '🤿', title: 'Mergulhador',        desc: 'Visitou todas as 18 páginas de conteúdo' },
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
  'time-traveler':      { icon: '⏳', title: 'Viajante do Tempo',     desc: 'Importou um snapshot de progresso' },
  'wireguard-master':   { icon: '🔐', title: 'WireGuard Master',      desc: 'Configurou um túnel WireGuard do zero' },
  'fail2ban-master':    { icon: '🚫', title: 'Fail2ban Master',       desc: 'Protegeu serviços com Fail2ban' },
  'proxmox-pioneer':    { icon: '🖥️', title: 'Proxmox Pioneer',      desc: 'Configurou um laboratório completo no Proxmox VE' },
  'resgate-gold':       { icon: '🏅', title: 'Agente de Resgate',     desc: 'Explorou os ambientes de laboratório avançados' },
  'sigma-master':       { icon: '🔬', title: 'SIGMA Master',          desc: 'Dominou forense de rede, anatomia do NAT e internos do kernel' },
};

export const ALL_CHECKLIST_IDS = [
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona', 'proxy-bloqueio',
  'web-server', 'dnat-funciona', 'port-knocking', 'snat-config', 'established-config',
  'forward-config', 'audit-log', 'dns-recursivo', 'dns-reverso', 'dns-firewall',
  'dnat-web', 'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping', 'vpn-psk', 'pivoting-risk',
  // Sprint I.1 — WireGuard
  'wg-keys', 'wg-server', 'wg-tunnel',
  // Sprint I.2 — Fail2ban
  'f2b-install', 'f2b-sshd', 'f2b-ban-test',
  // Sprint R — Alinhamento com material original (Aula 2)
  'firewall-persistence', 'firewall-service', 'firewall-log',
  // Sprint SIGMA — Ambientes de Laboratório
  'lab-comparison-read', 'lab-kvm-installed', 'lab-kvm-vm',
  // Sprint SIGMA — Proxmox VE
  'proxmox-iso', 'proxmox-bridges', 'proxmox-vms', 'proxmox-snapshot',
  // Sprint SIGMA — Certbot para Produção
  'certbot-installed', 'certbot-certificate', 'certbot-renewal',
  // Sprint SIGMA Fase 2 — /port-knocking
  'knock-admin-flow', 'knock-visibility',
  // Sprint SIGMA Fase 2 — /audit-logs
  'audit-knock-script', 'knock-monitor-script', 'audit-log-rotation',
  // Sprint SIGMA Fase 2 — /wan-nat
  'nat-5-functions', 'nat-conntrack-magic',
  // Sprint SIGMA Fase 2 — /dnat
  'prerouting-deep-dive', 'conntrack-dnat-mapping',
  // Sprint SIGMA Fase 2 — /lan-proxy
  'squid-flow-understood', 'squid-http-vs-https',
  // Sprint W — Windows-to-Linux (/instalacao)
  'terminal-basico', 'sudo-entendido', 'sysadmin-mindset',
]; // 59 checkpoints — deve bater com checklistItemsCount no dashboard

/*
 * PÁGINAS DE CONTEÚDO DO PROJETO (16 rotas técnicas — não inclui home, quiz, dashboard, certificado, topicos)
 * Usadas como limiar para o badge 'deep-diver'.
 * Atualizar se novas rotas de conteúdo forem adicionadas.
 *
 * /instalacao, /wan-nat, /dns, /nginx-ssl, /web-server, /lan-proxy,
 * /dnat, /port-knocking, /vpn-ipsec, /ataques-avancados, /pivoteamento,
 * /audit-logs, /evolucao, /glossario, /cheat-sheet
 */
export const CONTENT_PAGES_COUNT = 20; // Sprint SIGMA: +/laboratorio +/proxmox

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
  exportProgress: () => void;
  importProgress: (json: string) => { ok: boolean; error?: string };
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
    if (visitedPages.size >= CONTENT_PAGES_COUNT) unlockBadge('deep-diver');
    if (visitedPages.has('laboratorio') && visitedPages.has('proxmox')) unlockBadge('resgate-gold');
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
    if (checklist['wg-keys'] && checklist['wg-server'] && checklist['wg-tunnel']) unlockBadge('wireguard-master');
    if (checklist['f2b-install'] && checklist['f2b-sshd'] && checklist['f2b-ban-test']) unlockBadge('fail2ban-master');
    if (checklist['proxmox-iso'] && checklist['proxmox-bridges'] && checklist['proxmox-vms'] && checklist['proxmox-snapshot']) unlockBadge('proxmox-pioneer');
    // Sprint SIGMA Fase 2 — todos os 11 checkpoints avançados
    if (
      checklist['knock-admin-flow'] && checklist['knock-visibility'] &&
      checklist['audit-knock-script'] && checklist['knock-monitor-script'] && checklist['audit-log-rotation'] &&
      checklist['nat-5-functions'] && checklist['nat-conntrack-magic'] &&
      checklist['prerouting-deep-dive'] && checklist['conntrack-dnat-mapping'] &&
      checklist['squid-flow-understood'] && checklist['squid-http-vs-https']
    ) unlockBadge('sigma-master');

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

  const exportProgress = useCallback(() => {
    const snapshot = {
      version: 1,
      exportedAt: new Date().toISOString(),
      badges: Array.from(unlockedBadges),
      visitedPages: Array.from(visitedPages),
      topologyClicks,
      clickedRisks: Array.from(clickedRisks),
      checklist,
      quizScore,
      theme: localStorage.getItem('workshop-theme'),
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop-linux-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Delay revocation to give the browser time to start the download.
    // Without this, Chromium may cancel the blob download if revoked synchronously.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [unlockedBadges, visitedPages, topologyClicks, clickedRisks, checklist, quizScore]);

  const importProgress = useCallback((json: string): { ok: boolean; error?: string } => {
    try {
      const data = JSON.parse(json) as Record<string, unknown>;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Formato inválido');
      }

      if (Array.isArray(data.badges)) {
        const badges = data.badges as BadgeId[];
        setUnlockedBadges(new Set(badges));
        localStorage.setItem('workshop-badges', JSON.stringify(badges));
      }
      if (Array.isArray(data.visitedPages)) {
        const pages = data.visitedPages as string[];
        setVisitedPages(new Set(pages));
        localStorage.setItem('workshop-visited-pages', JSON.stringify(pages));
      }
      if (typeof data.topologyClicks === 'number') {
        setTopologyClicks(data.topologyClicks);
        localStorage.setItem('workshop-topo-clicks', String(data.topologyClicks));
      }
      if (Array.isArray(data.clickedRisks)) {
        const risks = data.clickedRisks as string[];
        setClickedRisks(new Set(risks));
        localStorage.setItem('workshop-clicked-risks', JSON.stringify(risks));
      }
      if (data.checklist && typeof data.checklist === 'object' && !Array.isArray(data.checklist)) {
        const cl = data.checklist as Record<string, boolean>;
        setChecklist(cl);
        localStorage.setItem('workshop-checklist-v2', JSON.stringify(cl));
      }
      if (typeof data.quizScore === 'number') {
        setQuizScore(data.quizScore);
        localStorage.setItem('workshop-quiz-score', String(data.quizScore));
      }
      if (typeof data.theme === 'string') {
        localStorage.setItem('workshop-theme', data.theme);
      }

      // Concede o badge após importação bem-sucedida
      unlockBadge('time-traveler');

      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }, [unlockBadge]);

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
      exportProgress,
      importProgress,
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
