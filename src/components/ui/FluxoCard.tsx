'use client';

import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FluxoStep {
  label: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}

interface FluxoCardProps {
  steps: FluxoStep[];
  direction?: 'horizontal' | 'vertical';
  title?: string;
  className?: string;
}

export const FluxoCard: React.FC<FluxoCardProps> = ({ steps, direction = 'horizontal', title, className }) => {
  return (
    <div className={cn("fluxo-card bg-bg-2 border border-border rounded-xl p-6 my-8", className)}>
      {title && <h4 className="text-xs font-bold text-text-3 uppercase tracking-widest mb-6 text-center">{title}</h4>}
      <div className={cn(
        "flex items-center justify-center gap-4",
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={cn(
              "p-4 rounded-lg bg-bg-3 border border-border text-center min-w-[120px] shadow-sm",
              step.color || "border-accent/30"
            )}>
              {step.icon && <div className="flex justify-center mb-2 text-accent">{step.icon}</div>}
              <div className="text-xs font-bold text-text">{step.label}</div>
              {step.sub && <div className="text-[10px] text-text-3 font-mono mt-1">{step.sub}</div>}
            </div>
            {idx < steps.length - 1 && (
              <div className="text-text-3">
                {direction === 'horizontal' ? <ArrowRight size={20} /> : <ArrowDown size={20} />}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
