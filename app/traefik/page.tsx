'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { GitMerge, Globe, Shield, Server, Zap, Lock, Network } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function TraefikPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/traefik');
  }, [trackPageVisit]);

  const items = [
    { id: 'traefik-instalado', label: 'Traefik rodando via Docker Compose com dashboard acessível em :8080' },
    { id: 'traefik-https',     label: 'HTTPS automático via ACME configurado e certificado Let\'s Encrypt emitido' },
    { id: 'traefik-middleware',label: 'Middleware de redirect HTTP→HTTPS e basicauth ativos em pelo menos um serviço' },
  ];

  return (
    <main className="module-accent-traefik min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔀</span>
            <div>
              <p className="section-label">Servidores e Serviços — S05</p>
              <h1 className="text-3xl font-bold text-text">Traefik Proxy Reverso</h1>
            </div>
          </div>
          <p className="text-text-2 text-lg max-w-2xl">
            Proxy reverso cloud-native que se configura automaticamente a partir de
            labels Docker. HTTPS com Let's Encrypt em um label, middlewares declarativos
            e dashboard integrado — zero arquivo de configuração por serviço.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Docker labels → HTTPS automático"
          steps={[
            { label: 'docker-compose.yml',    sub: 'Traefik + serviços com labels declarativos',    icon: <Server   size={14}/>, color: 'border-ok/50' },
            { label: 'entrypoints',           sub: 'web :80 e websecure :443 definidos',            icon: <Network  size={14}/>, color: 'border-accent/50' },
            { label: 'router via labels',     sub: 'Host(`app.dominio.com`) → serviço destino',     icon: <GitMerge size={14}/>, color: 'border-info/50' },
            { label: 'middleware',            sub: 'redirect HTTP→HTTPS, basicauth, rate-limit',    icon: <Shield   size={14}/>, color: 'border-layer-5/50' },
            { label: 'ACME / Let\'s Encrypt', sub: 'certificado emitido e renovado automaticamente', icon: <Lock    size={14}/>, color: 'border-layer-6/50' },
            { label: 'dashboard :8080',       sub: 'visualizar rotas, serviços e middlewares',      icon: <Globe    size={14}/>, color: 'border-warn/50' },
          ]}
        />

        {/* Traefik vs Nginx */}
        <section>
          <h2 className="section-title">Traefik vs Nginx como Proxy Reverso</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bg-3 text-text-2">
                  <th className="text-left p-3 border border-border">Critério</th>
                  <th className="text-left p-3 border border-border">Traefik</th>
                  <th className="text-left p-3 border border-border">Nginx</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Configuração</td>
                  <td className="p-3 border border-border">🏆 labels no docker-compose — zero arquivo extra</td>
                  <td className="p-3 border border-border">Arquivo .conf por site — mais verboso</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">Service Discovery</td>
                  <td className="p-3 border border-border">🏆 automático via Docker socket</td>
                  <td className="p-3 border border-border">Manual — atualizar conf e recarregar</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium text-text">SSL automático</td>
                  <td className="p-3 border border-border">🏆 ACME integrado — 1 label resolve</td>
                  <td className="p-3 border border-border">Certbot separado — script + cron</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">Reload sem downtime</td>
                  <td className="p-3 border border-border">🏆 hot reload automático</td>
                  <td className="p-3 border border-border">nginx -s reload (pode dropar conexões)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Dashboard</td>
                  <td className="p-3 border border-border">🏆 UI visual embutida</td>
                  <td className="p-3 border border-border">Nenhum — stub_status (métricas básicas)</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">Performance bruta</td>
                  <td className="p-3 border border-border">Boa (Go)</td>
                  <td className="p-3 border border-border">🏆 excelente (C, event loop)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Curva de aprendizado</td>
                  <td className="p-3 border border-border">Média (conceitos: router/service/middleware)</td>
                  <td className="p-3 border border-border">Menor para sites estáticos simples</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">Uso ideal</td>
                  <td className="p-3 border border-border">Docker/Kubernetes, muitos microserviços</td>
                  <td className="p-3 border border-border">Sites estáticos, alta performance, legado</td>
                </tr>
              </tbody>
            </table>
          </div>
          <InfoBox className="mt-4">
            <strong>Quando escolher Traefik:</strong> você tem múltiplos containers Docker e não quer gerenciar um arquivo de configuração por serviço. Quando escolher Nginx: alta performance para conteúdo estático, ou ambiente sem Docker.
          </InfoBox>
        </section>

        {/* docker-compose base */}
        <section>
          <h2 className="section-title">docker-compose.yml — Stack Básica com Traefik</h2>
          <p className="text-text-2 mb-4">
            O Traefik roda como container e lê os labels dos outros containers via Docker socket.
            Cada serviço declara seu próprio roteamento nas labels.
          </p>
          <CodeBlock lang="yaml" code={`# docker-compose.yml

services:
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    command:
      # API e dashboard
      - "--api.dashboard=true"
      - "--api.insecure=true"          # apenas para desenvolvimento!
      # Provider Docker
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"  # segurança: opt-in
      # Entrypoints
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"                    # dashboard
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"  # leitura do socket
    networks:
      - proxy

  # Serviço de exemplo — app web simples
  whoami:
    image: traefik/whoami
    container_name: whoami
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.rule=Host(\`whoami.localhost\`)"
      - "traefik.http.routers.whoami.entrypoints=web"
      - "traefik.http.services.whoami.loadbalancer.server.port=80"
    networks:
      - proxy

networks:
  proxy:
    external: false`} />
          <CodeBlock lang="bash" code={`# Subir a stack
docker compose up -d

# Verificar containers rodando
docker compose ps

# Acessar o dashboard (desenvolvimento)
# http://localhost:8080/dashboard/

# Testar o whoami (via curl com Host header)
curl -H "Host: whoami.localhost" http://localhost

# Ver logs do Traefik
docker compose logs traefik -f`} />
          <InfoBox className="mt-3">
            <strong>exposedbydefault=false:</strong> sem esse flag, Traefik expõe TODOS os containers automaticamente — risco de segurança. Com ele, só containers com <code>traefik.enable=true</code> são roteados.
          </InfoBox>
        </section>

        {/* HTTPS com ACME */}
        <section>
          <h2 className="section-title">HTTPS Automático com ACME (Let's Encrypt)</h2>
          <p className="text-text-2 mb-4">
            Traefik solicita, valida e renova certificados Let's Encrypt automaticamente.
            Você só precisa de um domínio real apontando para o servidor.
          </p>
          <CodeBlock lang="yaml" code={`# docker-compose.yml — com HTTPS automático

services:
  traefik:
    image: traefik:v3.1
    restart: unless-stopped
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      # ACME — Let's Encrypt
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=seu@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      # Redirect global HTTP → HTTPS
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "letsencrypt:/letsencrypt"     # persistir certificados
    networks:
      - proxy

  meuapp:
    image: nginx:alpine
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      # Router HTTPS
      - "traefik.http.routers.meuapp.rule=Host(\`app.meudominio.com\`)"
      - "traefik.http.routers.meuapp.entrypoints=websecure"
      - "traefik.http.routers.meuapp.tls.certresolver=letsencrypt"
      # Serviço backend
      - "traefik.http.services.meuapp.loadbalancer.server.port=80"
    networks:
      - proxy

volumes:
  letsencrypt:

networks:
  proxy:`} />
          <WarnBox className="mt-3">
            <strong>ACME requer:</strong> (1) domínio DNS apontando para o IP do servidor, (2) porta 80 acessível externamente para o HTTP challenge, (3) arquivo <code>acme.json</code> com permissão 600. Para testes use o servidor de staging: <code>--certificatesresolvers.letsencrypt.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory</code>
          </WarnBox>
          <CodeBlock lang="bash" code={`# Permissão correta para acme.json (automático via volume)
# ou se usar bind mount:
touch /opt/traefik/letsencrypt/acme.json
chmod 600 /opt/traefik/letsencrypt/acme.json

# Verificar certificado emitido
docker compose logs traefik | grep -i "certificate\\|acme\\|tls"

# Ver conteúdo do acme.json (JSON com certs e chaves)
cat /var/lib/docker/volumes/.../acme.json | python3 -m json.tool | head -50`} />
        </section>

        {/* Middlewares */}
        <section>
          <h2 className="section-title">Middlewares — Redirect, BasicAuth e Rate Limit</h2>
          <p className="text-text-2 mb-4">
            Middlewares interceptam requests antes de chegar ao serviço.
            São declarados via labels e reutilizáveis entre vários serviços.
          </p>

          <h3 className="font-semibold text-text mt-6 mb-3">1. Redirect HTTP → HTTPS</h3>
          <CodeBlock lang="yaml" code={`# Via label no serviço (alternativa ao redirect global):
labels:
  - "traefik.enable=true"
  # Router HTTP — redireciona para HTTPS
  - "traefik.http.routers.meuapp-http.rule=Host(\`app.dominio.com\`)"
  - "traefik.http.routers.meuapp-http.entrypoints=web"
  - "traefik.http.routers.meuapp-http.middlewares=redirect-https"
  # Middleware de redirect
  - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
  - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
  # Router HTTPS
  - "traefik.http.routers.meuapp.rule=Host(\`app.dominio.com\`)"
  - "traefik.http.routers.meuapp.entrypoints=websecure"
  - "traefik.http.routers.meuapp.tls.certresolver=letsencrypt"`} />

          <h3 className="font-semibold text-text mt-6 mb-3">2. BasicAuth — Proteger o Dashboard</h3>
          <CodeBlock lang="bash" code={`# Gerar hash da senha (htpasswd)
apt install apache2-utils -y
htpasswd -nb admin senhasegura123
# Saída: admin:$apr1$xyz...  ← copiar isso

# Labels no serviço Traefik:
# (atenção: $ precisa ser escapado como $$ em YAML)
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.dashboard.rule=Host(\`traefik.dominio.com\`)"
  - "traefik.http.routers.dashboard.entrypoints=websecure"
  - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
  - "traefik.http.routers.dashboard.service=api@internal"
  - "traefik.http.routers.dashboard.middlewares=auth"
  - "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$xyz..."`} />

          <h3 className="font-semibold text-text mt-6 mb-3">3. Rate Limiting</h3>
          <CodeBlock lang="yaml" code={`labels:
  # Aplicar rate limit ao router
  - "traefik.http.routers.api.middlewares=ratelimit"
  # Definir o middleware: 100 req/s com burst de 50
  - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"

  # Ou via arquivo traefik.yml (para reuso global):
  # http:
  #   middlewares:
  #     ratelimit:
  #       rateLimit:
  #         average: 100
  #         burst: 50`} />

          <h3 className="font-semibold text-text mt-6 mb-3">4. HSTS + Security Headers</h3>
          <CodeBlock lang="yaml" code={`labels:
  - "traefik.http.routers.meuapp.middlewares=security-headers"
  # Headers de segurança via middleware headers
  - "traefik.http.middlewares.security-headers.headers.stsSeconds=31536000"
  - "traefik.http.middlewares.security-headers.headers.stsIncludeSubdomains=true"
  - "traefik.http.middlewares.security-headers.headers.stsPreload=true"
  - "traefik.http.middlewares.security-headers.headers.forceSTSHeader=true"
  - "traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true"
  - "traefik.http.middlewares.security-headers.headers.browserXssFilter=true"
  - "traefik.http.middlewares.security-headers.headers.frameDeny=true"`} />
        </section>

        {/* Dashboard seguro */}
        <section>
          <h2 className="section-title">Dashboard Traefik — Visualizando Rotas e Serviços</h2>
          <CodeBlock lang="yaml" code={`# Habilitar dashboard com HTTPS e BasicAuth (produção)
services:
  traefik:
    command:
      - "--api.dashboard=true"
      # NÃO usar --api.insecure=true em produção!
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@dominio.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    labels:
      - "traefik.enable=true"
      # Dashboard acessível em traefik.dominio.com com HTTPS
      - "traefik.http.routers.dashboard.rule=Host(\`traefik.dominio.com\`) && (PathPrefix(\`/api\`) || PathPrefix(\`/dashboard\`))"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
      - "traefik.http.routers.dashboard.middlewares=dashboard-auth"
      - "traefik.http.middlewares.dashboard-auth.basicauth.users=admin:$$apr1$$..."`} />
          <InfoBox className="mt-3">
            O dashboard mostra em tempo real: todos os routers registrados e seus estados, serviços (backends) e healthcheck, middlewares ativos por rota e certificados TLS e validade.
          </InfoBox>
        </section>

        {/* Stack completa */}
        <section>
          <h2 className="section-title">Stack Completa — Traefik + App + PostgreSQL</h2>
          <CodeBlock lang="yaml" code={`# docker-compose.yml — stack de produção completa

services:
  traefik:
    image: traefik:v3.1
    restart: unless-stopped
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--certificatesresolvers.le.acme.tlschallenge=true"
      - "--certificatesresolvers.le.acme.email=admin@dominio.com"
      - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - public

  app:
    image: node:20-alpine
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(\`app.dominio.com\`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=le"
      - "traefik.http.routers.app.middlewares=security@file"
      - "traefik.http.services.app.loadbalancer.server.port=3000"
    networks:
      - public
      - internal          # app pode falar com DB, Traefik não

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal          # banco NÃO exposto ao Traefik/internet

volumes:
  letsencrypt:
  pgdata:

networks:
  public:
  internal:
    internal: true        # sem saída para internet`} />
          <InfoBox className="mt-3">
            <strong>Isolamento de rede:</strong> o banco de dados está na rede <code>internal: true</code> — sem acesso externo. O Traefik fica na rede <code>public</code> e só roteia para a <code>app</code>. Exatamente o padrão DMZ que você aprendeu no módulo de WAN/NAT.
          </InfoBox>
        </section>

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows — IIS ARR"
          linuxLabel="Linux — Traefik"
          windowsCode={`# IIS Application Request Routing (ARR)
# Requisitos:
# - IIS instalado
# - Módulo ARR 3.0 (download Microsoft)
# - URL Rewrite Module

# Configuração via GUI:
# IIS Manager → Server → ARR → Proxy
# → Enable proxy → OK

# Regras de proxy via web.config:
<rewrite>
  <rules>
    <rule name="ReverseProxy" stopProcessing="true">
      <match url="(.*)" />
      <action type="Rewrite"
        url="http://backend:3000/{R:1}" />
    </rule>
  </rules>
</rewrite>

# SSL: Certificado manual no IIS
# → Bindings → Add → HTTPS → Selecionar cert`}
          linuxCode={`# Traefik: tudo via labels Docker
# Zero arquivo de configuração por serviço

# Instalar: apenas docker compose up
# Certificado: automático via ACME label

labels:
  - "traefik.enable=true"
  - "traefik.http.routers.app.rule=Host(\`app.com\`)"
  - "traefik.http.routers.app.tls.certresolver=le"

# Adicionar novo serviço:
# 1. Subir container com labels
# 2. Traefik detecta automaticamente
# 3. Certificado emitido em segundos
# Sem reload, sem restart do proxy

# Dashboard em tempo real:
# http://localhost:8080/dashboard/`}
        />

        {/* Troubleshooting */}
        <section>
          <h2 className="section-title">Troubleshooting</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { prob: 'Router não aparece no dashboard',   sol: 'traefik.enable=true está no container? Container na mesma rede que o Traefik? docker compose ps confirma que está rodando?' },
              { prob: 'ACME: certificate not obtained',    sol: 'Porta 80 acessível externamente? DNS apontando para o servidor? Sem firewall bloqueando? Testar com servidor staging primeiro.' },
              { prob: '$ no basicauth causa erro YAML',    sol: 'Escapar como $$ em docker-compose.yml. Ou usar arquivo de secrets: basicauth.usersFile=/run/secrets/users' },
              { prob: 'redirect loop HTTP→HTTPS',          sol: 'Usar redirect global no entrypoint OU labels por serviço, nunca os dois. Verificar logs: docker compose logs traefik' },
            ].map(({ prob, sol }) => (
              <div key={prob} className="bg-bg-2 border border-border rounded-lg p-4">
                <p className="font-semibold text-warn text-sm mb-1">⚠ {prob}</p>
                <p className="text-text-2 text-sm">{sol}</p>
              </div>
            ))}
          </div>
          <CodeBlock lang="bash" code={`# Ver logs do Traefik em tempo real
docker compose logs traefik -f

# Inspecionar labels do container
docker inspect meuapp | grep -A 20 "Labels"

# Verificar redes do container (precisa compartilhar com Traefik)
docker inspect meuapp | grep -A 10 "Networks"

# Testar certificado emitido
openssl s_client -connect app.dominio.com:443 -servername app.dominio.com </dev/null 2>/dev/null | openssl x509 -noout -dates

# Verificar se porta 80/443 estão abertas no firewall
ss -tlnp | grep -E ":80|:443"
iptables -L INPUT -n -v | grep -E "80|443"`} />
        </section>

        {/* Exercícios */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-4">
            {[
              { n: 1, title: 'Stack básica com dashboard',
                desc: 'Suba Traefik + whoami via docker-compose. Acesse o dashboard em :8080 e confirme que o router do whoami aparece. Teste com curl -H "Host: whoami.localhost" http://localhost.' },
              { n: 2, title: 'HTTPS automático com ACME',
                desc: 'Com um domínio real apontando para seu servidor, configure o resolver Let\'s Encrypt e suba um serviço com o label tls.certresolver. Confirme o certificado com openssl s_client.' },
              { n: 3, title: 'Dashboard seguro + middlewares',
                desc: 'Proteja o dashboard com BasicAuth. Adicione middleware de redirect HTTP→HTTPS e HSTS headers a um serviço. Teste: acesso sem credenciais deve retornar 401; HTTP deve redirecionar para HTTPS.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-bg-2 border border-border rounded-lg p-4 flex gap-4">
                <span className="text-accent font-bold text-xl min-w-[1.5rem]">{n}</span>
                <div>
                  <p className="font-semibold text-text">{title}</p>
                  <p className="text-text-2 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section>
          <h2 className="section-title">Checklist do Lab</h2>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                />
                <span className={`text-sm ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2'} group-hover:text-text transition-colors`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <p className="text-ok font-semibold">🔀 Traefik Master desbloqueado!</p>
              <p className="text-text-2 text-sm mt-1">Proxy reverso cloud-native com HTTPS automático e middlewares configurados.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'HTTPS com Let\'s Encrypt falha — certificate resolver error: acme: error 403',
              fix: 'Verificar que o domínio aponta para o IP público correto: dig A dominio.com. A porta 80 deve estar acessível para o HTTP-01 challenge. Confirmar que acme.json tem permissão 600: chmod 600 acme.json. Testar com o servidor de staging primeiro: caServer: "https://acme-staging-v02.api.letsencrypt.org/directory".',
            },
            {
              err: 'Container não é roteado — Traefik não detecta o serviço',
              fix: 'Verificar que o container tem a label traefik.enable=true e está na mesma rede Docker que o Traefik. Se exposedByDefault=false (recomendado), a label é obrigatória. Ver no dashboard (porta 8080) se o router aparece. Logs do Traefik: docker logs traefik | grep ERROR.',
            },
            {
              err: 'Redirect HTTP→HTTPS não funciona — loop de redirect ou 404',
              fix: 'O entrypoint de redirecionamento deve apontar para websecure, não para si mesmo. Configurar: traefik.http.routers.app-http.middlewares=redirect-https e o middleware: traefik.http.middlewares.redirect-https.redirectscheme.scheme=https. Verificar que o router HTTPS tem tls: true.',
            },
            {
              err: 'Middleware basicAuth bloqueia todos — senha não funciona',
              fix: 'Formato do hash htpasswd precisa de escape no YAML: $ vira $$. Gerar: echo $(htpasswd -nb user senha) | sed -e s/\\$/\\$\\$/g. Verificar o valor no label: traefik.http.middlewares.auth.basicauth.users. Testar com curl -u user:senha https://dominio.com.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        <ModuleNav currentPath="/traefik" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
