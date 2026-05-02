'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Package, Download, Search, Archive, Terminal, Shield, RefreshCw, Trash2, HardDrive, Code2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST_ITEMS = [
  { id: 'apt-atualizado',   label: 'Executei apt update + apt upgrade e entendi a diferença' },
  { id: 'pacote-instalado', label: 'Instalei e removi um pacote com apt install + apt purge + autoremove' },
  { id: 'repo-adicionado',  label: 'Explorei /etc/apt/sources.list e entendi a estrutura dos repositórios' },
];

export default function PacotesPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/pacotes');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-pacotes min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <div className="module-hero mb-10 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="section-label">Fundamentos Linux · Módulo F11</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
            <Package size={36} className="text-ok" />
            Instalação de Programas
          </h1>
          <p className="text-text-2 text-lg">
            <code className="font-mono text-accent">apt</code> ·{' '}
            <code className="font-mono text-accent">dpkg</code> ·{' '}
            <code className="font-mono text-accent">snap</code> ·{' '}
            <code className="font-mono text-accent">pip</code> — como o Linux gerencia software
          </p>
        </div>

        {/* ── FluxoCard ───────────────────────────────────────────────────────── */}
        <FluxoCard
          title="Fluxo: Instalação de Software no Linux"
          steps={[
            { label: 'apt update',   sub: 'atualiza lista de pacotes disponíveis', icon: <RefreshCw size={14} />, color: 'border-info/50' },
            { label: 'apt search',   sub: 'pesquisa o pacote certo',               icon: <Search size={14} />,    color: 'border-accent/50' },
            { label: 'apt install',  sub: 'baixa e instala com dependências',      icon: <Download size={14} />,  color: 'border-ok/50' },
            { label: 'dpkg -l',      sub: 'confirma instalação',                   icon: <Package size={14} />,   color: 'border-layer-3/50' },
            { label: 'apt remove',   sub: 'remove sem deixar lixo',                icon: <Trash2 size={14} />,    color: 'border-err/50' },
          ]}
        />

        {/* ── WindowsComparisonBox ─────────────────────────────────────────────── */}
        <div className="mt-8">
          {/* Manual render — WindowsComparisonBox não tem prop windowsLabel/linuxLabel genérico acessível, usar inline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-border my-6">
            <div className="bg-[rgba(0,120,212,0.06)] border-r border-border p-5">
              <p className="font-mono text-xs font-bold mb-3 text-[#0078d4] uppercase tracking-wider">
                Windows — Instalar Programas
              </p>
              <pre className="font-mono text-xs text-text-2 whitespace-pre-wrap leading-relaxed">{`Baixar .exe do site → clicar em instalar
Windows Store → clicar em 'Obter'
Adicionar/Remover Programas → desinstalar
Atualizar manualmente cada programa`}</pre>
            </div>
            <div className="bg-[rgba(52,211,153,0.05)] p-5">
              <p className="font-mono text-xs font-bold mb-3 text-ok uppercase tracking-wider">
                Linux — apt
              </p>
              <pre className="font-mono text-xs text-text-2 whitespace-pre-wrap leading-relaxed">{`apt install nginx         # instala
apt remove nginx          # remove
apt upgrade               # atualiza tudo
apt autoremove            # limpa dependências órfãs`}</pre>
            </div>
          </div>
        </div>

        {/* ── Seção 1 — Por que repositórios existem ───────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-ok" />
            Por que repositórios existem
          </h2>
          <InfoBox>
            <p>
              No Linux, você <strong>não</strong> baixa software como .exe aleatório da internet —
              tudo vem de <strong>repositórios oficiais assinados criptograficamente</strong> com GPG.
              O sistema verifica a assinatura antes de instalar qualquer pacote, o que elimina
              a classe inteira de ataques de "supply chain" por executáveis adulterados.
            </p>
            <p className="mt-2">
              <strong>apt</strong> (Advanced Package Tool) é o gerenciador de pacotes do
              Debian/Ubuntu. Ele resolve dependências automaticamente, baixa pacotes do
              repositório e garante que versões compatíveis sejam instaladas juntas.
            </p>
          </InfoBox>
        </section>

        {/* ── Seção 2 — Comandos apt essenciais ───────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Terminal size={20} className="text-ok" />
            Comandos apt essenciais
          </h2>
          <CodeBlock lang="bash" code={`# Atualizar lista de pacotes (fazer SEMPRE antes de instalar)
apt update

# Diferença entre upgrade e full-upgrade
apt upgrade           # atualiza pacotes — NUNCA remove nada
apt full-upgrade      # pode remover pacotes conflitantes (usar com cuidado em prod)

# Instalar e remover
apt install nginx
apt install nginx curl wget htop  # vários de uma vez
apt remove nginx                   # remove pacote (guarda configurações)
apt purge nginx                    # remove pacote + configurações
apt autoremove                     # remove dependências que ninguém mais usa

# Pesquisar
apt-cache search firewall          # busca por palavra-chave
apt-cache show nginx               # detalhes do pacote (versão, tamanho, deps)
apt list --installed               # lista tudo que está instalado
apt list --installed | grep nginx  # verifica se nginx está instalado`} />
          <WarnBox>
            <strong>apt upgrade em produção</strong> — nunca sem antes verificar o que vai mudar com:{' '}
            <code className="font-mono text-warn">apt list --upgradable</code>. Uma atualização
            inesperada pode mudar comportamento de serviços críticos.
          </WarnBox>
        </section>

        {/* ── Seção 3 — dpkg: instalador de baixo nível ───────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Archive size={20} className="text-ok" />
            dpkg — instalador de baixo nível
          </h2>
          <InfoBox>
            <code className="font-mono text-accent">dpkg</code> é a camada abaixo do apt — instala
            e remove arquivos <code className="font-mono">.deb</code> locais, mas{' '}
            <strong>não gerencia dependências automaticamente</strong>. Use para inspecionar pacotes
            instalados, descobrir qual pacote instalou um arquivo, ou instalar .deb baixados manualmente.
          </InfoBox>
          <CodeBlock lang="bash" code={`# Instalar .deb baixado manualmente
dpkg -i pacote_versao_amd64.deb

# Listar pacotes instalados
dpkg -l                    # todos
dpkg -l | grep nginx       # filtrar por nome
dpkg -l | grep "^ii"       # só os instalados corretamente

# Descobrir qual pacote instalou um arquivo
dpkg -S /usr/sbin/nginx

# Remover
dpkg -r nome-do-pacote     # remove (guarda configs)
dpkg --purge nome           # remove tudo`} />
        </section>

        {/* ── Seção 4 — Repositórios ───────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HardDrive size={20} className="text-ok" />
            Repositórios — /etc/apt/sources.list
          </h2>
          <p className="text-text-2 mb-4">
            O apt sabe onde baixar pacotes porque lê a lista de repositórios em{' '}
            <code className="font-mono text-accent">/etc/apt/sources.list</code> e os arquivos
            em <code className="font-mono text-accent">/etc/apt/sources.list.d/</code>.
          </p>
          <CodeBlock lang="bash" code={`# Ver repositórios ativos
cat /etc/apt/sources.list
ls /etc/apt/sources.list.d/

# Anatomia de uma linha de repositório:
# deb http://br.archive.ubuntu.com/ubuntu noble main restricted
# ^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^  ^^^^
# tipo        URL do repositório          dist   componentes

# Adicionar PPA (Ubuntu)
add-apt-repository ppa:deadsnakes/ppa
apt update

# Adicionar repositório de terceiros (ex: Docker)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu noble stable" > /etc/apt/sources.list.d/docker.list
apt update`} />
          <WarnBox>
            Adicionar PPAs de fontes desconhecidas é um <strong>vetor de ataque</strong>. Um repositório
            malicioso pode injetar pacotes comprometidos no seu sistema. Use apenas repositórios
            oficiais ou muito bem documentados com reputação estabelecida.
          </WarnBox>
        </section>

        {/* ── Seção 5 — snap ───────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package size={20} className="text-ok" />
            snap — pacotes sandboxed
          </h2>
          <InfoBox>
            <strong>snap</strong> = pacotes isolados em sandbox com auto-update automático.
            Vantagem: independente da distribuição e versão do Ubuntu — você obtém sempre a
            versão mais recente. Desvantagem: mais pesado, inicia mais lento e ocupa mais
            espaço em disco que equivalentes via apt.
          </InfoBox>
          <CodeBlock lang="bash" code={`snap install code --classic     # VSCode via snap
snap list                       # snaps instalados
snap info nome                  # detalhes
snap remove code                # remove

# Quando usar snap vs apt:
# apt → pacotes do sistema, ferramentas CLI, servidores
# snap → apps desktop, versões mais recentes que o repositório oficial`} />
        </section>

        {/* ── Seção 6 — pip/pip3 ───────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code2 size={20} className="text-ok" />
            pip3 — pacotes Python
          </h2>
          <CodeBlock lang="bash" code={`# pip3 — pacotes Python
pip3 install requests          # instala
pip3 install -r requirements.txt  # instala lista de deps
pip3 list                      # lista instalados
pip3 show requests             # detalhes do pacote

# MELHOR PRÁTICA: ambiente virtual (não poluir o sistema)
python3 -m venv .venv          # cria ambiente virtual
source .venv/bin/activate      # ativa (bash/zsh)
pip3 install requests          # instala só neste ambiente
deactivate                     # sai do ambiente`} />
          <InfoBox>
            Em produção, <strong>sempre use venv</strong>. Instalar pip3 packages globalmente
            com <code className="font-mono">sudo</code> pode sobrescrever bibliotecas do sistema
            e quebrar ferramentas do Ubuntu que dependem de versões específicas do Python.
          </InfoBox>
        </section>

        {/* ── Seção 7 — Exercícios Guiados ─────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Terminal size={20} className="text-ok" />
            Exercícios Guiados
          </h2>

          {/* Exercício 1 */}
          <div className="bg-bg-2 border border-border rounded-lg p-6 mb-6">
            <h3 className="font-bold text-base mb-1 text-ok">Exercício 1 — Auditoria de pacotes instalados</h3>
            <p className="text-text-3 text-sm mb-4">
              Inspecione o estado atual dos pacotes no seu sistema.
            </p>
            <CodeBlock lang="bash" code={`# 1. Quantos pacotes estão instalados?
dpkg -l | grep "^ii" | wc -l

# 2. Quando o nginx foi instalado?
dpkg -l nginx

# 3. Qual arquivo pertence ao pacote openssh-server?
dpkg -S /usr/sbin/sshd`} />
          </div>

          {/* Exercício 2 */}
          <div className="bg-bg-2 border border-border rounded-lg p-6 mb-6">
            <h3 className="font-bold text-base mb-1 text-ok">Exercício 2 — Instalar e limpar corretamente</h3>
            <p className="text-text-3 text-sm mb-4">
              Pratique o ciclo completo de instalação e remoção limpa.
            </p>
            <CodeBlock lang="bash" code={`# 1. Instalar htop (monitor interativo)
apt install htop

# 2. Verificar instalação
dpkg -l htop

# 3. Remover sem deixar configs
apt purge htop

# 4. Limpar dependências órfãs
apt autoremove`} />
          </div>

          {/* Exercício 3 */}
          <div className="bg-bg-2 border border-border rounded-lg p-6 mb-6">
            <h3 className="font-bold text-base mb-1 text-ok">Exercício 3 — Adicionar repositório do Nginx oficial</h3>
            <p className="text-text-3 text-sm mb-4">
              Adicione o repositório oficial do Nginx para obter versões mais recentes.
            </p>
            <CodeBlock lang="bash" code={`# Chave GPG oficial do Nginx
curl -fsSL https://nginx.org/keys/nginx_signing.key | gpg --dearmor -o /etc/apt/keyrings/nginx.gpg

# Adicionar repositório
echo "deb [signed-by=/etc/apt/keyrings/nginx.gpg] http://nginx.org/packages/ubuntu noble nginx" > /etc/apt/sources.list.d/nginx.list

# Atualizar e verificar
apt update
apt-cache show nginx | grep Version`} />
          </div>
        </section>

        {/* ── Checkpoints ──────────────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={20} className="text-ok" />
            Checkpoints do Lab
          </h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => {
              const done = !!checklist[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => updateChecklist(item.id, !done)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all',
                    done
                      ? 'bg-ok/5 border-ok/30 text-text'
                      : 'bg-bg-2 border-border hover:border-ok/40 text-text-2',
                  )}
                >
                  {done
                    ? <CheckCircle2 size={18} className="text-ok mt-0.5 shrink-0" />
                    : <Circle size={18} className="text-text-3 mt-0.5 shrink-0" />}
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Próximo módulo ────────────────────────────────────────────────────── */}
        <div className="mt-12 p-6 bg-bg-2 border border-border rounded-lg">
          <p className="text-sm text-text-3 mb-1">Você concluiu o Módulo F11</p>
          <h3 className="font-bold text-lg mb-2">Trilha Fundamentos Linux completa!</h3>
          <p className="text-text-2 text-sm mb-4">
            Parabéns! Você dominou os fundamentos essenciais do Linux — do sistema de arquivos
            até a gestão de pacotes. Agora você está pronto para avançar para os módulos de
            segurança e firewall do curso principal.
          </p>
          <Link href="/fundamentos" className="btn-outline text-sm">
            Ver Trilha Fundamentos
          </Link>
        </div>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'E: Unable to locate package nome-do-pacote',
              fix: 'Índice desatualizado ou pacote em repositório não-padrão. Executar apt update primeiro. Se persistir: verificar se o pacote existe (apt-cache search nome), adicionar o repositório correto e rodar apt update novamente.',
            },
            {
              err: 'dpkg: error processing package — dependency problems',
              fix: 'Dependências quebradas. Corrigir automaticamente: apt --fix-broken install. Se persistir: apt install -f ou dpkg --configure -a. Nunca usar dpkg -i em pacotes com dependências complexas sem apt install ./pacote.deb.',
            },
            {
              err: 'apt-get upgrade travar em "waiting for cache lock: Could not get lock /var/lib/dpkg/lock"',
              fix: 'Outro processo apt está rodando (atualizações automáticas, snap). Aguardar finalizar. Ver processo: ps aux | grep apt. Se o processo travou: rm /var/lib/apt/lists/lock /var/lib/dpkg/lock* e rodar dpkg --configure -a.',
            },
            {
              err: 'pip install falha com "externally-managed-environment"',
              fix: 'Python 3.11+ no Debian/Ubuntu bloqueia pip global por padrão. Soluções em ordem de segurança: (1) usar apt install python3-pacote; (2) criar venv: python3 -m venv .venv && source .venv/bin/activate; (3) último recurso: pip install --break-system-packages (não recomendado em produção).',
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
              <p className="font-bold text-sm mb-2">Lab 1 — Gerenciar Pacotes com apt</p>
              <CodeBlock lang="bash" code={`# Atualizar índice de repositórios
apt update

# Ver pacotes atualizáveis
apt list --upgradable 2>/dev/null | head -15

# Buscar pacote antes de instalar
apt-cache search network scanner
apt-cache show nmap | head -20

# Instalar nmap e verificar versão
apt install nmap -y
nmap --version

# Ver dependências do pacote
apt-cache depends nmap

# Ver que arquivos o pacote instalou
dpkg -L nmap

# Remover pacote mantendo configurações
apt remove nmap -y

# Remover pacote e configurações
apt purge nmap -y
apt autoremove -y`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Adicionar Repositório de Terceiros (GPG)</p>
              <CodeBlock lang="bash" code={`# Exemplo: adicionar repositório do Grafana
# 1. Baixar e instalar a chave GPG
wget -q -O - https://packages.grafana.com/gpg.key | \
  gpg --dearmor | tee /etc/apt/keyrings/grafana.gpg > /dev/null

# 2. Adicionar o repositório
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] \
  https://packages.grafana.com/oss/deb stable main" | \
  tee /etc/apt/sources.list.d/grafana.list

# 3. Atualizar e verificar
apt update
apt-cache show grafana | grep -E "Version|Description"

# Ver todos os repositórios configurados
cat /etc/apt/sources.list
ls /etc/apt/sources.list.d/

# Remover repositório de teste
rm /etc/apt/sources.list.d/grafana.list
rm /etc/apt/keyrings/grafana.gpg
apt update`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — dpkg e Pacotes .deb Locais</p>
              <CodeBlock lang="bash" code={`# Listar todos os pacotes instalados
dpkg -l | head -20
dpkg -l | wc -l  # total de pacotes

# Buscar pacote por nome
dpkg -l | grep nginx
dpkg -l | grep -E "^ii.*python3"  # ii = instalado

# Ver arquivos de um pacote instalado
dpkg -L bash | head -20

# Descobrir qual pacote instalou um arquivo
dpkg -S /usr/bin/ssh
dpkg -S /bin/ls

# Ver arquivos de configuração que foram modificados
dpkg -l | grep "^rc"  # rc = removido mas config restante

# Baixar .deb sem instalar (para instalar offline depois)
apt download htop
ls -la htop_*.deb
dpkg -i htop_*.deb
rm htop_*.deb`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/pacotes" order={FUNDAMENTOS_ORDER} />
      </div>
    </main>
  );
}
