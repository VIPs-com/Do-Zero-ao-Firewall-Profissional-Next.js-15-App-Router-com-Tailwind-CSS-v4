'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, Award, ChevronRight, ChevronLeft, Trophy, Search, BookOpen, History, RotateCcw, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { QUIZ_QUESTIONS, type QuizQuestion, type QuizTrail } from '@/data/quizQuestions';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { getSRSData, saveSRSData, seedItem, getNow } from '@/lib/srs';

/* Sprint F — perguntas extraídas para src/data/quizQuestions.ts (reduz o bundle da rota /quiz). */
/* Sprint QUIZ-TRAIL — filtro por trilha na tela de início.                                       */
/* Sprint QUIZ-v2 — explicação inline, histórico de sessões (últimas 3), revisão de erros.        */

/* ── localStorage ────────────────────────────────────────────────────────────── */
const LS_HISTORY  = 'workshop-quiz-history';   // SessionRecord[] (max 3)
const LS_WRONG    = 'workshop-quiz-wrong-ids'; // number[] — índices em QUIZ_QUESTIONS

interface SessionRecord {
  date: string;
  score: number;
  total: number;
  percentage: number;
  trail: string;
  sessionSize: number | string;
}

function safeReadLS<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

const TRAIL_OPTIONS: Array<{ value: QuizTrail | 'all'; label: string; count: number; color: string }> = [
  { value: 'all',         label: 'Todas as Trilhas', count: QUIZ_QUESTIONS.length,                                         color: 'border-accent text-accent' },
  { value: 'firewall',    label: '🔥 Firewall',       count: QUIZ_QUESTIONS.filter(q => q.trail === 'firewall').length,    color: 'border-[#e05a2b] text-[#e05a2b]' },
  { value: 'fundamentos', label: '🐧 Fundamentos',    count: QUIZ_QUESTIONS.filter(q => q.trail === 'fundamentos').length, color: 'border-[#6366f1] text-[#6366f1]' },
  { value: 'avancados',   label: '🚀 Avançados',      count: QUIZ_QUESTIONS.filter(q => q.trail === 'avancados').length,   color: 'border-info text-info' },
];

type SessionSize = 20 | 40 | 'all';

const SESSION_OPTIONS: Array<{ value: SessionSize; label: string; desc: string }> = [
  { value: 20,    label: 'Rápido',   desc: '20 questões · ~5 min' },
  { value: 40,    label: 'Normal',   desc: '40 questões · ~10 min' },
  { value: 'all', label: 'Completo', desc: 'Todas · sem limite' },
];

/** Fisher-Yates shuffle (in-place, returns same array) */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState<QuizTrail | 'all'>('all');
  const [sessionSize, setSessionSize] = useState<SessionSize>(20);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showModuleFilter, setShowModuleFilter] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  // QUESTIONS é definido no handleStart — embaralhado + fatiado por sessão
  const [QUESTIONS, setQUESTIONS] = useState<QuizQuestion[]>([]);
  // QUIZ-v2: histórico e erros
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const { updateQuizScore, trackPageVisit } = useBadges();

  // Módulos disponíveis para a trilha selecionada (derivado, ordenado a-z)
  const moduleOptions = useMemo(() => {
    const pool = selectedTrail === 'all'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter(q => q.trail === selectedTrail);
    const counts = new Map<string, number>();
    pool.forEach(q => counts.set(q.badge, (counts.get(q.badge) ?? 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
      .map(([badge, count]) => ({ badge, count }));
  }, [selectedTrail]);

  // Contagem de preview para a tela de início (não embaralhado)
  const previewCount = useMemo(() => {
    let pool = selectedTrail === 'all'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter(q => q.trail === selectedTrail);
    if (selectedModule) pool = pool.filter(q => q.badge === selectedModule);
    return sessionSize === 'all' ? pool.length : Math.min(sessionSize, pool.length);
  }, [selectedTrail, sessionSize, selectedModule]);

  useEffect(() => {
    trackPageVisit('quiz');
    // Carrega histórico e contagem de erros do localStorage
    setSessionHistory(safeReadLS<SessionRecord[]>(LS_HISTORY, []));
    setWrongCount((safeReadLS<number[]>(LS_WRONG, [])).length);
    // URL params: ?trail=fundamentos pré-seleciona a trilha · ?modulo=NFS o módulo
    const params = new URLSearchParams(window.location.search);
    const trail = params.get('trail');
    if (trail === 'firewall' || trail === 'fundamentos' || trail === 'avancados') {
      setSelectedTrail(trail);
    }
    const mod = params.get('modulo');
    if (mod) {
      setSelectedModule(mod);
      setShowModuleFilter(true);
    }
  }, [trackPageVisit]);

  const handleStart = useCallback(() => {
    let pool = selectedTrail === 'all'
      ? [...QUIZ_QUESTIONS]
      : QUIZ_QUESTIONS.filter(q => q.trail === selectedTrail);
    if (selectedModule) pool = pool.filter(q => q.badge === selectedModule);
    const shuffled = shuffleArray([...pool]);
    const limit = sessionSize === 'all' ? shuffled.length : Math.min(sessionSize, shuffled.length);
    setQUESTIONS(shuffled.slice(0, limit));
    setCurrentIdx(0);
    setAnswers({});
    setShowResult(false);
    setStarted(true);
  }, [selectedTrail, selectedModule, sessionSize]);

  const handleAnswer = useCallback((optIdx: number) => {
    if (showResult) return;
    if (answers[currentIdx] !== undefined) return; // lock após primeiro toque
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  }, [showResult, answers, currentIdx]);

  const score = useMemo(() => {
    let correct = 0;
    Object.entries(answers).forEach(([idx, ans]) => {
      if (ans === QUESTIONS[parseInt(idx)]?.correct) correct++;
    });
    return correct;
  }, [answers, QUESTIONS]);

  const percentage = Math.round((score / QUESTIONS.length) * 100);

  const finishQuiz = useCallback(() => {
    setShowResult(true);
    // updateQuizScore() já dispara o useEffect no BadgeContext que desbloqueia
    // 'quiz-beginner' (>0), 'quiz-expert' (≥80) e 'quiz-master' (===100).
    updateQuizScore(percentage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // ── QUIZ-v2: salva questões erradas ──────────────────────────────────
    const wrongTexts = new Set(
      QUESTIONS.filter((q, i) => answers[i] !== q.correct).map(q => q.text)
    );
    const wrongIds = QUIZ_QUESTIONS
      .map((q, i) => (wrongTexts.has(q.text) ? i : -1))
      .filter(i => i >= 0);
    localStorage.setItem(LS_WRONG, JSON.stringify(wrongIds));
    setWrongCount(wrongIds.length);

    // ── Épico B — seed SRS: cada questão errada entra na fila de revisão espaçada
    let srsStore = getSRSData();
    const srsNow = getNow();
    wrongIds.forEach(idx => { srsStore = seedItem(srsStore, idx, srsNow); });
    saveSRSData(srsStore);

    // ── QUIZ-v2: salva sessão no histórico (max 3) ───────────────────────
    const trailLabel =
      selectedTrail === 'all'           ? '🗂️ Todas'
      : selectedTrail === 'firewall'    ? '🔥 Firewall'
      : selectedTrail === 'fundamentos' ? '🐧 Fundamentos'
      : '🚀 Avançados';
    const record: SessionRecord = {
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      score,
      total: QUESTIONS.length,
      percentage,
      trail: selectedModule ? `${trailLabel} · ${selectedModule}` : trailLabel,
      sessionSize: sessionSize === 'all' ? 'todas' : sessionSize,
    };
    const prev = safeReadLS<SessionRecord[]>(LS_HISTORY, []);
    const next = [record, ...prev].slice(0, 3);
    localStorage.setItem(LS_HISTORY, JSON.stringify(next));
    setSessionHistory(next);
  }, [percentage, score, QUESTIONS, answers, selectedTrail, sessionSize, updateQuizScore]);

  const resetQuiz = useCallback(() => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
    setStarted(false);
    setQUESTIONS([]);
    // não reseta selectedTrail nem sessionSize — o usuário pode querer repetir a mesma configuração
  }, []);

  /** QUIZ-v2: inicia sessão de revisão usando apenas as questões erradas da última sessão */
  const handleReview = useCallback(() => {
    const wrongIds = safeReadLS<number[]>(LS_WRONG, []);
    if (wrongIds.length === 0) return;
    const pool = QUIZ_QUESTIONS.filter((_, i) => wrongIds.includes(i));
    setQUESTIONS(shuffleArray([...pool]));
    setCurrentIdx(0);
    setAnswers({});
    setShowResult(false);
    setStarted(true);
  }, []);

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-2 border border-border rounded-2xl p-12 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8">
            <Search size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Desafio Final</h1>
          <p className="text-text-2 mb-6 max-w-md mx-auto leading-relaxed">
            Teste seus conhecimentos em Linux, Redes, Segurança e Infraestrutura.
            Escolha a trilha ou pratique com todas as questões.
          </p>

          {/* Seletor de trilha */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-left" role="radiogroup" aria-label="Selecionar trilha do quiz">
            {TRAIL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                role="radio"
                aria-checked={selectedTrail === opt.value}
                onClick={() => { setSelectedTrail(opt.value); setSelectedModule(null); }}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  selectedTrail === opt.value
                    ? cn('bg-bg-3', opt.color)
                    : 'border-border text-text-2 hover:border-accent/50',
                  opt.value === 'all' && 'col-span-2',
                )}
              >
                <div className={cn('text-sm font-bold', selectedTrail === opt.value ? opt.color.split(' ')[1] : '')}>{opt.label}</div>
                <div className="text-xs text-text-3 mt-0.5">{opt.count} questões</div>
              </button>
            ))}
          </div>

          {/* Seletor de tamanho da sessão */}
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-widest text-text-3 mb-3 text-left">Tamanho da sessão</div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tamanho da sessão">
              {SESSION_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  role="radio"
                  aria-checked={sessionSize === opt.value}
                  onClick={() => setSessionSize(opt.value)}
                  className={cn(
                    'p-3 rounded-xl border-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    sessionSize === opt.value
                      ? 'bg-bg-3 border-accent text-accent'
                      : 'border-border text-text-2 hover:border-accent/50',
                  )}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-xs text-text-3 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por módulo (colapsável) */}
          <div className="mb-6">
            <button
              onClick={() => setShowModuleFilter(v => !v)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                showModuleFilter
                  ? 'border-accent/50 bg-accent/5 text-accent'
                  : 'border-border text-text-2 hover:border-accent/30'
              )}
              aria-expanded={showModuleFilter}
            >
              <span className="flex items-center gap-2">
                <Filter size={14} />
                {selectedModule
                  ? <>Módulo: <span className="font-bold text-accent">{selectedModule}</span></>
                  : 'Filtrar por módulo (opcional)'}
              </span>
              <span className="text-text-3 text-xs font-mono">{showModuleFilter ? '▲' : '▼'}</span>
            </button>

            {showModuleFilter && (
              <div className="mt-2 p-3 bg-bg-3 border border-border rounded-xl">
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {/* chip "Todos" */}
                  <button
                    onClick={() => setSelectedModule(null)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold border transition-all',
                      selectedModule === null
                        ? 'bg-accent border-accent text-bg'
                        : 'border-border text-text-3 hover:border-accent/50'
                    )}
                  >
                    Todos ({selectedTrail === 'all'
                      ? QUIZ_QUESTIONS.length
                      : QUIZ_QUESTIONS.filter(q => q.trail === selectedTrail).length})
                  </button>
                  {moduleOptions.map(({ badge, count }) => (
                    <button
                      key={badge}
                      onClick={() => setSelectedModule(badge === selectedModule ? null : badge)}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold border transition-all',
                        selectedModule === badge
                          ? 'bg-accent border-accent text-bg'
                          : 'border-border text-text-2 hover:border-accent/50'
                      )}
                    >
                      {badge} <span className="opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Histórico das últimas sessões */}
          {sessionHistory.length > 0 && (
            <div className="mb-6 text-left">
              <div className="text-xs font-bold uppercase tracking-widest text-text-3 mb-2 flex items-center gap-1.5">
                <History size={12} /> Últimas sessões
              </div>
              <div className="space-y-1.5">
                {sessionHistory.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-bg-3 rounded-lg px-3 py-2 text-xs">
                    <span className="text-text-3">{s.trail} · {s.sessionSize}q · {s.date}</span>
                    <span className={cn(
                      'font-bold',
                      s.percentage >= 80 ? 'text-ok' : s.percentage >= 50 ? 'text-warn' : 'text-err'
                    )}>{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão revisar erros */}
          {wrongCount > 0 && (
            <button
              onClick={handleReview}
              className="w-full py-3 mb-3 rounded-xl border-2 border-warn/40 text-warn hover:border-warn hover:bg-warn/5 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <RotateCcw size={16} />
              Revisar {wrongCount} erro{wrongCount !== 1 ? 's' : ''} da última sessão
            </button>
          )}

          <button
            onClick={handleStart}
            aria-label="Começar Quiz"
            className="btn-primary w-full py-4 text-lg"
          >
            Começar — {previewCount} questões embaralhadas
            <ChevronRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-2 border border-border rounded-2xl p-12 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8">
            <Trophy size={40} />
          </div>
          <h2 className="text-4xl font-bold mb-4">Seu Resultado</h2>
          <div className="text-6xl font-black text-accent mb-2">{score}/{QUESTIONS.length}</div>
          <div className="text-xl font-bold text-text-2 mb-8">{percentage}% de acerto</div>
          
          <p className="text-text-3 mb-10 max-w-md mx-auto leading-relaxed">
            {percentage >= 80 
              ? '🎉 Excelente! Você domina os conceitos fundamentais de redes e firewalls Linux.' 
              : '📚 Bom trabalho! Recomendamos revisar os tópicos onde houve dúvidas para solidificar seu conhecimento.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {wrongCount > 0 && (
              <button
                onClick={handleReview}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-warn/50 text-warn hover:border-warn hover:bg-warn/5 transition-all text-sm font-semibold"
              >
                <RotateCcw size={17} />
                Revisar {wrongCount} erro{wrongCount !== 1 ? 's' : ''}
              </button>
            )}
            {wrongCount > 0 && (
              <Link
                href="/treino"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 transition-all text-sm font-bold"
              >
                🎯 Treinar com SRS →
              </Link>
            )}
            <button onClick={resetQuiz} className="btn-outline">
              <RefreshCw size={18} />
              Novo Quiz
            </button>
            <Link href="/certificado" className="btn-primary">
              <Award size={18} />
              Ver Certificado
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 space-y-6 text-left">
          <h3 className="font-bold text-xl px-4">Revisão das Questões</h3>
          {QUESTIONS.map((q, i) => (
            <div key={i} className={cn(
              "p-6 rounded-xl border",
              answers[i] === q.correct ? "bg-ok/5 border-ok/20" : "bg-err/5 border-err/20"
            )}>
              <div className="flex justify-between items-start gap-4 mb-4">
                <h4 className="font-bold text-sm leading-relaxed">{i + 1}. {q.text}</h4>
                {answers[i] === q.correct ? (
                  <CheckCircle2 className="text-ok shrink-0" size={20} />
                ) : (
                  <XCircle className="text-err shrink-0" size={20} />
                )}
              </div>
              <div className="text-xs text-text-2 mb-4">
                Sua resposta: <span className={answers[i] === q.correct ? "text-ok font-bold" : "text-err font-bold"}>{q.options[answers[i]]}</span>
              </div>
              <div className="p-4 bg-bg-3 rounded-lg text-xs text-text-3 leading-relaxed border border-border/50">
                <strong className="text-accent block mb-1">Explicação:</strong>
                {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIdx];
  // Feedback por questão — derivado do estado existente, sem novo useState
  const hasAnswered = answers[currentIdx] !== undefined;
  const selectedOpt = answers[currentIdx];
  const isCorrect = hasAnswered && selectedOpt === currentQuestion.correct;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Quiz Interativo</span>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="section-label">Autoavaliação</div>
            <h1 className="text-3xl font-bold">Teste seus conhecimentos</h1>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-text-3 uppercase tracking-widest mb-1">Questão</div>
            <div className="text-2xl font-bold text-accent">{currentIdx + 1}<span className="text-text-3 text-sm font-normal">/{QUESTIONS.length}</span></div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-bg-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-bg-2 border border-border rounded-2xl p-8 shadow-sm"
        >
          <div className="question-badge mb-4">{currentQuestion.badge}</div>
          <h2 className="text-xl font-bold mb-8 leading-relaxed">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedOpt === i;
              const isThisCorrect = i === currentQuestion.correct;
              // visual após responder
              const optClass = !hasAnswered
                ? cn(
                    "bg-bg-3 border-border text-text-2 hover:border-accent/50 hover:text-text cursor-pointer",
                    isSelected && "bg-accent-bg border-accent text-text"
                  )
                : isThisCorrect
                  ? "bg-ok/10 border-ok/60 text-ok cursor-default"
                  : isSelected
                    ? "bg-err/10 border-err/60 text-err cursor-default"
                    : "bg-bg-3 border-border text-text-3 opacity-40 cursor-default";

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={hasAnswered}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    optClass
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Opção ${i + 1}: ${opt}`}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    !hasAnswered && (isSelected ? "border-accent bg-accent text-white" : "border-border"),
                    hasAnswered && isThisCorrect && "border-ok bg-ok text-white",
                    hasAnswered && isSelected && !isThisCorrect && "border-err bg-err text-white",
                    hasAnswered && !isThisCorrect && !isSelected && "border-border",
                  )}>
                    {hasAnswered && isThisCorrect
                      ? <CheckCircle2 size={14} />
                      : hasAnswered && isSelected && !isThisCorrect
                        ? <XCircle size={14} />
                        : isSelected && !hasAnswered
                          ? <div className="w-2 h-2 rounded-full bg-white" />
                          : null}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Chip de feedback instantâneo + explicação inline (QUIZ-v2) */}
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-3 rounded-lg border text-sm font-medium",
                isCorrect ? "bg-ok/10 border-ok/30 text-ok" : "bg-err/10 border-err/30 text-err"
              )}
            >
              <div className="flex items-center gap-3">
                {isCorrect
                  ? <><CheckCircle2 size={18} className="shrink-0" /> <span>Correto! ✓</span></>
                  : <><XCircle size={18} className="shrink-0" /> <span>Resposta correta: <strong>{currentQuestion.options[currentQuestion.correct]}</strong></span></>
                }
              </div>
              {/* Explicação imediata (apenas quando errou) */}
              {!isCorrect && currentQuestion.explanation && (
                <div className="mt-2 pt-2 border-t border-err/20 flex items-start gap-1.5 text-xs text-text-2 font-normal leading-relaxed">
                  <BookOpen size={12} className="shrink-0 mt-0.5 text-err/60" />
                  <span>{currentQuestion.explanation}</span>
                </div>
              )}
            </motion.div>
          )}

          <div className="mt-10 flex justify-between items-center">
            <button 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="btn-outline px-4 py-2 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>
            
            {currentIdx === QUESTIONS.length - 1 ? (
              <button 
                onClick={finishQuiz}
                disabled={answers[currentIdx] === undefined}
                className="btn-primary px-8 py-2 disabled:opacity-50"
              >
                Finalizar Quiz
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                disabled={answers[currentIdx] === undefined}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                Próxima
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/quiz" />
    </div>
  );
}
