'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox } from '@/components/ui/Boxes';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'logs-lidos', text: 'Li logs com journalctl e tail -f, filtrei com grep e identifiquei erros no sistema' },
];

const JOURNALCTL = `journalctl -u nginx                        # logs do serviço nginx
journalctl -u ssh --since "1 hour ago"     # SSH na última hora
journalctl -f                              # seguir em tempo real (Ctrl+C para parar)
journalctl --since "2024-01-01" --until "2024-01-02"
journalctl -p err                          # apenas entradas de erro
journalctl --no-pager | grep "Failed"      # buscar falhas`;

const VAR_LOG = `ls /var/log/                               # ver todos os logs disponíveis
tail -f /var/log/syslog                    # seguir log principal
tail -f /var/log/auth.log                  # logins SSH e sudo
grep "Invalid user" /var/log/auth.log      # tentativas de usuário inválido
grep "Accepted" /var/log/auth.log          # logins bem-sucedidos
grep -c "Failed password" /var/log/auth.log  # contar falhas de senha`;

const MONITORAR = `# watch — repetir comando periodicamente
watch -n 2 'ss -tlnp'           # monitorar portas abertas a cada 2s
watch -n 5 df -h                # monitorar espaço a cada 5s
watch -n 1 'systemctl status nginx | tail -5'  # status do nginx

# Filtrar log do nginx em tempo real
tail -f /var/log/nginx/access.log | grep "404"
tail -f /var/log/nginx/error.log`;

export default function LogsBasicosPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/logs-basicos');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);
  const allDone = CHECKLIST.every(c => checklist[c.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-accent-fundamentos">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/fundamentos">Fundamentos Linux</Link>
        <span>/</span>
        <span className="text-text-2">Logs e Monitoramento</span>
      </div>

      <div className="section-label">Módulo 07 · Trilha Fundamentos</div>
      <h1 className="section-title">📋 Logs e Monitoramento</h1>
      <p className="section-sub">
        Logs são a memória do sistema. Todo problema tem um rastro.{' '}
        <strong>journalctl</strong>, <strong>/var/log/</strong> e <strong>tail -f</strong> são
        as ferramentas que você vai usar diariamente para diagnosticar falhas em servidores reais.
      </p>

      <div className="space-y-14">

        <section id="journalctl">
          <h2 className="text-2xl font-bold mb-2">journalctl — Logs do systemd</h2>
          <p className="text-text-2 text-sm mb-4">
            No Ubuntu/Debian moderno, todos os serviços systemd escrevem para o journal.
            <code>journalctl</code> é a interface centralizada.
          </p>
          <CodeBlock code={JOURNALCTL} lang="bash" title="journalctl" />
        </section>

        <section id="var-log">
          <h2 className="text-2xl font-bold mb-2">/var/log/ — Logs Tradicionais</h2>
          <p className="text-text-2 text-sm mb-4">
            Além do journal, muitos serviços ainda escrevem em <code>/var/log/</code>.
            O mais importante para segurança é <code>auth.log</code>.
          </p>
          <CodeBlock code={VAR_LOG} lang="bash" title="/var/log e auth.log" />
          <InfoBox className="mt-4" title="Conexão com o curso de firewall">
            <p className="text-sm text-text-2">
              No módulo de <strong>Audit Logs</strong> você vai aprender a correlacionar logs do iptables,
              do SSH e do Port Knocking para identificar ataques em andamento.
            </p>
          </InfoBox>
        </section>

        <section id="monitorar">
          <h2 className="text-2xl font-bold mb-2">Monitorar em Tempo Real</h2>
          <CodeBlock code={MONITORAR} lang="bash" title="watch e tail -f" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>logrotate — rotação automática para evitar disco cheio</li>
            <li>rsyslog centralizado — logs de múltiplos servidores em um lugar</li>
            <li>Elastic Stack (ELK) — análise e visualização de logs</li>
            <li>alertas com systemd-notify e scripts de monitoramento</li>
          </ul>
        </HighlightBox>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 07
            </h3>
            <div className="space-y-3">
              {CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-3 border border-border hover:border-[rgba(99,102,241,0.5)] transition-all text-left group"
                >
                  {checklist[item.id]
                    ? <CheckCircle2 size={18} className="text-ok shrink-0" />
                    : <Circle size={18} className="text-text-3 shrink-0 group-hover:text-[#6366f1] transition-colors" />
                  }
                  <span className={cn('text-sm', checklist[item.id] && 'line-through text-text-3')}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            {allDone && (
              <div className="mt-4 p-3 rounded-lg bg-ok/10 border border-ok/30 text-ok text-sm font-semibold text-center">
                ✅ Módulo 07 concluído! Próximo: Backup e Restauração →
              </div>
            )}
          </div>
        </section>

      </div>

      <ModuleNav currentPath="/logs-basicos" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
