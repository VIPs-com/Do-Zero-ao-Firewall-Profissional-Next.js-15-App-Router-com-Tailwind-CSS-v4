'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Search, Shield, AlertTriangle, Eye, FileText, Filter, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { useBadges } from '@/context/BadgeContext';

const MOCK_LOGS = [
  { t: '10:23:45', p: 'KNOCK-59991', s: '192.168.57.50', d: '192.168.57.250', i: 'enp0s9', type: 'legit' },
  { t: '10:23:46', p: 'SSH-LOGIN', s: '192.168.57.50', d: '192.168.57.250', i: 'enp0s9', type: 'legit' },
  { t: '11:05:12', p: 'SSH-SEM-KNOCK', s: '185.234.12.43', d: '192.168.20.200', i: 'enp0s3', type: 'attack' },
  { t: '11:05:13', p: 'SSH-SEM-KNOCK', s: '185.234.12.43', d: '192.168.20.200', i: 'enp0s3', type: 'attack' },
  { t: '11:42:01', p: 'KNOCK-59991', s: '192.168.57.50', d: '192.168.57.250', i: 'enp0s9', type: 'legit' },
];

const AUDIT_CHECKLIST = [
  { id: 'audit-log', text: 'Analisou logs de iptables com grep e awk' },
];

export default function AuditLogsPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('audit-logs');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-audit-logs">
      <div className="breadcrumb mb-8 module-hero">
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

            <CodeBlock
              title="Exemplo de log do iptables (syslog)"
              lang="log"
              code={`Mar 17 10:23:45 firewall kernel: [12345.678] KNOCK-59991: IN=enp0s9 OUT= MAC=... SRC=192.168.57.50 DST=192.168.57.250 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=12345 DF PROTO=TCP SPT=54876 DPT=59991 WINDOW=64240 RES=0x00 SYN URGP=0`}
            />

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <InfoBox title="Campos Críticos">
                <ul className="text-xs text-text-3 space-y-3">
                  <li><strong className="text-text-2">SRC:</strong> IP de origem — quem enviou o pacote.</li>
                  <li><strong className="text-text-2">IN:</strong> Interface de entrada. <code className="text-[10px]">enp0s3</code> (WAN) vs <code className="text-[10px]">enp0s9</code> (LAN).</li>
                  <li><strong className="text-text-2">TTL:</strong> Indica o SO aproximado. 64 = Linux, 128 = Windows.</li>
                  <li><strong className="text-text-2">SYN:</strong> Início de conexão TCP (o knock em si).</li>
                  <li><strong className="text-text-2">DPT:</strong> Porta de destino — identifica qual serviço foi alvo.</li>
                </ul>
              </InfoBox>
              <InfoBox title="Comandos de Análise">
                <ul className="text-xs text-text-3 space-y-3">
                  <li><code className="text-[10px] text-accent-2">tail -f /var/log/syslog | grep KNOCK</code></li>
                  <li><code className="text-[10px] text-accent-2">grep "Accepted" /var/log/auth.log</code></li>
                  <li><code className="text-[10px] text-accent-2">{"awk '/SRC=/ {print $NF}' /var/log/syslog"}</code></li>
                  <li><code className="text-[10px] text-accent-2">journalctl -k | grep KNOCK-59991</code></li>
                </ul>
              </InfoBox>
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

            <HighlightBox title="💡 Pulo do Gato">
              <p className="text-sm text-text-2">
                O prefixo <code className="text-xs">--log-prefix</code> do iptables é sua chave de busca.
                Use prefixos descritivos como <code className="text-xs">"KNOCK-59991 "</code> (note o espaço no final — obrigatório)
                para filtrar com precisão: <code className="text-xs">grep "KNOCK-59991" /var/log/syslog</code>.
                Sem prefixo, todos os logs se misturam e a análise vira caos.
              </p>
            </HighlightBox>
          </section>

          {/* Section 3: Log via journalctl */}
          <section id="journalctl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Search size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Análise com journalctl</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              Em sistemas modernos com systemd, o <code className="text-xs font-mono">journalctl</code> centraliza todos os logs.
              É mais poderoso que o syslog tradicional — suporta filtros por serviço, boot, prioridade e janela de tempo.
            </p>

            <div className="space-y-4">
              <CodeBlock
                title="Logs do kernel (iptables) em tempo real"
                lang="bash"
                code="journalctl -k -f | grep KNOCK"
              />
              <CodeBlock
                title="Tentativas de login SSH (últimas 50 entradas)"
                lang="bash"
                code={`journalctl -u ssh --no-pager -n 50 | grep -E "Failed|Invalid|Accepted"`}
              />
              <CodeBlock
                title="Logs de hoje filtrados por prioridade (erros)"
                lang="bash"
                code="journalctl --since today -p err"
              />
              <CodeBlock
                title="Exportar logs para análise offline"
                lang="bash"
                code="journalctl -k --since '1 hour ago' > /tmp/audit-$(date +%F).log"
              />
            </div>
          </section>

          {/* Section 4: Common Errors */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Erros Comuns</h2>
            </div>

            <WarnBox title="⚠️ Problemas frequentes em auditoria de logs">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>Log vazio após configurar iptables LOG</strong> → regra LOG inserida depois de uma regra DROP
                  → <code className="text-xs">iptables -L -n --line-numbers</code> e mover a regra LOG para antes do DROP
                </li>
                <li>
                  <strong>grep não encontra eventos</strong> → prefixo do log-prefix com espaço faltando
                  → sempre terminar o prefixo com espaço: <code className="text-xs">--log-prefix &quot;EVENTO &quot;</code>
                </li>
                <li>
                  <strong>journalctl não mostra logs do iptables</strong> → rsyslog não está redirecionando kern.* para syslog
                  → verificar <code className="text-xs">/etc/rsyslog.conf</code>: <code className="text-xs">kern.* /var/log/kern.log</code>
                </li>
                <li>
                  <strong>Log cresce indefinidamente</strong> → sem limite de taxa nas regras LOG
                  → adicionar <code className="text-xs">-m limit --limit 5/min --limit-burst 10</code> para evitar flood
                </li>
              </ul>
            </WarnBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Audit Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist de Auditoria
            </h3>
            <div className="space-y-3">
              {AUDIT_CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-start gap-3 text-left group"
                >
                  {checklist[item.id] ? (
                    <CheckCircle2 size={14} className="text-ok shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={14} className="text-text-3 shrink-0 mt-0.5 group-hover:text-accent" />
                  )}
                  <span className={cn(
                    "text-[10px] leading-tight transition-colors",
                    checklist[item.id] ? "text-text-2 line-through opacity-50" : "text-text-3 group-hover:text-text-2"
                  )}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

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

          <InfoBox title="Dica de Ouro">
            <p className="text-xs text-text-2 leading-relaxed">
              Use <code className="text-[10px]">grep -v</code> para excluir seu próprio IP das buscas e focar
              apenas no que é suspeito. Ex: <code className="text-[10px]">grep KNOCK /var/log/syslog | grep -v 192.168.57.1</code>
            </p>
          </InfoBox>

          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Terminal size={16} className="text-accent" />
              Atalhos de Análise
            </h4>
            <div className="space-y-2 text-[10px] font-mono text-text-3">
              <div><span className="text-accent-2">grep -c "Failed"</span> — conta tentativas</div>
              <div><span className="text-accent-2">sort | uniq -c | sort -rn</span> — ranking de IPs</div>
              <div><span className="text-accent-2">awk &apos;{'{'}print $8{'}'}&apos;</span> — extrai campo SRC</div>
              <div><span className="text-accent-2">journalctl --since &quot;-1h&quot;</span> — última hora</div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h4 className="font-bold text-sm mb-3">Páginas Relacionadas</h4>
            <div className="space-y-2">
              <Link href="/port-knocking" className="flex items-center gap-2 text-[10px] text-text-3 hover:text-accent transition-colors">
                🚪 Port Knocking
              </Link>
              <Link href="/fail2ban" className="flex items-center gap-2 text-[10px] text-text-3 hover:text-accent transition-colors">
                🚫 Fail2ban
              </Link>
              <Link href="/wan-nat" className="flex items-center gap-2 text-[10px] text-text-3 hover:text-accent transition-colors">
                🔥 Firewall & LOG
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
