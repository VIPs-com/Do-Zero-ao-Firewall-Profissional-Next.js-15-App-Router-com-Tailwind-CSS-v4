'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Network, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseCidr } from '@/lib/cidr';
import { useBadges } from '@/context/BadgeContext';

/** Prefixos comuns para seleção rápida. */
const QUICK_PREFIXES = [8, 16, 24, 25, 26, 28, 30];

/** Escopo → cor do badge. */
const SCOPE_STYLE: Record<string, string> = {
  'privado': 'bg-ok/10 border-ok/30 text-ok',
  'público': 'bg-info/10 border-info/30 text-info',
  'loopback': 'bg-warn/10 border-warn/30 text-warn',
  'link-local': 'bg-warn/10 border-warn/30 text-warn',
  'multicast': 'bg-accent/10 border-accent/30 text-accent',
  'reservado': 'bg-err/10 border-err/30 text-err',
};

export default function FerramentasPage() {
  const { trackPageVisit } = useBadges();
  const [input, setInput] = useState('192.168.1.0/24');

  useEffect(() => { trackPageVisit('/ferramentas'); }, [trackPageVisit]);

  const result = useMemo(() => parseCidr(input), [input]);

  /** Troca apenas o prefixo, preservando o IP digitado. */
  const setPrefix = (p: number) => {
    const ipPart = input.trim().split('/')[0] || '192.168.1.0';
    setInput(`${ipPart}/${p}`);
  };

  const rows: Array<{ label: string; value: string; mono?: boolean }> = result
    ? [
        { label: 'Endereço de rede',     value: result.network,   mono: true },
        { label: 'Broadcast',            value: result.broadcast, mono: true },
        { label: 'Primeiro host',        value: result.firstHost, mono: true },
        { label: 'Último host',          value: result.lastHost,  mono: true },
        { label: 'Máscara de sub-rede',  value: result.netmask,   mono: true },
        { label: 'Wildcard',             value: result.wildcard,  mono: true },
        { label: 'Hosts utilizáveis',    value: result.usableHosts.toLocaleString('pt-BR') },
        { label: 'Total de endereços',   value: result.totalAddresses.toLocaleString('pt-BR') },
        { label: 'Classe',               value: result.ipClass },
        { label: 'Prefixo',              value: `/${result.prefix}` },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Ferramentas</span>
      </div>

      <div className="section-label">Ferramentas Portáteis</div>
      <h1 className="section-title">🧮 Calculadora de Sub-redes CIDR</h1>
      <p className="section-sub">
        Digite um endereço no formato <code>IP/prefixo</code> e veja na hora a rede,
        o broadcast, a faixa de hosts e a máscara. Tudo roda no seu navegador —
        nenhuma informação é enviada a servidores.
      </p>

      {/* Entrada */}
      <div className="mt-8 bg-bg-2 border border-border rounded-2xl p-6">
        <label htmlFor="cidr-input" className="block text-xs font-bold uppercase tracking-widest text-text-3 mb-2">
          Endereço CIDR
        </label>
        <div className="relative">
          <Network className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} aria-hidden="true" />
          <input
            id="cidr-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="192.168.1.0/24"
            spellCheck={false}
            autoComplete="off"
            aria-invalid={input.trim() !== '' && !result}
            className="w-full bg-bg-3 border-2 border-border rounded-xl py-3.5 pl-12 pr-4 font-mono text-lg focus:border-accent outline-none transition-colors"
          />
        </div>

        {/* Prefixos rápidos */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-3 mr-1">Prefixo:</span>
          {QUICK_PREFIXES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrefix(p)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-bold font-mono border transition-colors',
                result?.prefix === p
                  ? 'bg-accent border-accent text-bg'
                  : 'border-border text-text-2 hover:border-accent/50',
              )}
            >
              /{p}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      {result ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-lg font-bold text-text">
              {result.ip}/{result.prefix}
            </span>
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border',
              SCOPE_STYLE[result.scope] ?? 'bg-bg-3 border-border text-text-3',
            )}>
              {result.scope}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {rows.map((row) => (
              <div key={row.label} className="bg-bg-2 border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-xs text-text-3">{row.label}</span>
                <span className={cn('text-sm font-bold text-text', row.mono && 'font-mono')}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : input.trim() !== '' ? (
        <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-err/30 bg-err/5 text-sm text-text-2">
          <AlertCircle size={18} className="text-err shrink-0" aria-hidden="true" />
          <span>
            Endereço inválido. Use o formato <code className="font-mono">IP/prefixo</code> —
            ex.: <code className="font-mono">10.0.0.0/8</code> · octetos 0–255 · prefixo 0–32.
          </span>
        </div>
      ) : null}

      {/* Nota didática */}
      <div className="mt-8 p-4 rounded-xl bg-info/5 border border-info/20 text-xs text-text-3 leading-relaxed">
        <strong className="text-text-2">Por que isso importa:</strong> calcular sub-redes
        de cabeça é lento e propenso a erro. Esta ferramenta confere o seu raciocínio na
        hora de planejar VLANs, regras de firewall (<code>iptables -s 10.0.0.0/8</code>) ou
        rotas. Casos especiais: <code>/31</code> é enlace ponto-a-ponto (RFC 3021, 2 hosts)
        e <code>/32</code> é um host único.
      </div>
    </div>
  );
}
