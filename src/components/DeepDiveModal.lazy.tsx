'use client';

/*
 * Sprint F — wrapper lazy do DeepDiveModal.
 *
 * O modal carrega `react-markdown` (+ plugins), que é o pacote mais pesado fora
 * do motion/react. Como ele só aparece quando o usuário clica num card de
 * mergulho profundo, faz sentido tirar do bundle inicial das rotas que o usam
 * e baixar sob demanda no primeiro clique.
 *
 * Callers simplesmente trocam:
 *   import { DeepDiveModal } from '@/components/DeepDiveModal';
 * por:
 *   import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
 *
 * API idêntica, zero mudança no uso.
 */

import dynamic from 'next/dynamic';

export const DeepDiveModal = dynamic(
  () => import('./DeepDiveModal').then((m) => ({ default: m.DeepDiveModal })),
  { ssr: false },
);
