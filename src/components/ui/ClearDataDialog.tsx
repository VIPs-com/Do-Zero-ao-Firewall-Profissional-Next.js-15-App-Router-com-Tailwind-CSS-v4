'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { clearAllWorkshopData } from '@/lib/migrations';

/**
 * LGPD — botão + modal de confirmação para apagar todos os dados do aluno.
 *
 * O progresso vive 100% no localStorage do navegador. Este componente dá ao
 * usuário o direito de expurgar esses dados num clique, com confirmação
 * explícita (ação destrutiva e irreversível).
 *
 * Acessibilidade: role="dialog" + aria-modal + aria-labelledby/describedby +
 * focus trap (Tab circula, ESC fecha, foco restaurado) — WCAG 2.1 AA.
 */
export function ClearDataDialog() {
  const [open, setOpen] = useState(false);
  const dialogRef = useFocusTrap<HTMLDivElement>(open, () => setOpen(false));

  const handleConfirm = () => {
    clearAllWorkshopData();
    // Recarrega para o BadgeContext re-hidratar do zero (estado limpo).
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg border border-err/40 text-err text-xs font-semibold hover:bg-err/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-err"
      >
        <Trash2 size={14} aria-hidden="true" />
        Apagar todos os meus dados
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-data-title"
            aria-describedby="clear-data-desc"
            className="relative max-w-md w-full bg-bg-2 border border-border rounded-2xl p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-text-3 hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="w-14 h-14 rounded-full bg-err/10 border border-err/30 flex items-center justify-center text-err mx-auto mb-5">
              <AlertTriangle size={28} aria-hidden="true" />
            </div>

            <h2 id="clear-data-title" className="text-xl font-bold text-center mb-3">
              Apagar todos os seus dados?
            </h2>
            <p id="clear-data-desc" className="text-sm text-text-2 text-center leading-relaxed mb-3">
              Esta ação remove <strong className="text-text">permanentemente</strong> deste
              navegador:
            </p>
            <ul className="text-xs text-text-3 space-y-1 mb-5 mx-auto max-w-[18rem] list-disc list-inside">
              <li>Badges e conquistas desbloqueadas</li>
              <li>Progresso do checklist e módulos visitados</li>
              <li>Pontuação e histórico do quiz</li>
              <li>Agenda de revisão (SRS) e streak de treino</li>
              <li>Nome do certificado e preferências</li>
            </ul>
            <p className="text-xs text-warn text-center mb-6 leading-relaxed">
              ⚠️ Não há como desfazer. Se quiser guardar seu progresso, exporte-o antes
              em <strong className="text-text-2">Exportar Progresso</strong>.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-bg-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg bg-err text-white text-sm font-bold hover:bg-err/85 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-err"
              >
                Apagar tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
