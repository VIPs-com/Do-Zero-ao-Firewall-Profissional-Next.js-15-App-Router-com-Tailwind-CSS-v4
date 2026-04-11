'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, Award, ChevronRight, ChevronLeft, Trophy, Search, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/data/quizQuestions';

/* Sprint F — perguntas extraídas para src/data/quizQuestions.ts (reduz o bundle da rota /quiz). */
const QUESTIONS: QuizQuestion[] = QUIZ_QUESTIONS;

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const { updateQuizScore, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('quiz');
  }, [trackPageVisit]);

  const handleAnswer = (optIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const score = useMemo(() => {
    let correct = 0;
    Object.entries(answers).forEach(([idx, ans]) => {
      if (ans === QUESTIONS[parseInt(idx)].correct) correct++;
    });
    return correct;
  }, [answers]);

  const percentage = Math.round((score / QUESTIONS.length) * 100);

  const finishQuiz = () => {
    setShowResult(true);
    // updateQuizScore() já dispara o useEffect no BadgeContext que desbloqueia
    // 'quiz-beginner' (>0), 'quiz-expert' (≥80) e 'quiz-master' (===100).
    // Não precisa chamar unlockBadge aqui — evita duplicidade.
    updateQuizScore(percentage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
    setStarted(false);
  };

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
          <p className="text-text-2 mb-8 max-w-md mx-auto leading-relaxed">
            Teste seus conhecimentos em Firewall Linux, DNS, Proxy, SSL e VPN. 
            São <strong>{QUESTIONS.length} questões</strong> que cobrem todo o conteúdo do workshop.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-10 text-left">
            <div className="p-4 rounded-xl bg-bg-3 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Dificuldade</div>
              <div className="text-sm font-bold text-accent">Intermediário</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-3 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Tempo Médio</div>
              <div className="text-sm font-bold text-accent">10-15 min</div>
            </div>
          </div>

          <button onClick={() => setStarted(true)} className="btn-primary w-full py-4 text-lg">
            Começar Agora
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

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={resetQuiz} className="btn-outline">
              <RefreshCw size={18} />
              Refazer Quiz
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
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  answers[currentIdx] === i 
                    ? "bg-accent-bg border-accent text-text" 
                    : "bg-bg-3 border-border text-text-2 hover:border-accent/50 hover:text-text"
                )}
                aria-pressed={answers[currentIdx] === i}
                aria-label={`Opção ${i + 1}: ${opt}`}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  answers[currentIdx] === i 
                    ? "border-accent bg-accent text-white" 
                    : "border-border group-hover:border-accent/50"
                )}>
                  {answers[currentIdx] === i && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-medium">{opt}</span>
              </button>
            ))}
          </div>

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
    </div>
  );
}
