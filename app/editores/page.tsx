'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'editores-usados', text: 'Editei um arquivo com nano e entrei/saí do VIM corretamente' },
];

const NANO_BASICS = `# ── nano — Simples e direto ──────────────────────────────────────────
# Abrir arquivo (cria se não existir)
nano /tmp/meu-teste.conf

# Dentro do nano:
# Digite normalmente — não tem "modos"
# Ctrl+O   → Salvar (O = write Out)
# Ctrl+X   → Sair (pergunta se quer salvar se houver mudanças)
# Ctrl+K   → Recortar linha
# Ctrl+U   → Colar linha
# Ctrl+W   → Buscar no arquivo
# Ctrl+G   → Ajuda`;

const VIM_BASICS = `# ── vim — 3 modos essenciais ─────────────────────────────────────────
vim /tmp/meu-teste.conf

# MODO NORMAL (padrão ao abrir) — navegação e comandos
# h j k l     → ← ↓ ↑ → (mover cursor)
# gg          → ir para o início do arquivo
# G           → ir para o fim do arquivo
# /palavra    → buscar "palavra" no arquivo
# n           → próximo resultado da busca

# Entrar em MODO INSERT (edição)
i             # Inserir antes do cursor
a             # Inserir depois do cursor (append)
o             # Nova linha abaixo e entrar em insert

# Voltar ao MODO NORMAL
# Esc          → sempre volta ao modo normal

# MODO COMMAND (com :) — a partir do modo normal
:w            # Salvar
:q            # Sair (erro se há mudanças não salvas)
:wq           # Salvar e sair
:q!           # Sair SEM salvar (forçar saída)
:wq!          # Salvar e sair forçando`;

const VIM_PRODUTIVO = `# ── VIM mais produtivo ───────────────────────────────────────────────
# Deletar
dd            # Deletar linha inteira
3dd           # Deletar 3 linhas
dw            # Deletar palavra
D             # Deletar do cursor até fim da linha

# Copiar e colar (no VIM se chama yank)
yy            # Copiar linha (yank yank)
p             # Colar depois do cursor
P             # Colar antes do cursor

# Desfazer e refazer
u             # Undo (desfazer)
Ctrl+r        # Redo (refazer)

# Substituição global
:%s/velho/novo/g    # Substituir "velho" por "novo" em todo arquivo
:%s/velho/novo/gc   # Com confirmação em cada ocorrência`;

const EDITAR_CONFIG = `# ── Editar configuração do SSH com nano ──────────────────────────────
sudo nano /etc/ssh/sshd_config

# Dicas dentro do nano:
# Ctrl+W → buscar "PasswordAuthentication"
# Altere para: PasswordAuthentication no
# Ctrl+O → salvar
# Ctrl+X → sair

# Verificar se ficou correto
grep "PasswordAuthentication" /etc/ssh/sshd_config

# ── Mesmo arquivo com vim ──────────────────────────────────────────────
sudo vim /etc/ssh/sshd_config
# Esc para garantir modo normal
# /Password → buscar
# i → entrar em insert
# editar a linha
# Esc → modo normal
# :wq → salvar e sair`;

export default function EditoresPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/editores');
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
        <span className="text-text-2">Editores de Texto</span>
      </div>

      <div className="section-label">Módulo 03 · Trilha Fundamentos</div>
      <h1 className="section-title">📝 Editores de Texto</h1>
      <p className="section-sub">
        Para configurar qualquer serviço Linux você precisa editar arquivos de configuração.
        Existem dois editores que todo sysadmin conhece: <strong>nano</strong> (direto ao ponto)
        e <strong>VIM</strong> (poderoso, mas com curva de aprendizado). Use nano enquanto aprende,
        migre para VIM quando quiser ser mais produtivo em produção.
      </p>

      <FluxoCard
        title="nano vs VIM — quando usar cada um"
        steps={[
          { label: 'nano',          sub: 'Edição rápida · Ctrl+O salva · fácil', icon: <span className="text-xs">📝</span>, color: 'border-ok/50' },
          { label: 'VIM — Normal',  sub: 'Modo de navegação (padrão)',            icon: <span className="text-xs">🔷</span>, color: 'border-info/50' },
          { label: 'VIM — Insert',  sub: 'Pressione i para editar',               icon: <span className="text-xs">✏️</span>, color: 'border-accent/50' },
          { label: 'VIM — Command', sub: ':wq para salvar e sair',                icon: <span className="text-xs">💾</span>, color: 'border-warn/50' },
        ]}
      />

      <div className="space-y-14">

        {/* ── nano ── */}
        <section id="nano">
          <h2 className="text-2xl font-bold mb-2">nano — Sem Mistério</h2>
          <p className="text-text-2 text-sm mb-4">
            Funciona como um editor de texto normal. Os atalhos ficam na parte inferior da tela.
            Ideal para edições rápidas de configurações.
          </p>
          <CodeBlock code={NANO_BASICS} lang="bash" title="nano — comandos essenciais" />
          <InfoBox className="mt-4" title="Instalar nano">
            <p className="text-sm text-text-2">
              No Ubuntu Server, nano já vem instalado. Se precisar: <code>sudo apt install nano -y</code>
            </p>
          </InfoBox>
        </section>

        {/* ── VIM ── */}
        <section id="vim">
          <h2 className="text-2xl font-bold mb-2">VIM — O Editor dos SysAdmins</h2>
          <p className="text-text-2 text-sm mb-4">
            VIM tem <strong>modos</strong>: você começa no modo Normal (navegação) e entra no modo Insert para editar.
            A confusão de iniciantes é tentar digitar em modo Normal. Lembre: <strong>Esc sempre volta ao modo Normal</strong>.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { mode: 'NORMAL', desc: 'Navegação, copiar, deletar, buscar. Modo padrão ao abrir.', color: 'border-info/50 bg-info/5', badge: 'text-info' },
              { mode: 'INSERT', desc: 'Digitação normal. Entre com i, a ou o. Saia com Esc.', color: 'border-accent/50 bg-accent/5', badge: 'text-accent' },
              { mode: 'COMMAND', desc: 'Comandos com :. Digite : no modo Normal. Ex: :wq', color: 'border-warn/50 bg-warn/5', badge: 'text-warn' },
            ].map(m => (
              <div key={m.mode} className={`p-4 rounded-xl border ${m.color}`}>
                <span className={`font-mono font-bold text-xs ${m.badge}`}>{m.mode}</span>
                <p className="text-xs text-text-2 mt-2">{m.desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={VIM_BASICS} lang="bash" title="VIM — os 3 modos" />
        </section>

        {/* ── VIM produtivo ── */}
        <section id="vim-produtivo">
          <h2 className="text-2xl font-bold mb-2">VIM Mais Produtivo</h2>
          <p className="text-text-2 text-sm mb-4">
            Após dominar os modos, esses atalhos vão acelerar sua edição em servidores reais.
          </p>
          <CodeBlock code={VIM_PRODUTIVO} lang="bash" title="VIM — atalhos avançados" />
        </section>

        {/* ── Caso Real ── */}
        <section id="caso-real">
          <h2 className="text-2xl font-bold mb-2">Caso Real — Editando Configurações SSH</h2>
          <p className="text-text-2 text-sm mb-4">
            É exatamente isso que você vai fazer nos módulos de Hardening e Instalação do firewall.
          </p>
          <CodeBlock code={EDITAR_CONFIG} lang="bash" title="Editar sshd_config" />
          <WarnBox className="mt-4" title="Sempre valide antes de reiniciar">
            <p className="text-sm text-text-2">
              Depois de editar qualquer config de serviço, verifique a sintaxe antes de reiniciar:
              <code> sshd -T</code> para SSH, <code>nginx -t</code> para Nginx, <code>named-checkconf</code> para BIND9.
              Um arquivo malformado pode derrubar o acesso ao servidor.
            </p>
          </WarnBox>
        </section>

        {/* ── Como sair do VIM ── */}
        <section id="sair-vim">
          <div className="p-6 rounded-xl bg-[rgba(251,191,36,0.08)] border border-warn/30">
            <h3 className="font-bold text-lg mb-3">😅 Como sair do VIM (a pergunta mais famosa do Linux)</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { cmd: 'Esc + :wq',  desc: 'Salvar e sair', color: 'text-ok' },
                { cmd: 'Esc + :q!',  desc: 'Sair sem salvar (forçar)', color: 'text-err' },
                { cmd: 'Esc + :w',   desc: 'Apenas salvar', color: 'text-info' },
                { cmd: 'Esc + :q',   desc: 'Sair (se não houver mudanças)', color: 'text-text-2' },
              ].map(item => (
                <div key={item.cmd} className="flex items-center gap-3">
                  <code className={`font-mono font-bold text-sm ${item.color}`}>{item.cmd}</code>
                  <span className="text-xs text-text-3">→ {item.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-3 mt-3">
              Sempre pressione <strong>Esc</strong> primeiro para garantir que está no modo Normal antes de digitar <code>:</code>.
            </p>
          </div>
        </section>

        {/* ── Exercícios ── */}
        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Edite com nano</p>
              <CodeBlock code={`nano /tmp/nano-teste.conf\n# Digite algumas linhas de texto\n# Ctrl+O para salvar\n# Ctrl+X para sair\ncat /tmp/nano-teste.conf  # Confirmar conteúdo`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Entre e saia do VIM</p>
              <CodeBlock code={`vim /tmp/vim-teste.conf\n# Pressione i para entrar em insert\n# Digite: # configuracao de teste\n# Pressione Esc\n# Digite :wq e Enter\ncat /tmp/vim-teste.conf  # Confirmar`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Substituição com VIM</p>
              <CodeBlock code={`vim /tmp/vim-teste.conf\n# No modo normal, digite:\n# :%s/teste/producao/g\n# Isso substitui "teste" por "producao" em todo o arquivo\n# :wq para salvar\ncat /tmp/vim-teste.conf`} lang="bash" />
            </div>
          </div>
        </section>

        {/* ── HighlightBox expansão futura ── */}
        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>Configurando o VIM com <code>~/.vimrc</code> — syntax highlight, numeração de linhas</li>
            <li>Neovim — o fork moderno do VIM com plugins LSP</li>
            <li><code>sed -i</code> — editar arquivos diretamente da linha de comando (sem abrir editor)</li>
            <li>Visual mode no VIM — selecionar blocos de texto para copiar/deletar</li>
          </ul>
        </HighlightBox>

        {/* ── Checkpoint ── */}
        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 03
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
                ✅ Módulo 03 concluído! Próximo: Gerenciamento de Processos →
              </div>
            )}
          </div>
        </section>

      </div>

      <WindowsComparisonBox
        windowsLabel="Windows — Notepad / VSCode"
        linuxLabel="Linux — nano / vim / micro"
        windowsCode={`# Windows — editar arquivos no terminal

# Notepad via cmd (abre janela gráfica):
notepad C:\\Windows\\System32\\drivers\\etc\\hosts

# PowerShell — editar texto inline (sem GUI):
# Get-Content mostra o arquivo:
Get-Content C:\\ProgramData\\arquivo.conf

# Set-Content substitui todo o conteúdo:
Set-Content arquivo.txt "nova linha"

# Add-Content adiciona ao final:
Add-Content log.txt "$(Get-Date): evento"

# Substituição de texto (equivalente ao sed -i):
(Get-Content arquivo.conf) -replace "old","new" |
  Set-Content arquivo.conf

# VSCode no terminal:
code arquivo.conf        # abre com interface gráfica
code --wait arquivo.conf # aguarda fechar antes de continuar

# Equivalente ao vim no Windows:
# winget install Git.Git → instala vim junto
# vim arquivo.conf → funciona no Git Bash`}
        linuxCode={`# Linux — editores de texto no terminal

# nano — fácil, mostra atalhos na tela:
nano /etc/hosts
# Ctrl+O = salvar, Ctrl+X = sair
# Ctrl+K = cortar linha, Ctrl+U = colar
# Ctrl+W = buscar texto

# micro — moderno, atalhos estilo Windows:
apt install micro -y
micro /etc/nginx/nginx.conf
# Ctrl+S = salvar, Ctrl+Q = sair
# Ctrl+F = buscar, Ctrl+Z = desfazer

# vim — o editor universal (disponível em todo Linux):
vim /etc/ssh/sshd_config
# i = entrar no modo INSERT (editar)
# Esc = voltar ao modo NORMAL
# :w = salvar
# :q = sair (só funciona no modo NORMAL)
# :wq = salvar e sair
# :q! = sair sem salvar
# /texto = buscar; n = próximo

# Edição one-liner (sem abrir editor):
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' \\
  /etc/ssh/sshd_config`}
      />

      <ModuleNav currentPath="/editores" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
