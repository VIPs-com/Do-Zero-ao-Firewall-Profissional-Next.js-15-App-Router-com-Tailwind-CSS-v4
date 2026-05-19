'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { FolderGit2, FilePlus2, GitCommitHorizontal, Database, GitBranch, GitMerge, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint GIT — Git: Controle de Versão.
   Fundamentos, branches & merge e fluxo colaborativo. Alinhado à prática
   profissional de desenvolvimento e operação de infraestrutura. */

type GitTab = 'commits' | 'branches' | 'fluxo';

const CHECKLIST_ITEMS = [
  { id: 'git-branch', label: 'Criei branches com git branch / git switch e aprendi a alternar entre eles sem perder trabalho' },
  { id: 'git-merge',  label: 'Fiz um merge de branch e resolvi um conflito de merge à mão, removendo os marcadores' },
  { id: 'git-fluxo',  label: 'Conectei um repositório remoto, fiz push/pull e entendi Pull Requests e Conventional Commits' },
];

export default function GitPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<GitTab>('commits');

  useEffect(() => {
    trackPageVisit('/git');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-git min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Git — Controle de Versão</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Carreira & Ferramentas</div>
          <h1 className="text-4xl font-bold mb-4">🔀 Git — Controle de Versão</h1>
          <p className="text-text-2 text-lg mb-6">
            Versionar código, configuração e infraestrutura é uma <strong>competência base</strong>
            de qualquer profissional de TI. O <strong>Git</strong> guarda o histórico completo de
            um projeto, permite experimentar sem medo em <strong>branches</strong> e é a espinha
            dorsal da colaboração em equipe. Aqui você sai do zero: commits, branches, merge,
            conflitos e o fluxo colaborativo com GitHub/GitLab.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado à prática profissional de desenvolvimento e operação de infraestrutura.
          </p>
        </div>

        <FluxoCard
          title="Os três estados de um arquivo no Git"
          steps={[
            { label: 'Working dir',  sub: 'você edita os arquivos no disco',         icon: <FilePlus2 size={14}/>,           color: 'border-info/50' },
            { label: 'git add',      sub: 'seleciona o que entra no commit',          icon: <GitCommitHorizontal size={14}/>, color: 'border-warn/50' },
            { label: 'Staging area', sub: 'a "foto" preparada para o commit',         icon: <FolderGit2 size={14}/>,          color: 'border-accent/50' },
            { label: 'git commit',   sub: 'grava a foto no histórico, com mensagem',  icon: <GitCommitHorizontal size={14}/>, color: 'border-ok/50' },
            { label: 'Repositório',  sub: 'histórico permanente e imutável',          icon: <Database size={14}/>,            color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'commits',  label: '🔀 Fundamentos & Commits' },
              { id: 'branches', label: '🌿 Branches & Merge' },
              { id: 'fluxo',    label: '🚀 Fluxo Colaborativo' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as GitTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive(tab.id)
                    ? 'border-[var(--mod)] text-[var(--mod)]'
                    : 'border-transparent text-text-2 hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB 1 ── */}
        {isActive('commits') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. O que é controle de versão</h2>
          <p className="text-text-2 mb-4">
            Um <strong>sistema de controle de versão</strong> (VCS) registra cada mudança feita
            num conjunto de arquivos ao longo do tempo. Em vez de pastas como
            <code> projeto_final</code>, <code>projeto_final_v2</code>,
            <code> projeto_final_AGORA_VAI</code>, você tem <em>um</em> diretório com um
            histórico navegável: quem mudou o quê, quando e por quê.
          </p>
          <p className="text-text-2 mb-4">
            O Git é <strong>distribuído</strong>: cada cópia do repositório (clone) contém o
            histórico <em>inteiro</em>, não apenas a versão atual. Não há um servidor central
            obrigatório — você pode commitar, criar branches e ver todo o histórico
            <strong> offline</strong>. O GitHub/GitLab são apenas um clone privilegiado que a
            equipe combina usar como ponto de encontro.
          </p>
          <InfoBox title="Por que todo profissional de TI precisa de Git">
            Git não é só para programadores. Arquivos de configuração (<code>nginx.conf</code>,
            playbooks Ansible, manifestos Kubernetes, Terraform), documentação e scripts vivem
            em Git. É a base do <strong>GitOps</strong> e da Infraestrutura como Código — versionar
            sua infra dá histórico, revisão por pares e a capacidade de voltar atrás.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Configuração inicial e primeiro repositório</h2>
          <p className="text-text-2 mb-4">
            Antes do primeiro commit, diga ao Git quem é você — essa identidade fica gravada em
            cada commit. Depois, crie um repositório do zero com <code>git init</code> ou copie
            um existente com <code>git clone</code>.
          </p>
          <CodeBlock lang="bash" code={`# Identidade — gravada em todos os commits (faça só uma vez por máquina)
git config --global user.name  "Aluno Lab"
git config --global user.email "aluno@git-lab.local"
git config --global init.defaultBranch main   # nome do branch inicial

# Conferir a configuração atual
git config --list

# CAMINHO A — criar um repositório novo a partir de uma pasta
mkdir meu-projeto && cd meu-projeto
git init                          # cria o subdiretório oculto .git/

# CAMINHO B — clonar um repositório que já existe
git clone https://github.com/usuario/projeto.git`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Os três estados: add, commit, status</h2>
          <p className="text-text-2 mb-4">
            Esta é a ideia central do Git. Um arquivo passa por três áreas: o
            <strong> working directory</strong> (onde você edita), a <strong>staging area</strong>
            (onde você prepara o que vai no próximo commit) e o <strong>repositório</strong>
            (o histórico gravado). O <code>git add</code> move da primeira para a segunda; o
            <code> git commit</code> da segunda para a terceira.
          </p>
          <CodeBlock lang="bash" code={`# Ver o estado atual: o que mudou, o que está em staging
git status

# Selecionar arquivos para o próximo commit (staging)
git add arquivo.txt          # um arquivo específico
git add .                    # tudo no diretório atual

# Gravar o commit com uma mensagem clara
git commit -m "Adiciona configuração inicial do servidor"

# Ver o histórico de commits
git log                      # detalhado
git log --oneline --graph    # resumido, com o desenho dos branches

# Ver exatamente o que mudou
git diff                     # mudanças ainda NÃO adicionadas (working dir)
git diff --staged            # mudanças JÁ em staging, prontas para o commit`} />
          <InfoBox title="Por que a staging area existe" className="mt-4">
            A staging area deixa você montar um commit <em>coeso</em>. Mexeu em cinco arquivos mas
            só dois pertencem à mesma mudança lógica? Adicione só esses dois e faça o commit; os
            outros três viram um segundo commit. Commits pequenos e focados são mais fáceis de
            revisar, entender no <code>git log</code> e reverter.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. .gitignore — o que NÃO versionar</h2>
          <p className="text-text-2 mb-4">
            Nem tudo deve entrar no histórico: senhas, arquivos gerados, dependências baixadas e
            artefatos de build poluem o repositório — e segredos vazados ali ficam
            <strong> para sempre</strong>. O arquivo <code>.gitignore</code> lista padrões que o
            Git deve ignorar.
          </p>
          <CodeBlock lang="text" title=".gitignore" code={`# Segredos e variáveis de ambiente — NUNCA versionar
.env
.env.local
*.key
*.pem
credentials.json

# Dependências e artefatos gerados
node_modules/
__pycache__/
dist/
build/

# Logs e arquivos temporários
*.log
*.tmp`} />
          <WarnBox title="Crie o .gitignore ANTES do primeiro commit" className="mt-4">
            O <code>.gitignore</code> só impede que arquivos <em>novos</em> entrem. Se você já
            commitou um <code>.env</code>, adicioná-lo ao <code>.gitignore</code> depois não o
            remove do histórico — ele continua acessível em commits antigos. Pense no
            <code> .gitignore</code> como a primeira coisa a criar num projeto.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Desfazendo: restore, revert e reset</h2>
          <p className="text-text-2 mb-4">
            Errar faz parte — e o Git tem três ferramentas para desfazer, cada uma para uma
            situação diferente. Confundi-las é fonte de muita dor, então preste atenção:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong><code>git restore</code></strong> — descarta mudanças <em>ainda não commitadas</em> no working directory, ou tira um arquivo da staging area. Não toca no histórico. É o mais seguro.</li>
            <li><strong><code>git revert</code></strong> — cria um <em>novo</em> commit que desfaz as mudanças de um commit anterior. O histórico original é preservado. É o jeito seguro de desfazer algo que já foi compartilhado.</li>
            <li><strong><code>git reset</code></strong> — move o branch para um commit anterior, <em>apagando</em> commits do histórico local. Poderoso e destrutivo: com <code>--hard</code> você perde também as mudanças no working directory.</li>
          </ul>
          <CodeBlock lang="bash" code={`# git restore — descartar mudanças locais (NÃO commitadas)
git restore arquivo.txt          # devolve o arquivo ao último commit
git restore --staged arquivo.txt # tira da staging, mantém a edição

# git revert — desfazer um commit JÁ publicado, com segurança
git revert <hash-do-commit>      # cria um commit "anti-mudança"

# git reset — reescrever o histórico LOCAL (cuidado)
git reset --soft HEAD~1          # desfaz o último commit, mantém em staging
git reset --mixed HEAD~1         # desfaz o commit e o staging (padrão)
git reset --hard HEAD~1          # desfaz commit + staging + working dir`} />
          <WarnBox title="revert para o que é público, reset só para o que é local" className="mt-4">
            Regra de ouro: se o commit <strong>já foi enviado</strong> para um repositório
            compartilhado, use <code>git revert</code> — ele desfaz sem reescrever o que os
            colegas já têm. Use <code>git reset</code> apenas em commits que ainda estão
            <strong> só na sua máquina</strong>. E <code>reset --hard</code> apaga trabalho não
            commitado sem rede de segurança — confira o <code>git status</code> antes.
          </WarnBox>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('branches') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. O que é um branch — e por que ramificar</h2>
          <p className="text-text-2 mb-4">
            Um <strong>branch</strong> é uma linha independente de desenvolvimento — na prática,
            um ponteiro leve para um commit. Ramificar permite trabalhar numa nova funcionalidade,
            num experimento ou numa correção <em>sem tocar</em> no código estável do branch
            principal (geralmente <code>main</code>). Se o experimento der errado, você
            simplesmente apaga o branch — o <code>main</code> nunca foi afetado.
          </p>
          <p className="text-text-2 mb-4">
            Branches no Git são <strong>baratíssimos</strong>: criar um é instantâneo, porque é
            só um arquivo de 41 bytes apontando para um commit. Por isso o fluxo profissional
            cria um branch para cada tarefa — uma cultura impossível em VCS antigos onde
            ramificar era lento e caro.
          </p>
          <CodeBlock lang="bash" code={`# Listar branches (o atual aparece com *)
git branch

# Criar um branch novo
git branch feature/nova-tela

# Alternar para outro branch — git switch é o comando moderno
git switch feature/nova-tela
git switch main                  # voltar para o main

# Criar e já alternar de uma vez
git switch -c feature/login      # equivale a: git checkout -b feature/login

# git checkout é a forma clássica (ainda funciona, faz mais coisas)
git checkout feature/nova-tela`} />
          <InfoBox title="git switch vs git checkout" className="mt-4">
            O <code>git checkout</code> histórico faz coisas demais (trocar de branch <em>e</em>
            restaurar arquivos), o que confunde iniciantes. As versões modernas do Git separaram
            isso: <code>git switch</code> só troca de branch e <code>git restore</code> só
            restaura arquivos. Prefira os comandos novos — são mais claros sobre a sua intenção.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['git-branch']} onChange={e => updateChecklist('git-branch', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['git-branch'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Merge — juntando os branches</h2>
          <p className="text-text-2 mb-4">
            Terminada a tarefa num branch, você integra essas mudanças de volta ao
            <code> main</code> com o <strong>merge</strong>. Posicione-se no branch que vai
            <em> receber</em> as mudanças e mande mesclar o outro:
          </p>
          <CodeBlock lang="bash" code={`# Estar no branch de DESTINO (o que recebe)
git switch main

# Trazer as mudanças do branch de funcionalidade
git merge feature/login

# Depois do merge, o branch pode ser apagado
git branch -d feature/login`} />
          <p className="text-text-2 my-4">
            Há dois tipos de merge, e o Git escolhe automaticamente:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Fast-forward</strong> — se o <code>main</code> não andou desde que o branch nasceu, o Git apenas <em>avança o ponteiro</em> do <code>main</code> para o último commit do branch. Histórico linear, sem commit de merge.</li>
            <li><strong>Merge commit</strong> — se os dois branches evoluíram em paralelo, o Git cria um <strong>commit de merge</strong> especial, com dois pais, unindo as duas histórias.</li>
          </ul>
          <InfoBox title="--no-ff para preservar o desenho do branch">
            Às vezes você quer um commit de merge mesmo quando o fast-forward seria possível —
            ele documenta que ali existiu um branch de funcionalidade.
            <code> git merge --no-ff feature/login</code> força a criação do commit de merge,
            deixando o <code>git log --graph</code> mais legível para a equipe.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Conflitos de merge — ler e resolver</h2>
          <p className="text-text-2 mb-4">
            Um <strong>conflito</strong> acontece quando os dois branches alteraram a
            <em> mesma linha</em> do mesmo arquivo de formas diferentes. O Git não tem como
            adivinhar qual versão você quer, então <strong>para</strong> e pede que você decida.
            Isso é normal e esperado — não é um erro.
          </p>
          <p className="text-text-2 mb-4">
            O Git marca o trecho conflitante no arquivo com três marcadores. O bloco entre
            <code> {'<<<<<<<'} </code> e <code> {'======='} </code> é a sua versão (do branch
            atual); entre <code> {'======='} </code> e <code> {'>>>>>>>'} </code> é a versão que
            está sendo mesclada. Veja um arquivo em conflito:
          </p>
          <CodeBlock lang="text" title="config.txt — em conflito" code={`porta_padrao=80
<<<<<<< HEAD
timeout=30
servidor=producao
=======
timeout=60
servidor=homologacao
>>>>>>> feature/ajuste-timeout
log_nivel=info`} />
          <p className="text-text-2 my-4">
            Para resolver: edite o arquivo, escolha o conteúdo correto (a sua versão, a outra,
            ou uma combinação) e <strong>apague as três linhas de marcador</strong>. Depois,
            adicione o arquivo e finalize o merge:
          </p>
          <CodeBlock lang="bash" code={`# Ver quais arquivos estão em conflito
git status

# Editar cada arquivo: escolher o conteúdo e REMOVER os marcadores
#   <<<<<<<   =======   >>>>>>>   não podem sobrar no arquivo final
nano config.txt

# Marcar o conflito como resolvido
git add config.txt

# Concluir o merge (abre o editor para a mensagem do commit de merge)
git merge --continue

# Mudou de ideia? Aborte e volte ao estado anterior ao merge
git merge --abort`} />
          <WarnBox title="Não deixe marcadores no arquivo" className="mt-4">
            O erro mais comum é resolver o conflito &quot;pela metade&quot; — escolher o conteúdo
            mas esquecer de apagar uma linha de marcador. O arquivo fica com lixo como
            <code> {'>>>>>>>'} </code> no meio, quebrando o programa. Antes do
            <code> git add</code>, procure por marcadores remanescentes:
            <code> grep -n &quot;&lt;&lt;&lt;&lt;&lt;&lt;&lt;\\|=======\\|&gt;&gt;&gt;&gt;&gt;&gt;&gt;&quot; config.txt</code>.
          </WarnBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['git-merge']} onChange={e => updateChecklist('git-merge', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['git-merge'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Rebase e stash</h2>
          <p className="text-text-2 mb-4">
            O <strong>rebase</strong> é uma alternativa ao merge. Em vez de criar um commit de
            merge, ele <em>reaplica</em> os seus commits a partir da ponta de outro branch — como
            se você tivesse começado o trabalho a partir dali. O resultado é um histórico
            <strong> linear</strong>, sem as bifurcações do merge.
          </p>
          <CodeBlock lang="bash" code={`# Rebase: reaplicar os commits do branch atual sobre o main atualizado
git switch feature/login
git rebase main

# git stash — guardar mudanças não commitadas temporariamente
git stash                 # esconde as mudanças e limpa o working dir
git switch outro-branch   # agora você pode trocar de branch
git switch feature/login
git stash pop             # devolve as mudanças guardadas
git stash list            # ver o que está guardado`} />
          <WarnBox title="NUNCA faça rebase de um branch já publicado" className="mt-4">
            O rebase <strong>reescreve o histórico</strong>: os commits ganham novos hashes. Se o
            branch já foi enviado e outras pessoas trabalham nele, o rebase quebra o repositório
            delas — o histórico delas e o seu deixam de bater. Regra: rebase só em commits
            <strong> locais e privados</strong>; para branches compartilhados, use
            <code> merge</code>.
          </WarnBox>
          <InfoBox title="merge vs rebase — qual usar" className="mt-4">
            <strong>Merge</strong> preserva a história real (&quot;estes commits foram feitos em
            paralelo&quot;) e é seguro sempre. <strong>Rebase</strong> produz um histórico limpo
            e linear, ótimo para arrumar o seu branch antes de abrir um Pull Request. Muitas
            equipes adotam: rebase para organizar o trabalho local, merge para integrar.
          </InfoBox>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('fluxo') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Repositórios remotos</h2>
          <p className="text-text-2 mb-4">
            Até aqui tudo aconteceu na sua máquina. Um <strong>repositório remoto</strong> é uma
            cópia hospedada noutro lugar — um servidor, o GitHub, o GitLab — que serve de ponto
            de encontro da equipe. O remoto padrão, criado por um <code>git clone</code>, chama-se
            <strong> origin</strong>.
          </p>
          <CodeBlock lang="bash" code={`# Listar os remotos configurados
git remote -v

# Adicionar um remoto a um repositório criado localmente
git remote add origin https://github.com/usuario/projeto.git

# Conferir
git remote show origin`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. push, pull e fetch</h2>
          <p className="text-text-2 mb-4">
            Três comandos sincronizam o seu repositório local com o remoto:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong><code>git push</code></strong> — envia os seus commits locais para o remoto.</li>
            <li><strong><code>git fetch</code></strong> — baixa os commits novos do remoto, mas <em>não</em> os mescla no seu branch. Você inspeciona antes de integrar.</li>
            <li><strong><code>git pull</code></strong> — é um <code>fetch</code> seguido de <code>merge</code>: baixa e já integra no seu branch atual.</li>
          </ul>
          <CodeBlock lang="bash" code={`# Enviar o branch atual para o remoto (a primeira vez usa -u)
git push -u origin main          # -u liga o branch local ao remoto
git push                         # nas próximas vezes, basta isso

# Trazer e integrar mudanças dos colegas
git pull                         # fetch + merge no branch atual

# Trazer SEM integrar — inspecionar primeiro
git fetch origin
git log HEAD..origin/main        # ver o que chegou de novo`} />
          <InfoBox title="Sempre dê pull antes de começar e antes do push" className="mt-4">
            Trabalhar a partir de uma cópia desatualizada gera conflitos desnecessários. Comece
            o dia com <code>git pull</code> e dê outro <code>pull</code> antes do
            <code> push</code> — assim você integra o trabalho dos colegas em pequenas doses, em
            vez de enfrentar um conflito gigante no fim.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. GitHub, GitLab e Pull Requests</h2>
          <p className="text-text-2 mb-4">
            <strong>GitHub</strong> e <strong>GitLab</strong> são plataformas que hospedam
            repositórios Git e adicionam colaboração: issues, CI/CD, e o recurso central — o
            <strong> Pull Request</strong> (PR no GitHub) ou <strong>Merge Request</strong> (MR
            no GitLab).
          </p>
          <p className="text-text-2 mb-4">
            Um PR é um pedido formal: &quot;quero mesclar o meu branch no <code>main</code> — por
            favor revisem&quot;. Antes do merge, os colegas fazem <strong>code review</strong>:
            comentam linhas, sugerem mudanças, e a automação (CI) roda testes. Só depois de
            aprovado o branch é integrado. É assim que equipes mantêm qualidade e compartilham
            conhecimento.
          </p>
          <CodeBlock lang="bash" code={`# Fluxo típico de contribuição via Pull Request
git switch -c feature/relatorio       # 1. branch para a tarefa
# ... edita, git add, git commit ...
git push -u origin feature/relatorio  # 2. envia o branch ao remoto

# 3. abra o PR/MR pela interface web do GitHub/GitLab
#    apontando feature/relatorio  ->  main
# 4. colegas revisam; CI roda os testes
# 5. aprovado: o merge é feito pela própria plataforma
# 6. atualize seu local e limpe o branch
git switch main && git pull
git branch -d feature/relatorio`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">13. Modelos de fluxo de trabalho</h2>
          <p className="text-text-2 mb-4">
            Equipes adotam convenções sobre como usar branches. Os três modelos mais comuns:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
            {[
              { i: '🌳', t: 'Git Flow', d: 'Branches de longa vida (main, develop, release, hotfix). Estruturado, bom para releases versionadas; pode ser pesado.' },
              { i: '🍃', t: 'GitHub Flow', d: 'Só main + branches curtos de feature, integrados via PR. Simples, ideal para deploy contínuo.' },
              { i: '🌲', t: 'Trunk-based', d: 'Todos commitam no main (trunk) com branches mínimos e feature flags. Exige CI forte; favorece integração contínua.' },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-text"><span aria-hidden="true">{m.i}</span> {m.t}</p>
                <p className="text-text-3 mt-1 leading-snug">{m.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">14. Tags e versionamento semântico</h2>
          <p className="text-text-2 mb-4">
            Uma <strong>tag</strong> marca um commit específico com um nome permanente —
            tipicamente o número de uma versão de release. O padrão de mercado é o
            <strong> versionamento semântico</strong> (<code>SemVer</code>):
            <code> MAJOR.MINOR.PATCH</code> — incrementa MAJOR em mudanças incompatíveis, MINOR
            em funcionalidades novas compatíveis, PATCH em correções.
          </p>
          <CodeBlock lang="bash" code={`# Criar uma tag anotada (com mensagem, autor e data — recomendado)
git tag -a v1.0.0 -m "Primeira versão estável"

# Listar e inspecionar tags
git tag
git show v1.0.0

# Tags NÃO sobem com o push normal — envie explicitamente
git push origin v1.0.0
git push origin --tags         # todas as tags de uma vez`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">15. Boas mensagens de commit</h2>
          <p className="text-text-2 mb-4">
            A mensagem de commit é o &quot;por quê&quot; da mudança — um futuro você (ou um
            colega) vai lê-la para entender o histórico. O padrão <strong>Conventional
            Commits</strong> dá estrutura: um <em>tipo</em>, um <em>escopo</em> opcional e uma
            descrição curta no imperativo.
          </p>
          <CodeBlock lang="text" title="Conventional Commits — formato e exemplos" code={`# Formato:  tipo(escopo): descrição curta no imperativo
#
# tipos comuns:
#   feat     nova funcionalidade
#   fix      correção de bug
#   docs     só documentação
#   refactor mudança de código sem alterar comportamento
#   test     adiciona ou ajusta testes
#   chore    tarefas de manutenção (deps, build)

feat(auth): adiciona login com autenticação em dois fatores
fix(api): corrige timeout na rota de relatórios
docs(readme): documenta as variáveis de ambiente
refactor(db): extrai a query de usuários para uma função

# Bom:  curto, no imperativo, diz o QUE e (no corpo) o PORQUÊ
# Ruim: "mudanças", "ajustes", "wip", "agora vai"`} />

          <WindowsComparisonBox
            windowsLabel="Windows (TFVC / SVN — centralizado)"
            linuxLabel="Git (distribuído)"
            windowsCode={`# VCS centralizados clássicos (TFVC, Subversion)
# - Um servidor único guarda TODO o histórico
# - "check-out" trava ou baixa arquivos do servidor
# - Sem servidor = sem commit, sem histórico, sem branch
# - Branches são caros e pouco usados
tf checkout arquivo.cs
tf checkin /comment:"ajuste"
svn commit -m "ajuste"`}
            linuxCode={`# Git — cada clone tem o histórico INTEIRO
git clone <url>          # baixa todo o histórico
git commit -m "ajuste"   # commita offline, sem servidor
git branch feature/x     # branches instantâneos e baratos
git push                 # sincroniza quando quiser
# GitHub Desktop é só uma GUI; a CLI faz tudo isto.`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Commitar um arquivo secreto (.env) por falta de .gitignore', sol: 'Crie o .gitignore ANTES do primeiro commit, listando .env, *.key e credenciais. Se já vazou, o segredo está no histórico para sempre — rotacione a credencial e considere reescrever o histórico (git filter-repo).' },
              { erro: 'git push --force apagando o trabalho de um colega', sol: 'O --force sobrescreve o histórico do remoto, descartando commits que outros enviaram. Quase nunca é necessário; quando for, use --force-with-lease, que aborta se o remoto mudou desde o seu último fetch.' },
              { erro: 'Fazer rebase de um branch já compartilhado', sol: 'O rebase reescreve hashes; quem já clonou o branch fica com um histórico divergente. Faça rebase apenas em commits locais e privados — para branches publicados, use merge.' },
              { erro: 'Resolver um conflito pela metade, deixando marcadores <<<<', sol: 'Depois de escolher o conteúdo, apague TODAS as linhas <<<<<<<, ======= e >>>>>>>. Antes do git add, faça um grep por esses marcadores — sobrar um deles quebra o arquivo.' },
            ].map((e, i) => (
              <details key={i} className="p-4 rounded-lg bg-bg-2 border border-border">
                <summary className="cursor-pointer font-medium text-text flex items-center gap-2">
                  <AlertOctagon size={15} className="text-err shrink-0" /> {e.erro}
                </summary>
                <p className="text-sm text-text-2 mt-2 pl-6">{e.sol}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>
          <div className="space-y-4">

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 1 — Primeiro repositório e ciclo de commits</p>
              <p className="text-sm text-text-2 mb-3">
                Configure a sua identidade, crie um repositório do zero com <code>git init</code> e
                adicione um <code>.gitignore</code> ignorando <code>.env</code> e <code>*.log</code>.
                Crie dois arquivos, use <code>git add</code> e <code>git status</code> para inspecionar
                a staging area e faça dois commits separados com mensagens no padrão Conventional
                Commits. Confira o resultado no <code>git log --oneline</code>.
              </p>
              <CodeBlock lang="bash" code={`mkdir lab-git && cd lab-git
git init
printf ".env\\n*.log\\n" > .gitignore
echo "projeto de teste" > README.md
git add .gitignore README.md
git commit -m "chore: estrutura inicial do projeto"
echo "linha 1" > notas.txt
git add notas.txt
git commit -m "docs: adiciona arquivo de notas"
git log --oneline`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — Branch, conflito e resolução</p>
              <p className="text-sm text-text-2 mb-3">
                A partir do repositório do Lab 1, crie o branch <code>feature/ajuste</code>, edite a
                <strong> mesma linha</strong> de um arquivo nele e volte ao <code>main</code> para
                editar essa mesma linha de outra forma. Faça o merge — o Git vai acusar conflito.
                Abra o arquivo, escolha o conteúdo final, remova os três marcadores e conclua o
                merge. Confirme que nenhum marcador sobrou.
              </p>
              <CodeBlock lang="bash" code={`git switch -c feature/ajuste
echo "versao do branch" > notas.txt
git commit -am "feat: altera notas no branch"
git switch main
echo "versao do main" > notas.txt
git commit -am "feat: altera notas no main"
git merge feature/ajuste          # conflito esperado
nano notas.txt                    # resolva e remova <<<< ==== >>>>
git add notas.txt
git merge --continue`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — Remoto, push e fluxo de Pull Request</p>
              <p className="text-sm text-text-2 mb-3">
                Crie um repositório vazio no GitHub ou GitLab e conecte-o como <code>origin</code>.
                Envie o <code>main</code> com <code>git push -u origin main</code>. Depois crie um
                branch de funcionalidade, faça um commit, envie-o e abra um Pull Request pela
                interface web apontando o branch para o <code>main</code>. Por fim, marque o commit
                aprovado com a tag <code>v1.0.0</code> e envie-a ao remoto.
              </p>
              <CodeBlock lang="bash" code={`git remote add origin https://github.com/SEU-USUARIO/lab-git.git
git push -u origin main
git switch -c feature/extra
echo "recurso extra" >> README.md
git commit -am "feat: documenta recurso extra"
git push -u origin feature/extra
# abra o Pull Request feature/extra -> main pela web
git switch main && git pull
git tag -a v1.0.0 -m "Primeira versão estável"
git push origin v1.0.0`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/git" />

      </div>
    </main>
  );
}
