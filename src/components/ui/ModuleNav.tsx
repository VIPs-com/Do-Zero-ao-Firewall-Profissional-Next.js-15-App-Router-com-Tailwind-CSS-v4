// src/components/ui/ModuleNav.tsx
// Navegação sequencial Anterior / Próximo módulo — inserida no rodapé de cada página de conteúdo.
// Prop `order` opcional: quando omitida usa COURSE_ORDER (trilha Firewall — padrão).
// Para a trilha Fundamentos, passar order={FUNDAMENTOS_ORDER}.
// Para módulos avançados (v3.0→v5.0), passar order={ADVANCED_ORDER} — prev/next derivados do índice.
'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COURSE_ORDER, CourseModule, SimpleModule } from '@/data/courseOrder';

type AnyModule = CourseModule | SimpleModule;

interface ModuleNavProps {
  currentPath: string;
  /** Sequência de módulos a usar. Default: COURSE_ORDER (trilha Firewall).
   *  Aceita CourseModule[] (prev/next explícitos) ou SimpleModule[] (prev/next por índice). */
  order?: AnyModule[];
}

export function ModuleNav({ currentPath, order }: ModuleNavProps) {
  const sequence = order ?? COURSE_ORDER;
  const idx = sequence.findIndex(m => m.path === currentPath);
  if (idx === -1) return null;

  const current = sequence[idx];

  // CourseModule tem prev/next explícitos; SimpleModule deriva do índice
  let prevModule: AnyModule | null = null;
  let nextModule: AnyModule | null = null;

  if ('prev' in current) {
    // CourseModule
    prevModule = current.prev ? (sequence.find(m => m.path === (current as CourseModule).prev) ?? null) : null;
    nextModule = current.next ? (sequence.find(m => m.path === (current as CourseModule).next) ?? null) : null;
  } else {
    // SimpleModule — derivar do índice
    prevModule = idx > 0 ? sequence[idx - 1] : null;
    nextModule = idx < sequence.length - 1 ? sequence[idx + 1] : null;
  }

  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
      {prevModule ? (
        <Link
          href={prevModule.path}
          className="btn-outline inline-flex items-center gap-2 text-sm"
          aria-label={`Módulo anterior: ${prevModule.title}`}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">{prevModule.title}</span>
          <span className="sm:hidden">Anterior</span>
        </Link>
      ) : (
        <div />
      )}

      {nextModule ? (
        <Link
          href={nextModule.path}
          className="btn-primary inline-flex items-center gap-2 text-sm"
          aria-label={`Próximo módulo: ${nextModule.title}`}
        >
          <span className="hidden sm:inline">{nextModule.title}</span>
          <span className="sm:hidden">Próximo</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
