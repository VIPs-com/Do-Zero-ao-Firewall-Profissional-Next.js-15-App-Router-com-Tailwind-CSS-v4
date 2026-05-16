/**
 * Motor de migração versionada do localStorage (Sprint STORAGE-MIGRATIONS).
 *
 * Problema: o progresso do aluno (badges, checkpoints, SRS, etc.) vive no
 * localStorage. Quando o schema muda — uma chave é renomeada, um formato
 * evolui — alunos antigos podem ficar com dados incompatíveis.
 *
 * Solução: uma versão de schema (`workshop-schema-version`) e uma lista
 * ordenada de migrações. No boot, `runStorageMigrations()` compara a versão
 * guardada com a atual e executa em sequência apenas as migrações pendentes.
 *
 * Princípios:
 *  - Puro e standalone — zero imports de React (testável em isolamento).
 *  - Defensivo — try/catch em tudo; localStorage indisponível nunca quebra o app.
 *  - SSR-safe — no-op quando `window` não existe.
 *  - Idempotente — rodar várias vezes é seguro; migração já aplicada não repete.
 */

/** Chave que guarda a versão de schema do localStorage do aluno. */
const VERSION_KEY = 'workshop-schema-version';

/** Versão de schema atual. Incrementar ao adicionar uma nova migração. */
export const STORAGE_SCHEMA_VERSION = 1;

interface Migration {
  /** Versão que esta migração estabelece (1, 2, 3, ...). */
  version: number;
  /** Descrição curta — aparece no log e no resultado de `runStorageMigrations`. */
  description: string;
  /** Transformação a aplicar. Deve ser idempotente e tolerante a dados ausentes. */
  migrate: () => void;
}

/**
 * Lista ordenada de migrações. Cada entrada leva o schema de `version - 1`
 * para `version`. NUNCA reordenar nem remover entradas já lançadas.
 */
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Renomeia a chave legada `workshop-checklist` → `workshop-checklist-v2`',
    migrate: () => {
      const legacy = localStorage.getItem('workshop-checklist');
      if (legacy !== null) {
        // Só copia se o destino ainda não existir — não sobrescreve progresso atual.
        if (localStorage.getItem('workshop-checklist-v2') === null) {
          localStorage.setItem('workshop-checklist-v2', legacy);
        }
        localStorage.removeItem('workshop-checklist');
      }
    },
  },
];

/** Lê a versão de schema guardada. Ausente ou corrompida → 0 (pré-versionamento). */
export function getStorageVersion(): number {
  try {
    if (typeof window === 'undefined') return 0;
    const raw = localStorage.getItem(VERSION_KEY);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export interface MigrationResult {
  /** Versão de schema antes da execução. */
  from: number;
  /** Versão de schema após a execução. */
  to: number;
  /** Descrições das migrações efetivamente aplicadas. */
  applied: string[];
}

/**
 * Executa todas as migrações pendentes em ordem e atualiza a versão de schema.
 * Seguro chamar a cada boot — só faz trabalho quando há migração pendente.
 */
export function runStorageMigrations(): MigrationResult {
  const applied: string[] = [];
  let from = 0;

  try {
    if (typeof window === 'undefined') return { from: 0, to: 0, applied };

    from = getStorageVersion();
    if (from >= STORAGE_SCHEMA_VERSION) {
      return { from, to: from, applied };
    }

    for (const m of MIGRATIONS) {
      if (m.version > from && m.version <= STORAGE_SCHEMA_VERSION) {
        try {
          m.migrate();
          applied.push(`v${m.version}: ${m.description}`);
        } catch (err) {
          // Falha numa migração: registra a última versão segura e para — não
          // marca o schema como totalmente atualizado para tentar de novo depois.
          console.error(`[migrations] Falha ao aplicar a migração v${m.version}:`, err);
          const safeVersion = m.version - 1;
          try {
            localStorage.setItem(VERSION_KEY, String(safeVersion));
          } catch { /* localStorage indisponível — silencioso */ }
          return { from, to: safeVersion, applied };
        }
      }
    }

    localStorage.setItem(VERSION_KEY, String(STORAGE_SCHEMA_VERSION));
    return { from, to: STORAGE_SCHEMA_VERSION, applied };
  } catch (err) {
    console.error('[migrations] Erro inesperado no motor de migração:', err);
    return { from, to: from, applied };
  }
}
