'use client';

import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StepItem: React.FC<StepItemProps> = ({ number, title, description, icon, className }) => (
  <div className={cn("p-6 rounded-xl bg-bg-2 border border-border flex gap-4", className)}>
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold">
        {icon || number}
      </div>
    </div>
    <div className="flex-1">
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-text-2 leading-relaxed">{description}</p>
    </div>
  </div>
);

interface ChecklistItemProps {
  text: string;
  sub?: string;
  layer?: string;
  checked: boolean;
  onToggle: () => void;
  className?: string;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ text, sub, layer, checked, onToggle, className }) => (
  <button
    onClick={onToggle}
    className={cn(
      "w-full flex items-start gap-3 p-3 rounded-lg hover:bg-bg-3 transition-colors text-left group",
      className
    )}
  >
    {checked ? (
      <CheckCircle2 size={18} className="text-ok shrink-0 mt-0.5" />
    ) : (
      <Circle size={18} className="text-text-3 group-hover:text-accent shrink-0 mt-0.5" />
    )}
    <div>
      <div className={cn("text-sm font-medium transition-colors", checked ? "text-text" : "text-text-2")}>
        {text}
      </div>
      {sub && <div className="text-[10px] text-text-3 font-mono mt-0.5">{sub}</div>}
      {layer && <div className="mt-1"><span className="text-[8px] font-bold uppercase px-1 rounded bg-info/10 border border-info/20 text-info">{layer}</span></div>}
    </div>
  </button>
);
