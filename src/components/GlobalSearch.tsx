import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Command, ChevronRight, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEARCH_ITEMS, SearchItem } from '@/data/searchItems';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return SEARCH_ITEMS.slice(0, 5); // Show some defaults
    const q = query.toLowerCase();
    return SEARCH_ITEMS.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    router.push(item.href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-bg-2 border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Search Header */}
              <div className="relative flex items-center border-b border-border p-4">
                <Search className="absolute left-6 text-text-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Busque por comandos, tópicos ou conceitos... (Esc para sair)"
                  className="w-full bg-transparent pl-12 pr-12 py-2 text-lg text-text outline-none placeholder:text-text-3"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                />
                <div className="absolute right-6 flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-bg-3 border border-border text-[10px] font-bold text-text-3 flex items-center gap-1">
                    <Command size={10} /> K
                  </kbd>
                  <button onClick={onClose} className="p-1 hover:bg-bg-3 rounded-md transition-colors text-text-3">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto p-2">
                {filteredItems.length > 0 ? (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      const isSelected = index === selectedIndex;
                      
                      return (
                        <button
                          key={item.id}
                          ref={el => { itemRefs.current[index] = el; }}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group border",
                            isSelected 
                              ? "bg-accent/10 border-accent/30 shadow-sm ring-1 ring-accent/20" 
                              : "hover:bg-bg-3 border-transparent"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isSelected ? "bg-accent text-white" : "bg-bg-3 text-text-3 group-hover:bg-bg-2 group-hover:text-accent"
                          )}>
                            <Icon size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-sm text-text truncate">{item.title}</span>
                              <span className={cn(
                                "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                item.category === 'Comando' ? "bg-info/10 border-info/20 text-info" :
                                item.category === 'Tópico' ? "bg-accent/10 border-accent/20 text-accent" :
                                item.category === 'Glossário' ? "bg-warn/10 border-warn/20 text-warn" :
                                "bg-bg-3 border-border text-text-3"
                              )}>
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-text-3 truncate">{item.description}</p>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-2 text-accent animate-in fade-in slide-in-from-right-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest">Pressione</span>
                              <kbd className="p-1 rounded bg-accent/10 border border-accent/20 flex items-center justify-center">
                                <CornerDownLeft size={12} />
                              </kbd>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-bold text-text mb-1">Nenhum resultado encontrado</h3>
                    <p className="text-sm text-text-3">Tente buscar por outros termos ou conceitos.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-bg-3 border-t border-border px-4 py-3 flex items-center justify-between text-[10px] font-bold text-text-3 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-bg-2 border border-border">↑↓</kbd> Navegar
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-bg-2 border border-border">Enter</kbd> Selecionar
                  </span>
                </div>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-2 border border-border">Esc</kbd> Fechar
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
