'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Cpu, Shield, Network, Eye, Zap, Lock, ChevronLeft, ChevronRight,
  AlertTriangle, Server, GitBranch,
} from 'lucide-react';
import Link from 'next/link';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const checklistItems = [
  {
    id: 'cilium-instalado',
    text: 'Cilium instalado no K3s substituindo kube-proxy e flannel — CNI eBPF nativo',
    sub: 'k3s sem kube-proxy → helm install cilium → cilium status --wait → todos os componentes OK',
  },
  {
    id: 'hubble-habilitado',
    text: 'Hubble habilitado com Relay e UI — fluxos de rede visíveis em tempo real',
    sub: 'cilium hubble enable --ui → hubble observe --all → identificar DROP com --verdict DROPPED',
  },
  {
    id: 'tetragon-seguranca',
    text: 'Tetragon detectando execução suspeita com TracingPolicy — nc bloqueado dentro de pod',
    sub: 'helm install tetragon → TracingPolicy YAML → kubectl exec nc → tetra getevents mostrando SIGKILL',
  },
];

const erros = [
  {
    titulo: 'cilium status mostra "Not Ready" após instalação',
    causa: 'K3s instalado com flannel padrão. Flannel e Cilium não convivem no mesmo cluster.',
    fix: `# Reinstalar K3s SEM flannel e SEM kube-proxy:
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend=none \\
  --disable-network-policy \\
  --kube-proxy-arg=--cleanup-iptables-on-exit=false" sh -

# Cilium precisa de mountpoint BPF:
mount bpffs -t bpf /sys/fs/bpf`,
  },
  {
    titulo: 'CiliumNetworkPolicy L7 não filtra HTTP — tráfego passa sem restrição',
    causa: 'L7 exige proxy Envoy injetado pelo Cilium. Sem o proxy, o Cilium faz apenas L3/L4 e ignora regras HTTP.',
    fix: `# Verificar se Envoy proxy está presente no pod:
kubectl get pod <nome> -o jsonpath='{.spec.containers[*].name}'
# Deve aparecer "cilium-proxy" quando L7 policy está ativa

# A policy DEVE ter seção rules/http para ativar o proxy:
# toPorts com apenas ports (sem rules) → L4 only
# toPorts com rules/http → L7 ativado automaticamente`,
  },
  {
    titulo: 'hubble observe retorna "context deadline exceeded"',
    causa: 'Hubble Relay não rodando ou porta 4245 inacessível.',
    fix: `# Verificar pods do Hubble:
kubectl -n kube-system get pods -l k8s-app=hubble-relay

# Re-habilitar com UI:
cilium hubble enable --ui

# Port-forward para acesso local:
kubectl port-forward -n kube-system svc/hubble-relay 4245:4245 &
export HUBBLE_SERVER=localhost:4245
hubble status`,
  },
  {
    titulo: 'Tetragon TracingPolicy não gera eventos — tetra getevents sem output',
    causa: 'Nome do kprobe difere entre versões de kernel. "__x64_sys_execve" pode não existir.',
    fix: `# Verificar kprobes disponíveis no kernel atual:
cat /sys/kernel/debug/tracing/available_filter_functions | grep execve

# Kernel 5.15+: "__x64_sys_execve"
# Kernel mais antigo: "sys_execve"
# Kernels ARM64: "__arm64_sys_execve"

# Ver logs de erro do Tetragon:
kubectl -n kube-system logs ds/tetragon | grep -i "error\\|kprobe"`,
  },
];

export default function EbpfAvancadoPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/ebpf-avancado');
  }, [trackPageVisit]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 module-accent-ebpf-avancado">
      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/evolucao">Evolução Natural</Link>
        <span>/</span>
        <span className="text-text-2">eBPF Avançado + Cilium</span>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="module-hero mb-12">
        <LayerBadge layer="eBPF Avançado · Cilium CNI" />
        <h1 className="text-4xl font-bold mt-4 mb-3">🧬 eBPF Avançado + Cilium</h1>
        <p className="text-text-2 text-lg leading-relaxed">
          Do kernel ao cluster: Cilium como CNI nativo eBPF substituindo kube-proxy e flannel,
          Hubble para observabilidade de fluxos em tempo real, CiliumNetworkPolicy até camada 7 e
          Tetragon para segurança em runtime. O networking moderno de Kubernetes feito do jeito certo.
        </p>
        <InfoBox>
          <strong>Pré-requisito:</strong> Este módulo aprofunda os conceitos do{' '}
          <Link href="/ebpf" className="text-accent underline underline-offset-2">módulo eBPF & XDP</Link>{' '}
          (BCC tools, bpftrace, XDP). Também é útil ter a base de Kubernetes do{' '}
          <Link href="/kubernetes" className="text-accent underline underline-offset-2">módulo K3s</Link>.
        </InfoBox>
      </div>

      {/* ── Por que Cilium? ──────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Por que Cilium substitui kube-proxy e flannel?</h2>
        <p className="text-text-2 mb-6">
          kube-proxy usa iptables com regras de DNAT e MASQUERADE para balancear Services. Com 10.000 Services, o kernel
          percorre até 40.000 regras por pacote. Flannel usa VXLAN com overhead de 50 bytes por pacote. Cilium elimina os dois:
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Network size={20} />, title: 'Sem iptables', desc: 'Load balancing via eBPF maps — O(1) independente do número de Services. 10x mais rápido com 10k+ Services.' },
            { icon: <Eye size={20} />, title: 'Observabilidade nativa', desc: 'Hubble captura cada fluxo TCP/UDP no kernel — sem modificar a aplicação. Identity-based em vez de IP-based.' },
            { icon: <Shield size={20} />, title: 'Política até L7', desc: 'CiliumNetworkPolicy entende HTTP paths, gRPC methods, DNS queries. iptables só faz L3/L4.' },
          ].map((c, i) => (
            <div key={i} className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="text-[var(--mod)] mb-2">{c.icon}</div>
              <div className="font-semibold mb-1">{c.title}</div>
              <div className="text-text-2 text-sm">{c.desc}</div>
            </div>
          ))}
        </div>

        <FluxoCard
          title="Arquitetura Cilium no K3s"
          steps={[
            { label: 'Cilium Agent', sub: 'DaemonSet — 1 pod por nó do cluster', icon: <Server size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'eBPF datapath', sub: 'Programas BPF no kernel — sem netfilter/iptables', icon: <Cpu size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'Identity store', sub: 'Labels do Pod → Numeric Identity (ex: 3945)', icon: <Lock size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'Hubble Relay', sub: 'Agrega fluxos de todos os nós em tempo real', icon: <Network size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'Hubble UI', sub: 'Service map visual + trace de fluxos individuais', icon: <Eye size={14} />, color: 'border-[var(--mod)]/50' },
          ]}
        />
      </section>

      {/* ── Instalação no K3s ───────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Instalação: K3s + Cilium do zero</h2>
        <p className="text-text-2 mb-6">
          K3s inclui flannel e kube-proxy por padrão. Precisamos desabilitar ambos antes de instalar o Cilium.
        </p>

        <StepItem
          number={1}
          title="Instalar K3s sem CNI e sem kube-proxy"
          description="O K3s precisa ser instalado sem flannel (--flannel-backend=none) e configurado para não subir kube-proxy. O argumento cleanup-iptables evita conflito com eBPF:"
        />
        <CodeBlock lang="bash" code={`# Instalação bare — sem flannel, sem kube-proxy nativo
export INSTALL_K3S_EXEC="--flannel-backend=none \\
  --disable-network-policy \\
  --disable=traefik \\
  --kube-proxy-arg=--cleanup-iptables-on-exit=false"

curl -sfL https://get.k3s.io | sh -

# Verificar: nós em NotReady (normal — falta o CNI)
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes  # STATUS: NotReady — aguardar Cilium`} />

        <StepItem
          number={2}
          title="Instalar Helm e o chart do Cilium"
          description="Com Helm, instalamos Cilium com kube-proxy replacement ativo, Hubble Relay e Hubble UI habilitados:"
        />
        <CodeBlock lang="bash" code={`# Instalar Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Adicionar repositório Cilium
helm repo add cilium https://helm.cilium.io/
helm repo update

# Instalar Cilium com kube-proxy replacement completo
helm install cilium cilium/cilium \\
  --namespace kube-system \\
  --set kubeProxyReplacement=true \\
  --set k8sServiceHost=<IP_DO_CONTROL_PLANE> \\
  --set k8sServicePort=6443 \\
  --set hubble.relay.enabled=true \\
  --set hubble.ui.enabled=true`} />

        <StepItem
          number={3}
          title="Verificar instalação com CLI do Cilium"
          description="Instale a CLI do Cilium e aguarde todos os componentes ficarem prontos:"
        />
        <CodeBlock lang="bash" code={`# Instalar CLI do Cilium
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
curl -L --fail --remote-name-all \\
  https://github.com/cilium/cilium-cli/releases/download/$CILIUM_CLI_VERSION/cilium-linux-amd64.tar.gz
tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin

# Aguardar todos os componentes ficarem prontos
cilium status --wait

# Saída esperada:
#     /¯¯\\
#  /¯¯\\__/¯¯\\    Cilium:             OK
#  \\__/¯¯\\__/    Operator:           OK
#  /¯¯\\__/¯¯\\    Hubble Relay:       OK
#  \\__/¯¯\\__/    KubeProxyReplacement: True
#     \\__/

# Confirmar que não há pods kube-proxy:
kubectl -n kube-system get pods | grep kube-proxy  # sem output`} />
        <HighlightBox>
          <strong>Saída esperada do <code>cilium status</code>:</strong> todos os componentes com status <code>OK</code> e{' '}
          <code>KubeProxyReplacement: True</code>. Se Hubble Relay aparecer como <code>Disabled</code>, aguarde 60s — os pods demoram para iniciar.
        </HighlightBox>

        <StepItem
          number={4}
          title="Teste de conectividade end-to-end"
          description="O comando connectivity test valida L3/L4/L7, policy, mTLS e DNS de forma automática:"
        />
        <CodeBlock lang="bash" code={`# Teste completo de conectividade (deploy pods de teste temporários)
cilium connectivity test

# Testa: Pod→Pod, Pod→Service, Pod→External, NetworkPolicy, L7
# Ao final: "All N tests passed!" — cluster 100% funcional`} />
      </section>

      {/* ── Hubble ──────────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Hubble — observabilidade de fluxos em tempo real</h2>
        <p className="text-text-2 mb-6">
          Hubble captura cada fluxo de rede no nível do kernel, identificando origem, destino, protocolo,
          veredicto (FORWARDED/DROPPED) e o motivo exato do bloqueio — sem tcpdump, sem modificar a aplicação.
        </p>

        <StepItem
          number={1}
          title="Instalar CLI do Hubble e configurar acesso"
          description="A CLI do Hubble se conecta ao Hubble Relay (porta 4245). Use port-forward para acesso local:"
        />
        <CodeBlock lang="bash" code={`export HUBBLE_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/hubble/master/stable.txt)
curl -L --fail --remote-name-all \\
  https://github.com/cilium/hubble/releases/download/$HUBBLE_VERSION/hubble-linux-amd64.tar.gz
tar xzvfC hubble-linux-amd64.tar.gz /usr/local/bin

# Port-forward do Relay para acesso local
kubectl port-forward -n kube-system svc/hubble-relay 4245:4245 &
export HUBBLE_SERVER=localhost:4245

# Verificar:
hubble status`} />

        <StepItem
          number={2}
          title="Observar fluxos — os comandos mais úteis"
          description="A principal ferramenta de diagnóstico do dia a dia com Cilium:"
        />
        <CodeBlock lang="bash" code={`# Todos os fluxos em tempo real
hubble observe --all

# Apenas drops — tráfego bloqueado por policy
hubble observe --verdict DROPPED

# Fluxos de um namespace específico
hubble observe --namespace production

# Fluxos HTTP com método e path
hubble observe --protocol http

# Exemplo de saída:
# Dec 15 10:23:41  DROPPED    default/frontend → default/db:5432
#                  reason: policy-denied (no matching egress policy)
# Dec 15 10:23:42  FORWARDED  default/frontend:54321 → default/backend:80
#                  GET /api/users HTTP/1.1`} />

        <StepItem
          number={3}
          title="Hubble UI — mapa visual de serviços"
          description="A UI mostra um grafo de dependências entre serviços. Setas vermelhas = DROPPED, verdes = FORWARDED:"
        />
        <CodeBlock lang="bash" code={`# Port-forward da UI
kubectl port-forward -n kube-system svc/hubble-ui 12000:80 &

# Abrir no browser: http://localhost:12000
# → Selecionar namespace
# → Ver grafo de dependências em tempo real
# → Clicar em uma conexão = ver fluxos individuais com motivo do bloqueio`} />
        <InfoBox>
          O Hubble UI substitui horas de <code>tcpdump</code> manual. Em produção, é a principal ferramenta
          para diagnosticar por que um Service não consegue se conectar a outro — o grafo mostra imediatamente
          a política que está bloqueando o tráfego.
        </InfoBox>
      </section>

      {/* ── CiliumNetworkPolicy ─────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">CiliumNetworkPolicy — do L3 ao L7</h2>
        <p className="text-text-2 mb-6">
          CiliumNetworkPolicy estende a <code>NetworkPolicy</code> padrão do Kubernetes com filtragem até L7.
          As políticas são baseadas em identidades (labels dos Pods) — não em IPs efêmeros que mudam a cada restart.
        </p>

        <h3 className="text-lg font-semibold mb-3">Default-deny + whitelist por labels</h3>
        <CodeBlock lang="yaml" code={`# 1. Default-deny total no namespace 'production'
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  endpointSelector: {}   # aplica a TODOS os pods
  ingress: []
  egress: []
---
# 2. Permitir frontend → backend na porta 8080
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: frontend-to-backend
  namespace: production
spec:
  endpointSelector:
    matchLabels:
      app: backend
  ingress:
    - fromEndpoints:
        - matchLabels:
            app: frontend
      toPorts:
        - ports:
            - port: "8080"
              protocol: TCP`} />

        <h3 className="text-lg font-semibold mt-6 mb-3">L7 — filtragem por HTTP path</h3>
        <CodeBlock lang="yaml" code={`# Apenas GET /api/public e GET /api/users — bloquear POST, /admin, etc.
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: api-gateway-l7
  namespace: production
spec:
  endpointSelector:
    matchLabels:
      app: api-server
  ingress:
    - fromEndpoints:
        - matchLabels:
            app: frontend
      toPorts:
        - ports:
            - port: "8080"
              protocol: TCP
          rules:
            http:
              - method: GET
                path: /api/public
              - method: GET
                path: /api/users
              # POST /admin/* → DROP automaticamente (policy-denied)`} />

        <h3 className="text-lg font-semibold mt-6 mb-3">DNS — controle por FQDN (toFQDNs)</h3>
        <CodeBlock lang="yaml" code={`# Permitir acesso apenas a *.github.com e registry.npmjs.org
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: egress-dns-allowlist
  namespace: production
spec:
  endpointSelector:
    matchLabels:
      app: ci-runner
  egress:
    - toFQDNs:
        - matchPattern: "*.github.com"
        - matchName: "registry.npmjs.org"
      toPorts:
        - ports:
            - port: "443"
              protocol: TCP
    # DNS resolution — sempre necessária
    - toEndpoints:
        - matchLabels:
            k8s:io.kubernetes.pod.namespace: kube-system
            k8s-app: kube-dns
      toPorts:
        - ports:
            - port: "53"
              protocol: ANY`} />
        <InfoBox>
          Políticas <code>toFQDNs</code> são resolvidas dinamicamente — quando o DNS retorna novos IPs para
          <code>*.github.com</code>, o mapa eBPF é atualizado automaticamente sem reiniciar pods. Com Calico ou
          iptables você precisaria recriar as regras manualmente.
        </InfoBox>
      </section>

      {/* ── eBPF Load Balancing ─────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">eBPF Load Balancing — o fim do kube-proxy</h2>
        <p className="text-text-2 mb-4">
          Com <code>kubeProxyReplacement=true</code>, o Cilium implementa todo o Service load balancing
          em eBPF usando maps <code>BPF_MAP_TYPE_LRU_HASH</code> — sem iptables, sem DNAT chains.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-semibold mb-3 text-warn">kube-proxy (iptables)</div>
            <div className="text-sm text-text-2 space-y-1.5">
              <div>• 1 regra iptables por endpoint por Service</div>
              <div>• 10k Services = ~40k regras = latência O(N)</div>
              <div>• Atualização = reescrever todas as chains</div>
              <div>• Sem visibilidade de qual regra matchou</div>
              <div>• Sem suporte a DSR (Direct Server Return)</div>
            </div>
          </div>
          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <div className="font-semibold mb-3 text-ok">Cilium eBPF LB</div>
            <div className="text-sm text-text-2 space-y-1.5">
              <div>• Hash map lookup O(1) para qualquer número de Services</div>
              <div>• 100k Services = mesma latência que 10</div>
              <div>• Atualização incremental — sem rewrite completo</div>
              <div>• Hubble mostra qual backend foi selecionado</div>
              <div>• DSR: resposta direto do server para o cliente</div>
            </div>
          </div>
        </div>

        <CodeBlock lang="bash" code={`# Ver todos os Services registrados no eBPF (substitui iptables -t nat -L)
cilium bpf lb list

# Saída:
# SERVICE ADDRESS         BACKEND ADDRESS         WEIGHT
# 10.96.0.1:443           192.168.1.10:6443       1
# 10.96.10.50:80          10.0.0.12:8080          1
#                         10.0.0.13:8080          1

# Habilitar DSR (Direct Server Return) — response bypassa o LB node
helm upgrade cilium cilium/cilium \\
  --namespace kube-system \\
  --reuse-values \\
  --set loadBalancer.mode=dsr`} />
      </section>

      {/* ── Tetragon ────────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Tetragon — segurança em runtime com eBPF</h2>
        <p className="text-text-2 mb-6">
          Tetragon intercepta syscalls no kernel e detecta comportamento anômalo dentro de containers —
          sem agent injetado, sem overhead de ptrace, antes mesmo de qualquer conexão ser estabelecida.
        </p>

        <StepItem
          number={1}
          title="Instalar Tetragon via Helm"
          description="Tetragon é instalado como DaemonSet — 1 pod por nó monitorando todas as syscalls:"
        />
        <CodeBlock lang="bash" code={`helm repo add cilium https://helm.cilium.io/
helm install tetragon cilium/tetragon \\
  --namespace kube-system \\
  --set tetragon.enableK8sAPI=true

# Verificar:
kubectl -n kube-system get pods -l app.kubernetes.io/name=tetragon

# Instalar CLI tetra:
TETRA_VERSION=$(curl -s https://api.github.com/repos/cilium/tetragon/releases/latest | jq -r .tag_name)
curl -LO https://github.com/cilium/tetragon/releases/download/$TETRA_VERSION/tetra-linux-amd64.tar.gz
tar -xvf tetra-linux-amd64.tar.gz -C /usr/local/bin`} />

        <StepItem
          number={2}
          title="TracingPolicy — bloquear execução de netcat dentro de containers"
          description="Defina uma TracingPolicy para interceptar execuções de nc/ncat/netcat e terminá-las imediatamente:"
        />
        <CodeBlock lang="yaml" code={`apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: detect-netcat
spec:
  kprobes:
    - call: "__x64_sys_execve"
      syscall: true
      args:
        - index: 0
          type: "filename"
      selectors:
        - matchArgs:
            - index: 0
              operator: "Postfix"
              values:
                - "/nc"
                - "/ncat"
                - "/netcat"
          matchActions:
            - action: Sigkill   # terminar antes de qualquer conexão`} />
        <WarnBox>
          <strong><code>action: Sigkill</code></strong> mata o processo no momento do execve, antes de qualquer
          código rodar. Para monitorar sem bloquear, use <code>action: Post</code>. Em produção, comece
          sempre com <code>Post</code> para calibrar antes de partir para <code>Sigkill</code>.
        </WarnBox>

        <StepItem
          number={3}
          title="Observar eventos — Tetragon em ação"
          description="Use o CLI tetra para ver eventos em tempo real. Em outro terminal, tente rodar nc dentro de um pod:"
        />
        <CodeBlock lang="bash" code={`# Terminal 1 — observar eventos:
kubectl exec -it -n kube-system ds/tetragon -c tetragon -- \\
  tetra getevents -o compact --namespaces default

# Terminal 2 — tentar executar nc dentro de um pod:
kubectl exec -it meu-pod -- nc -zv 10.0.0.1 22

# Saída no Terminal 1:
# process default/meu-pod /bin/nc -zv 10.0.0.1 22
# exit    default/meu-pod /bin/nc  SIGKILL
# Processo morto ANTES de abrir qualquer socket!`} />

        <StepItem
          number={4}
          title="Detectar leitura de arquivos sensíveis"
          description="TracingPolicy para alertar quando qualquer processo tenta acessar /etc/shadow ou /etc/passwd:"
        />
        <CodeBlock lang="yaml" code={`apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: detect-shadow-access
spec:
  kprobes:
    - call: "__x64_sys_openat"
      syscall: true
      args:
        - index: 1
          type: "filename"
      selectors:
        - matchArgs:
            - index: 1
              operator: "Equal"
              values:
                - "/etc/shadow"
                - "/etc/sudoers"
          matchActions:
            - action: Post    # registra sem bloquear`} />
      </section>

      {/* ── eBPF Maps Avançados ─────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">eBPF Maps — tipos e quando usar cada um</h2>
        <p className="text-text-2 mb-4">
          Maps são a estrutura de dados compartilhada entre programas eBPF e userspace.
          Escolher o tipo errado compromete performance em produção.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-bg-3 text-text-2 text-left">
                <th className="p-3 border border-border rounded-tl-lg">Tipo</th>
                <th className="p-3 border border-border">Complexidade</th>
                <th className="p-3 border border-border">Caso de Uso</th>
                <th className="p-3 border border-border rounded-tr-lg">Cilium usa?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['BPF_MAP_TYPE_HASH', 'O(1)', 'Tabela de conexões, blocklist de IPs', '✅ CT map'],
                ['BPF_MAP_TYPE_LRU_HASH', 'O(1) + evict', 'Services LB — auto-evict das entradas mais antigas', '✅ Service map'],
                ['BPF_MAP_TYPE_PERCPU_HASH', 'O(1) sem lock', 'Contadores de métricas por CPU', '✅ Metrics'],
                ['BPF_MAP_TYPE_RINGBUF', 'Push kernel→user', 'Streaming de eventos (substitui perf_event)', '✅ Hubble events'],
                ['BPF_MAP_TYPE_PROG_ARRAY', 'Jump table', 'Tail calls — dividir programa acima de 512 instruções', '✅ XDP dispatch'],
              ].map(([tipo, complexidade, uso, cilium], i) => (
                <tr key={i} className="border-b border-border hover:bg-bg-2 transition-colors">
                  <td className="p-3 font-mono text-xs text-[var(--mod)]">{tipo}</td>
                  <td className="p-3 text-ok text-xs">{complexidade}</td>
                  <td className="p-3 text-text-2">{uso}</td>
                  <td className="p-3 text-center">{cilium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── bpftrace Avançado ───────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">bpftrace Avançado — kprobes, uprobes e histogramas</h2>

        <h3 className="text-lg font-semibold mb-2">Latência de syscall read() por processo</h3>
        <CodeBlock lang="bash" code={`bpftrace -e '
kprobe:sys_read      { @start[tid] = nsecs; }
kretprobe:sys_read
/@start[tid]/
{
  @latency_us[comm] = hist((nsecs - @start[tid]) / 1000);
  delete(@start[tid]);
}
interval:s:5 { print(@latency_us); clear(@latency_us); }
'`} />

        <h3 className="text-lg font-semibold mt-6 mb-2">uprobe — instrumentar aplicação sem recompilar</h3>
        <CodeBlock lang="bash" code={`# Monitorar tempo de cada request HTTP numa app Go:
bpftrace -e '
uprobe:/usr/bin/minha-app:"net/http.(*ServeMux).ServeHTTP" {
  @start[tid] = nsecs;
}
uretprobe:/usr/bin/minha-app:"net/http.(*ServeMux).ServeHTTP"
/@start[tid]/
{
  @req_latency_ms = hist((nsecs - @start[tid]) / 1000000);
  delete(@start[tid]);
}
'`} />

        <h3 className="text-lg font-semibold mt-6 mb-2">Top processos por I/O de disco</h3>
        <CodeBlock lang="bash" code={`bpftrace -e '
tracepoint:block:block_rq_complete
/args->rwbs == "R"/
{
  @bytes[comm] = sum(args->nr_sector * 512);
}
interval:s:3 { print(@bytes); clear(@bytes); }
'`} />

        <FluxoCard
          title="Quando usar cada ferramenta eBPF"
          steps={[
            { label: 'bpftrace', sub: 'One-liners ad-hoc — investigação rápida em produção', icon: <Cpu size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'BCC Python/Go', sub: 'Scripts reutilizáveis com lógica complexa', icon: <GitBranch size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'Cilium eBPF', sub: 'Networking e políticas de segurança no cluster', icon: <Network size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'Tetragon', sub: 'Runtime security — syscalls e execuções suspeitas', icon: <Shield size={14} />, color: 'border-[var(--mod)]/50' },
            { label: 'XDP manual', sub: 'DDoS mitigation e packet filtering a 100Gbps', icon: <Zap size={14} />, color: 'border-[var(--mod)]/50' },
          ]}
        />
      </section>

      {/* ── WindowsComparisonBox ────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Windows vs Linux — Networking e Runtime Security</h2>
        <WindowsComparisonBox
          windowsLabel="Windows (Azure CNI / Defender)"
          linuxLabel="Linux (Cilium / Tetragon)"
          windowsCode={`# Azure CNI no AKS
# Cada Pod recebe IP da VNet Azure
# Políticas via Azure Network Policy
# (Calico disponível como alternativa)

# Observabilidade: NSG Flow Logs
# - Exporta para Log Analytics
# - Latência: minutos (não real-time)
# - Visibilidade: L3/L4 apenas

# Runtime security: Defender for Containers
# - Detecção baseada em assinaturas
# - Integração com Sentinel (SIEM)
# - Custo: ~$0.02/vCPU/hora`}
          linuxCode={`# Cilium CNI no K3s/K8s
# Identity-based (labels), não IP-based
# CiliumNetworkPolicy L3/L4/L7/DNS

# Observabilidade: Hubble
# - Tempo real (< 1ms overhead)
# - Fluxos L7: GET /api/users, gRPC
# - Service map visual no Hubble UI

# Runtime security: Tetragon
# - Detecção via kprobes no kernel
# - TracingPolicy YAML declarativo
# - Open source, sem custo de licença`}
        />
      </section>

      {/* ── Exercícios ──────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Exercícios Guiados</h2>
        <div className="space-y-4">
          {[
            {
              n: 1, title: 'Default-deny + whitelist seletivo com Hubble verificando',
              desc: 'Crie namespace "prod". Aplique CiliumNetworkPolicy default-deny-all. Suba dois pods (frontend + backend). Verifique que curl falha. Crie policy permitindo somente frontend→backend:8080 GET /api. No Hubble UI, confirme que POST retorna DROP com reason "policy-denied".',
            },
            {
              n: 2, title: 'Detectar e bloquear port scan com Tetragon',
              desc: 'Instale Tetragon com TracingPolicy action: Post para nmap e nc. Em um pod de teste, execute "nmap -sS 10.0.0.1". Observe o evento em tetra getevents. Mude para action: Sigkill e repita — o processo deve morrer antes de enviar qualquer pacote.',
            },
            {
              n: 3, title: 'Benchmark: iptables vs Cilium LB com 1000 Services',
              desc: 'Em cluster com kube-proxy, execute "iptables -t nat -L -n | wc -l" para contar regras e meça latência de 1000 requests com hey. Migre para Cilium (kubeProxyReplacement=true). Repita — compare número de regras vs lookup O(1) do eBPF map.',
            },
          ].map(ex => (
            <div key={ex.n} className="bg-bg-2 border border-border rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--mod)]/20 border border-[var(--mod)]/40 flex items-center justify-center text-sm font-bold text-[var(--mod)]">{ex.n}</span>
                <div>
                  <div className="font-semibold mb-1">{ex.title}</div>
                  <div className="text-text-2 text-sm">{ex.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Checklist ───────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Checklist do Módulo</h2>
        <div className="space-y-3">
          {checklistItems.map(item => (
            <ChecklistItem
              key={item.id}
              text={item.text}
              sub={item.sub}
              checked={!!checklist[item.id]}
              onToggle={() => updateChecklist(item.id, !checklist[item.id])}
            />
          ))}
        </div>
      </section>

      {/* ── Erros Comuns ────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="section-title">Erros Comuns</h2>
        <div className="space-y-3">
          {erros.map((e, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenError(openError === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-2 transition-colors"
                aria-expanded={openError === i}
              >
                <span className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-warn flex-shrink-0" />
                  <span className="font-medium">{e.titulo}</span>
                </span>
                <ChevronRight size={16} className={`text-text-3 transition-transform ${openError === i ? 'rotate-90' : ''}`} />
              </button>
              {openError === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                  <p className="text-text-2 text-sm"><strong>Causa:</strong> {e.causa}</p>
                  <CodeBlock lang="bash" code={e.fix} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

        <ModuleNav currentPath="/ebpf-avancado" order={ADVANCED_ORDER} />
    </div>
  );
}
