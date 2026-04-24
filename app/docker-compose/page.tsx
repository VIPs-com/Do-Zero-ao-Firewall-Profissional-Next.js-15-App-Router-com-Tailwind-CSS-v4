'use client';

import React, { useEffect } from 'react';
import { Package, Network, Database, Lock, Terminal, Settings, CheckCircle2, Circle, Layers, ArrowRight, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

const CHECKLIST = [
  { id: 'compose-instalado', text: 'Docker Compose v2 instalado e stack básica subiu com docker compose up -d' },
  { id: 'compose-stack',     text: 'Stack completa (Nginx + App + PostgreSQL) rodando com redes isoladas' },
  { id: 'compose-networks',  text: 'Rede interna isolada configurada: banco de dados inacessível pelo frontend' },
];

// ── Code snippets como const strings para evitar interpolação TypeScript ─────

const INSTALL_CHECK = `# Docker Compose v2 já vem embutido no Docker Desktop e Docker Engine moderno
docker compose version
# Docker Compose version v2.24.0

# Se não estiver instalado (Docker Engine antigo):
sudo apt install docker-compose-plugin

# Verificar integração com Docker:
docker compose ls          # lista stacks ativas
docker compose ps          # sem argumentos: precisa de um projeto ativo`;

const ANATOMIA = `# docker-compose.yml — estrutura completa comentada
version: "3.9"          # versão do schema (opcional em Compose v2)

services:               # containers que compõem a stack
  web:                  # nome do serviço (vira hostname na rede interna)
    image: nginx:alpine # imagem base
    ports:
      - "80:80"         # host:container — port mapping = DNAT automático
    volumes:
      - ./html:/usr/share/nginx/html:ro  # bind mount (readonly)
      - nginx_logs:/var/log/nginx        # volume nomeado
    networks:
      - frontend        # pertence apenas à rede frontend
    depends_on:
      - app             # aguarda app iniciar antes
    restart: unless-stopped

  app:
    build: ./app        # constrói imagem a partir de Dockerfile em ./app
    environment:
      - DB_HOST=db      # variável de ambiente — "db" é o hostname do PostgreSQL
      - DB_PORT=5432
    env_file:
      - .env            # carrega variáveis de .env (não comitar no Git!)
    networks:
      - frontend        # fala com Nginx
      - backend         # fala com PostgreSQL
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data  # persiste dados entre restarts
    environment:
      POSTGRES_DB: workshop
      POSTGRES_USER: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    networks:
      - backend         # ISOLADO — Nginx não consegue acessar o banco
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d workshop"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  frontend:             # Nginx <-> App
  backend:              # App <-> PostgreSQL (isolada)

volumes:
  pgdata:               # dados do PostgreSQL sobrevivem a "docker compose down"
  nginx_logs:

secrets:
  db_password:
    file: ./secrets/db_password.txt  # lido do filesystem em produção`;

const PRIMEIRA_STACK = `# Criar estrutura do projeto
mkdir -p ~/workshop-compose/html
cd ~/workshop-compose

# Criar index.html simples
cat > html/index.html << 'EOF'
<!DOCTYPE html>
<html><body>
<h1>Workshop Linux - Docker Compose</h1>
<p>Stack rodando!</p>
</body></html>
EOF

# Criar docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    restart: unless-stopped
EOF

# Subir a stack
docker compose up -d

# Verificar
docker compose ps
docker compose logs web

# Acessar: http://localhost:8080
curl http://localhost:8080`;

const REDES_ISOLADAS = `# Stack com 3 camadas e redes isoladas
# Arquivo: docker-compose.yml

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    networks:
      - frontend       # pode falar com "app"
    # IMPORTANTE: nginx NAO tem acesso à rede "backend"
    # Ele nunca consegue acessar o banco de dados diretamente

  app:
    image: node:20-alpine
    command: node server.js
    networks:
      - frontend       # recebe requests do nginx
      - backend        # acessa o banco de dados
    # app é a ÚNICA ponte entre as duas redes

  db:
    image: postgres:16-alpine
    networks:
      - backend        # isolado — só "app" consegue conectar
    # Se nginx tentar conectar em "db:5432", vai falhar com "Name or service not known"

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true     # bloqueia acesso externo — nem saída para internet`;

const VOLUMES_TIPOS = `# Tipo 1: Volume nomeado — gerenciado pelo Docker
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data  # persiste entre "down" e "up"

volumes:
  pgdata:              # Docker cria em /var/lib/docker/volumes/pgdata/_data

# Listar volumes:
docker volume ls
docker volume inspect workshop-compose_pgdata

# Tipo 2: Bind mount — mapeia pasta local
services:
  web:
    volumes:
      - ./html:/usr/share/nginx/html:ro  # ro = read-only
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

# Tipo 3: tmpfs — apenas em memória (bom para /tmp, sessions)
services:
  app:
    tmpfs:
      - /tmp
      - /run

# DIFERENÇA CHAVE:
# Volume nomeado: dados sobrevivem a "docker compose down"
# docker compose down -v: remove volumes nomeados também (CUIDADO!)`;

const ENV_SECRETS = `# Arquivo .env (na raiz do projeto — NUNCA commitá-lo!)
# .gitignore deve conter: .env e secrets/

DB_NAME=workshop
DB_USER=app
APP_PORT=3000
NODE_ENV=production

# docker-compose.yml usando .env e sintaxe de substituição
services:
  app:
    env_file:
      - .env              # carrega todas as variáveis do .env
    environment:
      - PORT=$APP_PORT    # sobrescreve variável específica
      - DB_HOST=db        # hardcoded (não é segredo)

  db:
    environment:
      POSTGRES_DB: $DB_NAME
      POSTGRES_USER: $DB_USER

# Para segredos reais (senhas, tokens), use Docker Secrets:
# secrets/db_password.txt (permissão 600 — apenas root lê)
echo "SenhaForteAqui123!" > secrets/db_password.txt
chmod 600 secrets/db_password.txt

# docker-compose.yml com secrets
services:
  db:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt`;

const STACK_COMPLETA = `# Stack de produção: Nginx (proxy) + Node.js + PostgreSQL
# Arquivo: docker-compose.prod.yml

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - app
    networks:
      - frontend
    restart: always

  app:
    build:
      context: ./app
      dockerfile: Dockerfile.prod
    env_file: .env
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      db:
        condition: service_healthy
    networks:
      - frontend
      - backend
    restart: always
    deploy:
      replicas: 2        # 2 instâncias — nginx faz load balancing

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    env_file: .env
    secrets:
      - db_password
    networks:
      - backend
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $DB_USER -d $DB_NAME"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  frontend:
  backend:
    internal: true

volumes:
  pgdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt`;

const COMANDOS = `# ── Ciclo de vida da stack ────────────────────────────────────────────────────
docker compose up -d              # sobe em background (detached)
docker compose up --build -d      # reconstrói imagens antes de subir
docker compose down               # para e remove containers
docker compose down -v            # remove containers E volumes (CUIDADO!)
docker compose restart            # reinicia todos os serviços

# ── Monitoramento ─────────────────────────────────────────────────────────────
docker compose ps                 # status de cada serviço
docker compose logs               # logs de todos os serviços
docker compose logs -f web        # tail -f de um serviço específico
docker compose top                # processos em execução (como top)
docker compose stats              # uso de CPU/memória em tempo real

# ── Execução e debug ──────────────────────────────────────────────────────────
docker compose exec app sh        # shell dentro do container
docker compose exec db psql -U app -d workshop  # prompt do PostgreSQL
docker compose run --rm app node migrate.js     # executar comando one-shot

# ── Escala e atualização ──────────────────────────────────────────────────────
docker compose scale app=3        # 3 instâncias do serviço app
docker compose pull               # atualiza imagens sem derrubar
docker compose up -d --no-recreate # sobe apenas novos serviços

# ── Múltiplos arquivos (override) ─────────────────────────────────────────────
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`;

const TROUBLESHOOT = `# Container não sobe — ver logs detalhados
docker compose logs --tail=50 nome-do-servico

# Porta já em uso — descobrir quem está usando
sudo ss -tlnp | grep :80
sudo kill -9 PID

# Banco não conecta — verificar se healthcheck passou
docker compose ps           # coluna "Status" deve mostrar "(healthy)"
docker compose exec app ping db   # testa resolução DNS interna

# Volume com permissão errada — PostgreSQL não inicia
docker compose down -v
docker compose up -d       # recria o volume zerado

# Variável de ambiente não carregou
docker compose exec app env | grep DB_

# Comparar config gerada com o que está rodando
docker compose config       # mostra o YAML final após interpolação
docker compose config --services  # lista todos os serviços

# Resetar tudo e começar do zero (DESTRUTIVO)
docker compose down -v --remove-orphans
docker system prune -f`;

export default function DockerComposePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/docker-compose');
  }, [trackPageVisit]);

  const completed = CHECKLIST.filter(item => checklist[item.id]).length;

  return (
    <main className="module-accent-compose min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <span className="section-label">Docker & Containers</span>
          <h1 className="text-3xl font-bold text-text flex items-center gap-3">
            <Package className="text-[var(--mod)]" size={32} />
            Docker Compose
          </h1>
          <p className="text-text-2 text-lg leading-relaxed">
            Em vez de subir containers manualmente com <code className="font-mono text-sm bg-bg-3 px-1 rounded">docker run</code>,
            o <strong>Docker Compose</strong> declara toda a sua stack em um único arquivo YAML.
            Um comando sobe, conecta e configura todos os serviços — com redes isoladas, volumes persistentes e secrets.
          </p>
        </div>

        {/* ── Checklist ─────────────────────────────────────────────────────── */}
        <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text flex items-center gap-2">
              <Layers size={18} className="text-[var(--mod)]" />
              Checklist do Módulo
            </h2>
            <span className="text-sm text-text-3">{completed}/{CHECKLIST.length} concluídos</span>
          </div>
          <div className="space-y-3">
            {CHECKLIST.map(item => (
              <button
                key={item.id}
                onClick={() => updateChecklist(item.id, !checklist[item.id])}
                className={cn(
                  'w-full flex items-start gap-3 text-left px-4 py-3 rounded-lg border transition-colors',
                  checklist[item.id]
                    ? 'bg-ok/10 border-ok/30 text-text'
                    : 'bg-bg border-border text-text-2 hover:border-[var(--mod)]/40'
                )}
              >
                {checklist[item.id]
                  ? <CheckCircle2 size={18} className="text-ok mt-0.5 shrink-0" />
                  : <Circle size={18} className="text-text-3 mt-0.5 shrink-0" />}
                <span className="text-sm">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Por que Compose? ───────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Motivação</span>
            <h2 className="section-title mt-1">Por que usar Docker Compose?</h2>
          </div>

          <FluxoCard
            title="Fluxo: do YAML à stack rodando"
            steps={[
              { label: 'docker-compose.yml', sub: 'declara services, networks e volumes', icon: <Settings size={14} />, color: 'border-info/50' },
              { label: 'docker compose up -d', sub: 'cria redes, volumes e containers', icon: <Terminal size={14} />, color: 'border-[var(--mod)]/50' },
              { label: 'Redes automáticas', sub: 'cada serviço vira hostname DNS', icon: <Network size={14} />, color: 'border-ok/50' },
              { label: 'Volumes persistem', sub: 'dados sobrevivem a restarts', icon: <Database size={14} />, color: 'border-warn/50' },
              { label: 'Stack operacional', sub: 'monitorar com compose ps/logs', icon: <Server size={14} />, color: 'border-ok/50' },
            ]}
          />

          <WindowsComparisonBox
            windowsLabel="Sem Compose (comandos manuais)"
            linuxLabel="Com Docker Compose"
            windowsCode={`docker network create frontend
docker network create backend
docker run -d --name db \\
  --network backend postgres:16
docker run -d --name app \\
  --network frontend --network backend myapp
docker run -d --name nginx \\
  -p 80:80 --network frontend nginx
# 5 comandos, ordem importa, fácil errar`}
            linuxCode={`# 1 comando sobe tudo na ordem certa
docker compose up -d

# Redes criadas automaticamente
# depends_on garante a sequência
# Repetível em qualquer máquina

# Derruba e limpa tudo:
docker compose down`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Declarativo', desc: 'Estado desejado em YAML — o Compose descobre o que criar, atualizar ou remover.', icon: '📋' },
              { label: 'Reproduzível', desc: 'O mesmo arquivo sobe em dev, staging e prod. Fim do "funciona na minha máquina".', icon: '🔁' },
              { label: 'Isolado', desc: 'Cada stack tem suas próprias redes. Dois projetos na mesma máquina não se interferem.', icon: '🔒' },
            ].map(c => (
              <div key={c.label} className="bg-bg-2 border border-border rounded-lg p-4 space-y-2">
                <div className="text-2xl">{c.icon}</div>
                <div className="font-semibold text-text text-sm">{c.label}</div>
                <p className="text-text-3 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Anatomia ──────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Fundamentos</span>
            <h2 className="section-title mt-1">Anatomia do docker-compose.yml</h2>
          </div>

          <CodeBlock code={ANATOMIA} title="docker-compose.yml completo e comentado" />

          <InfoBox title="Cada serviço vira um hostname DNS">
            <p className="text-sm text-text-2">
              Quando o Compose cria a rede, ele registra automaticamente cada serviço pelo seu nome como
              hostname. Então <code className="font-mono">app</code> consegue se conectar ao banco usando
              <code className="font-mono"> db:5432</code> — sem precisar de IP fixo.
              Isso é o DNS interno do Docker funcionando.
            </p>
          </InfoBox>

          <div className="bg-bg-2 border border-[var(--mod)]/30 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-text text-sm flex items-center gap-2">
              <ArrowRight size={16} className="text-[var(--mod)]" />
              As 5 seções principais do docker-compose.yml
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'services', desc: 'Cada container da stack. Nome do serviço = hostname na rede.' },
                { key: 'networks', desc: 'Redes virtuais. Serviços na mesma rede se comunicam; em redes diferentes, não.' },
                { key: 'volumes', desc: 'Armazenamento persistente. Dados sobrevivem a docker compose down.' },
                { key: 'secrets', desc: 'Senhas e tokens montados como arquivo em /run/secrets — nunca como env var.' },
                { key: 'configs', desc: 'Arquivos de configuração (nginx.conf, etc.) injetados de forma controlada.' },
              ].map(s => (
                <div key={s.key} className="flex gap-3">
                  <code className="font-mono text-[var(--mod)] text-sm shrink-0 pt-0.5">{s.key}:</code>
                  <p className="text-text-2 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Primeira Stack ────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Passo 1</span>
            <h2 className="section-title mt-1">Primeira Stack — Nginx simples</h2>
          </div>

          <CodeBlock code={INSTALL_CHECK} title="Verificar instalação do Docker Compose" />
          <CodeBlock code={PRIMEIRA_STACK} title="Subindo o primeiro container com Compose" />

          <InfoBox title="Onde ficam os dados gerados pelo Compose?">
            <p className="text-sm text-text-2">
              O Compose usa o nome do diretório como prefixo do projeto.
              Se o projeto está em <code className="font-mono">~/workshop-compose</code>, todos os recursos
              (networks, volumes, containers) recebem o prefixo <code className="font-mono">workshop-compose_</code>.
              Para mudar: <code className="font-mono">docker compose -p meu-projeto up -d</code>.
            </p>
          </InfoBox>
        </section>

        {/* ── Redes Declarativas ────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Passo 2 — O mais importante</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <Network size={22} className="text-[var(--mod)]" />
              Redes Declarativas — Isolamento de Serviços
            </h2>
          </div>

          <p className="text-text-2 leading-relaxed">
            A killer feature do Compose. Você define quem pode falar com quem. O Nginx não consegue
            conectar no banco de dados — nem por engano, nem por ataque. A única forma de chegar no
            banco é passando pela aplicação.
          </p>

          <div className="bg-bg-2 border border-[var(--mod)]/20 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 space-y-2">
                <div className="text-xs text-text-3 uppercase tracking-wider font-medium">Internet</div>
                <div className="bg-info/10 border border-info/30 rounded-lg p-3 text-center">
                  <div className="text-sm font-mono font-semibold text-info">nginx</div>
                  <div className="text-xs text-text-3">porta 80/443 exposta</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-[var(--mod)] shrink-0 mt-2 sm:mt-0" />
              <div className="flex-1 space-y-2">
                <div className="text-xs text-text-3 uppercase tracking-wider font-medium">Rede: frontend</div>
                <div className="bg-[var(--mod)]/10 border border-[var(--mod)]/30 rounded-lg p-3 text-center">
                  <div className="text-sm font-mono font-semibold text-[var(--mod)]">app</div>
                  <div className="text-xs text-text-3">frontend + backend</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-[var(--mod)] shrink-0 mt-2 sm:mt-0" />
              <div className="flex-1 space-y-2">
                <div className="text-xs text-text-3 uppercase tracking-wider font-medium">Rede: backend (internal)</div>
                <div className="bg-ok/10 border border-ok/30 rounded-lg p-3 text-center">
                  <div className="text-sm font-mono font-semibold text-ok">db</div>
                  <div className="text-xs text-text-3">isolado, sem acesso externo</div>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock code={REDES_ISOLADAS} title="Isolamento de redes — 3 camadas" />

          <WarnBox title="internal: true bloqueia saída para a internet também">
            <p className="text-sm text-text-2">
              Com <code className="font-mono">internal: true</code> na rede backend, o container do banco
              <strong> não consegue acessar a internet</strong> — nem para download de updates.
              Isso é intencional para bancos de dados em produção: ele não precisa de acesso externo e
              não deve ter. Se precisar de acesso de saída, remova o <code className="font-mono">internal: true</code>.
            </p>
          </WarnBox>
        </section>

        {/* ── Volumes ───────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Persistência</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <Database size={22} className="text-[var(--mod)]" />
              Volumes — Dados que Sobrevivem
            </h2>
          </div>

          <CodeBlock code={VOLUMES_TIPOS} title="Tipos de volumes no Docker Compose" />

          <WarnBox title="docker compose down -v apaga os dados">
            <p className="text-sm text-text-2">
              O flag <code className="font-mono">-v</code> em <code className="font-mono">docker compose down -v</code>
              remove <strong>todos os volumes nomeados da stack</strong> — incluindo o banco de dados.
              Para parar sem perder dados: <code className="font-mono">docker compose down</code> (sem o -v).
              Os dados ficam no volume e são reutilizados no próximo <code className="font-mono">docker compose up</code>.
            </p>
          </WarnBox>
        </section>

        {/* ── Env e Secrets ─────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Segurança</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <Lock size={22} className="text-[var(--mod)]" />
              Variáveis de Ambiente e Secrets
            </h2>
          </div>

          <CodeBlock code={ENV_SECRETS} title=".env files e Docker Secrets" />

          <InfoBox title="Por que não colocar senhas em environment: diretamente?">
            <div className="space-y-2 text-sm text-text-2">
              <p>
                Variáveis em <code className="font-mono">environment:</code> aparecem em
                <code className="font-mono"> docker inspect</code>, em logs de CI/CD e podem vazar em
                stack traces. Docker Secrets monta o valor como arquivo em
                <code className="font-mono"> /run/secrets/nome</code> — só o processo do container lê.
              </p>
              <p>
                Regra de ouro: <code className="font-mono">.env</code> e <code className="font-mono">secrets/</code>
                entram no <code className="font-mono">.gitignore</code>. Nunca commitar senhas no repositório.
              </p>
            </div>
          </InfoBox>
        </section>

        {/* ── Stack Completa ────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Produção</span>
            <h2 className="section-title mt-1">Stack Completa — Nginx + App + PostgreSQL</h2>
          </div>

          <CodeBlock code={STACK_COMPLETA} title="docker-compose.prod.yml — produção com TLS e healthcheck" />

          <InfoBox title="deploy.replicas — escala horizontal simples">
            <p className="text-sm text-text-2">
              O campo <code className="font-mono">deploy.replicas: 2</code> sobe 2 instâncias do serviço
              <code className="font-mono"> app</code>. O Nginx faz load balancing automático via DNS round-robin —
              o hostname <code className="font-mono">app</code> resolve para todos os IPs das instâncias.
              Para escala dinâmica: <code className="font-mono">docker compose scale app=5</code>.
            </p>
          </InfoBox>
        </section>

        {/* ── Comandos Essenciais ────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Referência</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <Terminal size={22} className="text-[var(--mod)]" />
              Comandos Essenciais
            </h2>
          </div>

          <CodeBlock code={COMANDOS} title="Ciclo de vida, monitoramento e debug" />
        </section>

        {/* ── Troubleshooting ───────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Debug</span>
            <h2 className="section-title mt-1">Troubleshooting Comum</h2>
          </div>

          <CodeBlock code={TROUBLESHOOT} title="Diagnosticar e resolver problemas" />

          <InfoBox title="docker compose config — seu melhor amigo">
            <p className="text-sm text-text-2">
              Antes de subir a stack, rode <code className="font-mono">docker compose config</code>.
              Ele mostra o YAML final após resolver todas as variáveis de ambiente e merges de arquivos.
              Se uma variável não foi substituída (aparece como <code className="font-mono">$VAR</code>),
              o arquivo <code className="font-mono">.env</code> não está sendo lido.
            </p>
          </InfoBox>
        </section>

        {/* ── Exercícios ────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Prática</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <Terminal size={22} className="text-[var(--mod)]" />
              Exercícios Guiados
            </h2>
          </div>

          {/* Ex 1 */}
          <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">1</span>
              Stack básica do zero ao acesso no browser
            </h3>
            <p className="text-sm text-text-2">
              Crie uma stack com Nginx servindo uma página HTML estática. Verifique os logs e derrube a stack.
            </p>
            <CodeBlock
              title="Exercício 1 — stack simples"
              code={`# Criar estrutura
mkdir -p ~/ex-compose/html && cd ~/ex-compose

# index.html
echo '<h1>Compose funcionando!</h1>' > html/index.html

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    restart: unless-stopped
EOF

# Subir
docker compose up -d

# Verificar
docker compose ps
curl http://localhost:8080

# Logs
docker compose logs -f web

# Limpar (Ctrl+C para sair dos logs)
docker compose down`}
            />
          </div>

          {/* Ex 2 */}
          <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">2</span>
              Redes isoladas — provar que o isolamento funciona
            </h3>
            <p className="text-sm text-text-2">
              Suba uma stack com duas redes e prove que um serviço não consegue alcançar o outro através da rede errada.
            </p>
            <CodeBlock
              title="Exercício 2 — isolamento de rede"
              code={`mkdir -p ~/ex-redes && cd ~/ex-redes

cat > docker-compose.yml << 'EOF'
services:
  frontend:
    image: alpine
    command: sleep 3600
    networks:
      - rede-a

  backend:
    image: alpine
    command: sleep 3600
    networks:
      - rede-a
      - rede-b

  database:
    image: alpine
    command: sleep 3600
    networks:
      - rede-b    # isolado em rede-b

networks:
  rede-a:
  rede-b:
    internal: true
EOF

docker compose up -d

# Teste 1: frontend -> backend (DEVE FUNCIONAR — mesma rede-a)
docker compose exec frontend ping -c 2 backend

# Teste 2: frontend -> database (DEVE FALHAR — redes diferentes)
docker compose exec frontend ping -c 2 database

# Teste 3: backend -> database (DEVE FUNCIONAR — mesma rede-b)
docker compose exec backend ping -c 2 database

docker compose down`}
            />
          </div>

          {/* Ex 3 */}
          <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">3</span>
              PostgreSQL com volume persistente e healthcheck
            </h3>
            <p className="text-sm text-text-2">
              Suba o PostgreSQL com volume nomeado, insira dados, derrube a stack e prove que os dados sobrevivem.
            </p>
            <CodeBlock
              title="Exercício 3 — persistência de dados"
              code={`mkdir -p ~/ex-volume && cd ~/ex-volume

cat > docker-compose.yml << 'EOF'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: workshop
      POSTGRES_USER: aluno
      POSTGRES_PASSWORD: senha123
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aluno -d workshop"]
      interval: 5s
      retries: 5

volumes:
  pgdata:
EOF

# Subir e aguardar ficar healthy
docker compose up -d
docker compose ps   # aguardar Status: healthy

# Inserir dados
docker compose exec db psql -U aluno -d workshop -c "
  CREATE TABLE teste (id serial, msg text);
  INSERT INTO teste (msg) VALUES ('dados persistem!');
  SELECT * FROM teste;
"

# Derrubar a stack (SEM -v — preserva o volume)
docker compose down

# Subir novamente
docker compose up -d
docker compose ps

# Verificar que os dados ainda estão lá
docker compose exec db psql -U aluno -d workshop -c "SELECT * FROM teste;"

# Limpar tudo incluindo volume
docker compose down -v`}
            />
          </div>
        </section>

        {/* ── Badge ─────────────────────────────────────────────────────────── */}
        <HighlightBox title="🐙 Badge: Compose Master">
          <p className="text-sm text-text-2">
            Complete os 3 checkpoints para desbloquear o badge <strong>Compose Master</strong>.
            Você terá orquestrado uma stack completa com redes isoladas, volumes persistentes e
            secrets — exatamente como funciona em produção real.
          </p>
        </HighlightBox>

        <ModuleNav currentPath="/docker-compose" />
      </div>
    </main>
  );
}
