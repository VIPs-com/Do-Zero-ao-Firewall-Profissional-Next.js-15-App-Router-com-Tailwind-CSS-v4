'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import {
  Activity,
  Database,
  BarChart3,
  Search,
  Layers,
  AlertOctagon,
  CheckCircle,
  AlertTriangle,
  Send,
  Boxes as BoxesIcon,
} from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint OBSERVABILIDADE-STACK — Logs centralizados em escala.
   Concretiza o HorizonteBox prometido em /rsyslog: Loki + ELK como
   as duas grandes escolas de pipeline de logs, lado a lado.
   Alinhado a SRE e CompTIA Linux+. */

type OsTab = 'loki' | 'elk' | 'escolha';

const CHECKLIST_ITEMS = [
  { id: 'loki-instalado',     label: 'Subi a stack Loki + Promtail + Grafana com docker-compose, configurei scrape_configs do Promtail e rodei uma query LogQL no Explore do Grafana' },
  { id: 'elk-stack',          label: 'Subi Elasticsearch + Kibana + Filebeat (ou Logstash com pipeline grok), abri o Kibana Discover e criei um index pattern' },
  { id: 'dashboards-prontos', label: 'Importei pelo menos um dashboard pronto (Grafana 13639/12559 ou Kibana sample) e mapeei quando usar Loki vs ELK no meu cenário' },
];

export default function ObservabilidadeStackPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<OsTab>('loki');

  useEffect(() => {
    trackPageVisit('/observabilidade-stack');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-observabilidade-stack min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Observabilidade Stack</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Logs em Escala</div>
          <h1 className="text-4xl font-bold mb-4">📊 Observabilidade Stack — Loki + ELK</h1>
          <p className="text-text-2 text-lg mb-6">
            O módulo <Link href="/rsyslog" className="text-accent underline">/rsyslog</Link>{' '}
            ensinou a centralizar logs com a fundação que todo Linux carrega. Quando a frota cresce
            — dezenas de servidores, contêineres efêmeros, microsserviços — o syslog puro vira um
            cemitério de arquivos <code>.gz</code>. Este módulo apresenta as <strong>duas grandes
            escolas</strong> de pipeline moderno de logs:{' '}
            <strong>Loki + Promtail + Grafana</strong> (a opção barata e &quot;Prometheus-like&quot;,
            indexa <em>labels</em>) e o <strong>ELK Stack</strong> (Elasticsearch + Logstash +
            Kibana — o histórico full-text search, caro porém poderoso).
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado a SRE (logs como o segundo pilar da observabilidade) e CompTIA Linux+.
          </p>
        </div>

        <FluxoCard
          title="Pipeline genérico de logs em escala"
          steps={[
            { label: 'Apps / syslog', sub: 'origem — journald, /var/log, stdout de contêiner', icon: <Activity size={14}/>,  color: 'border-text-3/50' },
            { label: 'Coletor',       sub: 'Promtail / Vector / Filebeat / Logstash',         icon: <Send size={14}/>,      color: 'border-info/50' },
            { label: 'Armazenamento', sub: 'Loki (chunks) ou Elasticsearch (índice inv.)',    icon: <Database size={14}/>,  color: 'border-accent/50' },
            { label: 'UI / Query',    sub: 'Grafana (LogQL) ou Kibana (KQL/Lucene)',          icon: <BarChart3 size={14}/>, color: 'border-warn/50' },
            { label: 'Alertas',       sub: 'Alertmanager / Loki Ruler / Watcher',             icon: <AlertOctagon size={14}/>, color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'loki',    label: '🟠 Loki + Promtail + Grafana' },
              { id: 'elk',     label: '🔵 ELK Stack Clássico' },
              { id: 'escolha', label: '⚖️ Quando escolher cada um' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OsTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive(tab.id)
                    ? 'border-[var(--mod)] text-text'
                    : 'border-transparent text-text-2 hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB 1 — Loki + Promtail + Grafana ── */}
        {isActive('loki') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Por que Loki — a filosofia &quot;Prometheus para logs&quot;</h2>
          <p className="text-text-2 mb-4">
            O <strong>Grafana Loki</strong> nasceu com uma decisão arquitetural ousada:{' '}
            <strong>não indexa o conteúdo dos logs</strong>. Indexa apenas um conjunto pequeno de{' '}
            <em>labels</em> (<code>job</code>, <code>app</code>, <code>env</code>, <code>instance</code>) —
            exatamente como o Prometheus faz com métricas. O texto da linha é jogado em{' '}
            <em>chunks</em> comprimidos no disco ou em object storage (S3, GCS, MinIO).
          </p>
          <p className="text-text-2 mb-4">
            A consequência prática é dramática: o custo de armazenamento e a RAM necessária caem
            em uma ou duas ordens de grandeza comparado ao Elasticsearch. O preço a pagar é que{' '}
            <em>full-text search</em> verdadeiro (&quot;ache a palavra <code>panic</code> em
            qualquer lugar dos últimos 30 dias&quot;) é mais lento — Loki faz <em>grep</em> dentro
            dos chunks que casaram pelos labels.
          </p>
          <InfoBox title="Loki + Prometheus = par natural">
            Se você já roda <Link href="/monitoring" className="text-accent underline">
            Prometheus + Grafana</Link> para métricas, Loki encaixa sem fricção: mesmos labels,
            mesmo Grafana, mesma sintaxe de seletor (<code>{`{job="nginx",env="prod"}`}</code>).
            Você navega de uma métrica de erro para os logs correlacionados em um clique no Explore.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Arquitetura — três peças, papéis distintos</h2>
          <FluxoCard
            title="Caminho de um log até o Grafana"
            steps={[
              { label: 'App / syslog', sub: 'gera linhas',                          icon: <Activity size={14}/>,  color: 'border-text-3/50' },
              { label: 'Promtail',     sub: 'agente — lê, etiqueta com labels',     icon: <Send size={14}/>,      color: 'border-info/50' },
              { label: 'Loki',         sub: 'recebe, comprime em chunks',           icon: <Database size={14}/>,  color: 'border-accent/50' },
              { label: 'Grafana',      sub: 'Explore + LogQL + dashboards',         icon: <BarChart3 size={14}/>, color: 'border-warn/50' },
              { label: 'Loki Ruler',   sub: 'alertas baseados em logs',             icon: <AlertOctagon size={14}/>, color: 'border-ok/50' },
            ]}
          />
          <ul className="text-text-2 space-y-2 mb-4 list-disc pl-5">
            <li><strong>Promtail</strong> — agente oficial, escrito em Go, lê arquivos, journald e/ou syslog, anexa labels e empurra para o Loki via HTTP. Concorrentes modernos: <em>Vector</em> (Datadog, mais flexível em transformações) e <em>Fluent Bit</em>.</li>
            <li><strong>Loki</strong> — servidor de ingestão e query. Modo <em>monolithic</em> para começar; <em>microservices</em> (distributor, ingester, querier, compactor) para escalar.</li>
            <li><strong>Grafana</strong> — a UI única para métricas (Prometheus) <em>e</em> logs (Loki). Explore mostra histograma de volume + as linhas.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Stack mínima com docker-compose</h2>
          <CodeBlock lang="yaml" title="docker-compose.yml" code={`services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - loki-data:/loki

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - /var/log:/var/log:ro                       # logs do host
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
    depends_on: [loki]

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on: [loki]

volumes:
  loki-data:
  grafana-data:`} />
          <p className="text-text-2 mt-4 mb-2">
            Sobe com <code>docker compose up -d</code>. No Grafana (<code>http://localhost:3000</code>,
            login <code>admin/admin</code>), adicione um data source <strong>Loki</strong> apontando
            para <code>http://loki:3100</code> e abra o <strong>Explore</strong>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. promtail-config.yml — scrape_configs mínimos</h2>
          <p className="text-text-2 mb-4">
            O Promtail toma emprestada a estética de configuração do Prometheus.{' '}
            <code>scrape_configs</code> define <em>jobs</em>, cada um com <code>static_configs</code>{' '}
            que dizem <strong>onde ler</strong> e <strong>quais labels</strong> anexar antes de
            empurrar para o Loki.
          </p>
          <CodeBlock lang="yaml" title="promtail-config.yml" code={`server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml      # onde parou em cada arquivo (resume após restart)

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # 1) Logs do sistema
  - job_name: syslog
    static_configs:
      - targets: [localhost]
        labels:
          job: syslog
          host: srv01
          __path__: /var/log/syslog

  # 2) Nginx access + error
  - job_name: nginx
    static_configs:
      - targets: [localhost]
        labels:
          job: nginx
          app: web
          __path__: /var/log/nginx/*.log

  # 3) Aplicação que joga em stdout do contêiner
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        target_label: 'container'`} />
          <WarnBox title="Cardinalidade explosiva — o pecado capital do Loki">
            Loki é barato porque tem <em>poucos labels com poucos valores distintos</em>. Se você
            criar um label <code>user_id</code> com 100.000 valores ou <code>request_id</code> com
            milhões, o índice explode e o cluster derrete. Regra de ouro: <strong>labels para
            agrupar (job, app, env, host, level), nunca para identificar (user_id, trace_id)</strong>.
            Identificadores ficam no <em>texto</em> da linha e são filtrados depois com{' '}
            <code>|=</code>.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. LogQL — o &quot;PromQL para logs&quot;</h2>
          <p className="text-text-2 mb-4">
            LogQL tem duas formas: <strong>log queries</strong> (devolvem linhas) e{' '}
            <strong>metric queries</strong> (devolvem séries numéricas — taxa de eventos por
            segundo, percentis, contagens). O seletor de labels usa a mesma sintaxe do Prometheus.
          </p>
          <CodeBlock lang="text" title="LogQL — receitas essenciais" code={`# 1) Todos os logs do Nginx em produção
{job="nginx", env="prod"}

# 2) Só linhas contendo "ERROR" (filtro de linha)
{job="nginx"} |= "ERROR"

# 3) Excluir ruído de health-checks
{job="nginx"} |= "ERROR" != "/healthz"

# 4) Regex case-insensitive
{job="api"} |~ "(?i)panic|fatal|segfault"

# 5) Parser JSON — extrai campos como rótulos temporários
{job="api"} | json | level="error" | http_status >= 500

# 6) Taxa de erros por segundo nos últimos 5min
rate({app="api"} |= "panic" [5m])

# 7) Top 5 hosts que mais logam erro na última hora
topk(5, sum by (host) (count_over_time({level="error"}[1h])))

# 8) Histograma de latência extraída do log
quantile_over_time(0.99,
  {app="api"} | json | unwrap latency_ms [5m]
)`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Integração com /rsyslog — sem reescrever nada</h2>
          <p className="text-text-2 mb-4">
            Se a infra já manda tudo para um servidor central via{' '}
            <Link href="/rsyslog" className="text-accent underline">rsyslog</Link>, você{' '}
            <em>não precisa</em> instalar Promtail em cada host. Basta apontar o rsyslog do
            servidor central para o Promtail (que escuta syslog) — ou usar o driver de log{' '}
            <code>syslog</code> direto do Docker.
          </p>
          <CodeBlock lang="text" title="Promtail recebendo syslog (trecho do promtail-config.yml)" code={`scrape_configs:
  - job_name: syslog-listener
    syslog:
      listen_address: 0.0.0.0:1514
      labels:
        job: syslog
    relabel_configs:
      - source_labels: ['__syslog_message_hostname']
        target_label:   'host'
      - source_labels: ['__syslog_message_app_name']
        target_label:   'app'`} />
          <CodeBlock lang="text" title="/etc/rsyslog.d/60-loki.conf — encaminhar TODO log para Promtail" code={`# Envia em RFC5424 (formato moderno) via TCP para o Promtail
*.* @@promtail-host:1514;RSYSLOG_SyslogProtocol23Format`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Dashboards prontos — atalho honesto</h2>
          <p className="text-text-2 mb-4">
            O Grafana hospeda um <strong>marketplace</strong> de dashboards JSON em{' '}
            <code>grafana.com/dashboards</code>. Importar por ID economiza horas:
          </p>
          <ul className="text-text-2 space-y-1 mb-4 list-disc pl-5">
            <li><strong>13639</strong> — &quot;Logs / App Nginx&quot; — visão executiva (top status codes, requisições por segundo, top URLs com erro).</li>
            <li><strong>12559</strong> — &quot;Loki &amp; Promtail&quot; — saúde da própria stack (ingestão, latência de queries, chunks).</li>
            <li><strong>13186</strong> — &quot;Syslog Logs&quot; — quando o coletor escuta syslog.</li>
          </ul>
          <CodeBlock lang="text" code={`# No Grafana: + → Import → cole o ID → selecione o data source Loki → Import`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['loki-instalado']} onChange={e => updateChecklist('loki-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['loki-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 — ELK ── */}
        {isActive('elk') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. ELK — o stack histórico que ainda dita o mercado</h2>
          <p className="text-text-2 mb-4">
            Antes do Loki existir, &quot;centralizar logs&quot; era praticamente sinônimo de{' '}
            <strong>ELK Stack</strong> — sigla de <strong>Elasticsearch</strong> (banco de busca
            invertida), <strong>Logstash</strong> (pipeline de ingestão) e <strong>Kibana</strong>{' '}
            (UI). A fundação Elastic depois adicionou os <strong>Beats</strong> (agentes leves: Filebeat
            para logs, Metricbeat para métricas, Auditbeat etc.) e o pacote passou a se chamar{' '}
            <strong>Elastic Stack</strong>.
          </p>
          <p className="text-text-2 mb-4">
            O coração é o Elasticsearch: um motor distribuído de <strong>índice invertido</strong>{' '}
            (mesmo princípio do Lucene/Solr) que indexa <em>cada palavra</em> de cada documento.
            Isso dá um superpoder que Loki não tem — <strong>full-text search verdadeiro com
            agregações pesadas em segundos</strong> — mas cobra caro em RAM, CPU e disco.
          </p>
          <InfoBox title="OpenSearch — o fork da AWS">
            Em 2021, a Elastic mudou a licença do Elasticsearch para SSPL (não-OSI-aprovada). A
            AWS bifurcou a última versão Apache 2.0 e mantém o <strong>OpenSearch</strong> +{' '}
            <strong>OpenSearch Dashboards</strong> como alternativa 100% open source. APIs e
            arquitetura são praticamente idênticas — a maioria das receitas ELK funciona em
            OpenSearch trocando os nomes.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Arquitetura — Beats / Logstash → Elasticsearch → Kibana</h2>
          <FluxoCard
            title="Pipeline ELK clássico"
            steps={[
              { label: 'Filebeat / app',  sub: 'agente leve no host',                 icon: <Send size={14}/>,      color: 'border-info/50' },
              { label: 'Logstash',        sub: 'parse com grok, enriquecimento',      icon: <Layers size={14}/>,    color: 'border-warn/50' },
              { label: 'Elasticsearch',   sub: 'índice invertido, sharding',          icon: <Database size={14}/>,  color: 'border-accent/50' },
              { label: 'Kibana',          sub: 'Discover, Visualize, Dashboards',     icon: <BarChart3 size={14}/>, color: 'border-ok/50' },
              { label: 'Watcher / Alert', sub: 'alertas em queries Lucene/EQL',       icon: <AlertOctagon size={14}/>, color: 'border-err/50' },
            ]}
          />
          <p className="text-text-2 mt-4">
            <strong>Logstash não é obrigatório.</strong> Filebeat fala direto com Elasticsearch e
            os <strong>Ingest Pipelines</strong> (rodam dentro do próprio Elasticsearch) cobrem
            quase tudo que Logstash fazia — com menos JVM no caminho. Logstash continua melhor
            para <em>fan-out</em> complexo (entrada de múltiplas fontes, saída para vários
            destinos, transformações pesadas).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Stack mínima com docker-compose (1 nó)</h2>
          <WarnBox title="Stack ELK pede RAM — não rode em laptop pequeno">
            Elasticsearch reserva memória de heap (JVM) de forma agressiva. O default pede{' '}
            <strong>2 GB de heap só para ele</strong>, e ainda precisa de RAM livre para o cache
            de filesystem (Lucene). Para laboratório, force um heap baixo (1 GB) — e nem assim
            espere milagre com menos de 4 GB de RAM no host.
          </WarnBox>
          <CodeBlock lang="yaml" title="docker-compose.yml" code={`services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.13.0
    container_name: es01
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false            # laboratório! produção = true + TLS
      - ES_JAVA_OPTS=-Xms1g -Xmx1g              # limita o heap
    ports:
      - "9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data
    ulimits:
      memlock: { soft: -1, hard: -1 }

  kibana:
    image: docker.elastic.co/kibana/kibana:8.13.0
    container_name: kib01
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on: [elasticsearch]

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.13.0
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    depends_on: [elasticsearch]

volumes:
  es-data:`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. filebeat.yml — coleta direta para o Elasticsearch</h2>
          <CodeBlock lang="yaml" title="filebeat.yml" code={`filebeat.inputs:
  - type: filestream
    id: syslog
    enabled: true
    paths:
      - /var/log/syslog
      - /var/log/auth.log

  - type: filestream
    id: nginx
    enabled: true
    paths:
      - /var/log/nginx/*.log

# Módulos prontos — Filebeat tem dezenas (nginx, apache, system, audit, mysql...)
filebeat.config.modules:
  path: ${'${path.config}'}/modules.d/*.yml
  reload.enabled: false

output.elasticsearch:
  hosts: ["http://elasticsearch:9200"]
  index: "filebeat-%{+yyyy.MM.dd}"

setup.kibana:
  host: "http://kibana:5601"

# Filebeat consegue carregar dashboards prontos no Kibana
setup.dashboards.enabled: true`} />
          <p className="text-text-2 mt-3">
            O bloco <code>setup.dashboards.enabled: true</code> + <code>filebeat setup</code>{' '}
            instala <strong>dashboards prontos no Kibana</strong> para Nginx, Apache, Auth log,
            etc. — atalho honesto e funcional para começar.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. Logstash com pipeline grok (quando faz sentido)</h2>
          <p className="text-text-2 mb-4">
            <strong>grok</strong> é a linguagem de pattern matching do Logstash — regex nomeada,
            pronta para extrair campos de linhas semi-estruturadas (logs do Apache, syslog,
            firewall). O pipeline tem 3 estágios: <code>input</code> → <code>filter</code> →{' '}
            <code>output</code>.
          </p>
          <CodeBlock lang="text" title="logstash/pipeline/nginx.conf" code={`input {
  beats { port => 5044 }                                # recebe de Filebeat
}

filter {
  if [fileset][name] == "access" {
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" } # parser pronto do Logstash
    }
    date {
      match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
    }
    geoip {
      source => "clientip"                              # enriquece com país/cidade
    }
    mutate {
      convert => { "response" => "integer" }
      convert => { "bytes"    => "integer" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "nginx-%{+YYYY.MM.dd}"
  }
}`} />
          <InfoBox title="Ingest Pipeline = grok dentro do Elasticsearch">
            Para 80% dos casos, o mesmo grok pode rodar como{' '}
            <em>Ingest Pipeline</em> dentro do próprio Elasticsearch — sem JVM extra do Logstash.
            Veja <code>PUT _ingest/pipeline/nginx-access</code> na API do Elasticsearch. Use
            Logstash quando precisar de múltiplas saídas (ES + Kafka + S3) ou plugins exóticos.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">13. Kibana Discover + dashboards prontos</h2>
          <p className="text-text-2 mb-4">
            No Kibana (<code>http://localhost:5601</code>), o fluxo é:
          </p>
          <ol className="text-text-2 space-y-2 mb-4 list-decimal pl-5">
            <li><strong>Stack Management → Index Patterns</strong> — crie <code>filebeat-*</code> apontando para o timestamp <code>@timestamp</code>.</li>
            <li><strong>Discover</strong> — a interface tipo &quot;tail&quot;. Filtre com KQL: <code>host.name : &quot;srv01&quot; and log.level : &quot;error&quot;</code>.</li>
            <li><strong>Visualize → Dashboard</strong> — gráficos de barras, pizzas, mapas. Filebeat já vem com <em>Web traffic</em>, <em>Security: Auth logs</em>, <em>System: SSH login attempts</em>.</li>
            <li><strong>Stack Management → Watcher</strong> (ou Alerting) — alertas: &quot;mais de 50 erros 5xx no Nginx em 5 minutos&quot;.</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">14. Auditd → Filebeat — fechando o ciclo com /seguranca-avancada</h2>
          <p className="text-text-2 mb-4">
            O Filebeat tem um <strong>módulo &quot;auditd&quot;</strong> que lê o{' '}
            <code>/var/log/audit/audit.log</code> gerado pelo{' '}
            <Link href="/seguranca-avancada" className="text-accent underline">auditd</Link>{' '}
            e empurra cada evento já estruturado (JSON com <code>event.action</code>,{' '}
            <code>file.path</code>, <code>user.name</code>) para o Elasticsearch — e ganha um
            dashboard de segurança pronto no Kibana.
          </p>
          <CodeBlock lang="bash" code={`# No host com auditd
sudo filebeat modules enable auditd

# /etc/filebeat/modules.d/auditd.yml — já vem ativado
# Reinicie
sudo systemctl restart filebeat

# No Kibana, vá em Discover → index pattern filebeat-* → filtre event.module: auditd`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['elk-stack']} onChange={e => updateChecklist('elk-stack', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['elk-stack'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 — Escolha & dashboards prontos ── */}
        {isActive('escolha') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">15. Loki vs ELK — tabela comparativa honesta</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-border">
              <thead className="bg-bg-3">
                <tr>
                  <th className="text-left p-3 border-b border-border">Critério</th>
                  <th className="text-left p-3 border-b border-border">🟠 Loki + Grafana</th>
                  <th className="text-left p-3 border-b border-border">🔵 ELK Stack</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-t border-border"><td className="p-3 font-medium">Modelo de indexação</td><td className="p-3">Apenas labels (pequeno)</td><td className="p-3">Índice invertido full-text (grande)</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Custo de armazenamento</td><td className="p-3">Baixo — chunks comprimidos em S3/disco</td><td className="p-3">Alto — índice ocupa 2-5× o tamanho dos dados</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">RAM mínima realista</td><td className="p-3">512 MB para começar</td><td className="p-3">4 GB para um nó mínimo</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Full-text search complexo</td><td className="p-3">Lento (grep dentro de chunks)</td><td className="p-3">Excepcional — milissegundos em TB</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Agregações estatísticas</td><td className="p-3">Bom para taxas e contagens</td><td className="p-3">Excelente — histogramas, percentis, geo</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Curva de aprendizado</td><td className="p-3">Suave se você já sabe PromQL</td><td className="p-3">Íngreme — KQL/Lucene/ESQL/EQL/Watcher</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Integração com métricas</td><td className="p-3">Nativa — Prometheus + Grafana</td><td className="p-3">Boa via Metricbeat, mas universo separado</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Caso de uso SIEM</td><td className="p-3">Limitado</td><td className="p-3">Padrão de mercado (Elastic Security)</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-medium">Licença</td><td className="p-3">AGPLv3 (open core)</td><td className="p-3">SSPL (ou OpenSearch — Apache 2.0)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">16. Regras práticas de escolha</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-lg bg-bg-2 border border-accent/40">
              <div className="flex items-center gap-2 mb-3">
                <BoxesIcon size={18} className="text-accent" />
                <p className="font-bold text-text">Use Loki quando...</p>
              </div>
              <ul className="text-sm text-text-2 space-y-2 list-disc pl-5">
                <li>Você já roda Prometheus + Grafana e quer correlacionar métricas e logs no mesmo painel.</li>
                <li>Os logs são majoritariamente de <strong>aplicações modernas</strong> (microsserviços, contêineres, Kubernetes).</li>
                <li>O orçamento de RAM/disco é apertado e o cluster precisa escalar horizontalmente em commodity hardware ou object storage.</li>
                <li>Os filtros principais usam <em>labels</em> (job/app/env) e <em>palavras-chave</em>, não regex complexa em TB de texto.</li>
              </ul>
            </div>
            <div className="p-5 rounded-lg bg-bg-2 border border-info/40">
              <div className="flex items-center gap-2 mb-3">
                <Search size={18} className="text-info" />
                <p className="font-bold text-text">Use ELK quando...</p>
              </div>
              <ul className="text-sm text-text-2 space-y-2 list-disc pl-5">
                <li>Você precisa de <strong>full-text search verdadeiro</strong> (analista pesquisa pelo conteúdo, sem saber o label).</li>
                <li>O caso de uso é <strong>SIEM</strong> / compliance — Elastic Security é referência de mercado.</li>
                <li>O time vai construir <strong>dashboards analíticos pesados</strong> com agregações (geo, histogramas, percentis).</li>
                <li>Há orçamento para RAM e a operação aceita a complexidade de cluster + shards.</li>
              </ul>
            </div>
          </div>
          <InfoBox title="Stacks híbridas existem">
            Não é raro grandes operações rodarem <em>os dois</em>: Loki para logs operacionais de
            aplicação (barato, correlacionado com Prometheus) <em>e</em> Elastic Security para
            logs de auditoria/segurança que exigem retenção longa e busca forense. Cada um na sua
            força.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">17. Diferença entre /monitoring, /rsyslog e este módulo</h2>
          <ul className="text-text-2 space-y-2 mb-4 list-disc pl-5">
            <li>
              <Link href="/monitoring" className="text-accent underline">/monitoring</Link>{' '}
              cobre <strong>métricas</strong> (Prometheus + Grafana + Alertmanager) — o{' '}
              <em>primeiro pilar</em> da observabilidade.
            </li>
            <li>
              <Link href="/rsyslog" className="text-accent underline">/rsyslog</Link>{' '}
              cobre <strong>logs locais e centralização clássica</strong> — a fundação que todo
              Linux carrega, perfeita para um servidor ou pequena frota.
            </li>
            <li>
              <strong>Este módulo</strong> cobre <strong>logs em escala</strong> — quando a frota
              cresce, os contêineres viram efêmeros e o syslog clássico vira um cemitério de{' '}
              <code>.gz</code>. Loki e ELK são as duas grandes escolas modernas.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">18. Dashboards prontos — os IDs que valem decorar</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-border">
              <thead className="bg-bg-3">
                <tr>
                  <th className="text-left p-3 border-b border-border">UI</th>
                  <th className="text-left p-3 border-b border-border">ID / Nome</th>
                  <th className="text-left p-3 border-b border-border">O que mostra</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-t border-border"><td className="p-3">Grafana (Loki)</td><td className="p-3 font-mono">13639</td><td className="p-3">Logs / App — Nginx (status codes, top URLs com erro)</td></tr>
                <tr className="border-t border-border"><td className="p-3">Grafana (Loki)</td><td className="p-3 font-mono">12559</td><td className="p-3">Saúde da própria stack Loki + Promtail</td></tr>
                <tr className="border-t border-border"><td className="p-3">Grafana (Loki)</td><td className="p-3 font-mono">13186</td><td className="p-3">Syslog Logs — quando o coletor escuta syslog</td></tr>
                <tr className="border-t border-border"><td className="p-3">Grafana (Prom)</td><td className="p-3 font-mono">1860</td><td className="p-3">Node Exporter Full — métricas do host (referência clássica)</td></tr>
                <tr className="border-t border-border"><td className="p-3">Kibana</td><td className="p-3">Filebeat sample dashboards</td><td className="p-3">Web traffic, SSH login attempts, system metrics — instalados via <code>filebeat setup</code></td></tr>
                <tr className="border-t border-border"><td className="p-3">Kibana</td><td className="p-3">Elastic Security</td><td className="p-3">SIEM completo — auditd, network, host (módulo pago em alguns recursos)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">19. Roteiro de migração — syslog clássico → Loki sem trauma</h2>
          <p className="text-text-2 mb-4">
            A virada do <Link href="/rsyslog" className="text-accent underline">rsyslog</Link>{' '}
            para Loki não exige reescrever a configuração dos servidores — eles continuam mandando
            para o servidor central. O que muda é o que o servidor central <em>faz</em> com os
            logs:
          </p>
          <ol className="text-text-2 space-y-2 mb-4 list-decimal pl-5">
            <li>Suba a stack Loki + Promtail + Grafana ao lado do servidor rsyslog atual (não substitua ainda).</li>
            <li>Adicione no rsyslog central uma regra que <em>também</em> encaminha para o Promtail (porta 1514 TCP RFC5424).</li>
            <li>Rode em paralelo por 1-2 semanas — confirme que todas as queries que a equipe faz no <code>grep</code>/<code>ausearch</code> têm equivalente em LogQL.</li>
            <li>Importe dashboards prontos (13639, 12559) e crie 2-3 alertas no Loki Ruler.</li>
            <li>Reduza retenção do rsyslog antigo (mantenha cópia fria por mais um trimestre) e desligue.</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">20. Alertas — Alertmanager + Loki Ruler</h2>
          <p className="text-text-2 mb-4">
            Logs sem alertas é log que ninguém lê. O <strong>Loki Ruler</strong> reaproveita o
            mesmo Alertmanager do Prometheus — você descreve regras em YAML, ele avalia LogQL
            periodicamente e dispara via o webhook/email/Slack que o Alertmanager já conhece.
          </p>
          <CodeBlock lang="yaml" title="loki-rules.yaml — alerta por taxa de erros" code={`groups:
  - name: api-erros
    interval: 1m
    rules:
      - alert: APIErrosCriticos
        expr: |
          sum(rate({app="api"} |~ "(?i)panic|fatal" [5m])) by (env)
          > 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Mais de 1 evento crítico/s no API ({{ $labels.env }})"
          runbook: "https://wiki.empresa/runbooks/api-panic"`} />

          <WindowsComparisonBox
            windowsLabel="Windows (Azure Monitor + Log Analytics + App Insights)"
            linuxLabel="Linux (Loki + Grafana / ELK + Kibana)"
            windowsCode={`# Stack Microsoft de observabilidade em escala
# - Log Analytics Workspace: armazena logs (KQL para consultar)
# - Azure Monitor: métricas + alertas
# - Application Insights: APM + traces distribuídos
# - Sentinel: camada SIEM por cima do Log Analytics

# Consulta KQL no Log Analytics
AzureDiagnostics
| where ResourceType == "VIRTUALMACHINES"
| where Category == "Syslog"
| where SeverityLevel_s == "err"
| summarize count() by Computer, bin(TimeGenerated, 5m)

# Alerta — KQL no portal Azure, dispara Action Group
# (email/SMS/webhook/Logic App/Function)`}
            linuxCode={`# Stack open source equivalente — duas escolas
# Loki:
{job="syslog"} | json | level="err"
| count_over_time([5m])
# Loki Ruler → Alertmanager → Slack/PagerDuty

# ELK:
GET filebeat-*/_search
{
  "query": { "bool": { "must": [
    { "match": { "log.level": "error" } },
    { "range": { "@timestamp": { "gte": "now-5m" } } }
  ]}}
}
# Kibana Alerting → Connector (Slack/Email/Webhook)`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['dashboards-prontos']} onChange={e => updateChecklist('dashboards-prontos', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['dashboards-prontos'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Elasticsearch consumindo toda a RAM do host sem heap limit', sol: 'Sem definir ES_JAVA_OPTS=-Xms?g -Xmx?g, a JVM reserva metade da RAM do contêiner (ou do host) — e ainda compete com o cache de filesystem que o Lucene precisa. Em laboratório fixe heap em 1 GB; em produção, regra clássica: heap = 50% da RAM do nó, MAX 32 GB (acima disso a JVM perde o pointer compression). Sempre rode com memlock soft/hard = -1 e vm.max_map_count >= 262144.' },
              { erro: 'Promtail não lê /var/log/syslog por falta de permissão', sol: 'O contêiner do Promtail roda como usuário não-root por padrão, mas /var/log/syslog é owned por syslog:adm em modo 640. Sintoma: positions.yaml fica vazio, nenhuma linha chega no Loki. Soluções: rodar Promtail como user: root no compose, ajustar ACL do arquivo (setfacl -m u:10001:r /var/log/syslog), ou usar journald em vez de tail de arquivo.' },
              { erro: 'Cardinalidade explosiva de labels no Loki — ingester derretendo', sol: 'O sintoma clássico: "too many streams" no log do Loki, latência de query subindo, OOM no ingester. Causa: alguém criou um label dinâmico (request_id, user_id, container_id sem normalização) que gera milhões de combinações. Cada combinação vira uma stream — Loki não foi feito para isso. Mova esses campos do label para dentro do texto e filtre depois com |= ou | json. Limite labels a job/app/env/host/level.' },
              { erro: 'Full-text search no Loki dentro de TB — lento e caro', sol: 'Loki não tem índice invertido. Quando você roda {job="x"} |~ "(?i)algumacoisa" sem labels restritivos, ele baixa e descomprime todos os chunks do range para fazer grep — pode levar minutos. Se o caso de uso PRIMÁRIO é busca full-text por palavras em logs históricos (compliance, forense, SIEM), Loki é a ferramenta errada — use ELK/OpenSearch. Se for ocasional, restrinja sempre por labels + janela de tempo curta.' },
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
              <p className="font-bold text-text mb-2">🧪 Lab 1 — Stack Loki em 10 minutos</p>
              <p className="text-sm text-text-2 mb-3">
                Suba a stack mínima Loki + Promtail + Grafana com o <code>docker-compose.yml</code>{' '}
                deste módulo. Configure o Promtail para ler <code>/var/log/syslog</code> e os logs
                dos contêineres. No Grafana, adicione o data source Loki, abra o Explore e rode 3
                queries: todos os logs do host, só linhas com a palavra <code>ERROR</code>, e a
                taxa de erros por minuto dos últimos 30 minutos.
              </p>
              <CodeBlock lang="bash" code={`docker compose up -d
docker compose ps                                   # loki, promtail, grafana UP

# Gere alguns logs no host para o Promtail empurrar
logger -t lab "primeira linha de teste"
logger -t lab -p user.err "ERROR — segundo evento, simulando falha"

# No Grafana → Explore → Loki:
#   {job="syslog"}                              -> todas as linhas
#   {job="syslog"} |= "ERROR"                   -> só erros
#   rate({job="syslog"} |= "ERROR" [5m])        -> taxa por segundo`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — Stack ELK + Filebeat para Nginx</p>
              <p className="text-sm text-text-2 mb-3">
                Em uma VM com pelo menos 4 GB de RAM livre, suba Elasticsearch (heap limitado a 1
                GB) + Kibana + Filebeat com o módulo <code>nginx</code> habilitado. Confirme que o
                índice <code>filebeat-*</code> aparece no Kibana, crie o index pattern, abra o
                Discover e instale os dashboards prontos de Nginx via <code>filebeat setup</code>.
              </p>
              <CodeBlock lang="bash" code={`# Pré-flight no host
echo 'vm.max_map_count=262144' | sudo tee /etc/sysctl.d/99-elastic.conf
sudo sysctl --system

docker compose up -d
curl -s http://localhost:9200/_cluster/health?pretty | head

# Habilitar módulo nginx do Filebeat e instalar dashboards no Kibana
docker exec -it filebeat filebeat modules enable nginx
docker exec -it filebeat filebeat setup --dashboards

# Verifique no Kibana
#   Stack Management → Index Patterns → filebeat-*  (use @timestamp)
#   Discover → filtre por event.module : "nginx"
#   Dashboard → "[Filebeat Nginx] Access and error logs ECS"`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — Alerta de logs com Loki Ruler + Alertmanager</p>
              <p className="text-sm text-text-2 mb-3">
                Em cima da stack do Lab 1, configure o Loki Ruler com uma regra que dispara quando
                aparecem 3 linhas com a palavra <code>panic</code> em 5 minutos. Suba um
                Alertmanager simples (mesma rede do compose), aponte o Loki para ele e dispare o
                alerta gerando logs com <code>logger</code>. Confirme o alerta no UI do
                Alertmanager.
              </p>
              <CodeBlock lang="yaml" title="loki-rules/api.yaml" code={`groups:
  - name: api-erros
    interval: 30s
    rules:
      - alert: APIPanicBurst
        expr: |
          sum(count_over_time({job="syslog"} |= "panic" [5m])) > 3
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Burst de panic no syslog ({{ $value }} eventos em 5m)"`} />
              <CodeBlock lang="bash" code={`# Aponte o Loki para um Alertmanager (no loki-config.yaml):
#   ruler:
#     alertmanager_url: http://alertmanager:9093
#     storage:
#       type: local
#       local:
#         directory: /loki/rules
#     rule_path: /loki/rules
#     ring:
#       kvstore:
#         store: inmemory

# Dispare o alerta
for i in 1 2 3 4 5; do logger -t api "panic — incidente $i"; sleep 2; done

# Verifique
curl -s http://localhost:9093/api/v2/alerts | jq '.[].labels'`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/observabilidade-stack" />

      </div>
    </main>
  );
}
