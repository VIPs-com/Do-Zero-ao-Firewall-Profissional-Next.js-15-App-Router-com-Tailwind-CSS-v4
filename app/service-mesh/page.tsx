'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Network, Shield, Eye, Zap, Activity, Server,
  ChevronLeft, ChevronRight, Terminal, Lock, GitMerge,
} from 'lucide-react';
import Link from 'next/link';

const checklistItems = [
  {
    id: 'service-mesh-instalado',
    text: 'Instalar Istio com istioctl e injetar sidecar Envoy nos pods',
    sub: 'istioctl install --set profile=demo && kubectl label namespace default istio-injection=enabled',
  },
  {
    id: 'service-mesh-mtls',
    text: 'Verificar mTLS automático entre serviços com PeerAuthentication STRICT',
    sub: 'kubectl apply -f peer-auth-strict.yaml && istioctl authn tls-check svc.namespace',
  },
  {
    id: 'service-mesh-traffic',
    text: 'Configurar traffic management com VirtualService e DestinationRule',
    sub: 'kubectl apply -f virtualservice.yaml && curl -H "version: v2" http://app/api — rotear tráfego por header',
  },
];

const erros = [
  {
    title: 'Pods não recebem sidecar Envoy — label de injeção ausente',
    desc: 'A injeção automática do sidecar Envoy requer que o namespace tenha o label istio-injection=enabled E que o pod seja criado DEPOIS do label ser aplicado.',
    fix: 'kubectl label namespace default istio-injection=enabled\nkubectl rollout restart deployment/minha-app  # forçar novo pod',
  },
  {
    title: 'mTLS quebra comunicação com serviços sem sidecar',
    desc: 'PeerAuthentication STRICT exige que o chamador também tenha sidecar Envoy. Serviços externos ou jobs sem sidecar falham com "RBAC: access denied".',
    fix: '# Aplicar STRICT apenas para namespaces com Istio:\nkubectl apply -n app-namespace -f peer-auth-strict.yaml\n# Manter PERMISSIVE no namespace de jobs sem sidecar',
  },
  {
    title: 'VirtualService não afeta o tráfego esperado',
    desc: 'VirtualService só funciona se houver um Gateway (tráfego externo) ou se o serviço for chamado via nome DNS interno. Tráfego direto por IP ignora o VirtualService.',
    fix: '# Verificar se o host bate com o Service name:\nkubectl get virtualservice -o yaml | grep host\n# Testar roteamento via istioctl:\nistioctl analyze',
  },
  {
    title: 'Kiali não mostra grafo de serviços — Prometheus não configurado',
    desc: 'Kiali depende das métricas do Prometheus para construir o Service Graph. Sem scraping das métricas do Envoy, o grafo fica vazio.',
    fix: '# Instalar Prometheus + Kiali do addons do Istio:\nkubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/prometheus.yaml\nkubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.21/samples/addons/kiali.yaml',
  },
];

export default function ServiceMeshPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/service-mesh');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-service-mesh min-h-screen">
      {/* Hero */}
      <section className="module-hero py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LayerBadge layer="Camada 7" />
            <span className="section-label">Kubernetes · mTLS · Observabilidade</span>
          </div>
          <h1 className="section-title text-4xl mb-4">
            🕸️ Service Mesh com Istio
          </h1>
          <p className="text-text-2 text-lg max-w-2xl">
            Um Service Mesh adiciona uma camada de infraestrutura entre seus microserviços
            — <strong className="text-text">sem alterar o código da aplicação</strong>. Istio injeta
            um proxy Envoy em cada pod e assume o controle do tráfego: mTLS automático,
            circuit breaker, retry, timeout, canary deploy e observabilidade completa.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['Istio', 'Envoy', 'mTLS', 'VirtualService', 'DestinationRule', 'Kiali', 'canary', 'circuit breaker'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-bg-3 text-text-2 border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* O problema que o Service Mesh resolve */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Network className="text-[var(--mod)]" size={22} />
            O problema: comunicação entre microserviços
          </h2>
          <p className="text-text-2 mb-6">
            À medida que o número de microserviços cresce, a comunicação entre eles vira um caos.
            Cada equipe precisa implementar retry, timeout, circuit breaker, autenticação e rastreamento
            na própria aplicação — duplicando lógica e introduzindo inconsistências.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-bg-2 border border-err/30 rounded-xl p-5">
              <h3 className="font-semibold text-err mb-3">❌ Sem Service Mesh</h3>
              <ul className="text-text-2 text-sm space-y-2">
                <li>• Retry/timeout implementado em cada serviço</li>
                <li>• TLS manual com certificados gerenciados por cada equipe</li>
                <li>• Rastreamento distribuído exige SDK na aplicação</li>
                <li>• Zero visibilidade de quem fala com quem</li>
                <li>• Circuit breaker é código de negócio, não infraestrutura</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-ok/30 rounded-xl p-5">
              <h3 className="font-semibold text-ok mb-3">✅ Com Istio</h3>
              <ul className="text-text-2 text-sm space-y-2">
                <li>• Retry/timeout declarativo em YAML (VirtualService)</li>
                <li>• mTLS automático — zero código, zero certificado manual</li>
                <li>• Traces em Jaeger sem mudar uma linha da app</li>
                <li>• Grafo de dependências em tempo real no Kiali</li>
                <li>• Circuit breaker via DestinationRule — 3 linhas de YAML</li>
              </ul>
            </div>
          </div>

          <FluxoCard
            title="Arquitetura do Istio"
            steps={[
              { label: 'istiod', sub: 'Control Plane — Pilot + Citadel + Galley', icon: <Server size={14} />, color: 'border-accent/50' },
              { label: 'Envoy Sidecar', sub: 'Data Plane — proxy em cada pod', icon: <Network size={14} />, color: 'border-info/50' },
              { label: 'mTLS automático', sub: 'Citadel emite certs SPIFFE/X.509', icon: <Lock size={14} />, color: 'border-ok/50' },
              { label: 'Telemetria', sub: 'métricas + traces + logs para addons', icon: <Eye size={14} />, color: 'border-[var(--color-layer-4)]/50' },
              { label: 'Kiali / Grafana', sub: 'Service Graph + dashboards', icon: <Activity size={14} />, color: 'border-warn/50' },
            ]}
          />
        </section>

        {/* Istio vs alternativas */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <GitMerge className="text-[var(--mod)]" size={22} />
            Istio vs alternativas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead className="bg-bg-3">
                <tr>
                  {['Critério', 'Istio', 'Linkerd', 'Consul Connect', 'Cilium (eBPF mesh)'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-text-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Data Plane', 'Envoy (C++)', 'linkerd-proxy (Rust)', 'Envoy (C++)', 'eBPF (kernel)'],
                  ['mTLS automático', '✅ SPIFFE/X.509', '✅ automático', '✅ com Vault', '✅ sem sidecar'],
                  ['Complexidade', '⚠️ Alta — CRDs extensos', '🟢 Baixa — simples', '🟡 Média', '🟡 Média'],
                  ['Performance', '🟡 sidecar overhead', '🟢 Rust = leve', '🟡 similar ao Istio', '✅ kernel-space, zero overhead'],
                  ['Observabilidade', '✅ Kiali + Jaeger + Grafana', '✅ Viz dashboard', '✅ UI Consul', '✅ Hubble'],
                  ['Canary / Traffic split', '✅ VirtualService', '✅ TrafficSplit', '✅ Resolver', '⚠️ CiliumNetworkPolicy'],
                  ['Ideal para', 'Empresas, features ricas', 'Simplicidade, K8s nativo', 'HashiCorp stack', 'eBPF + K8s já com Cilium'],
                ].map(([crit, ...vals]) => (
                  <tr key={crit} className="hover:bg-bg-2/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{crit}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-text-2 text-xs">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Instalação */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Terminal className="text-[var(--mod)]" size={22} />
            Instalação do Istio
          </h2>

          <WarnBox title="Pré-requisito: cluster Kubernetes rodando">
            Istio requer um cluster K8s funcional. Use K3s (Sprint I.16), minikube ou kind para lab local.
            Recursos mínimos: 4 vCPUs, 8 GB RAM (o control plane do Istio é pesado).
          </WarnBox>

          <div className="space-y-6 mt-6">
            <div>
              <StepItem
                number={1}
                title="Baixar e instalar o istioctl"
                description="istioctl é a CLI oficial para instalar e gerenciar o Istio no cluster."
              />
              <CodeBlock lang="bash" code={`# Baixar a versão mais recente do istioctl
curl -L https://istio.io/downloadIstio | sh -

# Entrar na pasta e adicionar ao PATH
cd istio-1.21.*
export PATH=\$PWD/bin:\$PATH

# Verificar pré-requisitos do cluster
istioctl x precheck`} />
            </div>

            <div>
              <StepItem
                number={2}
                title="Instalar o Istio com perfil demo"
                description="O perfil 'demo' instala todos os componentes com observabilidade habilitada — ideal para aprendizado."
              />
              <CodeBlock lang="bash" code={`# Instalar com perfil demo (inclui tracing, Prometheus, Grafana)
istioctl install --set profile=demo -y

# Verificar pods do control plane
kubectl get pods -n istio-system

# Saída esperada:
# NAME                                    READY   STATUS    RESTARTS
# istiod-7d9f9d6d8f-kqw9p                1/1     Running   0
# istio-ingressgateway-...               1/1     Running   0
# istio-egressgateway-...                1/1     Running   0`} />
            </div>

            <div>
              <StepItem
                number={3}
                title="Habilitar injeção automática de sidecar"
                description="O label no namespace instrui o Istio a injetar o proxy Envoy em todos os pods novos."
              />
              <CodeBlock lang="bash" code={`# Habilitar injeção automática no namespace default
kubectl label namespace default istio-injection=enabled

# Verificar o label
kubectl get namespace default --show-labels

# Implantar uma aplicação de teste (Bookinfo — app exemplo oficial do Istio)
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml

# Verificar que cada pod tem 2 containers (app + envoy sidecar)
kubectl get pods
# NAME                              READY   STATUS
# productpage-v1-...                2/2     Running  ← 2/2 = app + Envoy`} />
            </div>

            <div>
              <StepItem
                number={4}
                title="Instalar addons de observabilidade"
                description="Prometheus, Grafana, Kiali e Jaeger são instalados como addons opcionais."
              />
              <CodeBlock lang="bash" code={`# Instalar todos os addons de uma vez
kubectl apply -f samples/addons/

# Aguardar os pods ficarem prontos
kubectl rollout status deployment/kiali -n istio-system
kubectl rollout status deployment/grafana -n istio-system

# Abrir o Kiali no browser (túnel local)
istioctl dashboard kiali

# Abrir o Jaeger (distributed tracing)
istioctl dashboard jaeger`} />
            </div>
          </div>
        </section>

        {/* mTLS automático */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Lock className="text-[var(--mod)]" size={22} />
            mTLS automático — zero código
          </h2>
          <p className="text-text-2 mb-6">
            Por padrão, Istio opera em modo <strong className="text-text">PERMISSIVE</strong>: aceita
            tráfego com e sem mTLS. Para ambientes de produção, use
            <strong className="text-text"> STRICT</strong>: todo o tráfego entre pods precisa ser
            autenticado com certificado X.509 gerado pelo Istio (formato SPIFFE).
          </p>

          <CodeBlock lang="yaml" code={`# peer-auth-strict.yaml — mTLS obrigatório no namespace
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: default
spec:
  mtls:
    mode: STRICT    # PERMISSIVE = aceita plain text também
                    # STRICT = rejeita conexões sem mTLS`} />

          <CodeBlock lang="bash" code={`# Aplicar mTLS STRICT
kubectl apply -f peer-auth-strict.yaml

# Verificar status do mTLS em todos os serviços do namespace
istioctl authn tls-check -n default

# Saída:
# HOST:PORT                          STATUS    SERVER     CLIENT
# details.default:9080               OK        STRICT     mTLS
# productpage.default:9080           OK        STRICT     mTLS
# ratings.default:9080               OK        STRICT     mTLS`} />

          <InfoBox title="SPIFFE — identidade criptográfica por serviço">
            Cada pod recebe um certificado SPIFFE (Secure Production Identity Framework) no formato
            <code className="mx-1 px-1 bg-bg-3 rounded text-xs font-mono">spiffe://cluster.local/ns/default/sa/productpage</code>.
            Isso significa que a identidade do serviço é verificável criptograficamente — não basta ter
            o IP correto, precisa ter o certificado correto.
          </InfoBox>

          {/* AuthorizationPolicy */}
          <h3 className="font-semibold text-lg mt-8 mb-4">AuthorizationPolicy — quem pode falar com quem</h3>
          <CodeBlock lang="yaml" code={`# Negar tudo por padrão e liberar apenas o que precisa
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: deny-all
  namespace: default
spec: {}   # vazio = nega todo o tráfego
---
# Permitir apenas o frontend falar com o backend
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: default
spec:
  selector:
    matchLabels:
      app: backend
  action: ALLOW
  rules:
  - from:
    - source:
        principals:
        - cluster.local/ns/default/sa/frontend  # identidade SPIFFE do frontend`} />
        </section>

        {/* Traffic Management */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Zap className="text-[var(--mod)]" size={22} />
            Traffic Management — VirtualService e DestinationRule
          </h2>
          <p className="text-text-2 mb-6">
            O Istio adiciona dois CRDs fundamentais para controle de tráfego:
            <strong className="text-text"> VirtualService</strong> (regras de roteamento)
            e <strong className="text-text">DestinationRule</strong> (políticas de destino —
            subsets, circuit breaker, TLS settings).
          </p>

          <HighlightBox title="VirtualService vs DestinationRule">
            <p className="text-text-2 text-sm">
              <strong className="text-text">VirtualService</strong> = "Como rotear o tráfego?" (peso, headers, URI, retries, timeouts)<br />
              <strong className="text-text">DestinationRule</strong> = "Como se comportar no destino?" (subsets por label, circuit breaker, keep-alive, TLS)
            </p>
          </HighlightBox>

          <h3 className="font-semibold text-lg mt-8 mb-4">Canary deploy — 90% v1, 10% v2</h3>
          <CodeBlock lang="yaml" code={`# destination-rule.yaml — define subsets por label do pod
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
---
# virtual-service-canary.yaml — 90% → v1, 10% → v2
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 90
    - destination:
        host: reviews
        subset: v2
      weight: 10`} />

          <CodeBlock lang="bash" code={`kubectl apply -f destination-rule.yaml
kubectl apply -f virtual-service-canary.yaml

# Testar: enviar 100 requests e verificar distribuição
for i in \$(seq 1 100); do curl -s http://productpage/productpage | grep -o 'reviews-v[12]'; done | sort | uniq -c`} />

          <h3 className="font-semibold text-lg mt-8 mb-4">Roteamento por header — A/B testing</h3>
          <CodeBlock lang="yaml" code={`# Roteamento baseado em header HTTP
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        x-user-group:
          exact: beta-testers
    route:
    - destination:
        host: reviews
        subset: v2
  - route:   # default — todos os outros usuários
    - destination:
        host: reviews
        subset: v1`} />

          <h3 className="font-semibold text-lg mt-8 mb-4">Retry, Timeout e Circuit Breaker</h3>
          <CodeBlock lang="yaml" code={`# Retry automático + timeout por VirtualService
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - timeout: 3s         # falha se demorar mais de 3s
    retries:
      attempts: 3       # até 3 tentativas
      perTryTimeout: 1s # cada tentativa tem 1s
      retryOn: 5xx,gateway-error,reset,connect-failure
    route:
    - destination:
        host: ratings
---
# Circuit Breaker por DestinationRule
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ratings
spec:
  host: ratings
  trafficPolicy:
    connectionPool:
      http:
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    outlierDetection:                # Circuit Breaker
      consecutive5xxErrors: 5       # 5 erros 5xx consecutivos
      interval: 30s                 # janela de análise
      baseEjectionTime: 30s         # tempo de ejeção do pool
      maxEjectionPercent: 100`} />
        </section>

        {/* Observabilidade */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Eye className="text-[var(--mod)]" size={22} />
            Observabilidade — Kiali, Jaeger e Grafana
          </h2>
          <p className="text-text-2 mb-6">
            O Istio coleta métricas, logs e traces de todos os sidecars Envoy automaticamente —
            sem nenhuma mudança na aplicação. Os dados fluem para três ferramentas complementares.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="text-2xl mb-2">🗺️</div>
              <h3 className="font-semibold mb-2">Kiali</h3>
              <p className="text-text-2 text-sm">
                Service Graph interativo — visualiza dependências, saúde e tráfego em tempo real.
                Detecta anomalias e permite injetar falhas diretamente pela UI.
              </p>
              <code className="mt-3 block text-xs font-mono text-text-2 bg-bg-3 px-2 py-1 rounded">
                istioctl dashboard kiali
              </code>
            </div>
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-2">Jaeger</h3>
              <p className="text-text-2 text-sm">
                Distributed tracing — rastreia uma request pelo caminho completo entre todos os
                microserviços. Indispensável para diagnosticar latência em sistemas complexos.
              </p>
              <code className="mt-3 block text-xs font-mono text-text-2 bg-bg-3 px-2 py-1 rounded">
                istioctl dashboard jaeger
              </code>
            </div>
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">Grafana</h3>
              <p className="text-text-2 text-sm">
                Dashboards de métricas do Istio — request rate, error rate, P50/P99 latency por
                serviço. Integra com o Prometheus que o Istio configura automaticamente.
              </p>
              <code className="mt-3 block text-xs font-mono text-text-2 bg-bg-3 px-2 py-1 rounded">
                istioctl dashboard grafana
              </code>
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Gerar tráfego para popular os dashboards
kubectl exec -it \$(kubectl get pod -l app=productpage -o jsonpath='{.items[0].metadata.name}') \\
  -- bash -c "for i in \$(seq 1 200); do curl -s http://productpage:9080/productpage > /dev/null; done"

# Ver métricas dos proxies Envoy diretamente
kubectl exec -it \$(kubectl get pod -l app=productpage -o jsonpath='{.items[0].metadata.name}') \\
  -c istio-proxy -- pilot-agent request GET stats | grep upstream_rq_total

# Injeção de falhas para testar resiliência (via VirtualService)
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault:
      delay:
        percentage:
          value: 50    # 50% das requests com delay
        fixedDelay: 5s
      abort:
        percentage:
          value: 10    # 10% das requests retornam HTTP 500
        httpStatus: 500
    route:
    - destination:
        host: ratings
EOF`} />
        </section>

        {/* Ingress Gateway */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Shield className="text-[var(--mod)]" size={22} />
            Istio Ingress Gateway — entrada segura do cluster
          </h2>
          <p className="text-text-2 mb-6">
            O Ingress Gateway substitui o Ingress Controller do Kubernetes para tráfego externo —
            com suporte a mTLS, rate limiting, JWT validation e muito mais.
          </p>

          <CodeBlock lang="yaml" code={`# Gateway — define porta e protocolo de entrada
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: bookinfo-gateway
spec:
  selector:
    istio: ingressgateway   # usa o pod istio-ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "bookinfo.example.com"
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE              # TLS terminação no gateway
      credentialName: bookinfo-cert   # Secret com TLS cert
    hosts:
    - "bookinfo.example.com"
---
# VirtualService — associa o Gateway ao serviço interno
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: bookinfo
spec:
  hosts:
  - "bookinfo.example.com"
  gateways:
  - bookinfo-gateway
  http:
  - match:
    - uri:
        prefix: /productpage
    route:
    - destination:
        host: productpage
        port:
          number: 9080`} />

          <CodeBlock lang="bash" code={`# Obter IP externo do Ingress Gateway
export INGRESS_HOST=\$(kubectl get svc istio-ingressgateway -n istio-system \\
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Testar acesso externo
curl -H "Host: bookinfo.example.com" http://\$INGRESS_HOST/productpage

# Para K3s/Minikube sem LoadBalancer — usar NodePort:
export INGRESS_PORT=\$(kubectl get svc istio-ingressgateway -n istio-system \\
  -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
curl http://\$(minikube ip):\$INGRESS_PORT/productpage`} />
        </section>

        {/* Windows Comparison */}
        <WindowsComparisonBox
          windowsLabel="Windows — IIS ARR + WCF"
          linuxLabel="Linux — Istio Service Mesh"
          windowsCode={`# IIS Application Request Routing (ARR)
# Proxy reverso por regras no IIS Manager
# TLS por binding no IIS — certificado manual
# WCF para comunicação segura entre serviços
# Sem observabilidade nativa — precisa de ferramentas externas
# Load balancing via NLB ou ARR Rules
# Sem circuit breaker nativo`}
          linuxCode={`# Istio — tudo em YAML declarativo
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled

# mTLS automático — zero config adicional
kubectl apply -f peer-auth-strict.yaml

# Canary deploy com 10 linhas de YAML
kubectl apply -f virtual-service-canary.yaml

# Observabilidade completa — sem alterar a app
istioctl dashboard kiali`}
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
            <Activity className="text-[var(--mod)]" size={22} />
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
                    <CodeBlock lang="bash" code={e.fix} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Navegação */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link
            href="/ebpf"
            className="flex items-center gap-2 text-text-2 hover:text-text transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            <span>Anterior: eBPF &amp; XDP</span>
          </Link>
          <Link
            href="/sre"
            className="flex items-center gap-2 text-text-2 hover:text-text transition-colors text-sm"
          >
            <span>Próximo: SRE &amp; SLOs</span>
            <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
