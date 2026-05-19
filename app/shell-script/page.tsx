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

const BASH_ESTRITO = `#!/bin/bash
# Strict mode — torna o bash rigoroso e previsível
set -euo pipefail
IFS=$'\\n\\t'

# -e          : aborta se qualquer comando falhar (saída != 0)
# -u          : aborta ao usar variável não definida
# -o pipefail : falha no pipe se QUALQUER etapa falhar
# IFS         : separador só por quebra de linha e tab

# Valor padrão protege contra variável vazia
DESTINO="\${1:-/var/backups}"

# Sempre cite variáveis entre aspas
echo "Gravando backup em \\"\${DESTINO}\\""

# Sem set -e, a linha abaixo continuaria mesmo se o cd falhasse
cd "\${DESTINO}"
tar czf backup.tar.gz /etc`;

const TRAP_EXEMPLO = `#!/bin/bash
set -euo pipefail

# mktemp gera um nome único e seguro
TMPDIR="$(mktemp -d)"
LOCKFILE="/var/run/meu-script.lock"

cleanup() {
  echo "Limpando recursos temporários..."
  rm -rf "\${TMPDIR}"
  rm -f  "\${LOCKFILE}"
}

# cleanup roda em QUALQUER saída: sucesso, erro ou Ctrl+C
trap cleanup EXIT INT TERM

# Trabalho real usando o diretório temporário
touch "\${LOCKFILE}"
echo "dados" > "\${TMPDIR}/relatorio.txt"
process "\${TMPDIR}/relatorio.txt"

# Não precisa apagar nada no fim — o trap garante a limpeza`;

const GETOPTS_EXEMPLO = `#!/bin/bash
set -euo pipefail

VERBOSE=0
SAIDA="relatorio.txt"

uso() {
  echo "Uso: \${0##*/} [-v] [-o arquivo] [-h]"
  echo "  -v          modo verboso"
  echo "  -o arquivo  arquivo de saída (padrão: relatorio.txt)"
  echo "  -h          mostra esta ajuda"
}

# "vo:h" — o ':' após 'o' indica que -o EXIGE um valor
while getopts "vo:h" opt; do
  case "\${opt}" in
    v) VERBOSE=1 ;;
    o) SAIDA="\${OPTARG}" ;;
    h) uso; exit 0 ;;
    \\?) echo "Flag inválida: -\${OPTARG}" >&2; uso; exit 1 ;;
  esac
done

# Descarta as flags já lidas, restando os argumentos posicionais
shift $((OPTIND - 1))

[ "\${VERBOSE}" -eq 1 ] && echo "Modo verboso ligado"
echo "Saída: \${SAIDA}"
echo "Argumentos restantes: \$*"`;

const BATS_EXEMPLO = `#!/usr/bin/env bats
# exemplo.bats — testes do gerar-relatorio.sh
# Instalar: apt install bats   |   Rodar: bats exemplo.bats

@test "flag -h retorna codigo de saida 0" {
  run ./gerar-relatorio.sh -h
  [ "\${status}" -eq 0 ]
}

@test "flag invalida retorna codigo 1" {
  run ./gerar-relatorio.sh -x
  [ "\${status}" -eq 1 ]
}

@test "gera o arquivo de saida solicitado" {
  run ./gerar-relatorio.sh -o /tmp/teste.txt
  [ "\${status}" -eq 0 ]
  [ -f /tmp/teste.txt ]
}

@test "saida contem o cabecalho esperado" {
  run ./gerar-relatorio.sh
  [[ "\${output}" == *"Relatorio"* ]]
}`;

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

        <section id="bash-estrito">
          <h2 className="text-2xl font-bold mb-2">Robustez — Bash Estrito (Strict Mode)</h2>
          <p className="text-text-2 text-sm mb-4">
            Por padrão, o bash é <strong>tolerante demais</strong>: ele continua executando mesmo
            depois de um comando falhar e trata variáveis inexistentes como string vazia. Em um
            script de produção isso é perigoso — um <code>rm -rf &quot;$DIR/&quot;</code> com{' '}
            <code>$DIR</code> vazia apaga a raiz do sistema. O <em>strict mode</em> corrige isso
            com três flags na primeira linha útil do script.
          </p>
          <CodeBlock
            code={BASH_ESTRITO}
            lang="bash"
            title="Cabeçalho de um script robusto"
          />
          <ul className="text-sm text-text-2 mt-4 space-y-1 list-disc list-inside">
            <li><code>set -e</code> — aborta o script imediatamente se qualquer comando retornar erro (saída ≠ 0).</li>
            <li><code>set -u</code> — aborta se uma variável não definida for usada (pega erros de digitação).</li>
            <li><code>set -o pipefail</code> — em <code>cmd1 | cmd2</code>, propaga a falha de <em>qualquer</em> etapa do pipe, não só da última.</li>
            <li><code>IFS=$&apos;\n\t&apos;</code> — restringe o separador de campos a quebra de linha e tab, evitando word splitting por espaços.</li>
          </ul>
          <WarnBox className="mt-4" title="O perigo de scripts sem set -e">
            <p className="text-sm text-text-2">
              Sem <code>set -e</code>, um script que faz <code>cd /backup</code> e o diretório
              não existe vai continuar rodando no diretório errado — e o <code>rm</code> seguinte
              apaga a pasta errada. Sempre prefira valores padrão com{' '}
              <code>{'${'}VAR:-default{'}'}</code> e cite variáveis entre aspas:{' '}
              <code>&quot;$VAR&quot;</code>. Strict mode transforma falhas silenciosas em
              falhas barulhentas — e barulhentas você conserta.
            </p>
          </WarnBox>
        </section>

        <section id="traps">
          <h2 className="text-2xl font-bold mb-2">trap — Limpeza e Captura de Sinais</h2>
          <p className="text-text-2 text-sm mb-4">
            Scripts criam arquivos temporários, montam diretórios, abrem locks. Se o script morrer
            no meio — por erro, por <kbd>Ctrl+C</kbd> ou por um <code>kill</code> — esse lixo fica
            para trás. O <code>trap</code> registra uma função que roda <strong>sempre</strong> que
            o script termina, não importa o motivo, garantindo a limpeza.
          </p>
          <CodeBlock code={TRAP_EXEMPLO} lang="bash" title="trap + função cleanup" />
          <InfoBox className="mt-4" title="Sinais que valem capturar">
            <p className="text-sm text-text-2">
              <code>EXIT</code> dispara em qualquer saída (sucesso ou erro) — é o lugar ideal para
              limpeza. <code>INT</code> é o <kbd>Ctrl+C</kbd> do usuário. <code>TERM</code> é o{' '}
              <code>kill</code> padrão (e o que o systemd envia ao parar um serviço). Use{' '}
              <code>mktemp</code> em vez de inventar nomes como <code>/tmp/meu.tmp</code>:
              ele gera um nome único e evita colisão e ataques de symlink.
            </p>
          </InfoBox>
        </section>

        <section id="getopts">
          <h2 className="text-2xl font-bold mb-2">getopts — Parsing de Argumentos</h2>
          <p className="text-text-2 text-sm mb-4">
            Ler <code>$1</code>, <code>$2</code> na mão funciona para um argumento — mas vira um
            pesadelo quando o script precisa de flags opcionais (<code>-v</code>),
            flags com valor (<code>-o arquivo</code>) e ordem livre. O builtin{' '}
            <code>getopts</code> resolve isso de forma padronizada, igual a qualquer comando Unix.
          </p>
          <CodeBlock code={GETOPTS_EXEMPLO} lang="bash" title="getopts — exemplo completo" />
          <ul className="text-sm text-text-2 mt-4 space-y-1 list-disc list-inside">
            <li>A string <code>&quot;vo:h&quot;</code> declara as flags; o <code>:</code> após uma letra significa que ela <strong>exige um valor</strong>.</li>
            <li><code>{'${OPTARG}'}</code> contém o valor da flag atual (ex.: o nome do arquivo de <code>-o</code>).</li>
            <li><code>{'${OPTIND}'}</code> é o índice do próximo argumento; <code>shift $((OPTIND - 1))</code> descarta as flags já lidas, deixando só os argumentos posicionais.</li>
            <li>O caso <code>\?</code> captura flags inválidas e exibe a mensagem de uso.</li>
          </ul>
          <InfoBox className="mt-4" title="getopts vs $1 / $@ posicional">
            <p className="text-sm text-text-2">
              Use <code>$1</code>/<code>$@</code> posicional quando o script recebe argumentos
              fixos e obrigatórios numa ordem clara (ex.: <code>backup.sh origem destino</code>).
              Use <code>getopts</code> quando há flags opcionais, valores nomeados ou quando você
              quer que a ordem dos argumentos não importe — é a interface profissional, previsível
              e fácil de documentar com um <code>-h</code>.
            </p>
          </InfoBox>
        </section>

        <section id="bats">
          <h2 className="text-2xl font-bold mb-2">Testando Scripts com bats</h2>
          <p className="text-text-2 text-sm mb-4">
            Script de produção também merece teste automatizado. O <strong>bats</strong> (Bash
            Automated Testing System) deixa você escrever testes em bash: cada bloco{' '}
            <code>@test</code> roda o código com <code>run</code> e verifica o código de saída
            (<code>$status</code>) e a saída (<code>$output</code>). Assim você muda o script com
            confiança — se quebrar um comportamento, o teste acusa.
          </p>
          <CodeBlock code={BATS_EXEMPLO} lang="bash" title="exemplo.bats" />
          <InfoBox className="mt-4" title="Por que testar scripts">
            <p className="text-sm text-text-2">
              Um script de backup ou de firewall roda sem ninguém olhando. Um teste bats que
              valida &quot;arquivo gerado existe&quot; ou &quot;flag -h retorna código 0&quot;
              transforma o script numa peça confiável. Instale com{' '}
              <code>apt install bats</code> e rode com <code>bats exemplo.bats</code>.
            </p>
          </InfoBox>
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

      {/* ── Erros Comuns ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-warn">⚠️</span> Erros Comuns e Soluções
        </h2>
        {[
          {
            err: '-bash: ./script.sh: /bin/bash^M: bad interpreter',
            fix: 'Script criado no Windows tem line endings CRLF (\\r\\n) em vez de LF (\\n). Converter: dos2unix script.sh. Sem dos2unix: sed -i "s/\\r//" script.sh. Configurar o editor para salvar com LF: no VS Code, clicar "CRLF" na barra inferior e mudar para "LF".',
          },
          {
            err: '[: ==: unexpected operator — if com == falha no sh',
            fix: '== é sintaxe bash, não sh. Se o shebang for #!/bin/sh, usar = para comparação de strings. Ou mudar para #!/bin/bash que suporta ==. Verificar: ls -la /bin/sh (pode ser dash no Debian/Ubuntu, não bash).',
          },
          {
            err: 'Variável com espaço quebra o script — word splitting inesperado',
            fix: 'Sempre colocar variáveis entre aspas: "$VARIAVEL" em vez de $VARIAVEL. Especialmente para caminhos: cp "$ARQUIVO" "$DESTINO/". Usar shellcheck para detectar esses problemas: shellcheck script.sh (disponível via apt install shellcheck).',
          },
          {
            err: 'Script funciona manualmente mas falha com permissão negada no cron',
            fix: 'Caminhos relativos e variáveis de ambiente não funcionam no cron. Adicionar no início do script: cd "$(dirname "$0")" para garantir o diretório correto. Usar caminhos absolutos para todos os comandos e arquivos. Ver logs: grep CRON /var/log/syslog.',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </section>

      {/* ── Exercícios Guiados ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — Script de Monitoramento de Disco</p>
            <CodeBlock lang="bash" code={`cat > /usr/local/bin/monitora-disco.sh << 'EOF'
#!/bin/bash
LIMITE=80   # alerta quando uso >= 80%
EMAIL="admin@empresa.com"

while IFS= read -r linha; do
  USO=$(echo "$linha" | awk '{print $5}' | tr -d '%')
  MONTAGEM=$(echo "$linha" | awk '{print $6}')

  if [ "$USO" -ge "$LIMITE" ] 2>/dev/null; then
    MENSAGEM="ALERTA: $MONTAGEM está com $USO% de uso!"
    echo "[$(date)] $MENSAGEM"
    # mail -s "Disco cheio" "$EMAIL" <<< "$MENSAGEM"
  fi
done < <(df -h | tail -n +2)

echo "Verificação concluída: $(date)"
EOF

chmod +x /usr/local/bin/monitora-disco.sh
/usr/local/bin/monitora-disco.sh`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — Script de Verificação de Serviços</p>
            <CodeBlock lang="bash" code={`cat > /usr/local/bin/verifica-servicos.sh << 'EOF'
#!/bin/bash
SERVICOS=("ssh" "cron" "rsyslog")
ERROS=0

echo "=== Verificação de Serviços: $(date) ==="

for servico in "\${SERVICOS[@]}"; do
  if systemctl is-active --quiet "$servico"; then
    echo "✅ $servico: RODANDO"
  else
    echo "❌ $servico: PARADO"
    ERROS=$((ERROS + 1))

    # Tentar reiniciar automaticamente
    echo "   Tentando reiniciar $servico..."
    systemctl start "$servico" 2>&1 && echo "   ✅ Reiniciado com sucesso" \
                                     || echo "   ❌ Falha ao reiniciar"
  fi
done

echo "=== Total de problemas: $ERROS ==="
exit $ERROS
EOF

chmod +x /usr/local/bin/verifica-servicos.sh
/usr/local/bin/verifica-servicos.sh`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Funções, Arrays e Tratamento de Erros</p>
            <CodeBlock lang="bash" code={`cat > /tmp/script-avancado.sh << 'EOF'
#!/bin/bash
set -euo pipefail  # Sair em erro, variável não definida, pipe fail

# Função com retorno
verifica_porta() {
  local HOST="$1"
  local PORTA="$2"
  if nc -z -w3 "$HOST" "$PORTA" 2>/dev/null; then
    echo "✅ $HOST:$PORTA aberta"
    return 0
  else
    echo "❌ $HOST:$PORTA fechada ou inacessível"
    return 1
  fi
}

# Array de hosts para verificar
declare -A SERVICOS=(
  ["localhost:22"]="SSH"
  ["8.8.8.8:53"]="DNS Google"
  ["1.1.1.1:443"]="HTTPS Cloudflare"
)

echo "=== Verificação de Conectividade ==="
for endpoint in "\${!SERVICOS[@]}"; do
  HOST=$(echo "$endpoint" | cut -d: -f1)
  PORTA=$(echo "$endpoint" | cut -d: -f2)
  verifica_porta "$HOST" "$PORTA" || true
done
EOF

chmod +x /tmp/script-avancado.sh
bash /tmp/script-avancado.sh`} />
          </div>
        </div>
      </section>

      <ModuleNav currentPath="/shell-script" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
