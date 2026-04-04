'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Trophy, 
  CheckCircle2, 
  BookOpen, 
  Target, 
  Award, 
  ChevronRight, 
  Shield, 
  Zap,
  Activity,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges, BADGE_DEFS, BadgeId } from '@/context/BadgeContext';

export default function DashboardPage() {
  const { 
    unlockedBadges, 
    visitedPages, 
    checklist, 
    quizScore,
    trackPageVisit
  } = useBadges();

  React.useEffect(() => {
    trackPageVisit('dashboard');
  }, [trackPageVisit]);

  // FIX: era 28 → agora bate com TOPICS.length em topicos/page.tsx (24 tópicos)
  const totalTopics = 24;
  const topicsProgress = Math.round((visitedPages.size / totalTopics) * 100);

  // FIX: era 8 → agora bate com ALL_CHECKLIST_IDS.length em BadgeContext.tsx (26 checkpoints)
  const checklistItemsCount = 26;
  const checklistCompleted = Object.values(checklist).filter(v => v).length;
  const checklistProgress = Math.round((checklistCompleted / checklistItemsCount) * 100);

  const overallProgress = Math.round((topicsProgress + checklistProgress + (quizScore > 0 ? 100 : 0)) / 3);

  const stats = [
    { label: 'Tópicos Lidos',    value: `${visitedPages.size}/${totalTopics}`,          icon: <BookOpen />, color: 'text-info' },
    { label: 'Labs Concluídos',  value: `${checklistCompleted}/${checklistItemsCount}`, icon: <Shield />,   color: 'text-ok' },
    { label: 'Melhor Quiz',      value: `${quizScore}%`,                                icon: <Zap />,      color: 'text-accent' },
    { label: 'Badges',           value: `${unlockedBadges.size}/${Object.keys(BADGE_DEFS).length}`, icon: <Trophy />, color: 'text-warn' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Meu Progresso</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-bg-2 to-accent-bg/10 border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Olá, Administrador! 🧑</h1>
              <p className="text-text-2 mb-6">Aqui está o resumo da sua jornada rumo ao Firewall Profissional.</p>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-bg-3 stroke-current"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${overallProgress}, 100` }}
                      className="text-accent stroke-current"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-black">
                    {overallProgress}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-text-3 mb-1">Progresso Geral</div>
                  <div className="text-xs text-text-2 max-w-[200px]">
                    {overallProgress < 50
                      ? 'Você está no começo da jornada. Continue firme!'
                      : 'Quase lá! Falta pouco para o certificado.'}
                  </div>
                </div>
              </div>
            </div>
            <Activity className="absolute -bottom-6 -right-6 text-accent/5 w-48 h-48" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-bg-2 border border-border rounded-xl p-6 text-center">
                <div className={cn("w-10 h-10 rounded-lg bg-bg-3 flex items-center justify-center mx-auto mb-4", stat.color)}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-3">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Badges Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-warn" size={20} />
                Conquistas Desbloqueadas
              </h2>
              <span className="text-xs font-mono text-text-3">{unlockedBadges.size} de {Object.keys(BADGE_DEFS).length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(BADGE_DEFS).map(([id, badge]) => {
                const isUnlocked = unlockedBadges.has(id as BadgeId);
                return (
                  <div
                    key={id}
                    className={cn(
                      "p-6 rounded-xl border text-center transition-all",
                      isUnlocked
                        ? "bg-bg-2 border-accent/30 shadow-sm"
                        : "bg-bg-2/50 border-border opacity-40 grayscale"
                    )}
                  >
                    <div className="text-4xl mb-3">{badge.icon}</div>
                    <div className="text-xs font-bold mb-1">{badge.title}</div>
                    <div className="text-[9px] text-text-3 leading-tight">{badge.desc}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">

          {/* Checklist Summary */}
          <div className="bg-bg-2 border border-border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Target className="text-ok" size={16} />
              Checklist do Lab
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-text-3">Concluído</span>
                <span className="font-bold">{checklistProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-3 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-ok transition-all" style={{ width: `${checklistProgress}%` }} />
              </div>
              <Link href="/instalacao#checklist" className="btn-outline w-full py-2 text-xs">
                Continuar Lab
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-bg-2 border border-border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Zap className="text-accent" size={16} />
              Próximos Passos
            </h3>
            <div className="space-y-4">
              {overallProgress < 100 ? (
                <>
                  <div className="p-3 rounded-lg bg-bg-3 border border-border text-[11px] leading-relaxed">
                    <strong className="text-accent block mb-1">Dica do Mestre:</strong>
                    {visitedPages.size < 10
                      ? 'Explore mais tópicos técnicos para entender a teoria por trás das regras.'
                      : checklistProgress < 100
                        ? 'Finalize as validações do laboratório para garantir que tudo está funcionando.'
                        : 'Você está pronto para o Quiz final! Teste seus conhecimentos.'}
                  </div>
                  {quizScore < 80 && (
                    <Link href="/quiz" className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-3 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">
                          <Layout size={14} />
                        </div>
                        <span className="text-xs font-medium">Fazer o Quiz</span>
                      </div>
                      <ChevronRight size={14} className="text-text-3 group-hover:text-accent transition-colors" />
                    </Link>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-4">🎓</div>
                  <h4 className="font-bold text-sm mb-2">Tudo Pronto!</h4>
                  <p className="text-[10px] text-text-3 mb-4">Você completou todos os requisitos do workshop.</p>
                  <Link href="/certificado" className="btn-primary w-full py-2 text-xs">
                    Gerar Certificado
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Status */}
          <div className={cn(
            "p-6 rounded-xl border flex items-center gap-4",
            overallProgress >= 90 ? "bg-ok/5 border-ok/30" : "bg-bg-2 border-border"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              overallProgress >= 90 ? "bg-ok/10 text-ok" : "bg-bg-3 text-text-3"
            )}>
              <Award size={24} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-0.5">Certificado</div>
              <div className="text-[10px] text-text-3">
                {overallProgress >= 90 ? 'Disponível para emissão' : 'Complete 90% para liberar'}
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
