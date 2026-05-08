/**
 * src/lib/srs.ts — Motor SM-2 Lite (Spaced Repetition System)
 *
 * ZERO imports React. Algoritmo puro, testável e desacoplado da UI.
 * Pode ser reutilizado em React Native, Electron, PWA offline, backend sync.
 *
 * Referência: SuperMemo SM-2 (Wozniak, 1987)
 * easeFactor mínimo: 1.3 (invariante obrigatório)
 * easeFactor inicial: 2.5
 */

// ── Tipos públicos ────────────────────────────────────────────────────────────

export interface SRSItem {
  questionIdx: number;   // índice em QUIZ_QUESTIONS
  interval: number;      // dias até próxima revisão
  easeFactor: number;    // modificador de dificuldade (mín 1.3)
  repetitions: number;   // streak de revisões corretas consecutivas
  nextReview: number;    // timestamp ms
  lastReview: number;    // timestamp ms
  lastScore: number;     // 1-5
}

export interface SRSStore {
  version: 1;
  items: Record<number, SRSItem>;  // questionIdx → SRSItem
  updatedAt: number;               // timestamp ms
}

// ── Constantes ────────────────────────────────────────────────────────────────

const SRS_KEY     = 'workshop-srs-v1' as const;
const INITIAL_EF  = 2.5;
const MIN_EF      = 1.3;
const MS_PER_DAY  = 86_400_000;

// ── Fonte de tempo centralizada ───────────────────────────────────────────────
/**
 * getNow() — todas as datas do motor passam por aqui.
 * Centralizado para testabilidade (mock fácil), timezone-safety e
 * futura sincronização com servidor. Nunca usar Date.now() direto.
 */
export function getNow(): number {
  return Date.now();
}

// ── Persistência abstraída ────────────────────────────────────────────────────
/**
 * getSRSData() — lê e valida o store com try/catch.
 * Retorna emptyStore() em qualquer cenário de falha:
 * - localStorage indisponível (SSR)
 * - JSON corrompido
 * - version !== 1 (dados de versão futura)
 * - estrutura inválida
 */
export function getSRSData(): SRSStore {
  try {
    const raw = localStorage.getItem(SRS_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as SRSStore;
    if (
      parsed?.version !== 1 ||
      typeof parsed.items !== 'object' ||
      parsed.items === null ||
      Array.isArray(parsed.items)
    ) {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

/**
 * saveSRSData() — persiste com try/catch.
 * Silencia QuotaExceededError — o usuário perde apenas a sessão atual,
 * sem crash e sem dados corrompidos.
 */
export function saveSRSData(store: SRSStore): void {
  try {
    const payload: SRSStore = { ...store, updatedAt: getNow() };
    localStorage.setItem(SRS_KEY, JSON.stringify(payload));
  } catch {
    // QuotaExceededError ou SSR — silenciar
  }
}

/**
 * clearSRSData() — LGPD: permite ao usuário apagar todos os dados de revisão.
 */
export function clearSRSData(): void {
  try {
    localStorage.removeItem(SRS_KEY);
  } catch {
    // SSR — silenciar
  }
}

// ── Algoritmo SM-2 Lite ────────────────────────────────────────────────────────
/**
 * calculateNextReview() — núcleo do SM-2.
 * Função PURA: não lê nem escreve estado. Recebe item + score + timestamp,
 * retorna novo item. Todos os efeitos colaterais ficam na camada de UI.
 *
 * score 1-2 (esqueceu): reseta repetitions, interval e penaliza easeFactor
 * score 3-5 (lembrou):  avança interval, incrementa repetitions, ajusta easeFactor
 */
export function calculateNextReview(item: SRSItem, score: number, now: number): SRSItem {
  const next: SRSItem = { ...item, lastReview: now, lastScore: score };

  if (score >= 3) {
    // Acerto — avança na escada de intervalos
    if (next.repetitions === 0)      next.interval = 1;
    else if (next.repetitions === 1) next.interval = 6;
    else                             next.interval = Math.round(next.interval * next.easeFactor);

    next.repetitions++;

    // Ajuste do easeFactor: score 5 = +0.1, score 3 = 0, abaixo de 5 decresce
    next.easeFactor = Math.max(
      MIN_EF,
      next.easeFactor + 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02),
    );
  } else {
    // Esqueceu — reseta e penaliza
    next.repetitions = 0;
    next.interval    = 1;
    next.easeFactor  = Math.max(MIN_EF, next.easeFactor - 0.2);
  }

  next.nextReview = now + next.interval * MS_PER_DAY;
  return next;
}

// ── API de consulta ────────────────────────────────────────────────────────────

/**
 * getDueItems() — retorna items vencidos (nextReview <= now),
 * ordenados do mais atrasado para o mais recente.
 * Filtra indexes fora do range da QUIZ_QUESTIONS para evitar undefined.
 */
export function getDueItems(store: SRSStore, now: number, totalQuestions: number): SRSItem[] {
  return Object.values(store.items)
    .filter(item => item.nextReview <= now && item.questionIdx < totalQuestions)
    .sort((a, b) => a.nextReview - b.nextReview);
}

/**
 * getAllItems() — todos os items do store, ordenados por nextReview.
 */
export function getAllItems(store: SRSStore, totalQuestions: number): SRSItem[] {
  return Object.values(store.items)
    .filter(item => item.questionIdx < totalQuestions)
    .sort((a, b) => a.nextReview - b.nextReview);
}

/**
 * getTotalDue() — contagem de items vencidos (para UI / dashboard).
 */
export function getTotalDue(store: SRSStore, now: number, totalQuestions: number): number {
  return getDueItems(store, now, totalQuestions).length;
}

/**
 * seedItem() — adiciona um novo item ao store (não sobrescreve existente).
 * Chamado pelo quiz ao detectar resposta errada.
 * nextReview = now + 1 dia (revisão imediata, não hoje para não saturar).
 */
export function seedItem(store: SRSStore, questionIdx: number, now: number): SRSStore {
  if (store.items[questionIdx] !== undefined) return store;  // já existe — preservar progresso

  const item: SRSItem = {
    questionIdx,
    interval:    1,
    easeFactor:  INITIAL_EF,
    repetitions: 0,
    nextReview:  now + MS_PER_DAY,  // amanhã
    lastReview:  now,
    lastScore:   2,                 // "difícil" como baseline de seed
  };

  return {
    ...store,
    items: { ...store.items, [questionIdx]: item },
  };
}

/**
 * applyReview() — aplica resultado de uma revisão e persiste imediatamente.
 * Retorna o store atualizado.
 */
export function applyReview(store: SRSStore, questionIdx: number, score: number): SRSStore {
  const item = store.items[questionIdx];
  if (!item) return store;

  const now      = getNow();
  const updated  = calculateNextReview(item, score, now);
  const newStore = {
    ...store,
    items: { ...store.items, [questionIdx]: updated },
  };

  saveSRSData(newStore);
  return newStore;
}

// ── Helper interno ────────────────────────────────────────────────────────────

function emptyStore(): SRSStore {
  return { version: 1, items: {}, updatedAt: getNow() };
}
