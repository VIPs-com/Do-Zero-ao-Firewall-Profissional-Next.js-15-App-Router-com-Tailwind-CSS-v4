'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Target, Activity, AlertTriangle, BookOpen, Users,
  ChevronLeft, Shield, Clock, TrendingUp, FileText,
} from 'lucide-react';
import Link from 'next/link';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const checklistItems = [
  {
    id: 'sre-slo-definido',
    text: 'Definir SLIs e SLOs reais para um serviço com Prometheus',
    sub: 'Calcular availability SLO 99.9% e configurar recording rules: job:sli_availability:rate5m',
  },
  {
    id: 'sre-error-budget',
    text: 'Calcular error budget e criar alerta de burn rate no Alertmanager',
    sub: 'Error budget 43.8 min/mês → alerta quando burn rate > 14.4× (consumo 1h = 2% do budget mensal)',
  },
  {
    id: 'sre-postmortem',
    text: 'Escrever um postmortem blameless seguindo o template de 5 seções',
    sub: 'Resumo → Linha do tempo → Causa raiz → Ações corretivas → Lições aprendidas — sem culpar pessoas',
  },
];

const erros = [
  {
    title: 'SLO de disponibilidade definido como "uptime do servidor"',
    desc: 'Uptime do servidor mede se o processo está rodando — não se o usuário consegue usar o serviço. Um servidor pode estar "up" com 100% de erros 500. SLI deve medir a experiência do usuário: requisições bem-sucedidas / total de requisições.',
    fix: '# SLI correto: taxa de sucesso das requisições HTTP\nrecord: job:sli_http_availability:rate5m\nexpr: |\n  sum(rate(http_requests_total{status!~"5.."}[5m]))\n  /\n  sum(rate(http_requests_total[5m]))',
  },
  {
    title: 'Alerta dispara toda hora — alerta muito sensível',
    desc: 'Alertas baseados em threshold fixo (ex: error_rate > 1%) disparam com qualquer pico momentâneo, causando alert fatigue. Use burn rate: o alerta só dispara quando o consumo do error budget está acelerando.',
    fix: '# Burn rate: alerta somente quando consumo é insustentável\nexpr: |\n  job:error_budget_burn_rate:ratio1h > 14.4\n# 14.4× = consumo de 2% do budget em 1h (insustentável em 30 dias)',
  },
  {
    title: 'Postmortem vira sessão de culpa — ninguém quer participar',
    desc: 'Postmortems que identificam "o João fez deploy errado" destroem a cultura de segurança psicológica. Pessoas param de reportar incidentes por medo de punição. O sistema que permitiu o erro existe — foque nele.',
    fix: '# Template blameless:\n# ❌ "João fez deploy do código errado sem testar"\n# ✅ "O pipeline de CI não bloqueou o deploy de código sem cobertura de teste"\n# Ação corretiva: adicionar gate de cobertura mínima no CI/CD',
  },
  {
    title: 'On-call sem runbook — engenheiro perde 30 min entendendo o alerta',
    desc: 'Um alerta sem runbook faz o engenheiro de plantão perder tempo valioso tentando entender o que o alerta significa e o que fazer. Cada alerta deve ter um link para o runbook correspondente.',
    fix: '# No Alertmanager, adicionar anotação de runbook:\nannotations:\n  summary: "API error rate alta"\n  runbook_url: "https://wiki.empresa.com/runbooks/api-error-rate"\n  description: "Taxa de erros da API acima do SLO nos últimos 5 minutos"',
  },
];

export default function SrePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/sre');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-sre min-h-screen">
      {/* Hero */}
      <section className="module-hero py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LayerBadge layer="Cultura · Confiabilidade" />
            <span className="section-label">SLI · SLO · Error Budget · On-Call</span>
          </div>
          <h1 className="section-title text-4xl mb-4">
            🎯 SRE &amp; SLOs
          </h1>
          <p className="text-text-2 text-lg max-w-2xl">
            Site Reliability Engineering não é um cargo — é uma
            <strong className="text-text"> forma de pensar confiabilidade como engenharia</strong>.
            Você define metas mensuráveis (SLOs), quantifica o quanto pode falhar (error budget)
            e usa esses números para tomar decisões racionais sobre velocidade vs estabilidade.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['SLI', 'SLO', 'SLA', 'error budget', 'burn rate', 'blameless postmortem', 'on-call', 'toil'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-bg-3 text-text-2 border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* SLI SLO SLA */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Target className="text-[var(--mod)]" size={22} />
            SLI, SLO e SLA — a hierarquia da confiabilidade
          </h2>
          <p className="text-text-2 mb-6">
            Três siglas que parecem iguais mas têm papéis completamente diferentes.
            Confundi-las é o erro mais comum em times que estão começando com SRE.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-2 border border-info/30 rounded-xl p-5">
              <div className="text-2xl mb-2">📏</div>
              <h3 className="font-semibold text-info mb-2">SLI — Service Level Indicator</h3>
              <p className="text-text-2 text-sm mb-3">
                A <strong className="text-text">métrica real</strong> que você mede.
                Deve refletir a experiência do usuário — não a saúde interna do sistema.
              </p>
              <div className="bg-bg-3 rounded-lg p-3 text-xs font-mono text-text-2">
                <div className="text-ok mb-1">✓ Bons SLIs:</div>
                <div>• % requests HTTP bem-sucedidos</div>
                <div>• Latência P99 de uma API</div>
                <div>• Taxa de erros de checkout</div>
                <div className="text-err mt-2 mb-1">✗ Maus SLIs:</div>
                <div>• CPU usage do servidor</div>
                <div>• "Uptime" do processo</div>
              </div>
            </div>
            <div className="bg-bg-2 border border-accent/30 rounded-xl p-5">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-accent mb-2">SLO — Service Level Objective</h3>
              <p className="text-text-2 text-sm mb-3">
                A <strong className="text-text">meta interna</strong> que o time se compromete a atingir.
                Define a faixa aceitável do SLI ao longo do tempo.
              </p>
              <div className="bg-bg-3 rounded-lg p-3 text-xs font-mono text-text-2">
                <div className="mb-1">SLO = SLI + janela de tempo + meta</div>
                <div className="text-accent mt-2">Exemplos:</div>
                <div>• 99.9% disponibilidade / 30 dias</div>
                <div>• P99 latência &lt; 300ms / 7 dias</div>
                <div>• &lt; 0.1% erros de pagamento / dia</div>
              </div>
            </div>
            <div className="bg-bg-2 border border-warn/30 rounded-xl p-5">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-warn mb-2">SLA — Service Level Agreement</h3>
              <p className="text-text-2 text-sm mb-3">
                O <strong className="text-text">contrato externo</strong> com o cliente, com penalidades
                financeiras se descumprido. Deve ser menos rigoroso que o SLO interno.
              </p>
              <div className="bg-bg-3 rounded-lg p-3 text-xs font-mono text-text-2">
                <div className="text-warn mb-1">Regra de ouro:</div>
                <div>SLA &lt; SLO (sempre!)</div>
                <div className="mt-2">Se SLO = 99.9%</div>
                <div>então SLA = 99.5%</div>
                <div className="mt-1 text-text-2">Buffer para reagir antes</div>
                <div>de violar o contrato</div>
              </div>
            </div>
          </div>

          <FluxoCard
            title="Da métrica ao contrato"
            steps={[
              { label: 'Medir (SLI)', sub: 'requests bem-sucedidos / total', icon: <Activity size={14} />, color: 'border-info/50' },
              { label: 'Definir meta (SLO)', sub: '99.9% em 30 dias', icon: <Target size={14} />, color: 'border-accent/50' },
              { label: 'Calcular budget', sub: '43.8 min de downtime/mês', icon: <Clock size={14} />, color: 'border-ok/50' },
              { label: 'Monitorar burn', sub: 'Prometheus + Alertmanager', icon: <TrendingUp size={14} />, color: 'border-warn/50' },
              { label: 'Contrato (SLA)', sub: '99.5% com penalidade', icon: <FileText size={14} />, color: 'border-err/50' },
            ]}
          />
        </section>

        {/* Error Budget */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Clock className="text-[var(--mod)]" size={22} />
            Error Budget — a matemática da confiabilidade
          </h2>
          <p className="text-text-2 mb-6">
            O error budget é a quantidade de falha que você tem <strong className="text-text">permissão de causar</strong>
            dentro da janela do SLO. É o que transforma confiabilidade de uma conversa subjetiva
            em uma decisão de engenharia objetiva.
          </p>

          <HighlightBox title="Como calcular o error budget">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-text-2 text-sm mb-3">Para um SLO de <strong className="text-text">99.9% em 30 dias</strong>:</p>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex gap-2">
                    <span className="text-text-2">Indisponibilidade permitida:</span>
                    <span className="text-accent">0.1%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-text-2">Minutos no mês:</span>
                    <span className="text-accent">43.200 min</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-text-2">Error budget:</span>
                    <span className="text-ok font-bold">43,2 min</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-text-2 text-sm mb-3">Tabela de noves:</p>
                <div className="space-y-1 text-xs font-mono">
                  {[
                    ['99%',    '1%',   '7h 18m / mês'],
                    ['99.9%',  '0.1%', '43m 50s / mês'],
                    ['99.95%', '0.05%','21m 54s / mês'],
                    ['99.99%', '0.01%','4m 22s / mês'],
                    ['99.999%','0.001%','26s / mês'],
                  ].map(([slo, err, budget]) => (
                    <div key={slo} className="grid grid-cols-3 gap-2 text-text-2">
                      <span className="text-accent">{slo}</span>
                      <span>{err}</span>
                      <span>{budget}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HighlightBox>

          <h3 className="font-semibold text-lg mt-8 mb-4">Error budget como ferramenta de decisão</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-bg-2 border border-ok/30 rounded-xl p-5">
              <h4 className="font-semibold text-ok mb-2">🟢 Budget sobrando → acelerar</h4>
              <ul className="text-text-2 text-sm space-y-1">
                <li>• Mais deploys por semana</li>
                <li>• Features experimentais em produção</li>
                <li>• Testes de chaos engineering</li>
                <li>• Migração de infraestrutura com risco calculado</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-err/30 rounded-xl p-5">
              <h4 className="font-semibold text-err mb-2">🔴 Budget esgotado → frear</h4>
              <ul className="text-text-2 text-sm space-y-1">
                <li>• Congelar deploys não-críticos</li>
                <li>• Foco exclusivo em confiabilidade</li>
                <li>• Cancelar experimentos e rollbacks</li>
                <li>• Renegociar SLA com o cliente</li>
              </ul>
            </div>
          </div>

          <InfoBox title="Error budget: quem decide — dev ou ops?">
            No modelo SRE, o error budget pertence ao produto, não a uma equipe.
            Se o time de dev quer lançar features rápido, ele consome o budget.
            Se o budget acabar, o próprio processo de release é freado — não por decisão
            política, mas por matemática. Isso elimina o conflito clássico dev vs ops.
          </InfoBox>
        </section>

        {/* SLOs com Prometheus */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Activity className="text-[var(--mod)]" size={22} />
            Implementando SLOs com Prometheus
          </h2>
          <p className="text-text-2 mb-6">
            Na prática, SLIs são implementados como queries PromQL e SLOs são monitorados
            via recording rules + alertas de burn rate. O Google SRE Workbook define o
            padrão de burn rate que usaremos aqui.
          </p>

          <div className="space-y-6">
            <div>
              <StepItem
                number={1}
                title="Definir o SLI como recording rule"
                description="Recording rules pré-calculam queries pesadas. O SLI de disponibilidade HTTP é a proporção de requests não-5xx."
              />
              <CodeBlock lang="yaml" code={`# prometheus/rules/sli.yml
groups:
- name: sli_rules
  interval: 30s
  rules:
  # SLI: taxa de sucesso das requisições (excluindo 5xx)
  - record: job:sli_http_availability:rate5m
    expr: |
      sum(rate(http_requests_total{status!~"5.."}[5m])) by (job)
      /
      sum(rate(http_requests_total[5m])) by (job)

  # SLI de latência: proporção abaixo de 300ms (P99)
  - record: job:sli_latency_p99:rate5m
    expr: |
      histogram_quantile(0.99,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (job, le)
      )`} />
            </div>

            <div>
              <StepItem
                number={2}
                title="Calcular o burn rate do error budget"
                description="Burn rate mede a velocidade com que o error budget está sendo consumido. Burn rate 1 = consumo exatamente na taxa que esgota o budget ao final da janela."
              />
              <CodeBlock lang="yaml" code={`# Burn rate = (1 - SLI) / (1 - SLO)
# SLO = 0.999 (99.9%)  → error rate permitida = 0.001 (0.1%)
# Se error rate atual = 0.0144 (1.44%)
# Burn rate = 0.0144 / 0.001 = 14.4×
# → o budget vai acabar em 30 dias / 14.4 ≈ 2 dias!

groups:
- name: error_budget
  rules:
  # Error rate atual
  - record: job:error_rate:rate1h
    expr: |
      1 - job:sli_http_availability:rate5m

  # Burn rate em janela de 1 hora
  - record: job:error_budget_burn_rate:ratio1h
    expr: |
      job:error_rate:rate1h
      /
      (1 - 0.999)   # 1 - SLO target

  # Burn rate em janela de 6 horas (para alertas de longo prazo)
  - record: job:error_budget_burn_rate:ratio6h
    expr: |
      (
        1 - sum(rate(http_requests_total{status!~"5.."}[6h])) by (job)
        /
        sum(rate(http_requests_total[6h])) by (job)
      )
      /
      (1 - 0.999)`} />
            </div>

            <div>
              <StepItem
                number={3}
                title="Configurar alertas de burn rate em múltiplas janelas"
                description="A estratégia de alerta em múltiplas janelas detecta incidentes rápidos E lentos, com diferentes níveis de urgência."
              />
              <CodeBlock lang="yaml" code={`# prometheus/rules/alerts.yml
groups:
- name: slo_alerts
  rules:
  # CRÍTICO: burn rate 14.4× em 1h = 2% do budget consumido em 1h
  # → budget esgota em ~2 dias → page o engenheiro de plantão
  - alert: ErrorBudgetBurnRateCritico
    expr: |
      job:error_budget_burn_rate:ratio1h > 14.4
      and
      job:error_budget_burn_rate:ratio6h > 14.4
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "SLO em risco: burn rate crítico — \{\{ \$labels.job \}\}"
      description: "Burn rate \{\{ \$value | humanize \}\}× — error budget esgota em menos de 2 dias"
      runbook_url: "https://wiki/runbooks/slo-burn-rate-critico"

  # AVISO: burn rate 6× em 6h = 5% do budget consumido em 6h
  # → budget esgota em ~5 dias → ticket + notificação no Slack
  - alert: ErrorBudgetBurnRateAlto
    expr: |
      job:error_budget_burn_rate:ratio1h > 6
      and
      job:error_budget_burn_rate:ratio6h > 6
    for: 15m
    labels:
      severity: warning
    annotations:
      summary: "SLO atenção: burn rate elevado — \{\{ \$labels.job \}\}"
      description: "Burn rate \{\{ \$value | humanize \}\}× — investigar antes de virar incidente"
      runbook_url: "https://wiki/runbooks/slo-burn-rate-alto"`} />
            </div>

            <div>
              <StepItem
                number={4}
                title="Dashboard de error budget no Grafana"
                description="Visualizar o consumo do budget ao longo do mês ajuda a tomar decisões sobre velocidade de deploy."
              />
              <CodeBlock lang="bash" code={`# Query para painel "Budget Restante" no Grafana
# Calcula % do error budget consumido no mês atual

# Budget consumido (minutos de indisponibilidade acumulados):
(
  1 - avg_over_time(job:sli_http_availability:rate5m[30d])
) * 30 * 24 * 60
# Se retornar 15.3 → 15.3 min de downtime acumulado no mês

# Budget restante em %:
1 - (
  (1 - avg_over_time(job:sli_http_availability:rate5m[30d]))
  /
  (1 - 0.999)   # 1 - SLO
)
# Se retornar 0.65 → 65% do budget ainda disponível

# Grafana: usar "Stat" panel com thresholds:
# Verde: > 50% restante
# Amarelo: 10% - 50%
# Vermelho: < 10%`} />
            </div>
          </div>
        </section>

        {/* On-Call */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <AlertTriangle className="text-[var(--mod)]" size={22} />
            On-Call — plantão que não destrói engenheiros
          </h2>
          <p className="text-text-2 mb-6">
            On-call mal estruturado é a maior causa de burnout em times de engenharia.
            O SRE define princípios para tornar o plantão <strong className="text-text">sustentável</strong>:
            alertas acionáveis, runbooks completos e rotação justa.
          </p>

          <WarnBox title="Alertas que não levam a ação → alert fatigue → incidentes ignorados">
            Se um alerta dispara mas o engenheiro não sabe o que fazer ou não pode fazer nada
            no momento, ele treina o time a ignorar alertas. O alerta que "sempre dispara mas
            some sozinho" é o mais perigoso — porque um dia ele não vai sumir.
          </WarnBox>

          <h3 className="font-semibold text-lg mt-8 mb-4">Princípios de alertas acionáveis</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="space-y-3">
              <div className="bg-bg-2 border border-ok/30 rounded-xl p-4">
                <h4 className="font-semibold text-ok text-sm mb-2">✅ Todo alerta deve ter:</h4>
                <ul className="text-text-2 text-sm space-y-1">
                  <li>• Descrição clara do impacto no usuário</li>
                  <li>• Link para o runbook com passos de diagnóstico</li>
                  <li>• Contexto: quão urgente é agir?</li>
                  <li>• Ação clara: o que fazer primeiro?</li>
                </ul>
              </div>
              <div className="bg-bg-2 border border-err/30 rounded-xl p-4">
                <h4 className="font-semibold text-err text-sm mb-2">❌ Eliminar:</h4>
                <ul className="text-text-2 text-sm space-y-1">
                  <li>• Alertas que "sempre disparam" sem ação</li>
                  <li>• Alertas de causas (CPU alta) sem sintoma</li>
                  <li>• Alertas duplicados para o mesmo incidente</li>
                  <li>• Alertas que acordam alguém às 3h sem urgência</li>
                </ul>
              </div>
            </div>
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <h4 className="font-semibold mb-3">Urgência do alerta: página vs ticket</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-2 border-err pl-3">
                  <div className="font-semibold text-err">📟 Page (acorda agora)</div>
                  <div className="text-text-2">Usuário sendo impactado AGORA.<br />
                  Error budget consumindo rápido. Ação imediata necessária.</div>
                </div>
                <div className="border-l-2 border-warn pl-3">
                  <div className="font-semibold text-warn">🔔 Slack / Email (próxima hora)</div>
                  <div className="text-text-2">Tendência preocupante mas não crítica.<br />
                  Budget alto mas burn rate acelerado.</div>
                </div>
                <div className="border-l-2 border-info pl-3">
                  <div className="font-semibold text-info">🎫 Ticket (próximo dia útil)</div>
                  <div className="text-text-2">Problema de longo prazo sem impacto imediato.<br />
                  Dívida técnica, configuração subótima.</div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-lg mt-8 mb-4">Estrutura de um runbook</h3>
          <CodeBlock lang="markdown" code={`# Runbook: API Error Rate Alta

## Sintoma
Alerta: ErrorBudgetBurnRateCritico
Taxa de erros HTTP 5xx > 1% nas últimas 2 horas

## Impacto
Usuários recebendo erros em X% das requisições.
Error budget sendo consumido em velocidade insustentável.

## Diagnóstico (5 minutos)

### 1. Ver os erros recentes
\`\`\`bash
kubectl logs -n api deploy/api-server --since=30m | grep "ERROR" | tail -50
\`\`\`

### 2. Verificar dependências (banco de dados, cache)
\`\`\`bash
kubectl get pods -n api          # algum pod em CrashLoop?
kubectl get events -n api        # eventos recentes?
\`\`\`

### 3. Query Prometheus para identificar endpoint problemático
\`\`\`promql
topk(5, sum(rate(http_requests_total{status=~"5.."}[5m])) by (handler))
\`\`\`

## Mitigação imediata
- [ ] Rollback do último deploy: \`kubectl rollout undo deploy/api-server\`
- [ ] Aumentar réplicas se for sobrecarga: \`kubectl scale deploy/api-server --replicas=5\`
- [ ] Ativar circuit breaker manual se dependência externa falhou

## Escalonamento
Se não resolvido em 15 minutos → chamar lead de backend (@time-backend no Slack)`} />
        </section>

        {/* Postmortem */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <BookOpen className="text-[var(--mod)]" size={22} />
            Postmortem Blameless — aprender sem punir
          </h2>
          <p className="text-text-2 mb-6">
            Um postmortem não é uma sessão de culpa — é um <strong className="text-text">processo estruturado
            para extrair aprendizado de incidentes</strong>. O adjetivo "blameless" é o mais importante:
            sistemas complexos falham por causas sistêmicas, não por incompetência individual.
          </p>

          <HighlightBox title='Princípio fundamental: "Just Culture"'>
            <p className="text-text-2 text-sm">
              Pessoas não causam incidentes — elas são o <em>gatilho</em> de sistemas latentemente frágeis.
              Punir o engenheiro que "clicou no botão errado" não resolve o sistema que permitia
              esse clique ter consequências catastróficas. O postmortem pergunta:
              <strong className="text-text"> "Por que o sistema permitiu que isso acontecesse?"</strong>
            </p>
          </HighlightBox>

          <h3 className="font-semibold text-lg mt-8 mb-4">Template de postmortem — 5 seções obrigatórias</h3>
          <CodeBlock lang="markdown" code={`# Postmortem — [Nome do Incidente] — [Data]

**Severidade:** P1 / P2 / P3
**Duração:** HH:MM (detecção → resolução)
**Impacto:** X% dos usuários afetados / R$ Y de receita impactada

---

## 1. Resumo Executivo (1 parágrafo)
Na tarde de [data], o serviço de [X] ficou indisponível por [duração] para [Y% dos usuários].
A causa raiz foi [causa técnica]. O incidente foi detectado via [alerta/usuário] e resolvido
por [ação de mitigação]. Ações para prevenir recorrência estão listadas na seção 5.

---

## 2. Linha do Tempo
| Horário | Evento |
|---------|--------|
| 14:32   | Deploy v2.3.1 iniciado |
| 14:45   | Alerta: ErrorBudgetBurnRateCritico dispara |
| 14:47   | Engenheiro de plantão notificado |
| 14:52   | Identificado aumento de erros 503 na API |
| 15:01   | Rollback iniciado para v2.3.0 |
| 15:04   | Serviço normalizado, alerta resolvido |
| 15:30   | Postmortem agendado |

---

## 3. Causa Raiz (o que REALMENTE causou — não o sintoma)
A versão v2.3.1 introduziu uma query de banco de dados sem índice na rota /api/search.
Sob carga de produção, a query causou table scan completo, esgotando o connection pool
do PostgreSQL em ~12 minutos após o deploy.

**Por que não foi detectado antes?**
- Ambiente de staging tem 100× menos dados que produção
- Testes de carga não cobrem a rota /api/search
- A revisão de código não incluiu análise de performance de queries

---

## 4. Fatores Contribuintes
- Ausência de EXPLAIN ANALYZE no processo de code review
- Staging com dataset insuficiente para detectar problemas de performance
- Alerta de connection pool não configurado (existia mas estava silenciado)

---

## 5. Ações Corretivas
| Ação | Responsável | Prazo | Prioridade |
|------|-------------|-------|------------|
| Adicionar EXPLAIN ANALYZE ao template de PR para mudanças de query | @dev-lead | 1 semana | Alta |
| Aumentar dataset do staging para 10% da produção | @infra | 2 semanas | Alta |
| Reativar alerta de connection pool com runbook | @sre | 3 dias | Crítica |
| Adicionar teste de carga para /api/search no CI | @qa | 2 semanas | Média |`} />

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-bg-2 border border-err/30 rounded-xl p-5">
              <h4 className="font-semibold text-err mb-3">❌ Linguagem com culpa</h4>
              <ul className="text-text-2 text-sm space-y-2">
                <li>"O João fez deploy sem testar"</li>
                <li>"A Maria não seguiu o processo"</li>
                <li>"O time de DevOps foi negligente"</li>
                <li>"Alguém deveria ter visto isso"</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-ok/30 rounded-xl p-5">
              <h4 className="font-semibold text-ok mb-3">✅ Linguagem sistêmica</h4>
              <ul className="text-text-2 text-sm space-y-2">
                <li>"O processo de deploy não tinha gate de teste"</li>
                <li>"O checklist não incluía essa verificação"</li>
                <li>"O sistema não bloqueou a ação"</li>
                <li>"Não havia alerta configurado para isso"</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Toil */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Users className="text-[var(--mod)]" size={22} />
            Toil — o inimigo da confiabilidade
          </h2>
          <p className="text-text-2 mb-6">
            Toil é o trabalho operacional manual, repetitivo, automatable — mas que ainda é feito por humanos.
            O Google SRE define que times não devem gastar mais de <strong className="text-text">50% do tempo em toil</strong>.
            O restante deve ser engenharia que reduz o próprio toil futuro.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead className="bg-bg-3">
                <tr>
                  {['Toil', 'Não-Toil (Engenharia)', 'Como eliminar'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-text-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Reiniciar serviço manualmente toda semana', 'Configurar liveness probe + restart automático', 'Kubernetes health checks'],
                  ['Criar usuário manualmente no LDAP para cada novo funcionário', 'Script de onboarding automático via API', 'Ansible/Terraform + CI/CD'],
                  ['Verificar logs toda manhã por anomalias', 'Alertas de burn rate no Prometheus', 'Alerting by symptom'],
                  ['Fazer backup manual antes de cada deploy', 'Snapshot automático no pipeline de CI/CD', 'GitOps + pipeline stages'],
                  ['Responder tickets de "reset de senha"', 'Self-service de reset com MFA', 'Portal de autoatendimento'],
                ].map(([toil, eng, como]) => (
                  <tr key={toil} className="hover:bg-bg-2/50 transition-colors">
                    <td className="px-4 py-3 text-err text-xs">{toil}</td>
                    <td className="px-4 py-3 text-ok text-xs">{eng}</td>
                    <td className="px-4 py-3 text-text-2 text-xs font-mono">{como}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Windows Comparison */}
        <WindowsComparisonBox
          windowsLabel="Windows — ITSM / ITIL tradicional"
          linuxLabel="Linux / Cloud — SRE moderno"
          windowsCode={`# ITIL: processo burocrático centrado em tickets
# Change Advisory Board (CAB) aprova deploys
# Incidentes = "quem foi o responsável?"
# SLA definido no contrato, medido manualmente
# Relatório de disponibilidade: planilha mensal
# Postmortem = reunião de culpados
# On-call: pager para o "responsável pelo servidor"
# Alertas: CPU > 80%, disco > 90% (causas, não sintomas)`}
          linuxCode={`# SRE: engenharia orientada a confiabilidade mensurável
# Error budget: a matemática decide velocidade de deploy
# Incidentes = "o que no sistema permitiu isso?"
# SLO no Prometheus, calculado automaticamente
promtool query instant 'job:sli_http_availability:rate5m'
# Postmortem blameless com template estruturado
# On-call: rotação justa com runbooks para cada alerta
# Alertas: burn rate (sintoma) não CPU (causa)`}
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
            Armadilhas comuns
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
            <span className="text-warn">⚠️</span> Armadilhas Comuns em SRE
          </h2>
          {[
            {
              err: 'SLO definido como "uptime 99.9%" sem especificar o que conta como "up"',
              fix: 'O SLI precisa ser mensurável e específico: "porcentagem de requests com status HTTP 2xx/3xx com latência < 500ms". Definir claramente: o que é medido (SLI), o target (SLO) e a janela de tempo (rolling 30 dias). Ambiguidade gera conflito entre equipes.',
            },
            {
              err: 'Error budget zerou — time de produto quer continuar deployando features',
              fix: 'Error budget é uma política, não uma sugestão. Quando o budget zera: pausar deployments não-urgentes até o próximo período. Exceções exigem aprovação explícita com postmortem do que causou o esgotamento. Documentar a decisão independente do resultado.',
            },
            {
              err: 'Alert storms — centenas de alertas iguais durante um incidente',
              fix: 'Alertas sem group_by e group_wait adequados no Alertmanager. Configurar: group_by: [alertname, cluster] e group_wait: 30s. Um único alerta por grupo, não um por instância. Symptoms-based alerting: alertar no que o usuário sente (latência alta), não na causa (CPU alta).',
            },
            {
              err: 'Postmortem virou sessão de culpa — equipe evita ser honesta',
              fix: 'Postmortem blameless requer cultura explícita. Usar linguagem sistêmica: "o deploy às 14h causou..." em vez de "João fez o deploy errado". Focar em: o que o sistema deveria ter impedido? Quais salvaguardas faltam? Ações corretivas são técnicas, não disciplinares.',
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
              <p className="font-bold text-sm mb-2">Lab 1 — Definir SLIs e SLOs com Prometheus Recording Rules</p>
              <CodeBlock lang="yaml" code={`# prometheus/rules/slo-api.yml
groups:
  - name: slo-api
    interval: 30s
    rules:
      # SLI: disponibilidade (requisições bem-sucedidas / total)
      - record: sli:api_disponibilidade:ratio_rate5m
        expr: |
          sum(rate(http_requests_total{status=~"2.."}[5m]))
          /
          sum(rate(http_requests_total[5m]))

      # SLI: latência P99 < 300ms
      - record: sli:api_latencia_p99:rate5m
        expr: |
          histogram_quantile(0.99,
            rate(http_request_duration_seconds_bucket[5m])
          )

      # Error budget restante (SLO = 99.9%)
      - record: slo:error_budget_restante:ratio
        expr: |
          1 - (
            (1 - sli:api_disponibilidade:ratio_rate5m)
            / (1 - 0.999)
          )`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Alertas de Burn Rate no Alertmanager</p>
              <CodeBlock lang="yaml" code={`# prometheus/rules/burn-rate-alerts.yml
groups:
  - name: burn-rate-alerts
    rules:
      # Alerta crítico: burn rate 14.4× (esgota budget em 1 hora)
      - alert: ErrorBudgetBurnRateCritico
        expr: |
          (
            1 - sli:api_disponibilidade:ratio_rate5m
          ) > (14.4 * (1 - 0.999))
        for: 2m
        labels:
          severity: page   # PagerDuty / acorda on-call
        annotations:
          summary: "Burn rate crítico — error budget esgota em 1h"
          runbook: "https://wiki.empresa.com/runbooks/api-alta-taxa-erro"

      # Alerta alto: burn rate 6× (esgota budget em 6 horas)
      - alert: ErrorBudgetBurnRateAlto
        expr: |
          (
            1 - sli:api_disponibilidade:ratio_rate5m
          ) > (6 * (1 - 0.999))
        for: 15m
        labels:
          severity: slack
        annotations:
          summary: "Burn rate elevado — investigar em até 6h"`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Escrever um Postmortem Blameless</p>
              <CodeBlock lang="bash" code={`# Template de postmortem — criar no wiki/Notion/Confluence
cat > postmortem-2024-01-15.md << 'EOF'
# Postmortem — Indisponibilidade API de Pagamentos
**Data:** 2024-01-15 | **Duração:** 47 minutos | **Severidade:** P1
**SLO impactado:** Disponibilidade caiu de 99.9% para 82% neste período

## Resumo Executivo
O deploy da v2.3.1 introduziu uma migration SQL sem índice em tabela de
10M registros. O lock de leitura causou timeout em cascata nas réplicas.

## Timeline (UTC)
- 14:03 — Deploy v2.3.1 iniciado (automático, aprovado em staging)
- 14:07 — Alertas burn rate crítico disparados
- 14:09 — On-call notificado via PagerDuty
- 14:22 — Rollback para v2.3.0 iniciado
- 14:50 — Serviço normalizado, SLO recuperado

## Causa Raiz
Migration ALTER TABLE sem ALGORITHM=INPLACE causou lock exclusivo.

## Ações Corretivas
- [ ] Adicionar checklist de migrations na pipeline CI (Owner: @infra)
- [ ] Criar teste de carga de migrations em staging (Owner: @dba)
- [ ] Documentar padrão ALGORITHM=INPLACE para o time (Owner: @tech-lead)
EOF

echo "Postmortem criado. Compartilhar em até 48h após o incidente."`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/sre" order={ADVANCED_ORDER} />
      </div>
    </div>
  );
}
