'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Network, Regex, Shield, AlertCircle, Copy, Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseCidr } from '@/lib/cidr';
import { testRegex, type RegexMatch } from '@/lib/regex';
import { buildIptablesRule, buildIptablesScript, EMPTY_RULE, type IptablesRule } from '@/lib/iptables';
import { useBadges } from '@/context/BadgeContext';
import { useTabFilter } from '@/hooks/useTabFilter';

type ToolTab = 'cidr' | 'regex' | 'iptables';

const QUICK_PREFIXES = [8, 16, 24, 25, 26, 28, 30];

const SCOPE_STYLE: Record<string, string> = {
  'privado': 'bg-ok/10 border-ok/30 text-ok',
  'público': 'bg-info/10 border-info/30 text-info',
  'loopback': 'bg-warn/10 border-warn/30 text-warn',
  'link-local': 'bg-warn/10 border-warn/30 text-warn',
  'multicast': 'bg-accent/10 border-accent/30 text-accent',
  'reservado': 'bg-err/10 border-err/30 text-err',
};

/** Quebra o texto em segmentos, destacando os trechos casados pelo regex. */
function highlightMatches(text: string, matches: RegexMatch[]): React.ReactNode[] {
  if (matches.length === 0) return [text];
  const out: React.ReactNode[] = [];
  let pos = 0;
  matches.forEach((m, i) => {
    if (m.index > pos) out.push(text.slice(pos, m.index));
    if (m.text !== '') {
      out.push(
        <mark key={i} className="bg-accent/30 text-text rounded-sm">{m.text}</mark>,
      );
    }
    pos = m.index + m.text.length;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

/** Botão de copiar com feedback temporário "Copiado!". */
function CopyButton({ text, label, className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponível — silencia */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copiado' : `Copiar ${label || 'para a área de transferência'}`}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border px-2.5 py-1.5 transition-colors',
        copied
          ? 'border-ok/40 bg-ok/10 text-ok'
          : 'border-border text-text-2 hover:border-accent/50 hover:text-text',
        className,
      )}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? 'Copiado!' : label === '' ? null : (label ?? 'Copiar')}
    </button>
  );
}

const selectCls =
  'bg-bg-3 border border-border rounded-lg px-3 py-2 text-sm focus:border-accent outline-none transition-colors';
const inputCls =
  'bg-bg-3 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:border-accent outline-none transition-colors';

export default function FerramentasPage() {
  const { trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<ToolTab>('cidr');

  useEffect(() => { trackPageVisit('/ferramentas'); }, [trackPageVisit]);

  // ── CIDR ───────────────────────────────────────────────────────────────────
  const [cidrInput, setCidrInput] = useState('192.168.1.0/24');
  const cidr = useMemo(() => parseCidr(cidrInput), [cidrInput]);
  const setPrefix = (p: number) => {
    const ipPart = cidrInput.trim().split('/')[0] || '192.168.1.0';
    setCidrInput(`${ipPart}/${p}`);
  };
  const cidrRows: Array<{ label: string; value: string; mono?: boolean }> = cidr
    ? [
        { label: 'Endereço de rede',    value: cidr.network,   mono: true },
        { label: 'Broadcast',           value: cidr.broadcast, mono: true },
        { label: 'Primeiro host',       value: cidr.firstHost, mono: true },
        { label: 'Último host',         value: cidr.lastHost,  mono: true },
        { label: 'Máscara de sub-rede', value: cidr.netmask,   mono: true },
        { label: 'Wildcard',            value: cidr.wildcard,  mono: true },
        { label: 'Hosts utilizáveis',   value: cidr.usableHosts.toLocaleString('pt-BR') },
        { label: 'Total de endereços',  value: cidr.totalAddresses.toLocaleString('pt-BR') },
        { label: 'Classe',              value: cidr.ipClass },
        { label: 'Prefixo',             value: `/${cidr.prefix}` },
      ]
    : [];

  // ── Regex ──────────────────────────────────────────────────────────────────
  const [pattern, setPattern] = useState('\\d+\\.\\d+\\.\\d+\\.\\d+');
  const [flags, setFlags] = useState({ i: false, m: false, s: false });
  const [regexText, setRegexText] = useState(
    'Failed password for admin from 203.0.113.7 port 5512\nAccepted password for ubuntu from 192.168.1.50 port 22',
  );
  const flagStr = (flags.i ? 'i' : '') + (flags.m ? 'm' : '') + (flags.s ? 's' : '');
  const regexResult = useMemo(
    () => testRegex(pattern, flagStr, regexText),
    [pattern, flagStr, regexText],
  );

  // ── iptables ───────────────────────────────────────────────────────────────
  const [rule, setRule] = useState<IptablesRule>({ ...EMPTY_RULE, dport: '22' });
  const updRule = <K extends keyof IptablesRule>(k: K, v: IptablesRule[K]) =>
    setRule((r) => ({ ...r, [k]: v }));
  const iptablesCmd = useMemo(() => buildIptablesRule(rule), [rule]);
  const [rules, setRules] = useState<IptablesRule[]>([]);
  const addRule = () => setRules((rs) => [...rs, rule]);
  const removeRule = (i: number) => setRules((rs) => rs.filter((_, idx) => idx !== i));
  const iptablesScript = useMemo(() => buildIptablesScript(rules), [rules]);

  const TABS: Array<{ id: ToolTab; label: string }> = [
    { id: 'cidr', label: '🧮 Calculadora CIDR' },
    { id: 'regex', label: '🔍 Validador de Regex' },
    { id: 'iptables', label: '🔥 Gerador de iptables' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Ferramentas</span>
      </div>

      <div className="section-label">Ferramentas Portáteis</div>
      <h1 className="section-title">🧰 Ferramentas do SysAdmin</h1>
      <p className="section-sub">
        Utilitários de acesso rápido — calculadora de sub-redes, validador de regex e gerador
        de regras iptables. Tudo roda no seu navegador, nada é enviado a servidores.
      </p>

      {/* Tabs */}
      <div className="border-b border-border mt-8 mb-8">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                isActive(tab.id)
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-2 hover:text-text',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Calculadora CIDR ─────────────────────────────────────────────────── */}
      {isActive('cidr') && (
        <div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <label htmlFor="cidr-input" className="block text-xs font-bold uppercase tracking-widest text-text-3 mb-2">
              Endereço CIDR
            </label>
            <div className="relative">
              <Network className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} aria-hidden="true" />
              <input
                id="cidr-input"
                type="text"
                value={cidrInput}
                onChange={(e) => setCidrInput(e.target.value)}
                placeholder="192.168.1.0/24"
                spellCheck={false}
                autoComplete="off"
                aria-invalid={cidrInput.trim() !== '' && !cidr}
                className="w-full bg-bg-3 border-2 border-border rounded-xl py-3.5 pl-12 pr-4 font-mono text-lg focus:border-accent outline-none transition-colors"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-3 mr-1">Prefixo:</span>
              {QUICK_PREFIXES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrefix(p)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold font-mono border transition-colors',
                    cidr?.prefix === p
                      ? 'bg-accent border-accent text-bg'
                      : 'border-border text-text-2 hover:border-accent/50',
                  )}
                >
                  /{p}
                </button>
              ))}
            </div>
          </div>

          {cidr ? (
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-mono text-lg font-bold text-text">{cidr.ip}/{cidr.prefix}</span>
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border',
                  SCOPE_STYLE[cidr.scope] ?? 'bg-bg-3 border-border text-text-3',
                )}>
                  {cidr.scope}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {cidrRows.map((row) => (
                  <div key={row.label} className="group bg-bg-2 border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-text-3 shrink-0">{row.label}</span>
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={cn('text-sm font-bold text-text truncate', row.mono && 'font-mono')}>{row.value}</span>
                      <CopyButton
                        text={row.value}
                        label=""
                        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 shrink-0 px-1.5"
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : cidrInput.trim() !== '' ? (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-err/30 bg-err/5 text-sm text-text-2">
              <AlertCircle size={18} className="text-err shrink-0" aria-hidden="true" />
              <span>
                Endereço inválido. Use <code className="font-mono">IP/prefixo</code> —
                ex.: <code className="font-mono">10.0.0.0/8</code> · octetos 0–255 · prefixo 0–32.
              </span>
            </div>
          ) : null}

          <div className="mt-8 p-4 rounded-xl bg-info/5 border border-info/20 text-xs text-text-3 leading-relaxed">
            <strong className="text-text-2">Casos especiais:</strong> <code>/31</code> é enlace
            ponto-a-ponto (RFC 3021, 2 hosts) e <code>/32</code> é um host único. Útil para
            planejar VLANs, regras de firewall e rotas.
          </div>
        </div>
      )}

      {/* ── Validador de Regex ───────────────────────────────────────────────── */}
      {isActive('regex') && (
        <div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6 space-y-4">
            <div>
              <label htmlFor="regex-pattern" className="block text-xs font-bold uppercase tracking-widest text-text-3 mb-2">
                Padrão
              </label>
              <div className="relative">
                <Regex className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} aria-hidden="true" />
                <input
                  id="regex-pattern"
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="\d+\.\d+\.\d+\.\d+"
                  spellCheck={false}
                  autoComplete="off"
                  aria-invalid={!regexResult.ok}
                  className="w-full bg-bg-3 border-2 border-border rounded-xl py-3 pl-12 pr-4 font-mono text-sm focus:border-accent outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Flags:</span>
              {([
                { k: 'i' as const, label: 'i — ignore case' },
                { k: 'm' as const, label: 'm — multiline' },
                { k: 's' as const, label: 's — dotAll' },
              ]).map(({ k, label }) => (
                <label key={k} className="flex items-center gap-1.5 text-xs text-text-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags[k]}
                    onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))}
                    className="accent-[var(--color-accent)]"
                  />
                  <code>{label}</code>
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="regex-text" className="block text-xs font-bold uppercase tracking-widest text-text-3 mb-2">
                Texto de teste
              </label>
              <textarea
                id="regex-text"
                value={regexText}
                onChange={(e) => setRegexText(e.target.value)}
                rows={4}
                spellCheck={false}
                className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 font-mono text-xs focus:border-accent outline-none transition-colors resize-y"
              />
            </div>
          </div>

          {regexResult.ok ? (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-sm font-bold text-text">
                  {regexResult.count} {regexResult.count === 1 ? 'match' : 'matches'}
                </p>
                <CopyButton text={`/${pattern}/${flagStr}`} label="regex" />
              </div>
              <pre className="bg-bg-2 border border-border rounded-xl p-4 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">
                {highlightMatches(regexText, regexResult.matches)}
              </pre>
            </div>
          ) : (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-err/30 bg-err/5 text-sm text-text-2">
              <AlertCircle size={18} className="text-err shrink-0" aria-hidden="true" />
              <span>Regex inválido: <code className="font-mono">{regexResult.error}</code></span>
            </div>
          )}

          <div className="mt-8 p-4 rounded-xl bg-info/5 border border-info/20 text-xs text-text-3 leading-relaxed">
            <strong className="text-text-2">Onde isso ajuda:</strong> validar o padrão antes de
            usar em <code>grep -E</code>, <code>sed</code> ou no <code>failregex</code> de uma
            jail do Fail2ban. A flag <code>g</code> é aplicada automaticamente para mostrar todos
            os matches.
          </div>
        </div>
      )}

      {/* ── Gerador de iptables ──────────────────────────────────────────────── */}
      {isActive('iptables') && (
        <div>
          <div className="bg-bg-2 border border-border rounded-2xl p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Tabela</span>
                <select value={rule.table} onChange={(e) => updRule('table', e.target.value as IptablesRule['table'])} className={selectCls}>
                  <option value="filter">filter</option>
                  <option value="nat">nat</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Chain</span>
                <select value={rule.chain} onChange={(e) => updRule('chain', e.target.value)} className={selectCls}>
                  {['INPUT', 'OUTPUT', 'FORWARD', 'PREROUTING', 'POSTROUTING'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Protocolo</span>
                <select value={rule.protocol} onChange={(e) => updRule('protocol', e.target.value as IptablesRule['protocol'])} className={selectCls}>
                  {['tcp', 'udp', 'icmp', 'all'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Ação (-j)</span>
                <select value={rule.action} onChange={(e) => updRule('action', e.target.value)} className={selectCls}>
                  {['ACCEPT', 'DROP', 'REJECT', 'LOG', 'MASQUERADE'].map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Porta destino (--dport)</span>
                <input
                  type="text" value={rule.dport} onChange={(e) => updRule('dport', e.target.value)}
                  placeholder="22" spellCheck={false} className={inputCls}
                  disabled={rule.protocol !== 'tcp' && rule.protocol !== 'udp'}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Origem (-s)</span>
                <input
                  type="text" value={rule.source} onChange={(e) => updRule('source', e.target.value)}
                  placeholder="192.168.1.0/24" spellCheck={false} className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Interface (-i)</span>
                <input
                  type="text" value={rule.inInterface} onChange={(e) => updRule('inInterface', e.target.value)}
                  placeholder="eth0" spellCheck={false} className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Estado (conntrack)</span>
                <select value={rule.ctstate} onChange={(e) => updRule('ctstate', e.target.value)} className={selectCls}>
                  <option value="">— nenhum —</option>
                  <option value="NEW">NEW</option>
                  <option value="ESTABLISHED,RELATED">ESTABLISHED,RELATED</option>
                  <option value="NEW,ESTABLISHED">NEW,ESTABLISHED</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-text-3">Comando gerado</p>
              <div className="flex items-center gap-2">
                <CopyButton text={iptablesCmd} label="comando" />
                <button
                  type="button"
                  onClick={addRule}
                  className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-accent/40 bg-accent/10 text-accent px-2.5 py-1.5 hover:bg-accent/20 transition-colors"
                >
                  <Plus size={14} aria-hidden="true" /> Adicionar à lista
                </button>
              </div>
            </div>
            <pre className="bg-bg-2 border-2 border-accent/40 rounded-xl p-4 text-sm font-mono text-accent overflow-x-auto">{iptablesCmd}</pre>
          </div>

          {rules.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-text-3">
                  Script — {rules.length} {rules.length === 1 ? 'regra' : 'regras'}
                </p>
                <div className="flex items-center gap-2">
                  <CopyButton text={iptablesScript} label="script" />
                  <button
                    type="button"
                    onClick={() => setRules([])}
                    className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-border text-text-2 px-2.5 py-1.5 hover:border-err/50 hover:text-err transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </div>
              <ul className="space-y-1.5">
                {rules.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 bg-bg-2 border border-border rounded-lg pl-3 pr-1.5 py-1.5">
                    <code className="flex-1 min-w-0 text-xs font-mono text-text-2 overflow-x-auto whitespace-nowrap">{buildIptablesRule(r)}</code>
                    <button
                      type="button"
                      onClick={() => removeRule(i)}
                      aria-label={`Remover regra ${i + 1}`}
                      className="shrink-0 p-1 rounded-md text-text-3 hover:text-err hover:bg-err/10 transition-colors"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 p-4 rounded-xl bg-info/5 border border-info/20 text-xs text-text-3 leading-relaxed">
            <strong className="text-text-2">Lembre-se:</strong> a ordem das regras importa — o
            iptables avalia de cima para baixo e para na primeira que casa. Para persistir após
            o reboot use <code>iptables-save</code> / <code>netfilter-persistent</code>.
          </div>
        </div>
      )}
    </div>
  );
}
