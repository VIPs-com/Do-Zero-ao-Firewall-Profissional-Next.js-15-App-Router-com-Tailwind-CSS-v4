'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  GitMerge, Shield, Zap, Package, Server,
  ChevronLeft, ChevronRight, Terminal, Lock, Activity,
} from 'lucide-react';
import Link from 'next/link';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const checklistItems = [
  {
    id: 'cicd-pipeline',
    text: 'Criar workflow de CI com build, lint e testes automáticos no push',
    sub: '.github/workflows/ci.yml com jobs: lint → test → build em paralelo, cache de dependências ativado',
  },
  {
    id: 'cicd-secrets',
    text: 'Configurar secrets de ambiente e deploy automático para produção',
    sub: 'GitHub Secrets + environment protection rules → deploy apenas após aprovação manual em produção',
  },
  {
    id: 'cicd-runner',
    text: 'Registrar e usar um self-hosted runner no próprio servidor Linux',
    sub: './config.sh --url https://github.com/org/repo --token TOKEN && ./run.sh como serviço systemd',
  },
];

const erros = [
  {
    title: 'Workflow não dispara — evento de trigger errado',
    desc: 'O evento "push" por padrão dispara em qualquer branch. Se você filtrar por branch e o nome estiver errado (main vs master, ou typo), o workflow nunca executa.',
    fix: `# Verificar o nome exato da branch padrão:
git branch -a | grep HEAD

# Workflow com trigger correto:
on:
  push:
    branches: [ main ]   # não 'master' se seu repo usa 'main'
  pull_request:
    branches: [ main ]`,
  },
  {
    title: 'Secrets não disponíveis em forks — PR de forks falha',
    desc: 'Por segurança, GitHub não expõe secrets para workflows disparados por PRs de forks. Isso quebra pipelines de CI que dependem de credenciais externas.',
    fix: `# Usar ambiente separado para PRs de forks:
jobs:
  test:
    # Rodar sem secrets para PRs de fork
    if: github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name != github.repository
    steps:
      - run: npm test   # testes sem credenciais externas

  test-internal:
    # Secrets disponíveis para PRs internos e push
    if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
    environment: staging`,
  },
  {
    title: 'Cache de dependências nunca invalida — versão antiga em produção',
    desc: 'Se a chave do cache não incluir o hash do arquivo de lock (package-lock.json, requirements.txt), o cache pode servir versões antigas quando as dependências mudarem.',
    fix: `# Chave de cache que invalida quando o lock file muda:
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-`,
  },
  {
    title: 'Self-hosted runner com permissões insuficientes — docker falha',
    desc: 'O processo do runner roda como usuário não-root por padrão. Comandos que precisam de Docker exigem que o usuário esteja no grupo docker, e comandos de deploy podem precisar de sudo específico.',
    fix: `# Adicionar o usuário do runner ao grupo docker:
sudo usermod -aG docker github-runner

# Para comandos sudo específicos sem senha:
# /etc/sudoers.d/github-runner
github-runner ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart minha-app

# Reiniciar o runner após mudanças:
sudo systemctl restart actions.runner.*`,
  },
];

export default function CicdPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/cicd');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-cicd min-h-screen">
      {/* Hero */}
      <section className="module-hero py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LayerBadge layer="DevOps · Automação" />
            <span className="section-label">GitHub Actions · Pipeline · Deploy</span>
          </div>
          <h1 className="section-title text-4xl mb-4">
            🚀 CI/CD com GitHub Actions
          </h1>
          <p className="text-text-2 text-lg max-w-2xl">
            CI/CD é a espinha dorsal do desenvolvimento moderno —
            <strong className="text-text"> todo commit testado, todo deploy automatizado</strong>.
            GitHub Actions traz pipelines declarativos em YAML diretamente no repositório,
            com mais de 20.000 actions reutilizáveis no Marketplace.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['GitHub Actions', 'workflow', 'job', 'step', 'runner', 'secrets', 'environments', 'matrix', 'cache', 'artifact'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-bg-3 text-text-2 border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* Conceitos fundamentais */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <GitMerge className="text-[var(--mod)]" size={22} />
            Anatomia de um workflow
          </h2>
          <p className="text-text-2 mb-6">
            Workflows vivem em <code className="px-1 bg-bg-3 rounded text-xs font-mono">.github/workflows/</code>.
            Cada arquivo YAML é um workflow independente com seus próprios triggers, jobs e steps.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { term: 'Workflow', icon: '📄', desc: 'Arquivo YAML completo — define triggers, env vars globais e todos os jobs' },
              { term: 'Job', icon: '⚙️', desc: 'Unidade de execução que roda em uma máquina (runner). Jobs paralelos por padrão' },
              { term: 'Step', icon: '▶️', desc: 'Comando individual dentro de um job — pode ser um shell script ou uma action' },
              { term: 'Action', icon: '🧩', desc: 'Step reutilizável do Marketplace (ex: actions/checkout, docker/build-push-action)' },
              { term: 'Runner', icon: '🖥️', desc: 'Máquina que executa o job — GitHub-hosted (ubuntu-latest) ou self-hosted' },
              { term: 'Artifact', icon: '📦', desc: 'Arquivo produzido por um job e compartilhado com outros jobs ou para download' },
            ].map(({ term, icon, desc }) => (
              <div key={term} className="bg-bg-2 border border-border rounded-xl p-4 flex gap-3">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{term}</h3>
                  <p className="text-text-2 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <FluxoCard
            title="Fluxo de um pipeline completo"
            steps={[
              { label: 'Push / PR', sub: 'trigger: on push/pull_request', icon: <GitMerge size={14} />, color: 'border-info/50' },
              { label: 'Lint + Test', sub: 'jobs paralelos em ubuntu-latest', icon: <Activity size={14} />, color: 'border-accent/50' },
              { label: 'Build', sub: 'docker build → push registry', icon: <Package size={14} />, color: 'border-ok/50' },
              { label: 'Deploy Staging', sub: 'automático após merge', icon: <Server size={14} />, color: 'border-warn/50' },
              { label: 'Deploy Prod', sub: 'aprovação manual obrigatória', icon: <Shield size={14} />, color: 'border-err/50' },
            ]}
          />
        </section>

        {/* Primeiro workflow */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Terminal className="text-[var(--mod)]" size={22} />
            Primeiro workflow — CI completo
          </h2>

          <div className="space-y-6">
            <div>
              <StepItem
                number={1}
                title="Criar o arquivo de workflow"
                description="Crie o arquivo .github/workflows/ci.yml no repositório. O GitHub detecta automaticamente qualquer arquivo .yml nessa pasta."
              />
              <CodeBlock lang="bash" code={`mkdir -p .github/workflows
touch .github/workflows/ci.yml`} />
            </div>

            <div>
              <StepItem
                number={2}
                title="Workflow de CI com lint, test e build em paralelo"
                description="Jobs paralelos reduzem o tempo total do pipeline. Use needs: para encadear jobs que dependem de outros."
              />
              <CodeBlock lang="yaml" code={`# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '20'

jobs:
  # Job 1: Lint — roda em paralelo com test
  lint:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'           # cache automático do npm

      - run: npm ci              # instalar deps exatas do lock file
      - run: npm run lint        # typecheck
      - run: npm run lint:eslint # a11y

  # Job 2: Testes — roda em paralelo com lint
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        if: always()             # salvar coverage mesmo se tests falharem
        with:
          name: coverage-report
          path: coverage/

  # Job 3: Build — só roda após lint E test passarem
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [ lint, test ]        # espera os dois jobs acima
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/           # ou dist/ dependendo do framework
          retention-days: 7`} />
            </div>
          </div>
        </section>

        {/* Docker build e push */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Package className="text-[var(--mod)]" size={22} />
            Build e push de imagem Docker
          </h2>
          <p className="text-text-2 mb-6">
            Combinar o CI de código com build de imagem Docker é o padrão mais comum em produção.
            O GitHub Container Registry (ghcr.io) é gratuito para repositórios públicos.
          </p>

          <CodeBlock lang="yaml" code={`# .github/workflows/docker.yml
name: Docker Build & Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*.*.*' ]           # disparar em tags de versão também

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}  # org/repo → ghcr.io/org/repo

jobs:
  build-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write            # permissão para push no ghcr.io

    steps:
      - uses: actions/checkout@v4

      # Login no GitHub Container Registry
      - uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}   # token automático do Actions

      # Extrair metadados (tags, labels) automaticamente
      # git tag v1.2.3 → imagem com tag 1.2.3 e latest
      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix=sha-
            type=raw,value=latest,enable=\${{ github.ref == 'refs/heads/main' }}

      # Build com cache de camadas (BuildKit)
      - uses: docker/setup-buildx-action@v3

      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha   # cache do GitHub Actions
          cache-to: type=gha,mode=max`} />
        </section>

        {/* Environments e Deploy */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Shield className="text-[var(--mod)]" size={22} />
            Environments — deploy com aprovação manual
          </h2>
          <p className="text-text-2 mb-6">
            Environments permitem configurar regras de proteção por ambiente: aprovadores obrigatórios,
            secrets específicos por ambiente e delay antes do deploy. Staging automático, produção com aprovação.
          </p>

          <HighlightBox title="Configurar environments no GitHub">
            <p className="text-text-2 text-sm">
              Settings → Environments → New environment → <strong className="text-text">production</strong><br />
              Required reviewers: adicione os aprovadores obrigatórios.<br />
              Wait timer: delay em minutos antes de permitir deploy.<br />
              Deployment branches: apenas branches protegidas (ex: main).
            </p>
          </HighlightBox>

          <CodeBlock lang="yaml" code={`# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  # Deploy automático para staging
  deploy-staging:
    name: Deploy → Staging
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.minha-app.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy para staging
        env:
          SSH_KEY: \${{ secrets.STAGING_SSH_KEY }}   # secret do environment 'staging'
          HOST: \${{ secrets.STAGING_HOST }}
        run: |
          echo "\$SSH_KEY" > /tmp/deploy_key
          chmod 600 /tmp/deploy_key
          ssh -i /tmp/deploy_key -o StrictHostKeyChecking=no deploy@\$HOST \\
            "cd /app && git pull && docker compose up -d --build"

  # Deploy manual para produção (requer aprovação)
  deploy-prod:
    name: Deploy → Production
    runs-on: ubuntu-latest
    needs: deploy-staging          # só depois do staging passar
    environment:
      name: production             # environment com required reviewers
      url: https://minha-app.com
    steps:
      - uses: actions/checkout@v4
      - name: Deploy para produção
        env:
          SSH_KEY: \${{ secrets.PROD_SSH_KEY }}      # secret do environment 'production'
          HOST: \${{ secrets.PROD_HOST }}
        run: |
          echo "\$SSH_KEY" > /tmp/deploy_key
          chmod 600 /tmp/deploy_key
          ssh -i /tmp/deploy_key -o StrictHostKeyChecking=no deploy@\$HOST \\
            "cd /app && git pull origin main && docker compose up -d --no-build"
          rm -f /tmp/deploy_key`} />
        </section>

        {/* Matrix strategy */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Zap className="text-[var(--mod)]" size={22} />
            Matrix strategy — testar em múltiplas versões
          </h2>
          <p className="text-text-2 mb-6">
            A matrix strategy cria automaticamente múltiplos jobs a partir de combinações de variáveis.
            Ideal para testar em diferentes versões de Node, Python, ou sistemas operacionais.
          </p>

          <CodeBlock lang="yaml" code={`# Testar em Node 18, 20 e 22 × Ubuntu e Windows
jobs:
  test-matrix:
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false           # não cancelar outros jobs se um falhar
      matrix:
        node: [ 18, 20, 22 ]
        os: [ ubuntu-latest, windows-latest ]
        exclude:
          - os: windows-latest   # Node 18 no Windows está deprecated
            node: 18
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
        env:
          NODE_ENV: test`} />

          <InfoBox title="Matrix cria N × M jobs em paralelo">
            Com <code className="text-xs font-mono bg-bg-3 px-1 rounded">node: [18, 20, 22]</code> e{' '}
            <code className="text-xs font-mono bg-bg-3 px-1 rounded">os: [ubuntu-latest, windows-latest]</code>,
            o GitHub cria 6 jobs simultâneos (menos a exclusão = 5 jobs).
            Cada um é faturado separadamente contra os minutos gratuitos da conta.
          </InfoBox>
        </section>

        {/* Secrets e segurança */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Lock className="text-[var(--mod)]" size={22} />
            Secrets — credenciais seguras no pipeline
          </h2>
          <p className="text-text-2 mb-6">
            Nunca coloque credenciais diretamente no YAML. GitHub Secrets são criptografados em repouso
            e mascarados nos logs automaticamente. Existem três escopos diferentes.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead className="bg-bg-3">
                <tr>
                  {['Escopo', 'Configuração', 'Disponível em', 'Uso típico'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-text-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Repository', 'Settings → Secrets → Actions', 'Todos os workflows do repo', 'API keys, tokens de serviço'],
                  ['Environment', 'Settings → Environments → Secrets', 'Workflows que usam o environment', 'SSH keys por ambiente (staging/prod)'],
                  ['Organization', 'Org Settings → Secrets', 'Repositórios selecionados da org', 'Credenciais compartilhadas entre repos'],
                ].map(([scope, ...rest]) => (
                  <tr key={scope} className="hover:bg-bg-2/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-xs">{scope}</td>
                    {rest.map((v, i) => <td key={i} className="px-4 py-3 text-text-2 text-xs">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <WarnBox title="Nunca use secrets em variáveis de ambiente no shell sem aspas">
            Se um secret contém caracteres especiais e é usado sem aspas em um script shell,
            pode quebrar o comando ou vazar em mensagens de erro. Sempre use
            <code className="mx-1 px-1 bg-bg-3 rounded text-xs font-mono">&quot;\${'{'} secrets.MEU_SECRET {'}'}&quot;</code> com aspas duplas.
          </WarnBox>

          <CodeBlock lang="yaml" code={`# Boas práticas com secrets
steps:
  # ✅ Secret em variável de ambiente do step (não exposta no shell)
  - name: Deploy
    env:
      DATABASE_URL: \${{ secrets.DATABASE_URL }}
      API_TOKEN: \${{ secrets.API_TOKEN }}
    run: |
      ./deploy.sh   # o script acessa \$DATABASE_URL e \$API_TOKEN

  # ✅ Mascarar valor dinâmico gerado no runtime
  - name: Gerar token temporário
    run: |
      TOKEN=\$(./gerar-token.sh)
      echo "::add-mask::\$TOKEN"   # GitHub mascara esse valor nos logs
      echo "TEMP_TOKEN=\$TOKEN" >> \$GITHUB_ENV

  # ✅ Usar GITHUB_TOKEN automático para operações no próprio repo
  - name: Criar release
    uses: softprops/action-gh-release@v1
    with:
      files: dist/*
    env:
      GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}  # sem configuração extra`} />
        </section>

        {/* Self-hosted runner */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Server className="text-[var(--mod)]" size={22} />
            Self-hosted runner — CI no próprio servidor
          </h2>
          <p className="text-text-2 mb-6">
            Self-hosted runners permitem rodar workflows na sua própria infraestrutura —
            útil quando o deploy precisa acessar redes privadas, o build requer hardware específico
            ou os minutos gratuitos do GitHub não são suficientes.
          </p>

          <div className="space-y-6">
            <div>
              <StepItem
                number={1}
                title="Registrar o runner no GitHub"
                description="Settings → Actions → Runners → New self-hosted runner. Escolha Linux e copie os comandos gerados."
              />
              <CodeBlock lang="bash" code={`# No servidor Linux que será o runner:
# Criar usuário dedicado (não root)
sudo useradd -m -s /bin/bash github-runner
sudo usermod -aG docker github-runner   # permitir Docker

# Baixar o runner (URL gerada pelo GitHub)
sudo -u github-runner bash -c "
  mkdir -p /home/github-runner/actions-runner
  cd /home/github-runner/actions-runner
  curl -o actions-runner-linux-x64.tar.gz -L \\
    https://github.com/actions/runner/releases/download/v2.315.0/actions-runner-linux-x64-2.315.0.tar.gz
  tar xzf ./actions-runner-linux-x64.tar.gz
"

# Configurar (usar token gerado na interface do GitHub)
sudo -u github-runner /home/github-runner/actions-runner/config.sh \\
  --url https://github.com/SEU_ORG/SEU_REPO \\
  --token TOKEN_GERADO_NO_GITHUB \\
  --name meu-servidor-prod \\
  --labels self-hosted,linux,prod`} />
            </div>

            <div>
              <StepItem
                number={2}
                title="Instalar como serviço systemd"
                description="O runner precisa persistir após reboot. O script install.sh cria automaticamente o serviço systemd."
              />
              <CodeBlock lang="bash" code={`# Instalar serviço systemd
cd /home/github-runner/actions-runner
sudo ./svc.sh install github-runner
sudo ./svc.sh start

# Verificar status
sudo ./svc.sh status
# ou:
sudo systemctl status actions.runner.SEU_ORG-SEU_REPO.meu-servidor-prod

# Verificar no GitHub: Settings → Actions → Runners
# Status deve aparecer como "Idle" (verde)`} />
            </div>

            <div>
              <StepItem
                number={3}
                title="Usar o self-hosted runner no workflow"
                description="Referencie o runner pelo label atribuído durante o registro. Use labels customizados para separar ambientes."
              />
              <CodeBlock lang="yaml" code={`jobs:
  deploy:
    # Usar runner self-hosted com label 'prod'
    runs-on: [ self-hosted, linux, prod ]
    environment: production
    steps:
      - uses: actions/checkout@v4

      # O runner já tem acesso à rede interna
      # Pode acessar serviços sem VPN ou túnel SSH
      - name: Deploy via Docker Compose
        run: |
          cd /app
          git pull origin main
          docker compose pull
          docker compose up -d --remove-orphans
          docker system prune -f`} />
            </div>
          </div>

          <WarnBox title="Self-hosted runners de repositórios públicos = risco crítico">
            Nunca use self-hosted runners em repositórios públicos. Qualquer pessoa pode abrir um PR
            com código malicioso que roda no seu servidor. Use apenas em repositórios privados ou
            configure regras de aprovação obrigatória para PRs de forks.
          </WarnBox>
        </section>

        {/* Casos de uso avançados */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Activity className="text-[var(--mod)]" size={22} />
            Padrões avançados
          </h2>

          <h3 className="font-semibold text-lg mb-4">Reutilizar workflows com reusable workflows</h3>
          <CodeBlock lang="yaml" code={`# .github/workflows/reusable-deploy.yml
# Workflow reutilizável — chamado por outros workflows
on:
  workflow_call:                   # trigger especial para reuso
    inputs:
      environment:
        required: true
        type: string
      image_tag:
        required: true
        type: string
    secrets:
      SSH_KEY:
        required: true
      HOST:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: \${{ inputs.environment }}
    steps:
      - name: Deploy \${{ inputs.image_tag }} em \${{ inputs.environment }}
        env:
          SSH_KEY: \${{ secrets.SSH_KEY }}
          HOST: \${{ secrets.HOST }}
        run: |
          echo "\$SSH_KEY" | ssh-add -
          ssh deploy@\$HOST "docker pull minha-app:\${{ inputs.image_tag }} && \\
            docker compose up -d"
---
# .github/workflows/cd.yml — chama o workflow reutilizável
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image_tag: \${{ github.sha }}
    secrets:
      SSH_KEY: \${{ secrets.STAGING_SSH_KEY }}
      HOST: \${{ secrets.STAGING_HOST }}`} />

          <h3 className="font-semibold text-lg mt-8 mb-4">Notificação no Slack ao falhar</h3>
          <CodeBlock lang="yaml" code={`# Notificar o time quando o CI falha na branch main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build

      - name: Notificar Slack em falha
        if: failure() && github.ref == 'refs/heads/main'
        uses: slackapi/slack-github-action@v1.25.0
        with:
          payload: |
            {
              "text": "❌ CI falhou em *\${{ github.repository }}*",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "❌ *CI Falhou* em \`\${{ github.ref_name }}\`\\nCommit: \`\${{ github.sha }}\`\\n<\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|Ver detalhes>"
                }
              }]
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`} />
        </section>

        {/* Windows Comparison */}
        <WindowsComparisonBox
          windowsLabel="Windows — Azure DevOps / Jenkins"
          linuxLabel="Linux — GitHub Actions"
          windowsCode={`# Azure DevOps (azure-pipelines.yml)
trigger:
  branches:
    include: [ main ]

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: Build
  jobs:
  - job: Build
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '20.x'
    - script: npm ci && npm run build

# Jenkins: Groovy DSL (Jenkinsfile)
pipeline {
  agent any
  stages {
    stage('Build') {
      steps { sh 'npm ci && npm run build' }
    }
  }
}`}
          linuxCode={`# GitHub Actions (.github/workflows/ci.yml)
name: CI
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'        # cache automático
      - run: npm ci && npm run build

# Vantagem: YAML no repo, 20k+ actions
# no Marketplace, gratuito para repos públicos`}
        />

        {/* Checklist */}
        <section>
          <h2 className="section-title text-2xl mb-6">🎯 Checklist do Lab</h2>
          <div className="space-y-3">
            {checklistItems.map(item => (
              <ChecklistItem
                key={item.id}
                text={item.text}
                checked={!!checklist[item.id]}
                onToggle={() => updateChecklist(item.id, !checklist[item.id])}
                sub={item.sub}
              />
            ))}
          </div>
        </section>

        {/* Erros comuns */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Shield className="text-[var(--mod)]" size={22} />
            Erros comuns
          </h2>
          <div className="space-y-3">
            {erros.map((e, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenError(openError === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-2/50 transition-colors"
                  aria-expanded={openError === i}
                >
                  <span className="font-mono text-sm text-warn">⚠ {e.title}</span>
                  <span className="text-text-2 text-xs">{openError === i ? '▲' : '▼'}</span>
                </button>
                {openError === i && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border">
                    <p className="text-text-2 text-sm mt-3">{e.desc}</p>
                    <CodeBlock lang="yaml" code={e.fix} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'Error: Process completed with exit code 1 — workflow falha sem mensagem clara',
              fix: 'Adicionar set -e e set -x no script bash para ver qual comando falhou. Habilitar debug mode no workflow: secrets.ACTIONS_RUNNER_DEBUG = true. Verificar a aba "Annotations" no run — GitHub Actions muitas vezes oculta o erro real no log.',
            },
            {
              err: 'docker/build-push-action: denied: permission_denied — push para ghcr.io falha',
              fix: 'Token GITHUB_TOKEN não tem permissão de escrita em packages. Adicionar ao job: permissions: packages: write. Confirmar que o Dockerfile não referencia imagem privada sem autenticação.',
            },
            {
              err: 'Self-hosted runner: Job is pending — runner não pega o job',
              fix: 'Verificar status do runner: Settings → Actions → Runners. Runner offline = processo morreu. Reiniciar: sudo ./svc.sh start. Verificar grupos: o runner precisa estar no grupo docker para builds com containers.',
            },
            {
              err: 'Deployment falha: SSH: Permission denied (publickey)',
              fix: 'A chave privada no secret DEPLOY_KEY não corresponde à chave pública em authorized_keys no servidor. Gerar novo par: ssh-keygen -t ed25519 -f deploy_key. Adicionar deploy_key.pub ao servidor e deploy_key (privada) como secret no GitHub.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        <ModuleNav currentPath="/cicd" order={ADVANCED_ORDER} />
      </div>
    </div>
  );
}
