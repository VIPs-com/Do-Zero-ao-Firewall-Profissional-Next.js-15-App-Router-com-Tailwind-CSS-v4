/**
 * Perguntas do Quiz — extraídas de `app/quiz/page.tsx` no Sprint F.
 *
 * Sprint QUIZ-SPLIT: dividido em 3 arquivos por trilha para melhor
 * code-splitting e organização. Ver `src/data/quiz/`.
 *
 * IMPORTANTE: a ordem do array combinado preserva compatibilidade com
 * os índices do SRS (workshop-srs-v1 no localStorage).
 */

// Re-exporta tipos para compatibilidade com todos os imports existentes
export type { QuizTrail, QuizQuestion } from './quiz/types';

import { FIREWALL_QUESTIONS } from './quiz/firewall';
import { FUNDAMENTOS_QUESTIONS } from './quiz/fundamentos';
import { AVANCADOS_QUESTIONS } from './quiz/avancados';

export const QUIZ_QUESTIONS = [
  ...FIREWALL_QUESTIONS,
  ...FUNDAMENTOS_QUESTIONS,
  ...AVANCADOS_QUESTIONS,
];
