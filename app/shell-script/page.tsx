'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Code2, GitBranch, RefreshCw, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'script-escrito', text: 'Escrevi um script bash com variáveis, if/else e loop for, e dei permissão de execução' },
];

const ESTRUTURA = `#!/bin/bash
# Primeira linha: shebang — define o interpretador
# Sem ela, o sistema não sabe como executar o arquivo

# Variáveis (sem espaço ao redor do =)
NOME="servidor-1"
IP="192.168.1.100"
DATA=$(date +%Y%m%d)   # $() executa comando e captura saída

echo "Servidor: $NOME"
echo "IP: $IP"
echo "Data do backup: $DATA"

# Tornar executável e rodar
chmod +x meu-script.sh
./meu-script.sh`;

const CONDICIONAIS = `# if/else — comparar strings e números
if [ -f /etc/nginx/nginx.conf ]; then
  echo "Nginx está instalado"
else
  echo "Nginx NÃO encontrado"
fi

# Testes comuns: -f (arquivo), -d (diretório), -z (vazio), -n (não vazio)

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
LOG="/var/log/verificar-servicos.log"

echo "=== Verificação $(date) ===" >> $LOG

for SERVICO in $SERVICOS; do
  if systemctl is-active --quiet $SERVICO; then
    echo "OK    $SERVICO" | tee -a $LOG
  else
    echo "FALHA $SERVICO — tentando reiniciar..." | tee -a $LOG
    sudo systemctl start $SERVICO
    if systemctl is-active --quiet $SERVICO; then
      echo "OK    $SERVICO reiniciado com sucesso" | tee -a $LOG
    else
      echo "ERRO  $SERVICO NAO conseguiu reiniciar!" | tee -a $LOG
    fi
  fi
done

# Tornar executável e rodar:
# chmod +x verificar-servicos.sh
# ./verificar-servicos.sh`;

const FUNCOES = `#!/bin/bash
# Funções — reutilizar lógica

log_info() {
  echo "[INFO] $(date +%H:%M:%S) $1"
}

log_erro() {
  echo "[ERRO] $(date +%H:%M:%S) $1" >&2
}

verificar_servico() {
  local SERVICO="$1"
  if systemctl is-active --quiet "$SERVICO"; then
    log_info "$SERVICO: rodando"
    return 0
  else
    log_erro "$SERVICO: parado!"
    return 1
  fi
}

# Usar a função
verificar_servico nginx
verificar_servico ssh`;

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

      <FluxoCard
        title="Anatomia de um script bash"
        steps={[
          { label: '#!/bin/bash',   sub: 'shebang — define shell', icon: <Code2 size={14} />,      color: 'border-info/50' },
          { label: 'variáveis',     sub: 'VAR=valor / $(cmd)',      icon: <Cpu size={14} />,        color: 'border-accent/50' },
          { label: 'if / for',      sub: 'lógica e loops',          icon: <GitBranch size={14} />, color: 'border-warn/50' },
          { label: 'funções',       sub: 'reutilizar lógica',       icon: <RefreshCw size={14} />, color: 'border-ok/50' },
        ]}
      />

      <WindowsComparisonBox
        windowsCode={`PowerShell (scripts .ps1):
  $nome = "servidor"          # variável
  if ($condicao) { ... }      # condicional
  foreach ($item in $lista) { ... }
  Set-ExecutionPolicy RemoteSigned

Batch (.bat / .cmd):
  SET NOME=servidor
  IF EXIST arquivo.txt (echo sim)
  FOR %%i IN (a b c) DO echo %%i`}
        linuxCode={`Bash (scripts .sh):
  nome="servidor"             # variável
  if [ condição ]; then ... fi
  for item in lista; do ... done
  chmod +x script.sh          # dar permissão
  ./script.sh                 # executar`}
        windowsLabel="Windows — PowerShell / Batch"
        linuxLabel="Linux — Bash Shell Script"
      />

      <div className="space-y-14">

        <section id="estrutura">
          <h2 className="text-2xl font-bold mb-2">Estrutura Básica e Variáveis</h2>
          <p className="text-text-2 text-sm mb-4">
            Todo script começa com <code>#!/bin/bash</code> (shebang). Variáveis são atribuídas
            sem espaços: <code>VAR=valor</code>. Use <code>$VAR</code> para acessar.
          </p>
          <CodeBlock code={ESTRUTURA} lang="bash" title="Estrutura básica" />
          <InfoBox className="mt-4" title="Por que chmod +x é necessário?">
            <p className="text-sm text-text-2">
              No Linux, criar um arquivo não dá permissão de execução. Você precisa explicitamente
              dar <code>chmod +x script.sh</code> antes de rodar com <code>./script.sh</code>.
              Isso é intencional — previne execução acidental de arquivos de texto.
            </p>
          </InfoBox>
        </section>

        <section id="condicionais">
          <h2 className="text-2xl font-bold mb-2">Condicionais e Loops</h2>
          <CodeBlock code={CONDICIONAIS} lang="bash" title="if/else e for" />
          <WarnBox className="mt-4" title="Aspas importam em bash">
            <p className="text-sm text-text-2">
              Sempre use aspas duplas ao comparar variáveis: <code>if [ &quot;$VAR&quot; = &quot;valor&quot; ]</code>.
              Sem aspas, se a variável estiver vazia, o bash interpreta como{' '}
              <code>if [  = &quot;valor&quot; ]</code> e quebra com erro de sintaxe.
            </p>
          </WarnBox>
        </section>

        <section id="script-real">
          <h2 className="text-2xl font-bold mb-2">Script Real — Verificar Serviços</h2>
          <p className="text-text-2 text-sm mb-4">
            Este é o tipo de script que você vai criar para monitorar o firewall Linux.
            <code> tee -a $LOG</code> exibe na tela E grava no arquivo ao mesmo tempo.
          </p>
          <CodeBlock code={SCRIPT_REAL} lang="bash" title="verificar-servicos.sh" />
        </section>

        <section id="funcoes">
          <h2 className="text-2xl font-bold mb-2">Funções — Reutilizar Lógica</h2>
          <p className="text-text-2 text-sm mb-4">
            Funções evitam repetição. Defina uma vez, chame várias. Use <code>local</code> para
            variáveis locais e <code>return</code> para código de saída.
          </p>
          <CodeBlock code={FUNCOES} lang="bash" title="Funções bash" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>Arrays e associative arrays (declare -A)</li>
            <li>getopts — flags de linha de comando (-v, --verbose)</li>
            <li>trap — captura de erros e sinais (SIGTERM, SIGINT)</li>
            <li>heredoc — gerar arquivos de configuração inline</li>
            <li>shellcheck — ferramenta de lint para bash</li>
          </ul>
        </HighlightBox>

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Seu primeiro script</p>
              <CodeBlock code={`cat > /tmp/ola.sh << 'EOF'
#!/bin/bash
HOSTNAME=$(hostname)
IP=$(hostname -I | awk '{print $1}')
echo "Servidor: $HOSTNAME"
echo "IP: $IP"
echo "Uptime: $(uptime -p)"
EOF
chmod +x /tmp/ola.sh
/tmp/ola.sh`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Verificar serviços essenciais</p>
              <CodeBlock code={`cat > /tmp/check.sh << 'EOF'
#!/bin/bash
for SVC in ssh ufw nginx; do
  if systemctl is-active --quiet $SVC 2>/dev/null; then
    echo "OK    $SVC"
  else
    echo "----  $SVC (não instalado/rodando)"
  fi
done
EOF
chmod +x /tmp/check.sh && /tmp/check.sh`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Alerta de espaço em disco</p>
              <CodeBlock code={`cat > /tmp/disco.sh << 'EOF'
#!/bin/bash
LIMITE=80
USO=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
if [ "$USO" -gt "$LIMITE" ]; then
  echo "ALERTA: disco com $USO% acima do limite de $LIMITE%!"
else
  echo "OK: disco com $USO% de uso"
fi
EOF
chmod +x /tmp/disco.sh && /tmp/disco.sh`} lang="bash" />
            </div>
          </div>
        </section>

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
