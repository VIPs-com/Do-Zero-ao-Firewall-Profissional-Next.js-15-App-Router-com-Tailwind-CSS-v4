'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Search, Shield, AlertTriangle, Eye, FileText, Filter, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_LOGS = [
  { t: '10:23:45', p: 'KNOCK-59991', s: '192.168.57.50', d: '192.168.57.250', i: 'enp0s9', type: 'legit' },
  { t: '10:23:46', p: 'SSH-LOGIN', s: '192.168.57.50', d: '192.168.57.250', i: 'enp0s9', type: 'legit' },
  { t: '11:05:12', p: 'SSH-SEM-KNOCK', s: '185.234.12.43', d: '192.168.20.200', i: 'enp0s3', type: 'attack' },
  { t: '11:05:13', p: 'SSH-SEM-KNOCK', s: '185.234.12.43', d: '192.168.20.200', i: 'enp0s3', type: 'attack' },
  { t: '11:42:01', p: 'KNOCK-59991', s: '192.168.57.50', d: '192.168.57.250', i: 'enp0s9', type: 'legit' },
];

export default function AuditLogsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Auditoria & Logs</span>
      </div>

      <div className="section-label">Tópico Especial · Segurança Forense</div>
      <h1 className="section-title">🔍 Auditoria & Logs</h1>
      <p className="section-sub">
        Transformar logs brutos em inteligência é a habilidade que separa administradores de analistas de segurança.
        Aprenda a ler o que o kernel está dizendo.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: Anatomy of a Log */}
          <section id="anatomia">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Anatomia de uma linha de log</h2>
            </div>
            
            <div className="code-block mb-8">
              <div className="code-header">
                <div className="code-title">Exemplo de log do iptables (syslog)</div>
                <div className="code-lang">log</div>
              </div>
              <pre className="text-[10px] whitespace-pre-wrap">
                Mar 17 10:23:45 firewall kernel: [12345.678] <span className="text-accent">KNOCK-59991:</span> IN=enp0s9 OUT= MAC=... <span className="text-ok">SRC=192.168.57.50</span> DST=192.168.57.250 LEN=60 TOS=0x00 PREC=0x00 <span className="text-info">TTL=64</span> ID=12345 DF <span className="text-accent-2">PROTO=TCP SPT=54876 DPT=59991</span> WINDOW=64240 RES=0x00 SYN URGP=0
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-bg-2 border border-border">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-accent" />
                  Campos Críticos
                </h4>
                <ul className="text-xs text-text-3 space-y-3">
                  <li><strong className="text-text-2">SRC:</strong> IP de origem. Quem enviou o pacote.</li>
                  <li><strong className="text-text-2">IN:</strong> Interface de entrada. <code className="text-[10px]">enp0s3</code> (WAN) vs <code className="text-[10px]">enp0s9</code> (LAN).</li>
                  <li><strong className="text-text-2">TTL:</strong> Indica o SO. 64 (Linux), 128 (Windows).</li>
                  <li><strong className="text-text-2">SYN:</strong> Indica início de conexão (o knock).</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-bg-2 border border-border">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Terminal size={16} className="text-info" />
                  Comandos de Análise
                </h4>
                <ul className="text-xs text-text-3 space-y-3">
                  <li><code className="text-[10px] text-accent-2">tail -f /var/log/syslog | grep KNOCK</code></li>
                  <li><code className="text-[10px] text-accent-2">grep "Accepted" /var/log/auth.log</code></li>
                  <li><code className="text-[10px] text-accent-2">awk '/SRC=/ {'{'}print $NF{'}'}' /var/log/syslog</code></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Interactive Log Viewer */}
          <section id="simulador">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Simulador de Auditoria</h2>
            </div>
            
            <div className="bg-bg-3 border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border bg-bg-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-text-3" />
                  <span className="text-[10px] font-bold text-text-3 uppercase tracking-widest">Visualizador de Eventos</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-ok" />
                  <div className="w-2 h-2 rounded-full bg-err" />
                </div>
              </div>
              <div className="p-0">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-bg-2 border-b border-border text-text-3 uppercase font-bold">
                    <tr>
                      <th className="px-4 py-2">Hora</th>
                      <th className="px-4 py-2">Evento</th>
                      <th className="px-4 py-2">Origem (SRC)</th>
                      <th className="px-4 py-2">Interface</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono">
                    {MOCK_LOGS.map((log, i) => (
                      <tr key={i} className={cn(
                        "hover:bg-bg-2 transition-colors",
                        log.type === 'attack' ? "bg-err/5" : ""
                      )}>
                        <td className="px-4 py-3 text-text-3">{log.t}</td>
                        <td className="px-4 py-3 font-bold">{log.p}</td>
                        <td className="px-4 py-3 text-accent-2">{log.s}</td>
                        <td className="px-4 py-3">{log.i}</td>
                        <td className="px-4 py-3">
                          {log.type === 'legit' ? (
                            <span className="text-ok flex items-center gap-1">✓ Legítimo</span>
                          ) : (
                            <span className="text-err flex items-center gap-1">⚠️ Ataque</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-warn" />
              Risco de Bots
            </h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Bots varrem a internet 24/7 procurando portas 22 abertas. O Port Knocking as torna invisíveis.
            </p>
            <div className="p-3 bg-bg-3 rounded border border-border">
              <div className="text-[10px] text-text-3 mb-1">Tentativas de senha hoje:</div>
              <div className="text-xl font-bold text-err">0</div>
              <div className="text-[9px] text-ok mt-1">✓ Graças ao Port Knocking</div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-info/5 border border-info/20">
            <h4 className="font-bold text-sm text-info mb-2">Dica de Ouro</h4>
            <p className="text-xs text-text-2 leading-relaxed">
              Use o comando <code className="text-[10px]">grep -v</code> para excluir seu próprio IP das buscas e focar apenas no que é suspeito.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
