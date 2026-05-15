/**
 * Tipos compartilhados do quiz — importados pelos 3 arquivos de trilha
 * para evitar imports circulares.
 */

export type QuizTrail = 'firewall' | 'fundamentos' | 'avancados';

export interface QuizQuestion {
  text: string;
  badge: string;
  options: string[];
  /** Índice (0-based) da opção correta em `options`. */
  correct: number;
  explanation: string;
  /** Trilha do workshop à qual a questão pertence. */
  trail: QuizTrail;
}
