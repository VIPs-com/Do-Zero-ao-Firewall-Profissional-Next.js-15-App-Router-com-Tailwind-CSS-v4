import React, { useId, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, BookOpen, Share2, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DeepDive } from '@/data/deepDives';
import { useFocusTrap } from '@/lib/useFocusTrap';

interface DeepDiveModalProps {
  dive: DeepDive | null;
  onClose: () => void;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({ dive, onClose }) => {
  const [shared, setShared] = useState(false);
  const titleId = useId();
  const descId = useId();
  const isOpen = dive !== null;
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  // Respeita prefers-reduced-motion: zera animações se o usuário pediu
  const prefersReducedMotion = useReducedMotion();
  const fadeProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
  const panelProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
      };

  const handleShare = async () => {
    if (!dive || typeof navigator === 'undefined') return;
    const shareData = {
      title: `Workshop Linux — ${dive.title}`,
      text: `Mergulho profundo: ${dive.title} (${dive.category})`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      const nav = navigator as Navigator & {
        share?: (data: ShareData) => Promise<void>;
        clipboard?: { writeText: (text: string) => Promise<void> };
      };
      if (typeof nav.share === 'function') {
        await nav.share(shareData);
      } else if (nav.clipboard) {
        await nav.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      // Usuário cancelou ou erro silencioso — não polui UI
      console.debug('[DeepDiveModal] share cancelado/falhou:', err);
    }
  };

  return (
    <AnimatePresence>
      {dive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            {...fadeProps}
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            {...panelProps}
            className="relative bg-bg-2 border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-bg-3/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                  {dive.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent-2 px-2 py-0.5 rounded-full bg-accent/5 border border-accent/10">
                      Mergulho Profundo
                    </span>
                    <span className="text-[10px] font-mono text-text-3">• {dive.category}</span>
                  </div>
                  <h3 id={titleId} className="text-xl font-bold text-text leading-tight">{dive.title}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar mergulho profundo"
                className="p-2 rounded-full hover:bg-bg-3 text-text-3 hover:text-text transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div id={descId} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="markdown-body prose prose-invert max-w-none">
                <ReactMarkdown>{dive.content}</ReactMarkdown>
              </div>

              {/* Tags */}
              <div className="mt-12 flex flex-wrap gap-2 pt-6 border-t border-border">
                {dive.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-text-3 bg-bg-3 px-2 py-1 rounded border border-border">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-bg-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-text-3 italic">
                <BookOpen size={12} />
                Conteúdo técnico avançado para administradores
              </div>
              <button
                onClick={handleShare}
                aria-label={shared ? 'Link copiado' : 'Compartilhar este mergulho profundo'}
                className="flex items-center gap-2 text-[10px] font-bold text-accent hover:underline uppercase tracking-wider transition-all active:scale-95"
              >
                {shared ? <Check size={12} /> : <Share2 size={12} />}
                {shared ? 'Link copiado!' : 'Compartilhar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
