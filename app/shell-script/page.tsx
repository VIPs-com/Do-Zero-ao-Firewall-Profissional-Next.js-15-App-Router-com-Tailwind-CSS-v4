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
  { id: 'script-escrito', text: 'Escrevi um script bash com variáveis, if/else e loop for, e dei permissão de execução' },
];

const ESTRUTURA = `#!/bin/bash
# Primeira linha: shebang — define o interpretador

# Variáveis (sem espaço ao redor do =)
NOME="servidor-1"
IP="192.168.1.100"
DATA=$(date +%Y%m%d)   # $() executa comando e captura saída

echo "Servidor: $NOME"
echo "IP: $IP"
echo "Data do backup: $DATA"

# Tornar executável e rodar
# chmod +x meu-script.sh
# ./meu-script.sh`;

const CONDICIONAIS = `# if/else
if [ -f /etc/nginx/nginx.conf ]; then
  echo "Nginx está instalado"
else
  echo "Nginx NÃO encontrado"
fi

# Comparações numéricas: -eq -ne -lt -gt -le -ge
LIVRE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
if [ "$LIVRE" -gt 90 ]; then
  echo "ALERTA: disco com $LIVRE% de uso!"
fi

# Loop for — iterar sobre lista
for SERVICO in nginx ssh ufw; do
  STATUS=$(systemctl is-active $SERVICO)
  echo "$SERVICO: $STATUS"
done`;

const SCRIPT_REAL = `#!/bin/bash
# verificar-servicos.sh — verifica se serviços essenciais estão rodando

SERVICOS="nginx ssh ufw"

for SERVICO in $SERVICOS; do
  if systemctl is-active --quiet $SERVICO; then
    echo "OK  $SERVICO"
  else
    echo "FALHA  $SERVICO — tentando reiniciar..."
    sudo systemctl start $SERVICO
    if systemctl is-active --quiet $SERVICO; then
      echo "OK  $SERVICO reiniciado com sucesso"
    else
      echo "ERRO  $SERVICO NAO conseguiu reiniciar!"
    fi
  fi
done

# Tornar executável e rodar:
# chmod +x verificar-servicos.sh
# ./verificar-servicos.sh`;

export default function ShellScriptPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/shell-script');
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
        <span className="text-text-2">Shell Script</span>
      </div>

      <div className="section-label">Módulo 09 · Trilha Fundamentos</div>
      <h1 className="section-title">📜 Shell Script</h1>
      <p className="section-sub">
        Shell script transforma comandos manuais em automações. Um sysadmin que sabe bash pode
        automatizar backups, monitoramento, deploy e rotinas de manutenção —
        economizando horas por semana.
      </p>

      <div className="space-y-14">

        <section id="estrutura">
          <h2 className="text-2xl font-bold mb-2">Estrutura Básica e Variáveis</h2>
          <p className="text-text-2 text-sm mb-4">
            Todo script começa com <code>#!/bin/bash</code> (shebang). Variáveis são atribuídas
            sem espaços: <code>VAR=valor</code>. Use <code>$VAR</code> para acessar.
          </p>
          <CodeBlock code={ESTRUTURA} lang="bash" title="Estrutura básica" />
        </section>

        <section id="condicionais">
          <h2 className="text-2xl font-bold mb-2">Condicionais e Loops</h2>
          <CodeBlock code={CONDICIONAIS} lang="bash" title="if/else e for" />
          <InfoBox className="mt-4" title="Aspas importam em bash">
            <p className="text-sm text-text-2">
              Sempre use aspas duplas ao comparar variáveis: <code>if [ &quot;$VAR&quot; = &quot;valor&quot; ]</code>.
              Sem aspas, se a variável estiver vazia, o if quebra com erro de sintaxe.
            </p>
          </InfoBox>
        </section>

        <section id="script-real">
          <h2 className="text-2xl font-bold mb-2">Script Real — Verificar Serviços</h2>
          <p className="text-text-2 text-sm mb-4">
            Este é o tipo de script que você vai criar para monitorar o firewall Linux.
          </p>
          <CodeBlock code={SCRIPT_REAL} lang="bash" title="verificar-servicos.sh" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>Funções bash com parâmetros e retorno</li>
            <li>Arrays e associative arrays</li>
            <li>getopts — flags de linha de comando (-v, --verbose)</li>
            <li>trap — captura de erros e sinais (SIGTERM, SIGINT)</li>
            <li>heredoc — gerar arquivos de configuração inline</li>
          </ul>
        </HighlightBox>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 09
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
                ✅ Módulo 09 concluído! Próximo: Agendamento de Tarefas →
              </div>
            )}
          </div>
        </section>

      </div>

      <ModuleNav currentPath="/shell-script" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
