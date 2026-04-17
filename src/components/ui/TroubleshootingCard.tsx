'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TroubleshootingStep {
  layer: number;
  name: string;
  symptom: string;
  command: string;
  detail?: string;
}

interface TroubleshootingCardProps {
  title?: string;
  steps: TroubleshootingStep[];
  className?: string;
}

const layerColor: Record<number, string> = {
  1: 'border-[var(--color-layer-1)] text-[var(--color-layer-1)] bg-[var(--color-layer-1)]/10',
  2: 'border-[var(--color-layer-2)] text-[var(--color-layer-2)] bg-[var(--color-layer-2)]/10',
  3: 'border-[var(--color-layer-3)] text-[var(--color-layer-3)] bg-[var(--color-layer-3)]/10',
  4: 'border-[var(--color-layer-4)] text-[var(--color-layer-4)] bg-[var(--color-layer-4)]/10',
  5: 'border-[var(--color-layer-5)] text-[var(--color-layer-5)] bg-[var(--color-layer-5)]/10',
  6: 'border-[var(--color-layer-6)] text-[var(--color-layer-6)] bg-[var(--color-layer-6)]/10',
  7: 'border-[var(--color-layer-7)] text-[var(--color-layer-7)] bg-[var(--color-layer-7)]/10',
};

export const TroubleshootingCard: React.FC<TroubleshootingCardProps> = ({
  title = 'SOS Troubleshooting — Escada OSI',
  steps,
  className,
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div
      className={cn('rounded-xl border border-border bg-bg-2 p-6 my-8', className)}
      role="list"
      aria-label={title}
    >
      {title && (
        <h4 className="text-xs font-bold text-text-3 uppercase tracking-widest mb-6">
          {title}
        </h4>
      )}
      <div className="space-y-2">
        {steps.map((step) => {
          const isOpen = expanded === step.layer;
          const colors = layerColor[step.layer] ?? layerColor[7];
          return (
            <div key={step.layer} role="listitem">
              <button
                onClick={() => setExpanded(isOpen ? null : step.layer)}
                aria-expanded={isOpen}
                aria-controls={`sos-layer-${step.layer}`}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                  isOpen ? colors : 'border-border bg-bg-3 hover:border-accent/50'
                )}
              >
                <span
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-md border flex items-center justify-center text-[10px] font-bold',
                    colors
                  )}
                  aria-hidden="true"
                >
                  L{step.layer}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text">{step.name}</span>
                    <span className="text-[10px] text-text-3 font-mono truncate hidden sm:block">
                      {step.symptom}
                    </span>
                  </div>
                  <code className="text-[10px] text-accent-2 font-mono block truncate">
                    {step.command}
                  </code>
                </div>
                <span className="shrink-0 text-text-3" aria-hidden="true">
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>

              {isOpen && step.detail && (
                <div
                  id={`sos-layer-${step.layer}`}
                  className="mt-1 ml-11 p-3 rounded-lg bg-bg-3 border border-border"
                >
                  <div className="flex items-start gap-2">
                    <Terminal size={12} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-text-2 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
