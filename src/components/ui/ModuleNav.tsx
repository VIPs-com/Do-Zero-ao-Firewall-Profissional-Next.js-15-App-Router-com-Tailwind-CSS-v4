// src/components/ui/ModuleNav.tsx
// Navegação sequencial Anterior / Próximo módulo — inserida no rodapé de cada página de conteúdo.
'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COURSE_ORDER } from '@/data/courseOrder';

interface ModuleNavProps {
  currentPath: string;
}

export function ModuleNav({ currentPath }: ModuleNavProps) {
  const current = COURSE_ORDER.find(m => m.path === currentPath);
  if (!current) return null;

  const prevModule = current.prev ? COURSE_ORDER.find(m => m.path === current.prev) : null;
  const nextModule = current.next ? COURSE_ORDER.find(m => m.path === current.next) : null;

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
