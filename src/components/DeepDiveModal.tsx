import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, ChevronRight, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DeepDive } from '@/data/deepDives';

interface DeepDiveModalProps {
  dive: DeepDive | null;
  onClose: () => void;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({ dive, onClose }) => {
  return (
    <AnimatePresence>
      {dive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
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
                  <h3 className="text-xl font-bold text-text leading-tight">{dive.title}</h3>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-bg-3 text-text-3 hover:text-text transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
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
              <button className="flex items-center gap-2 text-[10px] font-bold text-accent hover:underline uppercase tracking-wider">
                <Share2 size={12} />
                Compartilhar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
