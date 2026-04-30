'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Activity, BarChart2, Bell, Database, Server, Layers, Terminal, Shield } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function MonitoringPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/monitoring');
  }, [trackPageVisit]);

  const items = [
    { id: 'monitoring-instalado',  label: 'Stack completa rodando: Prometheus coletando métricas do node_exporter, Grafana acessível em :3000 com datasource configurado' },
    { id: 'monitoring-dashboard',  label: 'Dashboard "Node Exporter Full" (ID 1860) importado no Grafana mostrando CPU, memória, disco e rede em tempo real' },
    { id: 'monitoring-alertas',    label: 'Regra de alerta criada no Prometheus (ex: CPU > 80% por 5min) e Alertmanager configurado para envio de notificação' },
  ];

  return (
    <main className="module-accent-monitoring min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📊</span>
            <span className="section-label">v4.0 · Infraestrutura Moderna</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Prometheus + Grafana</h1>
          <p className="text-text-2 text-lg leading-relaxed max-w-2xl">
            Observabilidade real para seu servidor Linux: métricas de sistema coletadas a cada 15 segundos,
            dashboards visuais em tempo real e alertas automáticos antes que o usuário perceba o problema.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['Prometheus', 'PromQL', 'Grafana', 'node_exporter', 'Alertmanager', 'TSDB', 'scraping'].map(t => (
              <span key={t} className="font-mono text-xs bg-mod/10 text-mod border border-mod/30 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Os 3 Pilares da Observabilidade */}
        <section>
          <h2 className="section-title">Os 3 Pilares da Observabilidade</h2>
          <p className="text-text-2 mb-6 leading-relaxed">
            Monitorar não é só saber se o servidor está de pé. Observabilidade real combina três tipos de
            dados complementares que juntos respondem: o que está errado, onde está errado e por quê.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Activity size={20} />, title: 'Métricas', color: 'text-mod', desc: 'Números ao longo do tempo: CPU %, memória usada, requisições/s, latência p99. Armazenados de forma compacta para consulta histórica.', tool: '← Prometheus faz isso' },
              { icon: <Database size={20} />, title: 'Logs', color: 'text-info', desc: 'Eventos discretos com timestamp: "usuário X fez login", "erro 500 em /api/pay". Contexto detalhado de cada ocorrência.', tool: '← Loki / rsyslog fazem isso' },
              { icon: <Layers size={20} />, title: 'Traces', color: 'text-warn', desc: 'Rastreamento distribuído: quanto tempo cada serviço gastou ao processar uma requisição de ponta a ponta.', tool: '← Jaeger / Tempo fazem isso' },
            ].map(f => (
              <div key={f.title} className="bg-bg-2 border border-border rounded-xl p-5">
                <div className={`${f.color} mb-3`}>{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-text-2 leading-relaxed mb-3">{f.desc}</p>
                <p className="text-xs font-mono text-text-3">{f.tool}</p>
              </div>
            ))}
          </div>

          <InfoBox title="Por que Prometheus dominou o mercado">
            <p>Prometheus nasceu no SoundCloud em 2012 e foi o segundo projeto aceito na CNCF (Cloud Native
            Computing Foundation) após o Kubernetes. Hoje é o padrão de facto para métricas em ambientes
            Linux, Docker e Kubernetes — toda ferramenta séria expõe um endpoint <code>/metrics</code>
            compatível com Prometheus.</p>
          </InfoBox>
        </section>

        {/* Arquitetura do Prometheus */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Database size={22} /> Arquitetura do Prometheus</h2>
          <p className="text-text-2 mb-6 leading-relaxed">
            Prometheus usa um modelo <strong>pull</strong> — ele vai buscar as métricas nos alvos
            (em vez de os alvos enviarem para ele). Isso simplifica a descoberta de serviços e evita
            sobrecarga nos alvos.
          </p>

          {/* Diagrama de arquitetura em ASCII/JSX */}
          <div className="bg-bg-2 border border-border rounded-xl p-6 font-mono text-sm mb-6 overflow-x-auto">
            <div className="text-text-2 space-y-2">
              <div className="text-info font-bold mb-3">Arquitetura Prometheus</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-ok">┌─────────────────────────────────────────────────────────────┐</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ok">│</span>
                  <span className="text-warn">PROMETHEUS SERVER</span>
                  <span className="text-text-3 ml-auto">porta 9090</span>
                  <span className="text-ok">│</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ok">│</span>
                  <span className="text-text-2">  Retrieval (scraping) → TSDB (armazenamento) → HTTP API  </span>
                  <span className="text-ok">│</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ok">└──────────────┬──────────────┬──────────────────────────────┘</span>
                </div>
                <div className="flex flex-col pl-4 gap-1 text-xs">
                  <div><span className="text-info">scrape ↓ (pull a cada 15s)</span></div>
                  <div className="grid grid-cols-3 gap-4 mt-1">
                    <div className="border border-border/50 rounded p-2 text-center">
                      <div className="text-ok">node_exporter</div>
                      <div className="text-text-3">:9100 — SO/hardware</div>
                    </div>
                    <div className="border border-border/50 rounded p-2 text-center">
                      <div className="text-warn">nginx-exporter</div>
                      <div className="text-text-3">:9113 — Nginx stats</div>
                    </div>
                    <div className="border border-border/50 rounded p-2 text-center">
                      <div className="text-info">app /metrics</div>
                      <div className="text-text-3">:8080 — sua aplicação</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="border border-mod/30 rounded p-2 text-center">
                      <div className="text-mod">Alertmanager</div>
                      <div className="text-text-3">:9093 — rotas e silences</div>
                    </div>
                    <div className="border border-info/30 rounded p-2 text-center">
                      <div className="text-info">Grafana</div>
                      <div className="text-text-3">:3000 — dashboards</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-2">
                  <th className="text-left p-4 font-mono text-text-2">Componente</th>
                  <th className="text-left p-4 font-bold text-mod">Função</th>
                  <th className="text-left p-4 text-text-2">Porta padrão</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['prometheus', 'Servidor principal: scraping, TSDB, PromQL, regras de alerta', '9090'],
                  ['node_exporter', 'Expõe métricas do SO Linux: CPU, memória, disco, rede, filesystem', '9100'],
                  ['Alertmanager', 'Recebe alertas do Prometheus, agrupa, roteia e envia (email/Slack/PD)', '9093'],
                  ['Grafana', 'Plataforma de dashboards: visualiza dados de múltiplas fontes', '3000'],
                  ['Pushgateway', 'Recebe métricas de jobs batch (short-lived) — não recomendado para serviços', '9091'],
                ].map(([c, f, p]) => (
                  <tr key={c} className="border-b border-border/50 hover:bg-bg-2/50">
                    <td className="p-4 font-mono text-ok text-xs">{c}</td>
                    <td className="p-4 text-text-2 text-sm">{f}</td>
                    <td className="p-4 font-mono text-text-3 text-xs">:{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Stack com Docker Compose */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Server size={22} /> Stack Completa com Docker Compose</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            A forma mais rápida de subir toda a stack. Um único arquivo define Prometheus, node_exporter,
            Grafana e Alertmanager em uma rede isolada.
          </p>

          <CodeBlock lang="yaml" code={`# monitoring/docker-compose.yml
---
version: "3.9"

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data: {}
  grafana_data: {}

services:
  # ── Prometheus ─────────────────────────────────────────────
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=30d"   # 30 dias de retenção
      - "--web.enable-lifecycle"               # reload sem reiniciar
    ports:
      - "9090:9090"
    networks:
      - monitoring

  # ── node_exporter ──────────────────────────────────────────
  node_exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.rootfs=/rootfs"
      - "--path.sysfs=/host/sys"
      - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
    ports:
      - "9100:9100"
    networks:
      - monitoring

  # ── Alertmanager ───────────────────────────────────────────
  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    restart: unless-stopped
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    command:
      - "--config.file=/etc/alertmanager/alertmanager.yml"
    ports:
      - "9093:9093"
    networks:
      - monitoring

  # ── Grafana ────────────────────────────────────────────────
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=grafana123   # TROCAR EM PRODUÇÃO
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=http://localhost:3000
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus`} />

          <CodeBlock lang="bash" code={`# Criar estrutura de diretórios
mkdir -p monitoring/grafana/provisioning/{datasources,dashboards}
cd monitoring

# Subir stack
docker compose up -d

# Verificar status
docker compose ps

# Verificar se Prometheus está coletando
curl http://localhost:9090/-/healthy
# Prometheus Server is Healthy.

# Ver targets sendo coletados
# Acesse: http://localhost:9090/targets`} />
        </section>

        {/* Configuração do Prometheus */}
        <section>
          <h2 className="section-title">Configuração do Prometheus</h2>

          <CodeBlock lang="yaml" code={`# monitoring/prometheus.yml
global:
  scrape_interval: 15s          # coleta métricas a cada 15s
  evaluation_interval: 15s      # avalia regras de alerta a cada 15s
  scrape_timeout: 10s

# Referência ao arquivo de regras de alerta
rule_files:
  - "alert_rules.yml"

# Configuração do Alertmanager
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Alvos de scraping (jobs)
scrape_configs:
  # O próprio Prometheus como alvo
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # node_exporter — métricas do SO
  - job_name: "node_exporter"
    static_configs:
      - targets: ["node_exporter:9100"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        regex: "([^:]+).*"
        replacement: "$1"

  # Múltiplos servidores
  - job_name: "linux-servers"
    static_configs:
      - targets:
          - "192.168.1.10:9100"   # web1
          - "192.168.1.11:9100"   # web2
          - "192.168.1.20:9100"   # db1
        labels:
          environment: "producao"
          region: "br-south"

  # Nginx Exporter
  - job_name: "nginx"
    static_configs:
      - targets: ["nginx-exporter:9113"]`} />

          <CodeBlock lang="bash" code={`# Instalar node_exporter diretamente no host (sem Docker)
# Útil para monitorar o host que roda o Docker

wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-*.linux-amd64.tar.gz
tar xf node_exporter-*.linux-amd64.tar.gz
sudo cp node_exporter-*/node_exporter /usr/local/bin/

# Criar serviço systemd
sudo tee /etc/systemd/system/node_exporter.service > /dev/null << 'EOF'
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo useradd -rs /bin/false node_exporter
sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter

# Testar — deve retornar centenas de métricas
curl http://localhost:9100/metrics | head -30`} />
        </section>

        {/* PromQL */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Terminal size={22} /> PromQL — Consultando Métricas</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            PromQL (Prometheus Query Language) é a linguagem para consultar e transformar séries temporais.
            Parece complexa no início, mas 90% das queries do dia a dia usam apenas 3-4 funções.
          </p>

          <CodeBlock lang="promql" code={`# ── Métricas instantâneas (instant vectors) ──────────────────

# CPU em uso (1 = 100%) — todos os modos
node_cpu_seconds_total

# % CPU em uso (média de todos os núcleos, últimos 5 minutos)
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memória disponível em bytes
node_memory_MemAvailable_bytes

# % memória usada
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Espaço em disco usado (filesystem root)
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100

# ── Funções essenciais ────────────────────────────────────────

# rate() — taxa por segundo em um range (para contadores crescentes)
rate(node_network_receive_bytes_total[5m])   # bytes/s recebidos

# irate() — taxa instantânea (mais reativa, mais ruidosa)
irate(node_cpu_seconds_total[5m])

# increase() — incremento total no período
increase(node_network_transmit_bytes_total[1h])  # bytes enviados na última hora

# sum() — agregar séries
sum(rate(node_network_receive_bytes_total[5m])) by (instance)

# avg, min, max, count
avg(node_load1) by (instance)  # load average 1min por instância

# ── Filtros por label ─────────────────────────────────────────

# Só o filesystem raiz
node_filesystem_size_bytes{mountpoint="/"}

# Excluir tmpfs
node_filesystem_size_bytes{fstype!="tmpfs"}

# Regex — qualquer interface de rede que começa com eth ou ens
node_network_receive_bytes_total{device=~"eth.*|ens.*"}

# ── Alertas típicos em PromQL ─────────────────────────────────

# CPU alta (> 80%) por 5 minutos
100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100) > 80

# Disco quase cheio (> 90%)
(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 90

# Host down
up == 0`} />

          <InfoBox title="Dica: Explorador do Prometheus">
            <p>Acesse <code>http://localhost:9090/graph</code> e use o botão <strong>Metrics Explorer</strong>
            para navegar por todas as métricas disponíveis. Em <strong>Status → Targets</strong> você vê
            todos os alvos configurados e se estão sendo coletados com sucesso.</p>
          </InfoBox>
        </section>

        {/* Grafana — Dashboards */}
        <section>
          <h2 className="section-title flex items-center gap-2"><BarChart2 size={22} /> Grafana — Dashboards Profissionais</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Grafana transforma queries PromQL em gráficos, tabelas, gauges e mapas. A comunidade mantém
            centenas de dashboards prontos no <strong>Grafana Dashboard Library</strong>.
          </p>

          <CodeBlock lang="bash" code={`# Configurar datasource Prometheus via provisioning (auto, sem UI)
mkdir -p grafana/provisioning/datasources

cat > grafana/provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    jsonData:
      timeInterval: "15s"
      httpMethod: POST
EOF

# Reiniciar Grafana para carregar o datasource
docker compose restart grafana`} />

          <div className="bg-bg-2 border border-border rounded-xl p-6 mb-6">
            <h3 className="font-bold mb-4">Dashboards Prontos — IDs para Importar</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-2">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Dashboard</th>
                    <th className="text-left p-3">O que mostra</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1860', 'Node Exporter Full', 'CPU, memória, disco, rede, systemd — o dashboard mais usado do mundo'],
                    ['3662', 'Prometheus 2.0 Overview', 'Saúde do próprio Prometheus: scrape rate, TSDB, alertas'],
                    ['893', 'Docker Container Monitoring', 'CPU/memória por container Docker — requer cAdvisor'],
                    ['13659', 'Blackbox Exporter', 'Uptime de URLs HTTP/HTTPS e latência de resposta'],
                    ['9578', 'Node Exporter Quickstart', 'Versão simplificada do 1860 — boa para começar'],
                  ].map(([id, name, desc]) => (
                    <tr key={id} className="border-b border-border/50 hover:bg-bg-2/50">
                      <td className="p-3 font-mono text-mod font-bold">{id}</td>
                      <td className="p-3 font-semibold">{name}</td>
                      <td className="p-3 text-text-2 text-xs">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-3 mt-3">Como importar: Grafana → Dashboards → New → Import → digitar o ID</p>
          </div>

          <CodeBlock lang="bash" code={`# Provisioning de dashboard via arquivo JSON (automático no boot)
mkdir -p grafana/provisioning/dashboards

cat > grafana/provisioning/dashboards/node_exporter.yml << 'EOF'
apiVersion: 1

providers:
  - name: "Node Exporter"
    orgId: 1
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Baixar dashboard 1860 como JSON e colocar na pasta
# (No Grafana: dashboard → Share → Export → Save to file)
# O arquivo .json vai para: grafana/provisioning/dashboards/`} />
        </section>

        {/* Alertas */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Bell size={22} /> Alertas — Saber Antes do Usuário</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Alertas são regras PromQL com um threshold. Quando a condição é verdadeira por um período
            definido (<code>for</code>), o Prometheus dispara o alerta para o Alertmanager.
          </p>

          <CodeBlock lang="yaml" code={`# monitoring/alert_rules.yml
groups:
  - name: node_alerts
    interval: 1m    # avaliar a cada 1 minuto
    rules:

      # CPU alta
      - alert: HighCpuUsage
        expr: 100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100) > 80
        for: 5m       # só dispara se verdadeiro por 5 minutos contínuos
        labels:
          severity: warning
        annotations:
          summary: "CPU alta em {{ $labels.instance }}"
          description: "CPU está em {{ $value | printf \"%.1f\" }}% nos últimos 5 minutos."

      # Memória quase cheia
      - alert: HighMemoryUsage
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Memória alta em {{ $labels.instance }}"
          description: "Uso de memória: {{ $value | printf \"%.1f\" }}%"

      # Disco quase cheio — CRÍTICO
      - alert: DiskAlmostFull
        expr: (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 90
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Disco quase cheio em {{ $labels.instance }}"
          description: "Disco raiz está {{ $value | printf \"%.1f\" }}% cheio"

      # Host down
      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Host {{ $labels.instance }} está DOWN"
          description: "{{ $labels.instance }} (job: {{ $labels.job }}) está inacessível há mais de 1 minuto."`} />

          <CodeBlock lang="yaml" code={`# monitoring/alertmanager.yml
global:
  resolve_timeout: 5m
  # SMTP para email
  smtp_smarthost: "smtp.gmail.com:587"
  smtp_from: "alertas@empresa.com"
  smtp_auth_username: "alertas@empresa.com"
  smtp_auth_password: "app-password-aqui"

route:
  # Agrupamento — evita flood de alertas similares
  group_by: ["alertname", "instance"]
  group_wait: 30s        # espera 30s antes de enviar (agrupa novos alertas)
  group_interval: 5m     # reenvia grupo a cada 5min se ainda ativo
  repeat_interval: 4h    # reenvia se continuar ativo após 4h
  receiver: "email-admin"

  # Roteamento condicional
  routes:
    - match:
        severity: critical
      receiver: "email-admin"
      repeat_interval: 30m    # críticos: lembrar a cada 30min

    - match:
        severity: warning
      receiver: "email-admin"
      repeat_interval: 4h

receivers:
  - name: "email-admin"
    email_configs:
      - to: "admin@empresa.com"
        send_resolved: true   # notifica quando o alerta se resolve
        headers:
          Subject: "[{{ .Status | toUpper }}] {{ .GroupLabels.alertname }}"

  # Alternativa: Slack
  - name: "slack-ops"
    slack_configs:
      - api_url: "https://hooks.slack.com/services/T.../B.../xxx"
        channel: "#alertas-ops"
        title: "[{{ .Status | toUpper }}] {{ .GroupLabels.alertname }}"
        text: "{{ range .Alerts }}{{ .Annotations.description }}\n{{ end }}"

inhibit_rules:
  # Suprimir warning se critical do mesmo host já disparou
  - source_match:
      severity: critical
    target_match:
      severity: warning
    equal: ["instance"]`} />

          <WarnBox title="Reload sem reiniciar">
            <p>Após editar <code>prometheus.yml</code> ou <code>alert_rules.yml</code>, recarregue sem
            derrubar o servidor: <code>curl -X POST http://localhost:9090/-/reload</code><br />
            Isso só funciona se o Prometheus foi iniciado com a flag <code>--web.enable-lifecycle</code>
            (já incluída no docker-compose.yml acima).</p>
          </WarnBox>
        </section>

        {/* Métricas customizadas da aplicação */}
        <section>
          <h2 className="section-title">Expondo Métricas da Sua Aplicação</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O grande poder do Prometheus é instrumentar sua própria aplicação. Basta expor um endpoint
            <code> /metrics</code> com as bibliotecas oficiais.
          </p>

          <CodeBlock lang="python" code={`# Python — usando prometheus_client
# pip install prometheus_client

from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Definir métricas
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total de requisições HTTP',
    ['method', 'endpoint', 'status_code']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'Latência das requisições HTTP',
    ['endpoint'],
    buckets=[.005, .01, .025, .05, .075, .1, .25, .5, .75, 1.0, 2.5]
)

ACTIVE_CONNECTIONS = Gauge(
    'http_active_connections',
    'Conexões HTTP ativas no momento'
)

# Usar nas rotas da sua aplicação
def handle_request(method, endpoint):
    start_time = time.time()
    ACTIVE_CONNECTIONS.inc()
    try:
        # ... processar requisição ...
        status = 200
        REQUEST_COUNT.labels(method=method, endpoint=endpoint, status_code=status).inc()
    finally:
        ACTIVE_CONNECTIONS.dec()
        REQUEST_LATENCY.labels(endpoint=endpoint).observe(time.time() - start_time)

# Expor /metrics na porta 8000
start_http_server(8000)
# Prometheus pode agora fazer scrape em http://sua-app:8000/metrics`} />

          <CodeBlock lang="yaml" code={`# Adicionar job da aplicação ao prometheus.yml
scrape_configs:
  # ... jobs existentes ...

  - job_name: "minha-app"
    static_configs:
      - targets: ["minha-app:8000"]
    metrics_path: /metrics   # padrão — pode omitir`} />
        </section>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Da Métrica ao Alerta"
          steps={[
            { label: 'node_exporter', sub: ':9100/metrics — expõe 1000+ métricas do SO', icon: <Server size={14} />, color: 'border-ok/50' },
            { label: 'Prometheus scrape', sub: 'coleta a cada 15s → armazena no TSDB', icon: <Database size={14} />, color: 'border-info/50' },
            { label: 'PromQL', sub: 'consulta e transforma séries temporais', icon: <Terminal size={14} />, color: 'border-mod/50' },
            { label: 'Grafana', sub: 'visualiza em dashboards e painéis', icon: <BarChart2 size={14} />, color: 'border-warn/50' },
            { label: 'Alert Rules', sub: 'avalia condições a cada 15s', icon: <Activity size={14} />, color: 'border-err/50' },
            { label: 'Alertmanager', sub: 'agrupa, roteia → email/Slack/PagerDuty', icon: <Bell size={14} />, color: 'border-ok/50' },
          ]}
        />

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows / Azure Monitor"
          linuxLabel="Prometheus + Grafana"
          windowsCode={`# Windows Performance Monitor
# Interface gráfica — perfmon.msc
# Contadores: CPU, memória, disco, rede

# Windows Admin Center
# Dashboard web para Windows Server
# Métricas locais por servidor

# Azure Monitor (nuvem)
# Coleta automática de VMs Azure
# Alertas via Action Groups
# Dashboards via Azure Workbooks
# Custo: por GB de dados ingeridos

# SCOM (System Center Operations Manager)
# Monitoramento enterprise Microsoft
# Licença cara, complexo de configurar`}
          linuxCode={`# Prometheus + Grafana (open source, gratuito)
# Funciona em qualquer infraestrutura:
# bare metal, VMs, Docker, Kubernetes,
# AWS, GCP, Azure, on-premises

# node_exporter = WMI/perfmon equivalente
# Expõe tudo: CPU, memória, disco, rede,
# filesystem, NFS, interrupts, context switches

# PromQL = linguagem de consulta poderosa
# Grafana = dashboards personalizáveis
# Alertmanager = roteamento inteligente

# Custo: zero (apenas infraestrutura)
# Retenção: configurável (30d padrão)
# Scale: Thanos/Cortex para multi-cluster`}
        />

        {/* Exercícios Guiados */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="font-bold">Subir a stack e verificar coleta</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Criar estrutura
mkdir -p ~/monitoring/grafana/provisioning/{datasources,dashboards}
cd ~/monitoring

# 2. Copiar os arquivos do tutorial:
# docker-compose.yml / prometheus.yml / alert_rules.yml / alertmanager.yml

# 3. Criar datasource automático
cat > grafana/provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

# 4. Subir stack
docker compose up -d

# 5. Aguardar ~10 segundos e verificar
docker compose ps
# prometheus, node_exporter, alertmanager, grafana → Up

# 6. Verificar targets
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool | grep -E "health|job"
# "health": "up"

# 7. Testar PromQL via API
curl -s "http://localhost:9090/api/v1/query?query=up" | python3 -m json.tool`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="font-bold">Importar dashboard no Grafana</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Acessar Grafana em http://localhost:3000
#    Login: admin / grafana123

# 2. Importar dashboard 1860 (Node Exporter Full):
#    Dashboards → New → Import
#    Digitar ID: 1860
#    Selecionar datasource: Prometheus
#    Importar

# 3. Explorar painéis:
#    - CPU Basic: % por núcleo
#    - Memory: RAM disponível vs usada
#    - Disk Space: uso por partição
#    - Network Traffic: bytes/s por interface

# 4. Criar painel customizado via PromQL:
#    New Panel → Add visualization
#    Query A:
#    100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100)
#    Legend: CPU %
#    Panel type: Gauge
#    Thresholds: 70 → yellow, 90 → red

# 5. Salvar dashboard com nome "Meu Servidor"`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-bold">Criar e testar regra de alerta</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Adicionar regra de teste (dispara logo — threshold baixo)
cat >> alert_rules.yml << 'EOF'

  - name: test_alerts
    rules:
      - alert: TestAlertHighLoad
        # Dispara se load > 0.1 (vai disparar quase sempre em dev)
        expr: node_load1 > 0.1
        for: 30s
        labels:
          severity: warning
        annotations:
          summary: "Teste: load alto em {{ $labels.instance }}"
          description: "Load: {{ $value | printf \"%.2f\" }}"
EOF

# 2. Recarregar Prometheus sem reiniciar
curl -X POST http://localhost:9090/-/reload

# 3. Verificar se a regra foi carregada
curl -s http://localhost:9090/api/v1/rules | python3 -m json.tool | grep name

# 4. Ver alertas disparados em:
# http://localhost:9090/alerts

# 5. Ver alertas no Alertmanager:
# http://localhost:9093

# 6. Verificar alertas via API
curl -s http://localhost:9093/api/v2/alerts | python3 -m json.tool`} />
            </div>
          </div>
        </section>

        {/* Erros Comuns */}
        <section>
          <h2 className="section-title">Erros Comuns e Soluções</h2>
          <div className="space-y-4">
            {[
              {
                err: 'INVALID is not a valid scrape status (target aparece como DOWN)',
                fix: 'Verificar conectividade: docker exec prometheus wget -qO- http://node_exporter:9100/metrics | head -5. Se falhar, conferir se estão na mesma rede Docker e se os nomes dos serviços batem com o prometheus.yml.',
              },
              {
                err: 'Error: YAML parse error on alert_rules.yml — indentação incorreta',
                fix: 'YAML é sensível a espaços. Usar validador: python3 -c "import yaml; yaml.safe_load(open(\'alert_rules.yml\'))" — se não der erro, o YAML está correto.',
              },
              {
                err: 'Grafana: "No data" no painel mesmo com Prometheus coletando',
                fix: 'Verificar o time range no canto superior direito — padrão é "Last 6 hours". Se o Prometheus está coletando há menos tempo, mudar para "Last 5 minutes". Conferir também se o datasource está selecionado na query.',
              },
              {
                err: 'Alertmanager não envia email',
                fix: 'Gmail exige "App Password" (não a senha da conta). Habilitar 2FA → Segurança → Senhas de app → criar uma específica para Alertmanager. Testar com: amtool alert add alertname="Test" --alertmanager.url=http://localhost:9093',
              },
            ].map(({ err, fix }) => (
              <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
                <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
                <p className="text-sm text-text-2">✅ {fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-bg-2 border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={22} className="text-mod" />
            <h2 className="text-xl font-bold">Checklist do Lab</h2>
          </div>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--mod)]"
                />
                <span className={`text-sm leading-relaxed transition-colors ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2 group-hover:text-text'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-xl text-ok text-sm font-medium">
              📊 Monitoring Master — observabilidade real instalada no seu servidor!
            </div>
          )}
        </section>

        <ModuleNav currentPath="/monitoring" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
