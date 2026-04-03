'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  label?: string;
  subLabel?: string;
  className?: string;
  variant?: 'default' | 'success' | 'info' | 'warn';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  subLabel, 
  className,
  variant = 'default'
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const variants = {
    default: 'bg-gradient-to-r from-accent to-accent-2',
    success: 'bg-ok',
    info: 'bg-info',
    warn: 'bg-warn'
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || subLabel) && (
        <div className="flex justify-between items-end mb-2">
          {label && <span className="text-sm font-bold text-text">{label}</span>}
          {subLabel && <span className="text-xs text-text-3 font-mono">{subLabel}</span>}
        </div>
      )}
      <div className="h-2 w-full bg-bg-3 rounded-full overflow-hidden border border-border/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", variants[variant])}
        />
      </div>
    </div>
  );
};
