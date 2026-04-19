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

export function WindowsComparisonBox({
  linuxCode,
  windowsCode,
  linuxLabel = 'Linux (bash)',
  windowsLabel = 'Windows (cmd / PowerShell)',
  className,
}: {
  linuxCode: string;
  windowsCode: string;
  linuxLabel?: string;
  windowsLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      'rounded-xl border border-border bg-bg-2 overflow-hidden my-4',
      className
    )}>
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-3 border-b border-border">
        <span className="text-sm" aria-hidden="true">🪟→🐧</span>
        <span className="text-xs font-mono font-bold text-text-2 uppercase tracking-wider">
          Equivalência Windows → Linux
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Windows */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              🪟 {windowsLabel}
            </span>
          </div>
          <pre className="text-xs font-mono text-text-2 whitespace-pre-wrap">{windowsCode}</pre>
        </div>
        {/* Linux */}
        <div className="p-4 bg-ok/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-ok uppercase tracking-wider">
              🐧 {linuxLabel}
            </span>
          </div>
          <pre className="text-xs font-mono text-text whitespace-pre-wrap">{linuxCode}</pre>
        </div>
      </div>
    </div>
  );
}
