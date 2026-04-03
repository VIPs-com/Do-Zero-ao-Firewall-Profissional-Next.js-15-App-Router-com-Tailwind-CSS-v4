'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, lang = 'bash', title, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("code-block", className)}>
      <div className="code-header">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-accent" />
          <span className="code-lang uppercase tracking-widest">{lang}</span>
          {title && <span className="text-text-3 text-[10px] ml-2">{title}</span>}
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 hover:bg-bg-2 rounded transition-colors text-text-3 hover:text-accent"
          title="Copiar comando"
        >
          {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};
