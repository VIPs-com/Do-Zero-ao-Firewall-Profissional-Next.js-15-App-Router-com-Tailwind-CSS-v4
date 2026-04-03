'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BadgeDef } from '@/context/BadgeContext';

interface BadgeDisplayProps {
  badge: BadgeDef;
  unlocked: boolean;
  className?: string;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, unlocked, className }) => {
  return (
    <div className={cn(
      "relative group p-4 rounded-xl border transition-all duration-300",
      unlocked 
        ? "bg-accent/5 border-accent/30 shadow-sm" 
        : "bg-bg-2 border-border opacity-60 grayscale",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110",
          unlocked ? "bg-accent/10 text-accent" : "bg-bg-3 text-text-3"
        )}>
          {unlocked ? (
            <span>{badge.icon}</span>
          ) : (
            <Lock size={20} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={cn("font-bold text-sm truncate", unlocked ? "text-text" : "text-text-3")}>
              {badge.title}
            </h4>
            {unlocked && <CheckCircle2 size={12} className="text-ok shrink-0" />}
          </div>
          <p className="text-[10px] text-text-3 leading-tight line-clamp-2">
            {badge.desc}
          </p>
        </div>
      </div>
      
      {unlocked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ok rounded-full flex items-center justify-center text-white shadow-sm border border-bg-1"
        >
          <Award size={10} />
        </motion.div>
      )}
    </div>
  );
};
