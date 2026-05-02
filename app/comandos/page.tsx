'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'comandos-praticados', text: 'Executei ls, cd, cp, mv, rm e usei pipe para filtrar saídas no terminal' },
];

const NAVEGACAO = `# ── Navegação ────────────────────────────────────────────────────────
pwd                    # Print Working Directory — onde estou?
ls                     # Listar arquivos no diretório atual
ls -la                 # Listar com detalhes e arquivos ocultos
ls -lh /var/log        # Listar /var/log com tamanhos legíveis (K, M, G)
cd /etc/ssh            # Entrar em /etc/ssh
cd ..                  # Subir um nível
cd ~                   # Ir para home do usuário
cd -                   # Voltar ao diretório anterior`;

const ARQUIVOS = `# ── Criar, copiar, mover ─────────────────────────────────────────────
mkdir projetos              # Criar diretório
mkdir -p a/b/c              # Criar diretórios aninhados
touch arquivo.txt           # Criar arquivo vazio (ou atualizar timestamp)
cp arquivo.txt backup.txt   # Copiar arquivo
cp -r pasta/ pasta-backup/  # Copiar diretório recursivamente
mv arquivo.txt novo.txt     # Renomear
mv arquivo.txt /tmp/        # Mover para /tmp

# ── Deletar (cuidado!) ────────────────────────────────────────────────
rm arquivo.txt              # Remover arquivo
rm -r pasta/                # Remover diretório e conteúdo
rm -rf pasta/               # Forçar remoção sem confirmação ⚠️`;

const VER_CONTEUDO = `# ── Ver conteúdo de arquivos ─────────────────────────────────────────
cat /etc/hosts              # Exibir todo o arquivo
less /var/log/syslog        # Paginado — setas para navegar, q para sair
head -20 /var/log/syslog    # Primeiras 20 linhas
tail -20 /var/log/syslog    # Últimas 20 linhas
tail -f /var/log/syslog     # Seguir em tempo real (Ctrl+C para parar)`;

const BUSCA = `# ── Buscar no sistema ────────────────────────────────────────────────
grep "error" /var/log/syslog           # Buscar linhas com "error"
grep -r "PasswordAuthentication" /etc/ # Buscar recursivamente em /etc
grep -i "ssh" /etc/hosts               # Busca case-insensitive (-i)
find /etc -name "*.conf"               # Encontrar arquivos .conf
find /var/log -newer /etc/passwd       # Arquivos mais novos que passwd
which nginx                            # Onde está o executável nginx?`;

const PIPE = `# ── Pipe (|) — encadeamento de comandos ──────────────────────────────
# O pipe passa a saída de um comando para a entrada do próximo.

ls -la /etc | grep "ssh"            # Filtrar saída do ls
cat /var/log/syslog | grep "error" | tail -20  # Cadeia de 3 comandos
ps aux | grep "nginx"               # Ver processos do nginx
df -h | grep "/$"                   # Espaço livre na partição raiz

# wc -l conta linhas
ls /etc/*.conf | wc -l              # Quantos .conf em /etc?
grep -r "PermitRoot" /etc/ssh/ | wc -l  # Quantas linhas têm PermitRoot?`;

export default function ComandosPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/comandos');
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
        <span className="text-text-2">Comandos Essenciais</span>
      </div>

      <div className="section-label">Módulo 02 · Trilha Fundamentos</div>
      <h1 className="section-title">💻 Comandos Essenciais Linux</h1>
      <p className="section-sub">
        O terminal é o coração do Linux. Não é intimidador — é <strong>eficiente</strong>.
        Com uma dúzia de comandos você consegue navegar, criar, copiar, buscar e filtrar
        qualquer coisa no sistema. Todos os admins de sistema usam esses comandos todo dia.
      </p>

      <FluxoCard
        title="Os 5 grupos de comandos"
        steps={[
          { label: 'Navegar',  sub: 'pwd, ls, cd',          icon: <Terminal className="w-4 h-4" />, color: 'border-accent/50' },
          { label: 'Arquivos', sub: 'cp, mv, rm, mkdir',    icon: <span className="text-xs">📁</span>, color: 'border-info/50' },
          { label: 'Ver',      sub: 'cat, less, head, tail', icon: <span className="text-xs">👁️</span>, color: 'border-warn/50' },
          { label: 'Buscar',   sub: 'grep, find, which',    icon: <span className="text-xs">🔍</span>, color: 'border-ok/50' },
          { label: 'Pipe |',   sub: 'combinar comandos',    icon: <span className="text-xs">🔗</span>, color: 'border-layer-6/50' },
        ]}
      />

      <div className="space-y-14">

        {/* ── Navegação ── */}
        <section id="navegacao">
          <h2 className="text-2xl font-bold mb-2">Navegando no Sistema</h2>
          <p className="text-text-2 text-sm mb-4">
            No Windows você clica em pastas. No Linux você usa o terminal — mais rápido e scriptável.
          </p>
          <CodeBlock code={NAVEGACAO} lang="bash" title="Navegação básica" />
          <InfoBox className="mt-4" title="Atalho essencial">
            <p className="text-sm text-text-2">
              <strong>Tab</strong> = autocompletar. Pressione Tab depois de digitar as primeiras letras de um comando ou caminho.
              <strong> Ctrl+R</strong> = busca no histórico de comandos. <strong>↑ / ↓</strong> = navegar no histórico.
            </p>
          </InfoBox>
        </section>

        {/* ── Arquivos ── */}
        <section id="arquivos">
          <h2 className="text-2xl font-bold mb-2">Criar, Copiar e Mover</h2>
          <CodeBlock code={ARQUIVOS} lang="bash" title="Operações com arquivos" />
          <WarnBox className="mt-4" title="rm -rf é permanente">
            <p className="text-sm text-text-2">
              Não existe lixeira no terminal Linux. <code>rm -rf</code> deleta sem confirmação e sem volta.
              Sempre verifique o caminho antes. Use <code>ls</code> para confirmar o que está na pasta antes de deletar.
            </p>
          </WarnBox>
        </section>

        {/* ── Ver conteúdo ── */}
        <section id="conteudo">
          <h2 className="text-2xl font-bold mb-2">Visualizando Arquivos</h2>
          <p className="text-text-2 text-sm mb-4">
            Para logs e configurações, você vai usar esses comandos o tempo todo durante o curso de firewall.
          </p>
          <CodeBlock code={VER_CONTEUDO} lang="bash" title="Ler arquivos" />
        </section>

        {/* ── Busca ── */}
        <section id="busca">
          <h2 className="text-2xl font-bold mb-2">Buscar no Sistema</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>grep</code> é o comando mais usado para diagnosticar problemas. <code>find</code> localiza arquivos por nome, data ou tipo.
          </p>
          <CodeBlock code={BUSCA} lang="bash" title="grep e find" />
        </section>

        {/* ── Pipe ── */}
        <section id="pipe">
          <h2 className="text-2xl font-bold mb-2">O Operador Pipe <code>|</code></h2>
          <p className="text-text-2 text-sm mb-4">
            O pipe conecta a saída de um comando à entrada do próximo. É o que torna o Linux
            extremamente poderoso — você combina ferramentas simples para resolver problemas complexos.
          </p>
          <CodeBlock code={PIPE} lang="bash" title="Encadeamento com pipe" />
          <HighlightBox className="mt-4" title="Filosofia Unix">
            <p className="text-sm text-text-2">
              "Faça uma coisa e faça bem". Cada comando Linux é especialista em uma tarefa.
              O pipe é a cola que une essas ferramentas — você vai usar isso em scripts de firewall,
              análise de logs e automações ao longo do curso inteiro.
            </p>
          </HighlightBox>
        </section>

        {/* ── Exercícios ── */}
        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Explore os logs</p>
              <CodeBlock code={`tail -f /var/log/syslog &   # Monitorar logs em background\nsudo apt update            # Gerar atividade nos logs\n# Você deve ver linhas novas aparecerem\nkill %1                    # Parar o tail`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Contar processos</p>
              <CodeBlock code={`ps aux | wc -l             # Quantos processos rodando?\nps aux | grep nginx        # nginx está rodando?\nps aux | sort -k3 -rn | head -5  # Top 5 por CPU`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Criar sua área de testes</p>
              <CodeBlock code={`mkdir -p ~/lab/firewall\ntouch ~/lab/firewall/regras.txt\necho "# Minhas regras iptables" > ~/lab/firewall/regras.txt\ncat ~/lab/firewall/regras.txt`} lang="bash" />
            </div>
          </div>
        </section>

        {/* ── HighlightBox expansão futura ── */}
        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>Redirecionamento <code>{'>'}</code> e <code>{'>>'}</code> — salvar saída em arquivos</li>
            <li><code>awk</code> e <code>sed</code> — processamento avançado de texto</li>
            <li><code>xargs</code> — passar saída como argumentos</li>
            <li>Aliases e funções no <code>~/.bashrc</code></li>
            <li>Histórico avançado: <code>history | grep iptables</code></li>
          </ul>
        </HighlightBox>

        {/* ── Checkpoint ── */}
        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 02
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
                  <span className={cn("text-sm", checklist[item.id] && "line-through text-text-3")}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            {allDone && (
              <div className="mt-4 p-3 rounded-lg bg-ok/10 border border-ok/30 text-ok text-sm font-semibold text-center">
                ✅ Módulo 02 concluído! Próximo: Editores de Texto →
              </div>
            )}
          </div>
        </section>

      </div>

      <WindowsComparisonBox
        windowsLabel="Windows CMD / PowerShell"
        linuxLabel="Linux Bash / Shell"
        windowsCode={`# Equivalências de comandos essenciais
dir                   → ls -la
cd C:\\Users\\joao      → cd /home/joao
type arquivo.txt       → cat arquivo.txt
copy origem destino    → cp origem destino
move origem destino    → mv origem destino
del arquivo.txt        → rm arquivo.txt
mkdir pasta            → mkdir pasta
rmdir /s pasta         → rm -rf pasta
cls                    → clear
echo %VARIAVEL%        → echo $VARIAVEL
set VARIAVEL=valor     → export VARIAVEL=valor
where python           → which python
ipconfig               → ip a   (ou ifconfig)
ping host              → ping host
netstat -an            → ss -tuln
tasklist               → ps aux
taskkill /PID 1234     → kill 1234
findstr "texto" arq    → grep "texto" arq
find . /name *.txt     → find . -name "*.txt"
# PowerShell pipeline:
Get-Process | Where CPU -gt 10  → ps aux | awk '$3>10'`}
        linuxCode={`# Comandos Linux essenciais com exemplos
ls -la /etc            # listar diretório detalhado
cd /var/log            # navegar para diretório
cat /etc/hosts         # ler arquivo inteiro
cp -r origem/ destino/ # copiar diretório recursivo
mv config.conf config.bak  # renomear/mover
rm -rf /tmp/cache      # remover recursivo (CUIDADO!)
mkdir -p /opt/app/logs # criar hierarquia de dirs
clear                  # limpar terminal
echo $HOME             # valor de variável
export PATH="$PATH:/opt/bin"  # adicionar ao PATH
which nginx            # onde está o binário
ip a                   # interfaces de rede
ping -c 4 8.8.8.8      # testar conectividade (4 pings)
ss -tuln               # portas abertas e serviços
ps aux | grep nginx    # processos em execução
kill -9 PID            # matar processo forçado
grep "ERROR" /var/log/nginx/error.log  # filtrar logs
find /etc -name "*.conf" -type f   # buscar arquivos`}
      />

      {/* ── Erros Comuns ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-warn">⚠️</span> Erros Comuns e Soluções
        </h2>
        {[
          {
            err: 'bash: cd: /etc/ssh: Permission denied',
            fix: 'O diretório /etc/ssh é acessível apenas por root. Usar sudo: sudo ls /etc/ssh. Para navegar e ler arquivos: sudo -i (abrir shell root) ou sudo cat /etc/ssh/sshd_config.',
          },
          {
            err: 'rm: cannot remove: Is a directory',
            fix: 'rm simples não remove diretórios. Usar rm -r pasta/ para remover recursivamente. Se houver arquivos protegidos de escrita: rm -rf pasta/ (forçado). Cuidado com rm -rf em caminhos errados — não há desfazer no terminal Linux.',
          },
          {
            err: 'grep: /var/log/syslog: Permission denied',
            fix: 'Logs do sistema requerem root. Usar sudo: sudo grep "error" /var/log/syslog. Alternativa: adicionar o usuário ao grupo adm (grupo com leitura de logs): sudo usermod -aG adm $USER — requer novo login.',
          },
          {
            err: 'find: /proc: Permission denied (muitas linhas de erro)',
            fix: 'find em / inclui /proc e /sys que têm entradas protegidas. Suprimir erros com: find / -name "arquivo" 2>/dev/null. Usar caminhos específicos: find /etc -name "*.conf" em vez de varrer o sistema inteiro.',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </section>

      <ModuleNav currentPath="/comandos" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
