import React from 'react';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const InfoBox: React.FC<BoxProps> = ({ children, className, title }) => (
  <div className={cn("info-box", className)}>
    <div className="flex items-center gap-2 mb-2 text-info font-bold uppercase tracking-widest text-[10px]">
      <Info size={14} />
      {title || 'Informação'}
    </div>
    {children}
  </div>
);

export const WarnBox: React.FC<BoxProps> = ({ children, className, title }) => (
  <div className={cn("warn-box", className)}>
    <div className="flex items-center gap-2 mb-2 text-warn font-bold uppercase tracking-widest text-[10px]">
      <AlertTriangle size={14} />
      {title || 'Atenção'}
    </div>
    {children}
  </div>
);

export const HighlightBox: React.FC<BoxProps> = ({ children, className, title }) => (
  <div className={cn("highlight-box", className)}>
    <div className="flex items-center gap-2 mb-2 text-accent font-bold uppercase tracking-widest text-[10px]">
      <Lightbulb size={14} />
      {title || 'Dica de Ouro'}
    </div>
    {children}
  </div>
);
