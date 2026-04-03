import React from 'react';
import { cn } from '@/lib/utils';

interface LayerBadgeProps {
  layer: string;
  className?: string;
}

export const LayerBadge: React.FC<LayerBadgeProps> = ({ layer, className }) => {
  const l = layer.toLowerCase().replace('camada ', 'l');
  return (
    <span className={cn("layer-badge", l, className)}>
      {layer}
    </span>
  );
};
