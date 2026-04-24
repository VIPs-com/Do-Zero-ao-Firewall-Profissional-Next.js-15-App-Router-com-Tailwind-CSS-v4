'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Edit3, List, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'tarefa-agendada', text: 'Criei uma entrada no crontab para executar um script periodicamente' },
];

const SINTAXE = `# Formato: minuto hora dia-do-mês mês dia-da-semana comando
# ┌── minuto (0-59)
# │ ┌── hora (0-23)
# │ │ ┌── dia do mês (1-31)
# │ │ │ ┌── mês (1-12)
# │ │ │ │ ┌── dia da semana (0-7, 0 e 7 = domingo)
# │ │ │ │ │
# * * * * *   comando

# Exemplos
0 2 * * *     /backup/diario.sh           # todo dia às 2h
0 */6 * * *   /scripts/verifica.sh        # a cada 6 horas
30 8 * * 1-5  /scripts/relatorio.sh       # seg-sex às 8h30
@reboot       /scripts/inicializa.sh      # na inicialização do sistema
@daily        /backup/logs.sh             # uma vez por dia (equiv. 0 0 * * *)
@weekly       /scripts/manutencao.sh      # uma vez por semana`;

const GERENCIAR = `crontab -e      # editar crontab do usuário atual (abre editor)
crontab -l      # listar crontab atual
crontab -r      # REMOVER tudo — cuidado!

sudo crontab -e  # crontab do root

# Desativar emails de saída (evitar spam no /var/mail)
# Adicione na primeira linha do crontab:
MAILTO=""

# Ver execuções recentes no log
sudo grep CRON /var/log/syslog | tail -20`;

const EXEMPLOS = `# Abrir para editar
crontab -e

# Backup do /etc todo dia às 3h
0 3 * * * tar -czf /backup/etc-$(date +\%Y\%m\%d).tar.gz /etc/

# Limpar /tmp de arquivos com +7 dias, todo domingo
0 4 * * 0 find /tmp -type f -mtime +7 -delete

# Verificar espaço em disco a cada hora e logar
0 * * * * df -h / >> /var/log/disk-usage.log

# Reiniciar nginx se estiver parado (a cada 5 minutos)
*/5 * * * * systemctl is-active nginx || systemctl start nginx`;

const BOAS_PRATICAS = `# 1. Sempre use caminhos absolutos
# ERRADO:
*/5 * * * * ./verificar.sh
# CERTO:
*/5 * * * * /scripts/verificar.sh

# 2. Redirecione saída para log
0 3 * * * /scripts/backup.sh >> /var/log/backup.log 2>&1

# 3. Faça backup do crontab antes de modificar
crontab -l > ~/crontab-backup-$(date +%Y%m%d).txt

# 4. Teste o script manualmente antes de agendar
/scripts/meu-script.sh  # confirmar que funciona

# 5. Use crontab.guru para validar expressões
# https://crontab.guru — digitar a expressão e ver descrição`;

export default function CronPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/cron');
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
        <span className="text-text-2">Agendamento de Tarefas</span>
      </div>

      <div className="section-label">Módulo 10 · Trilha Fundamentos</div>
      <h1 className="section-title">🕐 Agendamento de Tarefas</h1>
      <p className="section-sub">
        Automatize manutenção sem intervenção manual. <strong>cron</strong> é o agendador de tarefas
        do Linux — execute qualquer comando por minuto, hora, dia, semana ou mês.
        Combine com os scripts do Módulo 09 para automação completa.
      </p>

      <FluxoCard
        title="Fluxo: agendar uma tarefa com cron"
        steps={[
          { label: 'crontab -e',  sub: 'abrir editor',       icon: <Edit3 size={14} />, color: 'border-info/50' },
          { label: '* * * * *',   sub: 'definir horário',    icon: <Clock size={14} />, color: 'border-accent/50' },
          { label: '/script.sh',  sub: 'caminho absoluto',   icon: <Zap size={14} />,   color: 'border-warn/50' },
          { label: 'crontab -l',  sub: 'verificar agendamentos', icon: <List size={14} />, color: 'border-ok/50' },
        ]}
      />

      <WindowsComparisonBox
        windowsCode={`Agendador de Tarefas (taskschd.msc)
  → Nova Tarefa → Gatilhos → Ações
  → Disparadores: Diário, Semanal, Mensal
  → Na inicialização / Ao fazer logon
  → schtasks /create /tn "Backup" ...
  → Logs em: Agendador de Tarefas → Histórico`}
        linuxCode={`crontab -e        # editar agendamentos
0 3 * * * /scripts/backup.sh
@reboot /scripts/init.sh
crontab -l        # listar agendamentos
sudo grep CRON /var/log/syslog  # ver log`}
        windowsLabel="Windows — Agendador de Tarefas"
        linuxLabel="Linux — cron / crontab"
      />

      <div className="space-y-14">

        <section id="sintaxe">
          <h2 className="text-2xl font-bold mb-2">Sintaxe do crontab</h2>
          <p className="text-text-2 text-sm mb-4">
            5 campos definem quando o comando roda. Use <code>*</code> para &quot;qualquer valor&quot;
            e <code>*/n</code> para &quot;a cada n&quot;. Os atalhos <code>@daily</code> e <code>@reboot</code> simplificam casos comuns.
          </p>
          <CodeBlock code={SINTAXE} lang="bash" title="Formato crontab" />
          <InfoBox className="mt-4" title="Validar expressões com crontab.guru">
            <p className="text-sm text-text-2">
              Acesse <strong>crontab.guru</strong> no navegador e cole sua expressão para ver
              a descrição em linguagem natural: &quot;A cada 6 horas&quot;, &quot;Às 3h todo dia&quot;, etc.
              Evita erros de agendamento em produção.
            </p>
          </InfoBox>
        </section>

        <section id="gerenciar">
          <h2 className="text-2xl font-bold mb-2">Gerenciar o crontab</h2>
          <CodeBlock code={GERENCIAR} lang="bash" title="crontab -e, -l, -r" />
          <WarnBox className="mt-4" title="crontab -r apaga tudo sem confirmação">
            <p className="text-sm text-text-2">
              Ao contrário de <code>-e</code> (editar) e <code>-l</code> (listar),
              {' '}<code>-r</code> remove todas as entradas imediatamente. Sem confirmação, sem desfazer.
              Sempre use <code>crontab -l {'>'} crontab-backup.txt</code> antes de modificar.
            </p>
          </WarnBox>
        </section>

        <section id="exemplos">
          <h2 className="text-2xl font-bold mb-2">Exemplos Práticos</h2>
          <p className="text-text-2 text-sm mb-4">
            Esses padrões cobrem 90% das necessidades de manutenção de um servidor Linux.
            Note o escape <code>\%</code> — o <code>%</code> tem significado especial no crontab.
          </p>
          <CodeBlock code={EXEMPLOS} lang="bash" title="Exemplos reais de crontab" />
        </section>

        <section id="boas-praticas">
          <h2 className="text-2xl font-bold mb-2">Boas Práticas</h2>
          <p className="text-text-2 text-sm mb-4">
            Cron roda em um ambiente mínimo — sem as variáveis do seu shell interativo.
            Seguir estas práticas evita a maioria dos bugs.
          </p>
          <CodeBlock code={BOAS_PRATICAS} lang="bash" title="Boas práticas com cron" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>systemd timers — mais flexíveis e com logging nativo via journalctl</li>
            <li>at — agendar tarefa única para executar uma vez</li>
            <li>anacron — para máquinas que nem sempre estão ligadas</li>
            <li>cron com variáveis de ambiente e PATH explícito</li>
          </ul>
        </HighlightBox>

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Criar seu primeiro agendamento</p>
              <CodeBlock code={`# Criar script de teste
cat > /tmp/ping-google.sh << 'EOF'
#!/bin/bash
echo "$(date) - Ping: $(ping -c1 8.8.8.8 | grep time= | awk '{print $7}')" >> /tmp/ping-log.txt
EOF
chmod +x /tmp/ping-google.sh

# Agendar: a cada minuto (para testar rapidamente)
crontab -e
# Adicionar: * * * * * /tmp/ping-google.sh

# Aguardar 2 minutos e verificar
cat /tmp/ping-log.txt`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Listar e remover agendamentos</p>
              <CodeBlock code={`crontab -l                       # ver o que está agendado
crontab -l > ~/backup-crontab.txt  # fazer backup
# Para remover o ping-google após o teste:
crontab -e  # apagar a linha e salvar`} lang="bash" />
            </div>
          </div>
        </section>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 10 — Trilha Fundamentos Completa!
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
              <div className="mt-4 p-4 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)] text-center">
                <p className="text-lg font-bold mb-2">🐧 Trilha Fundamentos concluída!</p>
                <p className="text-sm text-text-2 mb-4">Você completou os 10 módulos. Badge <strong>Fundamentos Master</strong> desbloqueado!</p>
                <Link href="/instalacao" className="btn-primary px-6 py-2.5">
                  🛡️ Próximo: Montar o Firewall Linux
                </Link>
              </div>
            )}
          </div>
        </section>

      </div>

      <ModuleNav currentPath="/cron" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
