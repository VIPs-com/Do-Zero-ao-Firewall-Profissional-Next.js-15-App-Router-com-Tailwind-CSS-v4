'use client';

import React from 'react';
import { BadgeProvider } from '@/context/BadgeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BadgeProvider>
      {children}
    </BadgeProvider>
  );
}
