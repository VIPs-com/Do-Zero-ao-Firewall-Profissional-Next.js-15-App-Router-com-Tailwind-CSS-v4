/**
 * Testes de integridade dos dados do Quiz (Sprint CONSOLIDACAO).
 * Valida contagens, campos obrigatórios, duplicatas e ordem do barrel.
 * Zero renderização React — roda em milissegundos.
 */
import { describe, it, expect } from 'vitest';
import { FIREWALL_QUESTIONS } from './quiz/firewall';
import { FUNDAMENTOS_QUESTIONS } from './quiz/fundamentos';
import { AVANCADOS_QUESTIONS } from './quiz/avancados';
import { QUIZ_QUESTIONS } from './quizQuestions';
import type { QuizQuestion } from './quiz/types';

const REQUIRED_FIELDS: (keyof QuizQuestion)[] = ['text', 'badge', 'options', 'correct', 'explanation', 'trail'];

function sharedAssertions(questions: QuizQuestion[], label: string) {
  it('todos os campos obrigatórios presentes', () => {
    questions.forEach((q, i) => {
      REQUIRED_FIELDS.forEach(field => {
        expect(q[field] !== undefined && q[field] !== null,
          `questão ${i} em ${label} sem campo "${field}"`).toBe(true);
      });
    });
  });

  it('nenhuma tem text duplicado', () => {
    const texts = questions.map(q => q.text);
    const unique = new Set(texts);
    expect(unique.size, `${label} tem ${texts.length - unique.size} pergunta(s) duplicada(s)`).toBe(texts.length);
  });

  it('correct é índice válido (0 <= correct < options.length)', () => {
    questions.forEach((q, i) => {
      expect(q.correct, `questão ${i} correct=${q.correct} fora do intervalo`).toBeGreaterThanOrEqual(0);
      expect(q.correct, `questão ${i} correct=${q.correct} >= ${q.options.length}`).toBeLessThan(q.options.length);
    });
  });

  it('todas têm exatamente 4 opções', () => {
    questions.forEach((q, i) => {
      expect(q.options.length, `questão ${i} em ${label} tem ${q.options.length} opções`).toBe(4);
    });
  });
}

// ── FIREWALL ──────────────────────────────────────────────────────────────
describe('FIREWALL_QUESTIONS', () => {
  it('tem exatamente 105 questões', () => { expect(FIREWALL_QUESTIONS).toHaveLength(105); });
  it("todas têm trail: 'firewall'", () => {
    FIREWALL_QUESTIONS.forEach((q, i) => expect(q.trail, `questão ${i}`).toBe('firewall'));
  });
  sharedAssertions(FIREWALL_QUESTIONS, 'FIREWALL_QUESTIONS');
});

// ── FUNDAMENTOS ───────────────────────────────────────────────────────────
describe('FUNDAMENTOS_QUESTIONS', () => {
  it('tem exatamente 60 questões', () => { expect(FUNDAMENTOS_QUESTIONS).toHaveLength(60); });
  it("todas têm trail: 'fundamentos'", () => {
    FUNDAMENTOS_QUESTIONS.forEach((q, i) => expect(q.trail, `questão ${i}`).toBe('fundamentos'));
  });
  sharedAssertions(FUNDAMENTOS_QUESTIONS, 'FUNDAMENTOS_QUESTIONS');
});

// ── AVANCADOS ─────────────────────────────────────────────────────────────
describe('AVANCADOS_QUESTIONS', () => {
  it('tem exatamente 92 questões', () => { expect(AVANCADOS_QUESTIONS).toHaveLength(92); });
  it("todas têm trail: 'avancados'", () => {
    AVANCADOS_QUESTIONS.forEach((q, i) => expect(q.trail, `questão ${i}`).toBe('avancados'));
  });
  sharedAssertions(AVANCADOS_QUESTIONS, 'AVANCADOS_QUESTIONS');
});

// ── BARREL ────────────────────────────────────────────────────────────────
describe('QUIZ_QUESTIONS (barrel)', () => {
  it('total = 257 (105 + 60 + 92)', () => { expect(QUIZ_QUESTIONS).toHaveLength(257); });

  it('nenhuma text duplicada em todo o array', () => {
    const texts = QUIZ_QUESTIONS.map(q => q.text);
    const unique = new Set(texts);
    expect(unique.size, `${texts.length - unique.size} texto(s) duplicado(s)`).toBe(texts.length);
  });

  it('ordem: primeiro bloco é firewall (índices 0..104)', () => {
    for (let i = 0; i < 105; i++)
      expect(QUIZ_QUESTIONS[i].trail, `[${i}]`).toBe('firewall');
  });

  it('ordem: segundo bloco é fundamentos (índices 105..164)', () => {
    for (let i = 105; i < 165; i++)
      expect(QUIZ_QUESTIONS[i].trail, `[${i}]`).toBe('fundamentos');
  });

  it('ordem: terceiro bloco é avancados (índices 165..256)', () => {
    for (let i = 165; i < 257; i++)
      expect(QUIZ_QUESTIONS[i].trail, `[${i}]`).toBe('avancados');
  });
});
