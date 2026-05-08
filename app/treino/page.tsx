'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Target, ChevronRight, RotateCcw, CheckCircle2, AlertTriangle, Clock, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import {
  getSRSData,
  saveSRSData,
  getDueItems,
  getAllItems,
  calculateNextReview,
  clearSRSData,
  getNow,
  type SRSStore,
  type SRSItem,
} from '@/lib/srs';
import { QUIZ_QUESTIONS } from '@/data/quizQuestions';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_SESSION = 20;
const MS_PER_DAY  = 86_400_000;

const SCORE_LABELS: { score: number; emoji: string; label: string; color: string }[] = [
  { score: 1, emoji: '❌', label: 'Não lembro',    color: 'border-err/50 bg-err/10 text-err hover:bg-err/20' },
  { score: 2, emoji: '😓', label: 'Muito difícil', color: 'border-warn/40 bg-warn/10 text-warn hover:bg-warn/20' },
  { score: 3, emoji: '🤔', label: 'Com esforço',   color: 'border-border bg-bg-3 text-text-2 hover:bg-bg-3' },
  { score: 4, emoji: '✅', label: 'Lembrei',        color: 'border-ok/40 bg-ok/10 text-ok hover:bg-ok/20' },
  { score: 5, emoji: '⚡', label: 'Fácil',          color: 'border-info/40 bg-info/10 text-info hover:bg-info/20' },
];

type Phase = 'lobby' | 'question' | 'rating' | 'done';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getItemUrgency(item: SRSItem, now: number): 'overdue' | 'today' | 'scheduled' {
  if (item.nextReview <= now) return 'overdue';
  if (item.nextReview <= now + MS_PER_DAY) return 'today';
  return 'scheduled';
}

function getDaysOverdue(item: SRSItem, now: number): number {
  return Math.max(0, Math.floor((now - item.nextReview) / MS_PER_DAY));
}

function getDaysUntil(item: SRSItem, now: number): number {
  return Math.max(0, Math.ceil((item.nextReview - now) / MS_PER_DAY));
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function TreinoPage() {
  const { trackPageVisit } = useBadges();

  React.useEffect(() => { trackPageVisit('/treino'); window.scrollTo(0, 0); }, [trackPageVisit]);

  const [store,        setStore]       = useState<SRSStore>(() => getSRSData());
  const [session,      setSession]     = useState<SRSItem[]>([]);
  const [currentIdx,   setCurrentIdx]  = useState(0);
  const [phase,        setPhase]       = useState<Phase>('lobby');
  const [showAnswer,   setShowAnswer]  = useState(false);
  const [sessionScores,setScores]      = useState<number[]>([]);
  const [showClear,    setShowClear]   = useState(false);

  const now = useMemo(() => getNow(), [phase]); // refresh por fase

  // Items vencidos e total no store
  const dueItems  = useMemo(() => getDueItems(store, now, QUIZ_QUESTIONS.length), [store, now]);
  const allItems  = useMemo(() => getAllItems(store, QUIZ_QUESTIONS.length), [store]);
  const totalDue  = dueItems.length;
  const totalSRS  = allItems.length;

  // Questão atual da sessão
  const currentItem = session[currentIdx];
  const currentQ    = currentItem ? QUIZ_QUESTIONS[currentItem.questionIdx] : null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    const items = getDueItems(store, getNow(), QUIZ_QUESTIONS.length).slice(0, MAX_SESSION);
    if (items.length === 0) return;
    setSession(items);
    setCurrentIdx(0);
    setScores([]);
    setShowAnswer(false);
    setPhase('question');
    window.scrollTo(0, 0);
  }, [store]);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const handleScore = useCallback((score: number) => {
    if (!currentItem) return;

    // Aplica SM-2 e persiste
    const now       = getNow();
    const updated   = calculateNextReview(currentItem, score, now);
    const newStore  = {
      ...store,
      items: { ...store.items, [currentItem.questionIdx]: updated },
    };
    saveSRSData(newStore);
    setStore(newStore);
    setScores(prev => [...prev, score]);

    // Próxima questão ou fim
    const nextIdx = currentIdx + 1;
    if (nextIdx < session.length) {
      setCurrentIdx(nextIdx);
      setShowAnswer(false);
      window.scrollTo(0, 0);
    } else {
      setPhase('done');
      window.scrollTo(0, 0);
    }
  }, [currentItem, currentIdx, session, store]);

  const handleRestart = useCallback(() => {
    setPhase('lobby');
    setStore(getSRSData()); // refetch para mostrar items atualizados
    setSession([]);
    setCurrentIdx(0);
    setScores([]);
    setShowAnswer(false);
    window.scrollTo(0, 0);
  }, []);

  const handleClear = useCallback(() => {
    clearSRSData();
    setStore({ version: 1, items: {}, updatedAt: getNow() });
    setShowClear(false);
    setPhase('lobby');
  }, []);

  // ── Resultado da sessão ──────────────────────────────────────────────────

  const sessionAvgScore = useMemo(() => {
    if (!sessionScores.length) return 0;
    return sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length;
  }, [sessionScores]);

  const sessionStrong  = sessionScores.filter(s => s >= 4).length;
  const sessionWeak    = sessionScores.filter(s => s <= 2).length;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — Lobby
  // ─────────────────────────────────────────────────────────────────────────

  if (phase === 'lobby') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <div className="breadcrumb mb-8">
          <Link href="/">Início</Link>
          <span>/</span>
          <span className="text-text-2">Treinamento Tático</span>
        </div>

        {/* Hero */}
        <div className="section-label">Motor SM-2 · Revisão Espaçada</div>
        <h1 className="section-title flex items-center gap-3">
          <Target className="text-accent" size={32} aria-hidden="true" />
          Treinamento Tático
        </h1>
        <p className="section-sub mb-8">
          O sistema analisa seu histórico de respostas e agenda automaticamente as revisões
          no momento certo — quando você está prestes a esquecer. Ciência cognitiva aplicada
          ao estudo de redes Linux.
        </p>

        {/* Stats do store */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-bg-2 border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent">{totalSRS}</p>
            <p className="text-[11px] text-text-3 mt-1 uppercase tracking-wider font-mono">Agendadas</p>
          </div>
          <div className={cn(
            'border rounded-xl p-4 text-center',
            totalDue > 5 ? 'bg-err/5 border-err/30' : totalDue > 0 ? 'bg-warn/5 border-warn/30' : 'bg-bg-2 border-border'
          )}>
            <p className={cn('text-2xl font-bold', totalDue > 5 ? 'text-err' : totalDue > 0 ? 'text-warn' : 'text-text-3')}>
              {totalDue}
            </p>
            <p className="text-[11px] text-text-3 mt-1 uppercase tracking-wider font-mono">Pendentes</p>
          </div>
          <div className="bg-bg-2 border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-text-3">{totalSRS - totalDue}</p>
            <p className="text-[11px] text-text-3 mt-1 uppercase tracking-wider font-mono">Agendadas</p>
          </div>
        </div>

        {/* CTA principal */}
        {totalDue === 0 ? (
          <div className="bg-ok/5 border border-ok/30 rounded-xl p-6 text-center mb-8">
            <CheckCircle2 className="text-ok mx-auto mb-3" size={40} aria-hidden="true" />
            <p className="font-bold text-text mb-1">
              {totalSRS === 0 ? 'Nenhuma revisão agendada ainda' : 'Tudo em dia! ✓'}
            </p>
            <p className="text-sm text-text-3">
              {totalSRS === 0
                ? 'Complete o quiz para começar a acumular pontos de revisão.'
                : 'Volte amanhã ou faça o quiz para acumular novos pontos de revisão.'
              }
            </p>
            {totalSRS === 0 && (
              <Link href="/quiz" className="inline-flex items-center gap-2 mt-4 btn-primary px-5 py-2.5 text-sm">
                Ir para o Quiz <ChevronRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-8">
            {/* Alerta operacional para backlog crítico */}
            {totalDue > 5 && (
              <div className="flex items-center gap-3 bg-err/10 border border-err/30 rounded-lg px-4 py-3 mb-4">
                <AlertTriangle className="text-err shrink-0" size={18} aria-hidden="true" />
                <p className="text-sm text-err font-medium">
                  Backlog operacional: {totalDue} revisões acumuladas. Revisar agora previne perda de retenção.
                </p>
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-3"
            >
              <Target size={20} aria-hidden="true" />
              Iniciar Missão ({Math.min(totalDue, MAX_SESSION)} revisões)
            </button>
          </div>
        )}

        {/* Lista de items agendados */}
        {allItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-text-3 mb-3">
              Fila de revisão
            </p>
            {allItems.slice(0, 10).map(item => {
              const q       = QUIZ_QUESTIONS[item.questionIdx];
              if (!q) return null;
              const urgency = getItemUrgency(item, now);
              const days    = urgency === 'overdue' ? getDaysOverdue(item, now) : getDaysUntil(item, now);

              return (
                <div
                  key={item.questionIdx}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border text-sm',
                    urgency === 'overdue'   && 'bg-err/5 border-err/20',
                    urgency === 'today'     && 'bg-warn/5 border-warn/20',
                    urgency === 'scheduled' && 'bg-bg-2 border-border',
                  )}
                >
                  <span className="shrink-0 mt-0.5 text-base" aria-hidden="true">
                    {urgency === 'overdue' ? '🔴' : urgency === 'today' ? '🟡' : '🔵'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-xs font-bold mb-0.5',
                      urgency === 'overdue' ? 'text-err' : urgency === 'today' ? 'text-warn' : 'text-text-3'
                    )}>
                      {urgency === 'overdue'
                        ? `Atrasado ${days > 0 ? `${days}d` : 'hoje'}`
                        : urgency === 'today'
                        ? 'Para hoje'
                        : `Em ${days}d`}
                      {' · '}{q.badge}
                    </p>
                    <p className="text-text-2 line-clamp-1 text-xs">{q.text}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-text-3 font-mono">×{item.repetitions}</p>
                    <p className="text-[10px] text-text-3 font-mono">EF {item.easeFactor.toFixed(1)}</p>
                  </div>
                </div>
              );
            })}
            {allItems.length > 10 && (
              <p className="text-center text-xs text-text-3 py-2">
                + {allItems.length - 10} mais agendadas
              </p>
            )}
          </div>
        )}

        {/* LGPD — Apagar dados */}
        {totalSRS > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            {!showClear ? (
              <button
                onClick={() => setShowClear(true)}
                className="text-xs text-text-3 hover:text-err transition-colors"
              >
                Apagar todos os dados de revisão
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-err/5 border border-err/30 rounded-lg p-4">
                <p className="text-sm text-text-2 flex-1">
                  Apagar todos os {totalSRS} dados de revisão SRS? Esta ação não pode ser desfeita.
                </p>
                <button onClick={handleClear} className="text-sm font-bold text-err hover:text-err/80 transition-colors">
                  Confirmar
                </button>
                <button onClick={() => setShowClear(false)} className="text-sm text-text-3 hover:text-text transition-colors">
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — Question / Rating
  // ─────────────────────────────────────────────────────────────────────────

  if ((phase === 'question' || phase === 'rating') && currentQ) {
    const urgency     = getItemUrgency(currentItem, now);
    const progress    = currentIdx / session.length;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Progresso da sessão */}
        <div className="flex items-center justify-between mb-6 text-xs text-text-3 font-mono">
          <span>Missão {currentIdx + 1} / {session.length}</span>
          <button onClick={handleRestart} className="hover:text-text transition-colors flex items-center gap-1">
            <RotateCcw size={12} aria-hidden="true" /> Encerrar
          </button>
        </div>
        <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Urgência */}
        <div className={cn(
          'inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4',
          urgency === 'overdue' ? 'text-err border-err/40 bg-err/10'
          : urgency === 'today' ? 'text-warn border-warn/40 bg-warn/10'
          : 'text-info border-info/40 bg-info/10'
        )}>
          <span aria-hidden="true">{urgency === 'overdue' ? '🔴' : urgency === 'today' ? '🟡' : '🔵'}</span>
          {urgency === 'overdue' ? 'Ponto de revisão · Área crítica' : urgency === 'today' ? 'Revisão de hoje' : 'Revisão agendada'}
        </div>

        {/* Badge da questão */}
        <div className="mb-2">
          <span className="layer-badge l4">{currentQ.badge}</span>
        </div>

        {/* Pergunta */}
        <div className="bg-bg-2 border border-border rounded-xl p-6 mb-6">
          <p className="text-text leading-relaxed text-base">{currentQ.text}</p>
        </div>

        {/* Botão "Ver Resposta" */}
        {!showAnswer ? (
          <button
            onClick={handleShowAnswer}
            className="w-full btn-outline py-3.5 font-bold flex items-center justify-center gap-2"
          >
            <Brain size={18} aria-hidden="true" />
            Ver Resposta
          </button>
        ) : (
          <div className="space-y-4">
            {/* Resposta correta */}
            <div className="bg-ok/5 border border-ok/30 rounded-xl p-5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-ok mb-2">
                ✓ Resposta correta
              </p>
              <p className="text-text font-semibold mb-3">
                {currentQ.options[currentQ.correct]}
              </p>
              {currentQ.explanation && (
                <>
                  <div className="border-t border-ok/20 pt-3 mt-3">
                    <p className="text-xs text-text-2 leading-relaxed">{currentQ.explanation}</p>
                  </div>
                </>
              )}
            </div>

            {/* Botões de score */}
            <div>
              <p className="text-xs text-text-3 font-mono uppercase tracking-wider mb-3 text-center">
                Como foi sua lembrança?
              </p>
              <div className="grid grid-cols-5 gap-2">
                {SCORE_LABELS.map(({ score, emoji, label, color }) => (
                  <button
                    key={score}
                    onClick={() => handleScore(score)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 py-3 rounded-xl border font-bold transition-all text-xs',
                      color
                    )}
                    aria-label={`Score ${score}: ${label}`}
                  >
                    <span className="text-xl" aria-hidden="true">{emoji}</span>
                    <span className="text-[10px] leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] text-text-3 mt-2 font-mono">
                1 = esqueceu · 5 = automático
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — Done
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">

      <div className="text-5xl mb-4" aria-hidden="true">
        {sessionAvgScore >= 4 ? '🎯' : sessionAvgScore >= 3 ? '💪' : '📋'}
      </div>

      <div className="section-label justify-center">Sessão concluída</div>
      <h2 className="text-2xl font-bold text-text mb-2">
        {sessionAvgScore >= 4
          ? 'Excelente retenção!'
          : sessionAvgScore >= 3
          ? 'Bom progresso!'
          : 'Pontos de revisão identificados'}
      </h2>
      <p className="text-text-3 mb-8 text-sm">
        {session.length} questão{session.length !== 1 ? 'ões' : ''} revisada{session.length !== 1 ? 's' : ''} · Score médio {sessionAvgScore.toFixed(1)} / 5
      </p>

      {/* Stats da sessão */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-ok/5 border border-ok/30 rounded-xl p-4">
          <p className="text-2xl font-bold text-ok">{sessionStrong}</p>
          <p className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-wider">Sólidas</p>
        </div>
        <div className="bg-bg-2 border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-text">
            {sessionScores.filter(s => s === 3).length}
          </p>
          <p className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-wider">Com esforço</p>
        </div>
        <div className={cn('border rounded-xl p-4', sessionWeak > 0 ? 'bg-err/5 border-err/30' : 'bg-bg-2 border-border')}>
          <p className={cn('text-2xl font-bold', sessionWeak > 0 ? 'text-err' : 'text-text-3')}>{sessionWeak}</p>
          <p className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-wider">A reforçar</p>
        </div>
      </div>

      {/* Próximas revisões */}
      {(() => {
        const freshStore = getSRSData();
        const nextDue    = getDueItems(freshStore, getNow() + MS_PER_DAY, QUIZ_QUESTIONS.length).length;
        return nextDue > 0 ? (
          <div className="flex items-center gap-2 bg-info/5 border border-info/30 rounded-lg px-4 py-3 mb-6 text-sm">
            <Clock size={16} className="text-info shrink-0" aria-hidden="true" />
            <span className="text-text-2">{nextDue} revisão{nextDue !== 1 ? 'ões' : ''} agendada{nextDue !== 1 ? 's' : ''} para amanhã</span>
          </div>
        ) : null;
      })()}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {getDueItems(getSRSData(), getNow(), QUIZ_QUESTIONS.length).length > 0 ? (
          <button onClick={handleRestart} className="btn-primary px-6 py-3 flex items-center gap-2 justify-center">
            <Zap size={16} aria-hidden="true" /> Nova Missão
          </button>
        ) : (
          <div className="flex items-center gap-2 text-ok text-sm font-bold">
            <CheckCircle2 size={16} aria-hidden="true" /> Tudo em dia por hoje!
          </div>
        )}
        <Link href="/dashboard" className="btn-outline px-6 py-3 flex items-center gap-2 justify-center">
          Dashboard <ChevronRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/quiz" className="btn-outline px-6 py-3 flex items-center gap-2 justify-center">
          Mais Quiz <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
