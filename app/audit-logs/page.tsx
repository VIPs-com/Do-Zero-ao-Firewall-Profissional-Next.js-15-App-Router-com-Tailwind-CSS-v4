'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Search, Shield, AlertTriangle, Eye, FileText, Filter, CheckCircle2, Circle, Activity, UserCheck } from 'lucide-react';
import { StepItem } from '@/components/ui/Steps';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { ModuleNav } from '@/components/ui/ModuleNav';
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

            <HighlightBox title="💡 Anatomia Completa — Decodificando Cada Campo">
              <p className="text-sm text-text-2 mb-3">
                Uma linha de log do iptables carrega toda a informação do pacote capturado. Aqui está uma linha real de ataque com cada campo explicado:
              </p>
              <code className="text-[10px] block bg-bg-3 p-3 rounded border border-border font-mono leading-6 text-ok">
                Jan 15 10:23:45 fw kernel: [IPTABLES DROP] IN=enp0s3 OUT= MAC=aa:bb:cc:dd:ee:ff SRC=185.234.12.43 DST=192.168.56.250 LEN=44 TOS=0x00 TTL=118 ID=1234 DF PROTO=TCP SPT=51234 DPT=22 WINDOW=1024 RES=0x00 SYN URGP=0
              </code>
              <ul className="mt-3 space-y-1 text-sm text-text-2">
                <li><code className="text-xs text-accent-2">IN=enp0s3</code> → interface de entrada (WAN — veio da internet)</li>
                <li><code className="text-xs text-accent-2">OUT=</code> → vazio = pacote DROP antes de rotear</li>
                <li><code className="text-xs text-accent-2">SRC=185.234.12.43</code> → IP do atacante</li>
                <li><code className="text-xs text-accent-2">DST=192.168.56.250</code> → IP destino (firewall)</li>
                <li><code className="text-xs text-accent-2">TTL=118</code> → fingerprint SO: ≈ Windows (128 - 10 hops)</li>
                <li><code className="text-xs text-accent-2">PROTO=TCP DPT=22</code> → tentativa de SSH direto (sem Port Knocking)</li>
                <li><code className="text-xs text-accent-2">SYN</code> → início de conexão TCP (handshake fase 1)</li>
              </ul>
            </HighlightBox>

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

          {/* Section 5: Auditoria Forense — Port Knocking */}
          <section id="forense-knock">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <UserCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold">5. Auditoria Forense — Port Knocking</h2>
            </div>

            <InfoBox title="🔍 Dois tipos de administrador">
              <div className="space-y-3 text-sm font-mono">
                <div>
                  <p className="text-err font-bold">Administrador REATIVO:</p>
                  <p className="text-text-2 pl-2">&quot;O servidor foi comprometido!&quot; → &quot;Quando aconteceu?&quot; → <strong>&quot;Não sei... não estava monitorando.&quot;</strong></p>
                </div>
                <div>
                  <p className="text-ok font-bold">Administrador com FORENSE:</p>
                  <p className="text-text-2 pl-2">&quot;Comprometido em 2026-03-17 às 03:42:17 pelo IP 185.234.x.x — aqui está o log completo assinado.&quot;</p>
                </div>
                <p className="text-text-3 pt-1">A diferença: logs configurados, retidos e analisados. O <code className="text-xs">tail -f</code> é só o começo.</p>
              </div>
            </InfoBox>

            <div className="mt-6 space-y-6">
              <StepItem
                number={1}
                title="Nível 1 — Monitoramento em Tempo Real"
                description="Ver cada knock ao vivo com hora, interface e IP de origem"
              />
              <CodeBlock code={`# Ver todos os eventos de knock ao vivo:
tail -f /var/log/syslog | grep "KNOCK"

# Versão legível — hora | interface | IP → porta:
tail -f /var/log/syslog | grep "KNOCK" \\
    | awk '{
        for(i=1;i<=NF;i++) {
            if($i ~ /^SRC=/) src=substr($i,5)
            if($i ~ /^IN=/)  iface=substr($i,4)
            if($i ~ /^DPT=/) dpt=substr($i,5)
        }
        print $3 " | " iface " | " src " → porta " dpt
    }'

# Saída esperada:
# 10:23:45 | enp0s9 | 192.168.57.50 → porta 59991  (admin legítimo)
# 10:24:12 | enp0s3 | 185.234.x.x  → porta 59991  (SUSPEITO — veio da WAN!)`} />

              <StepItem
                number={2}
                title="Nível 2 — Análise Histórica"
                description="Top IPs, horários de pico e tentativas SSH sem knock"
              />
              <CodeBlock code={`# Top 10 IPs que mais bateram:
grep "KNOCK-59991" /var/log/syslog \\
    | grep -oP "SRC=\\K[0-9.]+" \\
    | sort | uniq -c | sort -rn | head 10
# 43  192.168.57.50  ← admin legítimo
#  3  192.168.57.100 ← outro admin?
#  1  185.234.x.x    ← SUSPEITO!

# Horários de pico:
grep "KNOCK-59991" /var/log/syslog \\
    | grep -oP "^\\w+ \\d+ \\K\\d+(?=:)" \\
    | sort | uniq -c | sort -rn
# 12  10  ← 12 batidas às 10h (horário de trabalho — normal)
#  1  03  ← 1 batida às 3h da manhã — ALERTA!

# Tentativas SSH sem knock (bots):
grep "SSH-SEM-KNOCK" /var/log/syslog \\
    | grep -oP "SRC=\\K[0-9.]+" \\
    | sort | uniq -c | sort -rn
# 847  185.x.x.x  ← bot tentando SSH direto — nunca chega ao serviço`} />

              <StepItem
                number={3}
                title="Nível 3 — Correlação de Eventos"
                description="Descobrir quem bateu E depois fez SSH — possível reconhecimento ativo"
              />
              <CodeBlock code={`# Extrair IPs que bateram:
grep "KNOCK-59991" /var/log/syslog \\
    | grep -oP "SRC=\\K[0-9.]+" > /tmp/batidas.txt

# Extrair logins SSH bem-sucedidos:
grep "Accepted" /var/log/auth.log \\
    | awk '{print $(NF-3)}' > /tmp/logins.txt

# Correlacionar — quem bateu E logou?
while read ip; do
    if grep -q "$ip" /tmp/logins.txt; then
        echo "LEGÍTIMO: $ip bateu e fez login"
    else
        echo "SUSPEITO: $ip bateu mas NÃO logou — reconhecimento?"
    fi
done < /tmp/batidas.txt`} />

              <div className="mt-2">
                <p className="text-sm font-semibold text-text-2 mb-3">Script completo: <code className="text-xs text-accent">/usr/local/bin/audit-knock</code></p>
              </div>
              <CodeBlock code={`cat > /usr/local/bin/audit-knock << 'SCRIPT'
#!/bin/bash
LOGFILE="/var/log/syslog"
AUTHLOG="/var/log/auth.log"
DATA=$(date +"%Y-%m-%d")

echo "╔══════════════════════════════════════════╗"
echo "║   RELATÓRIO DE AUDITORIA — PORT KNOCKING  ║"
echo "║   Gerado em: $(date)   ║"
echo "╚══════════════════════════════════════════╝"

echo "━━━ RESUMO DO DIA ━━━"
echo "Batidas na porta 59991:     $(grep "KNOCK-59991" $LOGFILE | grep "$DATA" | wc -l)"
echo "Tentativas SSH sem knock:   $(grep "SSH-SEM-KNOCK" $LOGFILE | grep "$DATA" | wc -l)"
echo "Logins bem-sucedidos:       $(grep "Accepted" $AUTHLOG | grep "$DATA" | wc -l)"

echo "━━━ TOP IPs QUE BATERAM ━━━"
grep "KNOCK-59991" $LOGFILE | grep "$DATA" \\
    | grep -oP "SRC=\\K[0-9.]+" \\
    | sort | uniq -c | sort -rn | head 10

echo "━━━ ATIVIDADE FORA DO HORÁRIO COMERCIAL ━━━"
grep "KNOCK-59991" $LOGFILE | grep "$DATA" \\
    | awk '{split($3,t,":"); h=t[1]+0; if(h<8||h>=20) print "⚠️ "$3, $0}' \\
    | grep -oP "⚠️ [0-9:]+ .*SRC=\\K[0-9.]+" \\
    | while read ip; do echo "  Batida suspeita de: $ip"; done
SCRIPT

chmod +x /usr/local/bin/audit-knock
audit-knock  # executar o relatório`} />

              <div className="mt-2">
                <p className="text-sm font-semibold text-text-2 mb-3">Monitor em tempo real: <code className="text-xs text-accent">/usr/local/bin/knock-monitor</code></p>
              </div>
              <CodeBlock code={`cat > /usr/local/bin/knock-monitor << 'SCRIPT'
#!/bin/bash
ADMIN_IP="192.168.57.50"

tail -f /var/log/syslog | while read linha; do
    if echo "$linha" | grep -q "KNOCK-59991"; then
        IP=$(echo "$linha" | grep -oP "SRC=\\K[0-9.]+")
        HORA=$(echo "$linha" | awk '{print $3}')
        IN=$(echo "$linha" | grep -oP "IN=\\K\\S+")

        if [ "$IP" = "$ADMIN_IP" ]; then
            echo "[$HORA] ✓ KNOCK LEGÍTIMO: $IP via $IN"
        else
            echo "[$HORA] ⚠️  KNOCK SUSPEITO: $IP via $IN"
            logger -p auth.warning "ALERTA: knock suspeito de $IP via $IN"
        fi

    elif echo "$linha" | grep -q "SSH-SEM-KNOCK"; then
        IP=$(echo "$linha" | grep -oP "SRC=\\K[0-9.]+")
        echo "[$(echo "$linha" | awk '{print $3}')] 🚨 SSH SEM KNOCK: $IP (bot/scanner)"

    elif echo "$linha" | grep -q "Accepted publickey"; then
        echo "[$(echo "$linha" | awk '{print $3}')] 🔑 LOGIN SSH: $(echo "$linha" | awk '{print $9}')"
    fi
done
SCRIPT

chmod +x /usr/local/bin/knock-monitor
# Rodar em background:
nohup /usr/local/bin/knock-monitor > /var/log/knock-monitor.log 2>&1 &
tail -f /var/log/knock-monitor.log`} />

              <HighlightBox title="📁 Retenção de 90 dias + Arquivo separado para knock">
                <CodeBlock code={`# /etc/logrotate.d/rsyslog — garantir 90 dias:
# rotate 90   (ao invés do padrão 7)
# compress    (gzip nos arquivos antigos)

# /etc/rsyslog.d/knock.conf — separar logs de knock:
# :msg, contains, "KNOCK" /var/log/auditoria/knock.log
# & stop

mkdir -p /var/log/auditoria && chmod 700 /var/log/auditoria
systemctl restart rsyslog

# Monitorar apenas os logs de knock:
tail -f /var/log/auditoria/knock.log`} />
              </HighlightBox>

              <div className="space-y-3 mt-4">
                {[
                  { id: 'audit-knock-script', text: 'Criei e executei o script /usr/local/bin/audit-knock' },
                  { id: 'knock-monitor-script', text: 'Rodei o knock-monitor em background e vi os alertas coloridos' },
                  { id: 'audit-log-rotation', text: 'Configurei retenção de 90 dias e arquivo separado para knock' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    {checklist[item.id] ? (
                      <CheckCircle2 size={16} className="text-ok shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-text-3 shrink-0 mt-0.5 group-hover:text-accent" />
                    )}
                    <span className={cn(
                      "text-sm leading-tight transition-colors",
                      checklist[item.id] ? "text-text-2 line-through opacity-50" : "text-text-3 group-hover:text-text-2"
                    )}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6: Erros Comuns (renumerado — era 4) */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">6. Erros Comuns</h2>
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

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/audit-logs" />
    </div>
  );
}
